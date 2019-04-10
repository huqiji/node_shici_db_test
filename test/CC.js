/**
 * Created by rockeycai on 2019/4/10.
 */
// const opencc = require('node-opencc');

// var aa = opencc.hongKongToSimplified('滑鼠');// === '鼠标';
// console.log(aa)
// var a1 = opencc.traditionalToHongKong('僞') //=== '偽';
// console.log(a1)



// var a2 = opencc.traditionalToSimplified('單氏，成都妓。與陳摶同時，事見《詩話總龜》前集卷一二。') //=== '偽';
// console.log(a2)


var OpenCC = require('opencc');


// s2t.json Simplified Chinese to Traditional Chinese 簡體到繁體
// t2s.json Traditional Chinese to Simplified Chinese 繁體到簡體
// s2tw.json Simplified Chinese to Traditional Chinese (Taiwan Standard) 簡體到臺灣正體
// tw2s.json Traditional Chinese (Taiwan Standard) to Simplified Chinese 臺灣正體到簡體
// Load the default Simplified to Traditional config
var opencc = new OpenCC('t2s.json');

// Set conversion mode
// opencc.setConversionMode(OpenCC.CONVERSION_FAST);

// Sync API
var converted = opencc.convertSync("幸夤遜");
console.log(converted);

// // Async API
// opencc.convert("汉字", function (err, converted) {
//     console.log(converted);
// });
