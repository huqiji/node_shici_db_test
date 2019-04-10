
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

// songce();
tangshi()


//保存宋词
function tangshi(){

    var fileList = new Array();

    for(var i = 0 ; i <= 57 ; i++){
        //poet.tang.0.json
        var fileName =  "poet.tang." + (i * 1000) + ".json"
        var filePath = "/Users/rockeycai/work/WebstormProjects/sqlite/test/s/json/" + fileName;

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





//保存宋诗
function songshi(){

    var fileList = new Array();

    for(var i = 0 ; i <= 254 ; i++){

        var fileName =  "poet.song." + (i * 1000) + ".json"
        var filePath = "/Users/rockeycai/work/WebstormProjects/sqlite/test/s/json/" + fileName;

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

        var stmt = db.prepare("insert into shi " +
            "( author, paragraphs, strains, title, type, era, state, notes, rhythmic, tags) " +
            "values " +
            "( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )");
        //( '作者', '段落', '声调，平仄', '标题', '类型，是唐诗还是宋词还是其他', '朝代', '状态1有效', '解释', '词牌名', '标签');


        var items = JSON.parse(data.toString());

        _.each(items , function(item){

            var era = filePath.split(".")[1]

            var paragraphs = item.paragraphs.join("\n")
            var strains = item.strains.join("\n")
            var type = "诗"


            var array = [];
            array.push(item.author)
            array.push(paragraphs)
            array.push(strains)
            array.push(item.title)
            array.push(type)
            array.push(era)
            array.push(1)
            array.push(item.notes)
            array.push(item.rhythmic)
            array.push(item.tags)

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

