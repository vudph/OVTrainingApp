mongoimport --db nms --collection Alarm --file nmsAlarm.json --drop
mongoimport --db nms --collection Port --file nmsPort.json --drop
mongoimport --db nms --collection Device --file nmsDevice.json --drop
mongoimport --db nms --collection Sequence --file nmsSequence.json --drop
mongoimport --db nms --collection system.indexes --file nmsSystemIndexes.json --drop

@echo off
pause
