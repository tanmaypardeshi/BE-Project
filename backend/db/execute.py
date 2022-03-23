
import yaml
#from neo4j.driver.exceptions import CypherError
from neo4j import GraphDatabase
import warnings

from .graph_builder import GraphBuilder



def nuke(session):
	session.write_transaction(lambda tx: tx.run("MATCH ()-[r]-() delete r"))
	session.write_transaction(lambda tx: tx.run("MATCH (n) delete n"))


class Neo4jSession(object):

	def __init__(self, args):
		self.args = args

	def __enter__(self):
		self.driver = GraphDatabase.driver(
			self.args["neo-url"], 
			auth=(self.args["neo-user"], self.args["neo-password"]), 
			encrypted=False)
		self.session = self.driver.session()

		return self.session

	def __exit__(self, a, b, c):
		self.session.close()
		self.driver = None


def load_yaml(session, graph_path):
	with open(graph_path) as file:
		for qa in yaml.load_all(file):
			gb = GraphBuilder(qa)
			gb.write(session)

		 	# Only load first graph
			return

def matchQuestion(tx, query):
	
	result_val = []

	result = tx.run(query)
	#print(result)
	
	for line in result:
		result_val.append(line.values())
		#print(line.values())
		
	return result_val

def run_query(session, query):
	return list(session.read_transaction(matchQuestion, query))
	#return list(session.read_transaction(matchQuestion, query))
	#return list(session.read_transaction(lambda tx: tx.run(query)))

