import os
import pathlib
import pickle
import traceback
import urllib.request
import warnings
import zipfile

from neo4j.exceptions import CypherSyntaxError

from db import *
from .input import gen_input_fn
from .model import model_fn
from .util import *

tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)
logger = logging.getLogger(__name__)
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"


def translate(args, question):
    warnings.filterwarnings("ignore")
    estimator = tf.estimator.Estimator(
        model_fn,
        model_dir=args["model-dir"],
        params=args)

    predictions = estimator.predict(input_fn=lambda: gen_input_fn(args, None, question))

    for p in predictions:
        return prediction_row_to_cypher(p)


def add_args(parser):
    parser.add_argument("--graph-path", type=str, default="./data/gqa-single.yaml")
    parser.add_argument("--neo-url", type=str, default="bolt://localhost:7687")
    parser.add_argument("--neo-user", type=str, default="neo4j")
    parser.add_argument("--neo-password", type=str, default="1234")


def download_model(args):
    if not tf.io.gfile.exists(os.path.join(args["model-dir"], "checkpoint")):
        zip_path = "./model_checkpoint.zip"
        print("Downloading model (850mb)")
        urllib.request.urlretrieve(
            "https://storage.googleapis.com/octavian-static/download/english2cypher/model_checkpoint.zip", zip_path)

        print("Downloading vocab for model")
        assert args["vocab_path"][0:len(args["input-dir"])] == args[
            "input-dir"], "Vocab path must be inside input-dir for automatic download"
        pathlib.Path(args["input-dir"]).mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve("https://storage.googleapis.com/octavian-static/download/english2cypher/vocab.txt",
                                   args["vocab_path"])

        print("Unzipping")
        pathlib.Path(args["model-dir"]).mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(args["model-dir"])


def getAnswer(question):
    geeky_file = open('args', 'rb')
    args = pickle.load(geeky_file)
    geeky_file.close()

    download_model(args)

    with Neo4jSession(args) as session:
        nuke(session)
        load_yaml(session, args["graph-path"])

        query_english = question.strip()
        query_cypher = translate(args, query_english)

        try:
            result = run_query(session, query_cypher)
        except CypherSyntaxError:
            traceback.print_exc()
        else:
            all_answers = []
            for i in result:
                for j in i:
                    all_answers.append(str(j))
    return all_answers
