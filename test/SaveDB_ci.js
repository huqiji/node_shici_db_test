
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

songci()




//保存宋词
function songci(){

    var fileList = new Array();

    for(var i = 0 ; i <= 21 ; i++){

        var fileName =  "ci.song." + (i * 1000) + ".json"
        var filePath = "/Users/rockeycai/work/my/nodejs/chinese-poetry-master/ci/" + fileName

        fileList.push(filePath)
    }
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

        var stmt = db.prepare("insert into ci " +
            "( author, paragraphs, rhythmic, tags, state) " +
            "values " +
            "( ?, ?, ?, ?, ? )");


        var items = JSON.parse(data.toString());

        _.each(items , function(item){

            var era = filePath.split(".")[1]

            var paragraphs = item.paragraphs.join("\n")
            var tags = item.tags ? item.tags.join("\n") : ""

            var array = [];
            array.push(item.author)
            array.push(paragraphs)
            array.push(item.rhythmic)
            array.push(tags)
            array.push(1)

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

