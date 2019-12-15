ffmpeg -i `node twitch_url.js` -vcodec copy -flags +global_header $1
