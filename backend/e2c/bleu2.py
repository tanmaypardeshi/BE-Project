import os
os.environ["TF_CPP_MIN_LOG_LEVEL"]="2"

import argparse
import tensorflow as tf
import logging
import yaml
import traceback
import random
from neo4j.exceptions import CypherSyntaxError
import zipfile
import urllib.request
import pathlib
import warnings
import pandas as pd
from nltk.translate.bleu_score import sentence_bleu
from torchtext.data.metrics import bleu_score

logger = logging.getLogger(__name__)

from .model import model_fn
from .util import *
from .args import get_args
from .input import gen_input_fn
from db import *

def translate(args, question):
    
    warnings.filterwarnings("ignore")
    estimator = tf.estimator.Estimator(
		model_fn,
		model_dir=args["model_dir"],
		params=args)
        
    #predictions = estimator.predict(input_fn=lambda: gen_input_fn(args, None, question))
    predictions = estimator.evaluate(input_fn=lambda: gen_input_fn(args, None, question))

    print(predictions)
    
    for p in predictions:
        print(p)
        print(prediction_row_to_cypher(p))
        print()
        return prediction_row_to_cypher(p)


def download_model(args):
    
    if not tf.io.gfile.exists(os.path.join(args["model_dir"], "checkpoint")):
        zip_path = "./model_checkpoint.zip"
        print("Downloading model (850mb)")
        urllib.request.urlretrieve ("https://storage.googleapis.com/octavian-static/download/english2cypher/model_checkpoint.zip", zip_path)

        print("Downloading vocab for model")
        assert args["vocab_path"][0:len(args["input_dir"])] == args["input_dir"], "Vocab path must be inside input-dir for automatic download"
        pathlib.Path(args["input_dir"]).mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve ("https://storage.googleapis.com/octavian-static/download/english2cypher/vocab.txt", args["vocab_path"])

        print("Unzipping")
        pathlib.Path(args["model_dir"]).mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(zip_path,"r") as zip_ref:
            zip_ref.extractall(args["model_dir"])

if __name__ == "__main__":

    df_test = pd.read_csv('./e2c/predict.csv')
    df_test.drop(['Unnamed: 0'], axis = 1, inplace = True)
    
    warnings.filterwarnings("ignore")
    
    flag = 1
    
    def add_args(parser):
        parser.add_argument("--graph-path",   type=str, default="./data/gqa-single.yaml")
        parser.add_argument("--neo-url",      type=str, default="bolt://localhost:7687")
        parser.add_argument("--neo-user",     type=str, default="neo4j")
        parser.add_argument("--neo-password", type=str, default="pict1234")
        
    args = get_args(add_args)
    logging.basicConfig()
    logger.setLevel(args["log_level"])
    logging.getLogger('e2c').setLevel(args["log_level"])

	#tf.autograph.set_verbosity(tf.compat.v1.ERROR)
    download_model(args)

    bleu_sc = 0

    print("Predicting::\n")

    for i in range(df_test.shape[0]):
        

        #query_cypher = translate(args, df_test.iloc[i, 0])
        #print(f"Translation into cypher: '{query_cypher}'")

        #bleu_sc = bleu_sc + sentence_bleu([df_test.iloc[i, 0].split()], query_cypher.split())
        #bleu_sc = bleu_sc + bleu_score([query_cypher.split()],[[df_test.iloc[i, 1].split()]])

        if i % 20 == 0:
            query_cypher = translate(args, df_test.iloc[i, 0])
            print(i)
            #print(df_test.iloc[i, 1])
            #print(query_cypher)
            #print(bleu_score([query_cypher.split()],[[df_test.iloc[i, 1].split()]]))

    print("Bleu: ", bleu_sc/df_test.shape[0])


    
    

    

