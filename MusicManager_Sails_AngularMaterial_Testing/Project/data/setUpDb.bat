@ECHO off
setlocal enabledelayedexpansion enableextensions

SET mongoHome="C:\Program Files\OmniVista 2500 NMS\ThirdParty\mongodb"
SET jsFileDevPath=%mongoHome%\musicManagerDev.js
SET jsFileTestPath=%mongoHome%\musicManagerTest.js

ECHO db=db.getSiblingDB('admin'); > %jsFileDevPath%
ECHO db.auth('admin','passwd'); >> %jsFileDevPath%
ECHO db=db.getSiblingDB('my-app-dev'); >> %jsFileDevPath%
ECHO db.dropUser('dbadmin'); >> %jsFileDevPath%
ECHO db.addUser({ user: 'dbadmin', pwd:'dbpasswd', roles: ['dbAdmin','readWrite']}); >> %jsFileDevPath%
ECHO db.auth('dbadmin','dbpasswd'); >> %jsFileDevPath%
ECHO db.createCollection('testColl'); >> %jsFileDevPath%
ECHO db.testColl.insert({name : 'test' , id : 123}); >> %jsFileDevPath%

ECHO db=db.getSiblingDB('admin'); > %jsFileTestPath%
ECHO db.auth('admin','passwd'); >> %jsFileTestPath%
ECHO db=db.getSiblingDB('my-app-test'); >> %jsFileTestPath%
ECHO db.dropUser('dbadmin'); >> %jsFileTestPath%
ECHO db.addUser({ user: 'dbadmin', pwd:'dbpasswd', roles: ['dbAdmin','readWrite']}); >> %jsFileTestPath%
ECHO db.auth('dbadmin','dbpasswd'); >> %jsFileTestPath%
ECHO db.createCollection('testColl'); >> %jsFileTestPath%
ECHO db.testColl.insert({name : 'test' , id : 123}); >> %jsFileTestPath%

if NOT exist %mongoHome%\data\my-app-test.0 (
%mongoHome%\bin\mongo admin --username "admin" --password "passwd" %jsFileTestPath%
) else (
ECHO 'Database Test existing'
)

if NOT exist %mongoHome%\data\my-app-dev.0 (
%mongoHome%\bin\mongo admin --username "admin" --password "passwd" %jsFileDevPath%
%mongoHome%\bin\mongoimport -u "dbadmin" -p "dbpasswd" -d my-app-dev -c songs  --file songs.json --jsonArray
%mongoHome%\bin\mongoimport -u "dbadmin" -p "dbpasswd" -d my-app-dev -c playlists  --file playlists.json --jsonArray
) else (
ECHO 'Database Dev existing'
)


DEL %jsFileDevPath%
DEL %jsFileTestPath%

@pause