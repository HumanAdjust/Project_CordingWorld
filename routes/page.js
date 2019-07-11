var express = require('express');
var router = express.Router();
var db = require('../models/DB')
var Puzzle = require('../public/Javascript/puzzlegame');

router.get('/', function (req, res) {
    if(req.session.user_id != null){
        res.render('../views/index.ejs', { islogin: 'login' });
    } else {
        res.render('../views/index.ejs', { islogin: 'no' });
    }
}); //index.ejs를 끄집어와요

router.get('/game', function(req, res){
    if(req.session.user_id != null){
        res.render('../views/html/main.ejs', { islogin: 'login' });
    } else {
        res.send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
});

router.get('/lecture', function(req, res){
    if (req.session.user_id != null) {
        res.render('../views/html/lecture.ejs', { islogin : 'login' });
    } else {
        res.status(401).send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
});

router.get('/mypage', function(req, res){
    if (req.session.user_id != null) {
        var id = req.session.user_id;

        db.profile(id, function (err, show) {
            if (err) {
                console.log('오류 발생!');
                res.status(401).send('<script type="text/javascript">alert("에러가 발생했습니다."); document.location.href="/";</script>');
                res.end();
                return;
            }

            if (show) {
                console.log("이름: " + show[0].nickname);
                res.render('../views/html/mypage.ejs', { name: show[0].nickname, islogin: 'login' , solved_Try: show[0].solved});
                res.end();
            }
        });
    } else {
        res.status(401).send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
}); //마이페이지에 접속 시 유저 정보를 가져옵니다!

router.get('/user/logout', function (req, res){
    delete req.session.user_id;
    delete req.session.name;
    res.redirect('/');
}); //로그아웃과 함께 쿠키와 세션도 사라지는 마술☆

router.get('/lecture/C', function (req, res) {
    if (req.session.user_id != null) {
        res.render('../views/html/lecture-list/C.ejs', { islogin: 'login' });
    } else {
        res.status(401).send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
});

router.get('/lecture/C++', function(req, res){
    if (req.session.user_id != null) {
        res.render('../views/html/lecture-list/C++.ejs', { islogin : 'login' });
    } else {
        res.status(401).send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
});

router.get('/lecture/Java', function (req, res) {
    if (req.session.user_id != null) {
        res.render('../views/html/lecture-list/Java.ejs', { islogin: 'login' });
    } else {
        res.status(401).send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
});

router.get('/lecture/Python', function (req, res) {
    if (req.session.user_id != null) {
        res.render('../views/html/lecture-list/Python.ejs', { islogin: 'login' });
    } else {
        res.status(401).send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
});

router.get('/lecture/HTML', function (req, res) {
    if (req.session.user_id != null) {
        res.render('../views/html/lecture-list/HTML.ejs', { islogin: 'login' });
    } else {
        res.status(401).send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
});

router.get('/lecture/CSS', function(req, res){
    if (req.session.user_id != null) {
        res.render('../views/html/lecture-list/CSS.ejs', { islogin : 'login' });
    } else {
        res.status(401).send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
});

router.get('/lecture/JavaScript', function (req, res) {
    if (req.session.user_id != null) {
        res.render('../views/html/lecture-list/JavaScript.ejs', { islogin: 'login' });
    } else {
        res.status(401).send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
        res.end();
    }
});

router.post('/user/login', function (req, res) {
    console.log('user/login 호출됨');
    var paramID = req.body.user || req.query.user;
    var paramPW = req.body.pass || req.query.pass;
    console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);

    if (db) {
        db.authUser(paramID, paramPW,
            function (err, data) {
                if (db) {
                    if (err) {
                        console.log('Error!!!');
                        res.status(401).send('<script type="text/javascript">alert("에러 발생!"); document.location.href="/user";</script>');
                        res.end();
                        return;
                    }

                    if (data) {
                        console.dir(data);
                        console.log("로그인 성공!");
                        req.session.user_id = req.body.user, // 아이디
                        req.session.name = req.body.name // 이름
                        console.log(req.session.user_id);
                        res.redirect('/');
                        res.end();

                    }
                    else {
                        console.log('empty Error!!!');
                        res.status(401).send('<script type="text/javascript">alert("유저가 존재하지 않습니다!"); document.location.href="/user";</script>');
                        res.end();
                    }
                }
                else {
                    console.log('DB 연결 안됨');
                    res.status(401).send('<script type="text/javascript">alert("DB 연결 실패!"); document.location.href="/user";</script>');
                    res.end();
                }
            }
        );
    }
}); //로그인 체크

router.post('/user/search', function (req, res) {
    console.log('user/search 호출됨');
    var paramID = req.body.user || req.query.user;
    console.log('paramID : ' + paramID);

    if (db) {
        db.findPassword(paramID, function (err, data) {
                if (db) {
                    if (err) {
                        console.log('Error!!!');
                        res.status(401).send('<script type="text/javascript">alert("에러가 발생하였습니다."); document.location.href="/user";</script>');
                        res.end();
                        return;
                    }

                    if (data) {
                        console.dir(data);
                        console.log("비밀번호 발견: " + data);
                        res.status(401).send('<script type="text/javascript">alert("당신의 비밀번호는 '+data[0].passwords+' 입니다."); document.location.href="/user";</script>');
                        res.end();
                    }
                    else {
                        console.log('empty Error!!!');
                        res.status(401).send('<script type="text/javascript">alert("유저가 존재하지 않습니다!"); document.location.href="/";</script>');
                        res.end();
                    }
                }
                else {
                    console.log('DB 연결 안됨');
                    res.status(401).send('<script type="text/javascript">alert("DB가 연결되어 있지 않습니다!"); document.location.href="/user";</script>');
                    res.end();
                }
            }
        );
    }
}); //비밀번호 찾기

router.post('/user/adduser', function (req, res) {
    console.log('user/adduser 호출됨');
    var paramID = req.body.user || req.query.user;
    var paramPW = req.body.pass || req.query.pass;
    var paramName = req.body.name || req.query.name;
    var paramPW_Correct = req.body.pass_correct || req.query.pass_correct;
    console.log('paramID : ' + paramID + ', paramPW : ' + paramPW + ' paramName: ' + paramName + ' paramPW_Correct ' + paramPW_Correct);

    if(paramID == null || paramPW == null){
        res.status(401).send('<script type="text/javascript">alert("아이디 또는 비밀번호를 입력해주세요!"); document.location.href="/user";</script>');
        res.end();
    } else {
        if (paramPW == paramPW_Correct) {
            if (db) {
                db.sameUser(paramID, 
                    function(err, show){
                        if (err) {
                            console.log('Error!!!');
                            res.status(401).send('<script type="text/javascript">alert("에러가 발생했습니다."); document.location.href="/user";</script>');
                            res.end();
                            return;
                        }
                        
                        if(show){
                            if(show != true){
                                console.log('유저가 이미 존재함!');
                                res.status(401).send('<script type="text/javascript">alert("이미 있는 회원입니다."); document.location.href="/user";</script>');
                                res.end();
                                return;
                            }else{
                                db.addUser(paramID, paramPW, paramName,
                                    function (err, result) {
                                        if (err) {
                                            console.log('Error!!!');
                                            res.status(401).send('<script type="text/javascript">alert("에러가 발생했습니다.")document.location.href="/user";</script>');
                                            res.end();
                                            return;
                                        }

                                        if (result) {
                                            console.dir(result);
                                            console.log("회원가입 성공!");
                                            res.status(200).send('<script type="text/javascript">alert("회원가입 성공!로그인해주시기 바랍니다."); document.location.href="/";</script>');
                                            res.end();
                                            return;
                                        }
                                        else {
                                            console.log('추가 안됨 Error!!!');
                                            res.status(401).send('<script type="text/javascript">alert("추가에 실패했습니다.")document.location.href="/user";</script>');
                                            res.end();
                                            return;
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
            } else {
                console.log('DB 연결 안됨');
                res.status(401).send('<script type="text/javascript">alert("DB가 연결되어 있지 않습니다!"); document.location.href="/user";</script>');
                res.end();
                return;
            }
        } else {
            res.status(401).send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다!"); document.location.href="/user";</script>');
            res.end();
            return;
        }
    }
}); //유저 정보 전송

router.post('/game', function (req, res){
    console.log("ㅎㅇ");
    var id = req.session.user_id;
    if (db) {
        db.profileupdate(id, Puzzle.solvedTry, function (err, success) {
            if (err) {
                console.log(err);
            }

            if (success) {
                if (success == true) {
                    console.log('success');
                    if (req.session.user_id != null) {
                        res.render('../views/html/main.ejs', { islogin: 'login' });
                    } else {
                        res.send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
                        res.end();
                    }
                } else {
                    console.log('오류 발생');
                }
            }
        });
    }
});

module.exports = router; //라우터를 모듈화