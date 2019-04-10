
var fs = require('fs');
var OpenCC = require('opencc');
var opencc = new OpenCC('t2s.json');
var fileHelper = require('./Dir');
var _ = require('underscore');
var async = require("async")

var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var dbPath = path.join(__dirname , "sc.db");
var db = new sqlite3.Database(dbPath);
// db.run("delete from poetry");


authors();

//保存宋诗
function authors(){

    var fileList = new Array();

    var filePath = "/Users/rockeycai/work/WebstormProjects/sqlite/test/s/json/authors.song.json"
    fileList.push(filePath)
    var filePath2 = "/Users/rockeycai/work/WebstormProjects/sqlite/test/s/json/authors.tang.json"
    fileList.push(filePath2)

    //循环文件集合
    async.eachSeries(fileList , function(filePath , callback) {

        readFile(filePath , function(){
            callback(null);
        });

    } , function (error) {
        console.log("--全部任务结束--");
        db.close();
    });
}




function readFile(filePath , fileCb){

    console.log("--开始--" , filePath);

    //读取文件
    fs.readFile(filePath,function(err,data){
        if(err){
            return console.log(err);
        }

        saveDB(filePath , data,function(){

            console.log("--结束--" , filePath);
            fileCb();

        });
    });
}


function saveDB(filePath , data, cb ){

    db.serialize(function () {

        db.run('BEGIN');

        var stmt = db.prepare("insert into author " +
            "( name, desc, short_description,era, state , type) " +
            "values " +
            "( ?, ?, ?,?,?,?)");

        var items = JSON.parse(data.toString());

        _.each(items , function(item){

            var era = filePath.split(".")[1]

            var array = [];
            array.push(item.name)
            array.push(item.desc)
            array.push(item.short_description)
            array.push(era)
            array.push(1)
            array.push('诗')

            stmt.run( array );
        })

        stmt.finalize(function(dbError){

            if(dbError){
                console.error(dbError)
            }

            db.run('COMMIT');
            cb();
        });

        // db.run('COMMIT');
    });

}

