import datetime, pickle, os
from elasticsearch import Elasticsearch
from dumpAllData import get_all_from_index, get_mapping
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

all_events = get_all_from_index('events')

shooting_data_per_team = {}



for event in all_events:
    # print event
    event_data = event['_source']
    teamNumber = event_data['teamNumber']
    if event['_type'] == 'gearplace' and event_data['status'] == 'Success':
        # print event_data
        if teamNumber in shooting_data_per_team:
            # print shooting_data_per_team[teamNumber]
            count = (shooting_data_per_team[teamNumber]['count'] + 1)
            game_ids = shooting_data_per_team[teamNumber]['game_ids']
            game_ids.add(event_data['gameId'])
        else:
            count = 1
            game_ids = set([event_data['gameId']])
        shooting_data_per_team[teamNumber] = {
            'count': count,
            'game_ids': game_ids
        }


top_teams = []
averageShootingPerTeam = {}

for teamNumber, teamData in shooting_data_per_team.iteritems():
    top_teams.append({
            'teamNumber': teamNumber,
            'average': teamData['count'] / float(len(teamData['game_ids']))
        }
    )

def compare_averages(a, b):
    return int(b['average']*100 - a['average']*100)

top_teams.sort(compare_averages)
# print top_teams[0:10]

for data in top_teams[0:10]:
    print 'Team %s scores %f average gear places per game' % (data['teamNumber'], data['average'])
