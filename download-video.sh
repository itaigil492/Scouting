ffmpeg -i `youtube-dl -f $1 -g $2` -vcodec copy -flags +global_header $3;
