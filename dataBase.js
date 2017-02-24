var fs = require('fs');
var mysql = require('mysql');
var app = require('./app');

var dbConfig;
var dbConfigFilePath;
var conn=null;

module.exports.getDBConfig=function(){                                                                                  console.log("dbConfig=",dbConfig);
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

//module.exports.getUnits = function (callback) {
//    var reqSql = new sql.Request(conn);
//    var query_str = fs.readFileSync('./scripts/mobile_units.sql', 'utf8');
//    reqSql.query(query_str,
//        function (err, recordset) {
//            if (err)
//                callback(err, null);
//            else
//                callback(null, recordset);
//        });
//};
//module.exports.getViewMainData = function (bdate, edate, unit_condition, errAction, successAction) {
//    var reqSql = new sql.Request(conn);
//    var query_str = fs.readFileSync('./scripts/mobile_main_view.sql', 'utf8');
//    reqSql.input('BDATE', sql.Date, bdate);
//    reqSql.input('EDATE', sql.Date, edate);
//    reqSql.input('StocksList', sql.NVarChar, unit_condition);
//    reqSql.query(query_str,
//        function (err, recordset) {
//            if (err) {
//                errAction(err);
//            } else {
//                successAction(recordset);
//            }
//        })
//};
//module.exports.getViewMainDetailData = function (bdate, edate, unit_condition, errAction, successAction) {
//    var reqSql = new sql.Request(conn);
//    var query_str = fs.readFileSync('./scripts/mobile_main_view_d.sql', 'utf8');
//    reqSql.input('BDATE', sql.Date, bdate);
//    reqSql.input('EDATE', sql.Date, edate);
//    reqSql.input('StocksList', sql.NVarChar, unit_condition);
//    reqSql.query(query_str,
//        function (err, recordset) {
//            if (err) {
//                errAction(err);
//            } else {
//                successAction(recordset);
//            }
//        })
////};
//module.exports.getDetailViewData= function(detail_id, bdate, edate, unit_condition,callback) {
//    var reqSql = new sql.Request(conn);
//    var query_str=fs.readFileSync('./scripts/mobile_detail_view_'+detail_id+'.sql', 'utf8');
//    reqSql.input('BDATE',sql.Date,bdate);
//    reqSql.input('EDATE',sql.Date,edate);
//    reqSql.input('StocksList',sql.NVarChar,unit_condition );
//    reqSql.query(query_str,
//        function (err, recordset) {
//            if (err) {
//                callback(err);
//            } else {
//                callback(null,recordset);
//            }
//        }
//    )
//};
module.exports.getResultToNewQuery=function(newQuery, callback ){   console.log("getResultToNewQuery=");
 //   var reqSql = new sql.Request(conn);

    var newQueryString=newQuery.text;                                                                                   console.log("newQueryString=",newQueryString);

   // for(var paramName in parameters) reqSql.input(paramName, deleteSpaces(parameters[paramName]));


    //reqSql.input('BDATE',sql.Date,bdate);
    //reqSql.input('EDATE',sql.Date,edate);
    //if(unit_condition){unit_condition=deleteSpaces(unit_condition)}
    //reqSql.input('StocksList',sql.NVarChar,unit_condition);
    //reqSql.query(newQueryString,
    //    function (err, result) {
    //        if (err) {
    //            callback(err);
    //        } else {
    //            callback(null,result);
    //        }
    //    })

    conn.query(newQueryString,
        function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null,result);
            }
        });
};

function deleteSpaces(text){
    if(text.indexOf(" ")!=-1){
        text = text.replace(/ /g,"");
    }
    return text;
}




//var connection = mysql.createConnection({
//    host:'localhost',
//    user:'root',
//    password:'Кен123',
//    database:'computersDB'
//
//});
//connection.connect(function(error){
//    if(error){
//        console.log('Error');
//    }else{
//        console.log('Connected');
//    }
//});