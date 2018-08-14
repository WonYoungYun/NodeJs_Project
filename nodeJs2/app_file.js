const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');

app.set('views', './views_file');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended : false}));

app.get('/topic/new', function(req, res){
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('new', {topics:files});
    });
});

app.get(['/topic','/topic/:id'], function(req, res){
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        var ida = req.params.id;
        if(ida){
        //id값이 있을 때
            fs.readFile('data/'+ida, 'utf-8', function(err, data){
                if(err){
                    res.status(500).send('Internal Server Error');
                }
                res.render('view', {topics:files, title:ida, description:data});
            });
        } else {
            //id값이 없을 때
            res.render('view', {topics: files, title:'welcome', description:'Hello Express!'});
        }
    })
});
app.post('/topic', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title,description,function(err){
        if(err){
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/'+title);    
    });
});
/*
app.get('/topic/:id', function(req, res){
    var ida = req.params.id;
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        fs.readFile('data/'+ida, 'utf-8', function(err, data){
            if(err){
                res.status(500).send('Internal Server Error');
            }
            res.render('view', {topics:files, title:ida, description:data});
        });
    });
});
*/
app.listen(port, function(){
    console.log(`Connected ${port} port!`);
});

