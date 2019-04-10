/**
 * Created by rockeycai on 2019/4/10.
 */
var fs = require('fs');
var OpenCC = require('opencc');
var opencc = new OpenCC('t2s.json');
var fileHelper = require('./Dir');
var _ = require('underscore');

var  fileList = fileHelper.getFileList("/Users/rockeycai/work/my/nodejs/chinese-poetry-master/json/");

//console.log(fileList)


_.each(fileList , function(item){

    var path = item.path;
    var filename = item.filename;

    console.log(item)

    if(filename.indexOf(".json") > 0){


        // var path = '/Users/rockeycai/work/my/nodejs/chinese-poetry-master/json/authors.song.json'
        //读取文件
        fs.readFile(path + filename,function(err,data){
            if(err){
                return console.log(err);
            }
            // console.log(data.toString());

            //转为简体
            var converted = opencc.convertSync(data.toString());
            //console.log(converted);

            //写入文件
            fs.writeFile('./s/json/' + filename, converted,function(err){
                if(err) console.log('写文件操作失败');
                //else console.log('写文件操作成功');
            });


        });

    }

})
