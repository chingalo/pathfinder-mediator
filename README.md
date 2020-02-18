# Pathfinder data sync mediator


## Pre-requiestes
```
- Node
- npm
- git
```

## Get started
 - clone repository
 - change directory inside app and run install all node packages
 - configure the server and data set as shown below
 - run the app

 ### Node packages installations
 Make sure you are inside clone app directory and run below command
 ```
 npm i
 ```

## Server Configurations
Configurations of source  and destination  configurations. Configrations are in _config_ directory, create files and saved as _server-config.js_ , its contents as in _server-config.example.js_ file within _config_ directory. See below sample

sourceServer for configuration of source dhis 2 instane and destinationServer for configuration of destination dhis 2 instane

```
const sourceServer = {
    url: "https://play.dhis2.org/2.28",
    username: "admin",
    password: "district"
}
const destinationServer = {
    url: "https://play.dhis2.org/2.29",
    username: "admin",
    password: "district"
}

module.exports = {
    sourceServer,
    destinationServer
}
```

## Date set configurations
Configuration for data sets to be used in migration of data from source to destination dhis 2 instance. it key value pair where key is data set id and value is array of organisatiounit level ou wish to do data migration. These configrations are in _config_ directory in file _data-set-config.js_, update object _dataSetConfig_ See the example below "xewWZMYbqYc" and ou is "acZHYslyJLt" means sync all data for _xewWZMYbqYc_ data set for all ou with ou _acZHYslyJLt_ in its path
```
const dataSetConfig = {
    "xewWZMYbqYc": ["acZHYslyJLt"],
    "TfoI3vTGv1f": ["tq4bMQkHDbC", "IGSrsG5I54W", "FylvwNXCTAQ", "acZHYslyJLt", "dt0Q0NhyPty", "aVLidCZ2RYk"],
    "kSaoJVXNxZE": ["acZHYslyJLt"],
    "GzvLb3XVZbR": ["tq4bMQkHDbC", "IGSrsG5I54W", "FylvwNXCTAQ", "acZHYslyJLt", "dt0Q0NhyPty", "aVLidCZ2RYk"],
    "cap79mdf6Co": ["tq4bMQkHDbC", "IGSrsG5I54W", "FylvwNXCTAQ"],
    "rm3y3VHPiFD": ["tq4bMQkHDbC", "IGSrsG5I54W", "FylvwNXCTAQ"],
    "zeEp4Xu2GOm": ["tq4bMQkHDbC", "IGSrsG5I54W", "FylvwNXCTAQ"]
}
module.exports = {
    dataSetConfig
}
```

## How to run the app
There are two way to run app, first using default number of previous month which is 3 or specific based on your specifications
 - To run app with default number previous month

```
node index.js
```
- To run app with specific number previous month ,let say number of specific previous month is 10
```
node index.js 10
```
