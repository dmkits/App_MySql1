function startupMode(){
  var app_params = process.argv.slice(2);
  if(app_params.length==0) return 'production';
  return app_params[0];
}
module.exports.startupMode = startupMode;

var fs = require('fs');
var express = require('express');
var app = express();
var port=8181;
var path=require ('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/',express.static('public'));
var database = require('./dataBase');
var ConfigurationError, DBConnectError;

tryLoadConfiguration();
function tryLoadConfiguration(){
  try {
    database.loadConfig();
    ConfigurationError=null;
  } catch (e) {
    ConfigurationError= "Failed to load configuration! Reason:"+e;
  }
}
if (!ConfigurationError) tryDBConnect();
function tryDBConnect(postaction) {
  database.databaseConnection(function (err) {
    DBConnectError = null;
    if (err) {
      DBConnectError = "Failed to connect to database! Reason:" + err;
    }
    if (postaction)postaction(err);
  });
}
app.get("/sysadmin", function(req, res){
  res.sendFile(path.join(__dirname, '/views', 'sysadmin.html'));
});
app.get("/sysadmin/app_state", function(req, res){
  var outData= {};
  outData.mode= startupMode();
  if (ConfigurationError) {
    outData.error= ConfigurationError;
    res.send(outData);
    return;
  }
  outData.configuration= database.getDBConfig();
  if (DBConnectError)
    outData.dbConnection= DBConnectError;
  else
    outData.dbConnection='Connected';
  res.send(outData);
});
app.get("/sysadmin/startup_parameters", function (req, res) {
  res.sendFile(path.join(__dirname, '/views/sysadmin', 'startup_parameters.html'));
});
app.get("/sysadmin/startup_parameters/get_app_config", function (req, res) {
  if (ConfigurationError) {
    res.send({error:ConfigurationError});
    return;
  }
  res.send(database.getDBConfig());
});
app.get("/sysadmin/startup_parameters/load_app_config", function (req, res) {
  tryLoadConfiguration();
  if (ConfigurationError) {
    res.send({error:ConfigurationError});
    return;
  }
  res.send(database.getDBConfig());
});
app.post("/sysadmin/startup_parameters/store_app_config_and_reconnect", function (req, res) {
  var newDBConfigString = req.body;
  database.setDBConfig(newDBConfigString);
  database.saveConfig(
      function (err) {
        var outData = {};
        if (err) outData.error = err;
        tryDBConnect(/*postaction*/function (err) {
          if (DBConnectError) outData.DBConnectError = DBConnectError;
          res.send(outData);
        });
      }
  );
});
app.get("/sysadmin/sql_queries", function (req, res) {
  res.sendFile(path.join(__dirname, '/views/sysadmin', 'sql_queries.html'));
});
app.get("/sysadmin/sql_queries/get_script", function (req, res) {
  res.send(fs.readFileSync('./scripts/'+req.query.filename, 'utf8'));
});
app.post("/sysadmin/sql_queries/get_result_to_request", function (req, res) {
  var newQuery = req.body;
  database.getResultToNewQuery(newQuery,/*speed,*/
      function (err,result) {
        var outData = {};
        if (err) outData.error = err.message;
        outData.result = result;
        res.send(outData);
      }
  );
});
app.listen(port);