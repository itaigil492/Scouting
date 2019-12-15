import datetime, pickle, os, sys
from elasticsearch import Elasticsearch
import argparse
import json

parser = argparse.ArgumentParser(prog='insertData.py', description='Reads a database dump file and inserts it into a current live database')
parser.add_argument('--host', type=str, default='localhost')
parser.add_argument('--port', type=int, default=9200)
parser.add_argument('filepath', type=str)


args = parser.parse_args()
host = args.host
port = args.port
filepath = args.filepath

yesno = raw_input("WARNING: you are going to insert, and maybe override data into your elasticsearch cluster. Are you sure? [y/n]")
if yesno != 'y':
    sys.exit("Come back again when you are 100%% confident that you want to override data in your database.")

with open(filepath, 'r') as dumpfile:
    try:
        imported_data = pickle.load(dumpfile)
    except Exception as e:
        sys.exit("Error in loading pickle file '%s'. error: %s" % (filepath, str(e)))

try:
    es = Elasticsearch(['http://' + host + ':' + str(port)])
except Exception:
    sys.exit("Error in connection to database: %s" % str())

MAX_SIZE = 10000

def get_all_from_index(index):
    res = es.search(index=index, body={ 'size': MAX_SIZE, 'query': {'match_all': { } } })
    if not 'hits' in res or not 'hits' in res['hits']:
        print('Could not find documents in index %s')
        return ''
    hits = res['hits']['hits']
    for hit in hits:
        del hit['_score']
    return hits

def differenceBetween(documents1, documents2):
    found_in_documents1_and_not_in_documents2 = list()
    for document in documents1:
        if document not in documents2:
            found_in_documents1_and_not_in_documents2.append(document)
    return found_in_documents1_and_not_in_documents2

all_games_to_insert = differenceBetween(imported_data['games'], get_all_from_index('games'))
all_events_to_insert = differenceBetween(imported_data['events'], get_all_from_index('events'))
all_team_game_data_to_insert = differenceBetween(imported_data['team-game-data'], get_all_from_index('team-game-data'))
kibana_data_to_insert = differenceBetween(imported_data['.kibana'], get_all_from_index('.kibana'))

data_to_insert = { \
    'games': all_games_to_insert,\
    'events': all_events_to_insert,\
    'team-game-data': all_team_game_data_to_insert,\
    '.kibana': kibana_data_to_insert\
}

#print data_to_insert

mappings = {
    'games': imported_data['games_mapping'],
    'events': imported_data['events_mapping'],
    'team-game-data': imported_data['team_game_data_mapping']
}

for index, mapping in mappings.iteritems():
    indexMapping = mapping[index]['mappings']
    for _type, typeMapping in indexMapping.iteritems():
        es.indices.put_mapping(doc_type=_type, body=typeMapping, index=index)

for index, documents in data_to_insert.iteritems():
    for document in documents:
        body = document['_source']
        es.index(index=document['_index'], doc_type=document['_type'], id=document['_id'], body=body)
