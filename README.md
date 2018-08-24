## Run local mongo DB
docker run --name mongo --restart=always -d -p 27017:27017 -v ~/mongo_datadir:/data/db:delegated -d mongo
