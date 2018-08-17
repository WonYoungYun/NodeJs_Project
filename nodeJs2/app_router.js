const express = require('express');
const app = express();

var p1 = require('./routes/p1')(app);
app.use('/p1', p1);//p1으로 들어오는 모든 접속은 router에게 위임

var p2 = require('./routes/p2');
app.use('/p2', p2);

//별도의 파일로 모듈을 만든다면 모듈은 고립화되고 고립화된 모듈에 영향을 주는 것이 힘들어진다.
//모듈을 전달할떄 함수화한다음 app인자 전달을 통한 모듈의 객체화를 통해 모듈에 영향을 주고 결과값을 반환 받는 형식을 취함으로써 모듈과의 연계를 더 좋게 할 수 있다.
app.listen(3000, function(){
    console.log('connected');
})