const express = require('express');
const session =  require('express-session');
const app = express();
const bodyParser = require('body-parser');
const md5 = require('md5');//현재는 md5를 권장하지 않음
const sha256 = require('sha256');

app.set('views', './views_file');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended : false}));
app.use(session({
    secret: '1234DSFs@adfasdf',
    resave: false,
    saveUninitialized: true
}))

var users = [
    {
    username:'user1',
    //password: '111';
    //password:'61d569ba561705ccac326ee94dfe6456',//md5를 통해 암호를 해싱
    password: '1d71891850f79d8730868d1899a88cd026911369fa5c0424af64e608c0ef824e',//sha25을 통해 암호를 해싱
    salt: '#$ajh3j4@adsj42&',//salt값을 추가하여 md5로 변환하면 좀더 보안성이 올라간다.
    displayName:'people'
    },
    {
    username:'user2',
    //password: '111';
    //password:'9830e2d995ab36a5def9e0ad877d7e72',
    password: 'e089895dc4cfcb429243398ab54c165e047ff51d1f068c9116759d44e942046f',
    salt:'!@#3trew23#!@',//사용자마다 salt값을 다르게 줘서 한명의 사용자의 정보가 유출되어도 다른 사용자에게 미치는 영향을 최소화 한다.
    displayName:'human'
    }
];//테스트를 위한 정보, 실제로 소스코드에 정보를 담는것은 매우 위험하다.

app.post('/auth/login', function(req,res){
    var uname = req.body.username;
    var pwd = req.body.password;
    for(var i =0; i<users.length; i++){
        var user = users[i];
        if(uname === user.username && /*md5(pwd+user.salt)*/
        sha256(pwd+user.salt) === user.password){//사용자에게서 받은 암호를 md5로 암호화하여 저장된 패스워드와 비교
            req.session.displayName = user.displayName;
            return req.session.save(function(){
                res.redirect('/welcome');
            });
        } 
    }
    res.send('<script tpye="text/javascript">alert("login failed");window.location.href= "/auth/login"; </script> ');
});
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
            <a href="/auth/logout">Logout</a>
        `);
    } else  {
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">Login</a></br>
            <a href="/auth/register">Register</a>
        `)
    }
});
app.get('/auth/login', function(req, res){
    res.render('login');
});
app.post('/auth/register', function(req,res){
    var salt = Math.floor(Math.random() * (132959230510235091 - 123948123098))+123948123098;
    var user = {
        username:req.body.username,
        password:sha256(req.body.password+salt),
        salt:salt,
        displayName:req.body.displayName
    };
    users.push(user);
    req.session.displayName = req.body.displayName;
    req.session.save(function(){
        res.redirect('/welcome');
    });
});
app.get('/auth/register', function(req, res){
    res.render('register');
})
app.listen(3000, function(){
    console.log('Connected 3000 port!');
});