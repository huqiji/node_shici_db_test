
var sqlite3 = require('sqlite3').verbose();
var path = require('path');

var dbPath = path.join(__dirname , "sc.db");

var db = new sqlite3.Database(dbPath);

