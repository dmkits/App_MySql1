var fs = require('fs');
var mysql = require('mysql');
var app = require('./app');

var dbConfig;
var dbConfigFilePath;
var conn=null;

module.exports.getDBConfig=function(){
    return dbConfig;
};
module.exports.setDBConfig=function(newDBConfig){
    dbConfig= newDBConfig;
};
module.exports.loadConfig=function(){
    dbConfigFilePath='./' + app.startupMode() + '.cfg';
    var stringConfig = fs.readFileSync(dbConfigFilePath);
    dbConfig = JSON.parse(stringConfig);
};
module.exports.saveConfig=function(callback) {
    fs.writeFile(dbConfigFilePath, JSON.stringify(dbConfig), function (err, success) {
        callback(err,success);
    })
};
module.exports.databaseConnection=function(callback){
    if(conn) conn.end();
    conn = mysql.createConnection(dbConfig);
    conn.connect(function (err) {
        if (err) {
            callback(err.message);
            return;
        }
        callback(null,"connected");
    });
};
module.exports.getResultToNewQuery=function(newQuery, callback ){
    var newQueryString=newQuery.text;
    conn.query(newQueryString,[550,950],
        function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null,result);
            }
        });
};
