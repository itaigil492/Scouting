ffmpeg -i $1 -c:v libx264 -crf 23 -preset medium -c:a libfdk_aac -vbr 4 -movflags +faststart -vf scale=-2:720,format=yuv420p $2
