var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var body_parser= require('body-parser');
var app = express();

var db=()=>{
    let database = new sqlite3.Database('./portfolio.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    //res.send('Connected to the chinook database.');
    //res.end('Hello World');
    });
    return database;
}


app.use(body_parser.urlencoded({extended:false}));
app.get("/",(req,res)=>{
    res.end("Server is running...");
})

app.get('/users', function (req, res) {
      var sql="select * from User";
      db().all(sql,(err, rows ) => {
        res.send(rows);
        res.end();
        db().close();
    });
})

app.post('/users',(req,res)=>{
    var first_name = req.body.first_name;
    var last_name= req.body.last_name;
    var email= req.body.email;
    var password= req.body.password;
    var phone= req.body.phone;
 
    var sql="insert into User (first_name,last_name,email,password,phone) values(?,?,?,?,?)";
    var cmd=db().prepare(sql);
    cmd.run([first_name,last_name,email,password,phone],(err)=>{
        if(err)
            console.log(err.message);
    })
    cmd.finalize();
    res.send('Save successfully');
    res.end();
    db().close();
})

app.put('/users',(req,res)=>{
    var first_name = req.body.first_name;
    var last_name= req.body.last_name;
    var email= req.body.email;
    var password= req.body.password;
    var phone= req.body.phone;
    var user_id=req.body.user_id;

    let sql = `UPDATE User SET first_name = ?,last_name=?,email=?,password=?,phone=? WHERE user_id = ?`;
    var cmd=db().prepare(sql);
    cmd.run([first_name,last_name,email,password,phone,user_id],(err)=> {
          if (err) {
            return console.error(err.message);
          }
        });
        cmd.finalize();
        res.send('Update successfully');
        res.end();
        db().close();
})

app.delete('/users',(req,res)=>{
    var user_id=req.body.user_id;
    let sql = `DELETE from User WHERE user_id = ?`;
    var cmd=db().prepare(sql);
    cmd.run([user_id],(err)=> {
        if (err) {
          return console.error(err.message);
        }
      });
      cmd.finalize();
      res.send('Delete successfully');
      res.end();
      db().close();
})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})