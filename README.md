# Welcome to GreenBlitz's Scouting System

## Installation Instructions
### Prerequisites
#### Docker
>Follow the appropriate [installation instructions](https://docs.docker.com/engine/getstarted/step_one/) for your operating system
#### Docker-Compose
>Follow the appropriate [installation instructions](https://docs.docker.com/compose/install/) for your operating system
#### Disclaimer Regarding Docker & Docker-Compose
If you configured docker and docker-compose correctly you might not need to run all your docker commands with sudo. If this is the case ignore all of the sudo prefixes to docker commands. A good way to test it is to run: `docker ps`. if it returns a list of machines (whether empty or filled with different virtual machines) it's a sign you configured docker correctly. If docker complains about a not being able to connect to the Docker daemon, don't worry. Just run all your docker commands with a sudo prefix and you should be just fine :D
### Install
That is it. Now you are ready to deploy your first scouting system ! :D
It's as easy as:
1. `cd <ROOT_REPOSITORY_CLONE_DIRECTORY>`
2. If this is your first time installing the system run: `./elasticsearch_fix.sh`
3. `sudo docker-compose up`

* Your webapp will be found under the `port 3000`
* Your elastic search cluster will be found under the `port 9200`
* Your kibana instance will be found under the `port 5601`

Enjoy!

### DB Dumps
#### Dump Data
Dumps the current elastic search and kibana data to a dump file. The default file path is in db_dumps and the name of the dump file will contain thee timestamp from the time it was created.
```
usage: dumpAllData.py [-h] [--host HOST] [--port PORT] [--filepath FILEPATH]

Reads all data from a scouting database and dumps it into a pickle file

optional arguments:
  -h, --help           show this help message and exit
  --host HOST
  --port PORT
  --filepath FILEPATH
```
If this is the first time you are running this script you may need to install the python module elasticsearch. In a Linux os this could be installed through: `sudo pip install elasticsearch`
#### Insert Data
Inserts the data stored in the specified dump file to an elastic search cluster and a kibana instance.
```
usage: insertData.py [-h] [--host HOST] [--port PORT] filepath

Reads a database dump file and inserts it into a current live database

positional arguments:
  filepath

optional arguments:
  -h, --help   show this help message and exit
  --host HOST
  --port PORT
```
e.g. `python insertData.py db_dumps/currentDump.p`
If this is the first time you are running this script you may need to install the python module elasticsearch. In a Linux os this could be installed through: `sudo pip install elasticsearch`
## Shutting Down the system
Simply press Ctrl^C to allow all the machines to terminate gracefully. If you run `sudo docker-compose up` again in the same directory you will find that all of your data is safe :D
When you truly wish to delete your data completely and remove all of the virtual machines created by the system run: `sudo docker-compose down`
This is very dangerous as it deletes your entire databasee in just under 5 seconds. Be careful.
## Youtube Record Stream Script Instructions
### Prerequisites
1. To download the youtube-dl tool run `sudo ./get-youtube-dl.sh` 
2. [Compile ffmpeg from source](https://trac.ffmpeg.org/wiki/CompilationGuide) - Use the apropriate guide for your operating system.
* When running the final ./configure command e.g. in this [Ubuntu Guide](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu#ffmpeg) add `--enable-openssl` to the list of flags
### Usage
To Download a video, pleasee configure the recordGame.sh script correctly and run it like so: `./recordGame.sh <GAME_ID>.mp4` where <GAME_ID> is a number that represents the gamee's ID in the system.
To configure the script correctly set 2 environment variables:
1. `export YOUTUBE_STREAM_URL=<YOUTUBE_STREAM_URL>` where <YOUTUBE_STREAM_URL> is the url you get from right clicking the video in youtube and copying the video url
2. `export YOUTUBE_STREAM_FORMAT=<YOUTUBE_STREAM_FORMAT>` where <YOUTUBE_STREAM_FORMAT> is the integer value for the format you choose following the command `./youtube-dl-script <YOUTUBE_STREAM_URL>` e.g. 95

Now run `./recordGame.sh 1.mp4` for example.
To cut off the live recording press Ctrl^C.
Remember to use only one  Ctrl^C when closing the ffmpeg stream recording.

