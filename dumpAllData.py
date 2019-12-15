import datetime, pickle, os
from elasticsearch import Elasticsearch
import argparse

dump_directory = 'db_dumps'


parser = argparse.ArgumentParser(prog='dumpAllData.py', description='Reads all data from a scouting database and dumps it into a pickle file')
parser.add_argument('--host', type=str, default='localhost')
parser.add_argument('--port', type=int, default=9200)
parser.add_argument('--filepath', type=str, default=os.path.join(dump_directory, 'db_data_dump_%s.p' % datetime.datetime.now().strftime("%I:%M%p_%B_%d_%Y")))

args = parser.parse_args()
host = args.host
port = args.port
filepath = args.filepath


try:
    es = Elasticsearch([{'host': host, 'port': port}])
except Exception:
    sys.exit("Error in connection to database: %s" % str())

MAX_SIZE = 10000

def get_all_from_index(index):
    page = es.search(index=index, scroll='2m', body={ 'size': MAX_SIZE, 'query': {'match_all': { } } })
    sid = page['_scroll_id']
    scroll_size = page['hits']['total']
    hits = page['hits']['hits']
    print scroll_size
    # Start scrolling
    while (scroll_size > 0):
        print "Scrolling..."
        page = es.scroll(scroll_id = sid, scroll = '2m')
        # Update the scroll ID
        sid = page['_scroll_id']
        # Get the number of results that we returned in the last scroll
        hits += page['hits']['hits']
        scroll_size = len(page['hits']['hits'])
    print "len hits:", len(hits)
    for hit in hits:
        del hit['_score']
    return hits


def get_mapping(index):
    mapping = es.indices.get_mapping(index=index)
    return mapping


all_games = get_all_from_index('games')
all_events = get_all_from_index('events')
all_team_game_data = get_all_from_index('team-game-data')
kibana_data = get_all_from_index('.kibana')

games_mapping = get_mapping('games')
events_mapping= get_mapping('events')
team_game_data_mapping = get_mapping('team-game-data')

data = {
    'games': all_games,
    'games_mapping': games_mapping,
    'events_mapping': events_mapping,
    'team_game_data_mapping': team_game_data_mapping,
    'events': all_events,
    'team-game-data': all_team_game_data,
    '.kibana': kibana_data
}

if not os.path.exists(dump_directory):
    os.makedirs(dump_directory)

with open(filepath, 'w+') as dumpfile:
    pickle.dump(data, dumpfile)

print('Successfuly pickled all data into into file %s' % filepath)
