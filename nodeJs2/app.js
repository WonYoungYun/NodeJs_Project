const express = require('express');
const port = 3000;
const app = express();

app.locals.pretty =true;
app.set('view engine', 'pug');
app.set('views', './views');//views에서 파일을 찾아 사용가능
app.use(express.static('public'));//정적 파일의 디렉토리 제공
//use에서 설정한 디렉터리에서 정적파일을 가져와 사용할 수 있다.

app.get('/topics/:id', function(req,res){
    var topics =[
        'Javascript...',
        'Nodejs...',
        'Expreass...'
    ];
    var as = `
        <a href="/topics?id=0">Javascript</a></br>
        <a href="/topics?id=1">Nodejs</a></br>
        <a href="/topics?id=2">Express</a></br>
        ${topics[req.params.id]}
    `
    res.send(as);
})
app.get('/topics/:id/:mode', function(req, res){
    res.send(req.params.id+','+req.params.mode)

});

app.get('/topic', function(req,res){
    res.send(req.query.id+','+req.query.name);//?을 통해 query를 구분하며 id값과 name값을 통해 query의 동작을 확인가능하다.
});

app.get('/template', function(req, res){
    res.render('temp', {time:Date(), _title:'Pug'});//pug로 짠 파일을 render하여 html로 반환
});

app.get('/', function(req, res){
    var lis = '';
    for(var i = 0; i < 5; i++){
        lis = lis + '<li>coding</li>';
    }
    var output = `<!DOCTYPE HTML>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Hello world!</title>
    </head>
    <body>
        Hello world!
        <ul>
        ${lis}
        </ul>
    </body>
    </html>`;
    res.send(output);
});

app.get('/login', function(req, res){
    res.send('Login Please');
});
app.listen(port, function(){
    console.log(`Connected ${port} port!`);
});

