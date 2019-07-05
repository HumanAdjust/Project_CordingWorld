var express = require('express');
var logger = require('morgan');
var favicon = require('serve-favicon');
var path = require('path');
var cording = require('./routes/page');
var app = express();
var database = require('./models/DB');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  //favicon 처리 맛깔나게 해버렷!!!
app.use(logger('dev'));  //로깅 처리
app.use(express.static('public'));  //기본 경로는 public
app.use(express.urlencoded({ extended: true }));  //body 데이터 파싱
app.use(cookieParser());  //쿠키를 사용해 버리겠어!
app.use(session({
    resave: false,
    saveUninitialized: false,
    key: 'sid', // 세션키
    secret: 'secret', // 비밀키
    cookie: {
        maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
    }
})); //세션 처리

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', cording);
app.use('/user', cording);
app.use('/game', cording);

app.listen(8080, function () {
    console.log('8080포트에서 대기중');
    database.connectDB();  //DB 연결
}); 