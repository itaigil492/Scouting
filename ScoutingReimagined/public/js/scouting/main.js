$(window)
    .on('load', function () {
        console.log("Here Document is Ready");
        var $video, $sourceBuffer;
        var parts = [];

        $video = $('#gameVideo');
        // $box = $('#upload-box');
        // $progress = $('#progress');
        // $list = $('#list');

        // var mediaSource = new MediaSource();

        $video.attr({
            controls: true,
            autoplay: true
        });

        // var sourceBuffer;
        // $video.attr('src', (window.URL || window.webkitURL)
        //     .createObjectURL(mediaSource));

        // function callback(e) {
        //     console.log("sourceopen or webkitsourceopen");
        //     console.log("readyState:", this.readyState);
        //     // sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
        //     sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
        //     sourceBuffer.addEventListener('updateend', function () {
        //         console.log("Updated Ended");
        //         var data = parts.shift();
        //         if (data) {
        //             console.log("Adding new data");
        //             sourceBuffer.appendBuffer(parts.shift());
        //         }
        //     }, false);
        // }
        //
        // mediaSource.addEventListener('sourceopen', callback, false);
        // mediaSource.addEventListener('webkitsourceopen', callback, false);
        //
        // mediaSource.addEventListener('webkitsourceended', function (e) {
        //     console.log("readyState:", this.readyState);
        // }, false);

        video.request(gameId + ".mp4");



        client.on('open', function () {
            console.log("Open Event");

            // video.list(setupList);
            //
            // $box.on('dragenter', fizzle);
            // $box.on('dragover', fizzle);
            // $box.on('drop', setupDragDrop);
        });

        client.on('stream', function (stream) {
            console.log("Stream Event");
            video.download(stream, function (err, src) {
                console.log("err:", err);
                console.log("src:", src);
                $video.attr('src', src);
                // if (result == true) {
                //     console.log("event ended and returned true");
                //     sourceBuffer.addEventListener('updateend', function () {
                //         console.log("Updated Ended Phase 2");
                //         var data = parts.shift();
                //         if (data) {
                //             console.log("Adding new data");
                //             sourceBuffer.appendBuffer(parts.shift());
                //         }
                //     }, true);
                // }
            });
        });

        function setupList(err, files) {
            var $ul, $li;

            $list.empty();
            $ul = $('<ul>')
                .appendTo($list);

            files.forEach(function (file) {
                $li = $('<li>')
                    .appendTo($ul);
                $a = $('<a>')
                    .appendTo($li);

                $a.attr('href', '#')
                    .text(file)
                    .click(function (e) {
                        fizzle(e);

                        var name = $(this)
                            .text();
                        video.request(name);
                    });
            });
        }

        function setupDragDrop(e) {
            fizzle(e);

            var file, tx;

            file = e.originalEvent.dataTransfer.files[0];
            tx = 0;

            video.upload(file, function (err, data) {
                var msg;

                if (data.end) {
                    msg = "Upload complete: " + file.name;

                    video.list(setupList);
                } else if (data.rx) {
                    msg = Math.round(tx += data.rx * 100) + '% complete';

                } else {
                    // assume error
                    msg = data.err;
                }

                $progress.text(msg);

                if (data.end || data.err) {
                    setTimeout(function () {
                        $progress.fadeOut(function () {
                                $progress.text('Drop file here');
                            })
                            .fadeIn();
                    }, 5000);
                }
            });
        }
    });
