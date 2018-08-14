const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser('1ad@#$%!skfjae213'));//쿠키파서에 입력한 키값으로 암호화하여 전달한다. signedCookies로 키값으로 암호화 할 수 있다.

var products = {
    1:{title:'The history of web 1'},
    2:{title:'The next web'}
};
app.get('/products', function(req,res){
    var output = '';
    for(var name in products){
        output += `
        <li>
        <a href="/cart/${name}">${products[name].title}
        </li>
        `
    }
    res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});
app.get('/cart', function(req, res){
    var cart = req.signedCookies.cart;
    if(!cart){
        res.send('Empty!');
    } else{
        var output ='';
        for(var id in cart){
            output += `<li>${products[id].title} (${cart[id]})</li>`;
        }
    }
    res.send(`
        <h1>Cart</h1>
        <ul>${output}</ul>
        <a href="/products">Products List</a>
        `);
})
/*
cart ={
    제품넘버 : 제품개수
        1:2
        2:1
}
*/
app.get('/cart/:id', function(req, res){
    var id = req.params.id;
    if(req.signedCookies.cart){
        var cart = req.signedCookies.cart;
    } else {
        var cart = {};
    }
    if(!cart[id]){
        cart[id] = 0;
    }
    cart[id] = parseInt(cart[id])+ 1; //cart은 문자기 떄문에 parseInt로 int형으로 바꿔서 +1을 해줌

    res.cookie('cart', cart, {signed:true});
    res.redirect('/cart');
});
app.get('/count', function(req, res){
    if(req.signedCookies.count){
        var count = parseInt(req.signedCookies.count);
    } else {
        var count = 0;
    } 
    count = count +1;
    res.cookie('count', count, {signed:true});
    res.send('count : '+ count);
});
app.listen(3000,function(){
    console.log('Connected 3000 port!');
});