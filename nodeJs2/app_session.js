const express = require('express');
const session =  require('express-session');
const app = express();
const bodyParser = require('body-parser');

app.set('views', './views_file');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended : false}));

app.use(session({
    secret: '1234DSFs@adfasdf',
    resave: false,
    saveUninitialized: true
}))
app.get('/count', function(req, res){
    if(req.session.count){
        req.session.count++;
    } else{
        req.session.count = 1;
    }
    res.send('count : '+req.session.count);
});//session을 통하여 아이디 별로 별도의 데이터를 저장 할 수 있다.
app.get('/auth/logout', function(req,res){
    delete req.session.displayName;
    res.redirect('/welcome');
})
app.get('/welcome', function(req, res){
    if(req.session.displayName){
        res.send(`
            <h1>Hello ${req.session.displayName}</h1>
            <a href="/auth/login">Logout</a>
        `);
    } else  {
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">Login</a>
        `)
    }
});
app.post('/auth/login', function(req,res){
    var user = {
        username:'user1',
        password:'111',
        displayName:'people'
    };//테스트를 위한 정보, 실제로 소스코드에 정보를 담는것은 매우 위험하다.
    var uname = req.body.username;
    var pwd = req.body.password;
    if(uname === user.username && pwd === user.password){
        req.session.displayName = user.displayName;
        res.redirect('/welcome');
    } else{
        res.send('<script tpye="text/javascript">alert("login failed");window.location.href= "/auth/login"; </script> ');
    }
});

app.get('/auth/login', function(req, res){
    res.render('login');
});

app.listen(3000, function(){
    console.log('Connected 3000 port!');
});