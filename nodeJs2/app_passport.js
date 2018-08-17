const express = require('express');
const session =  require('express-session');
const app = express();
const bodyParser = require('body-parser');
const sha256 = require('sha256');
const passport =require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.set('views', './views_file');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended : false}));
app.use(session({
    secret: '1234DSFs@adfasdf',
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());//패스포트초기화 하여 패스포트를 사용할 수 있다.
app.use(passport.session());//인증작업할때 세션 사용 반드시 세션을 정의한다음 그 밑에 붙어야함

var users = [
    {
    username:'user1',
    password: '1d71891850f79d8730868d1899a88cd026911369fa5c0424af64e608c0ef824e',
    salt: '#$ajh3j4@adsj42&',
    displayName:'people'
    },
    {
    username:'user2',
    password: 'e089895dc4cfcb429243398ab54c165e047ff51d1f068c9116759d44e942046f',
    salt:'!@#3trew23#!@',
    displayName:'human'
    }
];

//use -> serializeUser -> deserializeUser 순으로 실행
passport.serializeUser(function(user, done){
    done(null, user.username);//이때 user가 세션에 저장되며, 다시 방문할때마다 deserializeUser만 발생
});
passport.deserializeUser(function(id, done){
    for (var i=0; i<users.length; i++) {
        var user = users[i];
        if(user.username === id){
            done(null, user);
        }
    }
});

passport.use(new LocalStrategy(
    function(username, password, done){
        var uname = username;
        var pwd = password;
        for(var i=0; i<users.length; i++){
            var user = users[i];
            if(uname === user.username && sha256(pwd+user.salt) === user.password){ 
                return done(null, user)//null의 인자는 에러처리를 하는데 사용
                    //2번째 인자값이 false가 아니면 passport.serializeUser가 실행
                } 
        }
        done(null, false);
    }
));


app.post('/auth/login', passport.authenticate('local',/*전략을 의미, facebook을 사용하려면 'facebook'으로 바꿔주면된다.*/
    {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false
    }));

app.get('/count', function(req, res){
    if(req.session.count){
        req.session.count++;
    } else{
        req.session.count = 1;
    }
    res.send('count : '+req.session.count);
});

app.get('/auth/logout', function(req,res){
    req.logout();
    req.session.save(function(){ //logout이 끝나고 redirect시켜줘서 더 안정적이다.
        res.redirect('/welcome');
    });
});

app.get('/welcome', function(req, res){
if(req.user && req.user.displayName){
        res.send(`
            <h1>Hello ${req.user.displayName}</h1>
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
    req.login(user, function(err){
        req.session.save(function(){
            res.redirect('/welcome');
        });
    });
});
app.get('/auth/register', function(req, res){
    res.render('register');
})
app.listen(3000, function(){
    console.log('Connected 3000 port!');
});