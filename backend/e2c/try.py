from neo4j import GraphDatabase

uri = "bolt://localhost:7687"
driver = GraphDatabase.driver(uri, auth=("neo4j", "1234"))

def matchQuestion(tx):

    result = tx.run('MATCH (var1) WHERE var1.name="Dawbridge"  WITH 1 AS foo, var1.architecture AS var2 RETURN var2')

    for line in result:
        print(line)

with driver.session() as session:
    session.read_transaction(matchQuestion)