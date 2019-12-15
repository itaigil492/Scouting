var twitchStreams = require('twitch-get-stream')('my6xxlv3grzga2clhqn2ggckl3om4z'); // twitch now ENFORCES client id usage apparently, so this is now required. 
twitchStreams.get('firstinspires_roebling').then(function(streams) {
	for (var stream of streams)
                if(stream.quality == 'Source') console.log(stream.url);
}).catch(function(error) {
        if (error)
            return console.log('Error caught:', error);
    });

