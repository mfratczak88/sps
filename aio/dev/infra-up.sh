docker container rm "$(docker container ls -aq)" -f 2>/dev/null
# set env vars from doppler
doppler secrets download --no-file --format env > /tmp/tmp.env
eval "$(cat /tmp/tmp.env)"
rm /tmp/tmp.env
doppler run -- docker-compose up -d --build --force-recreate
