var express = require('express');
var router = express.Router();
var db = require('../models/DB');
var fs = require('fs');
var number = 0;
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', function (req, res) {
    if(req.session.user_id != null){
        res.render('../views/index.ejs', { islogin: 'login' });
    } else {
        res.render('../views/index.ejs', { islogin: 'no' });
    }
}); //index.ejs를 끄집어와요

router.get('/game', function(req, res){
    res.render('../views/html/main.ejs');
});

for (let i = 1; i <= 5; i++) {
    router.get(`/game/puzzle NO.${i}`, function(req, res){
        res.render(`../views/html/TQ${i}.ejs`);
    });
}



router.get('/user/logout', function (req, res) {
router.get('/user/logout', function (req, res){
    delete req.session.user_id;
    delete req.session.name;
    res.redirect('/');
}); //로그아웃과 함께 쿠키와 세션도 사라지는 마술☆

router.get('/user/mypage', function (req, res) {
    if (req.session.user_id != null) {
        var id = req.session.user_id;

        db.profile(id, function (err, show) {
            if (err) {
                console.log('오류 발생!');
                res.status(401).send('<script type="text/javascript">alert("에러가 발생했습니다."); document.location.href="/user/signup";</script>');
                res.end();
                return;
            }

            if (show) {
                console.log("이름: " + show[0].nickname);
                res.status(200).render('../views/users/mypage.ejs', { name: show[0].nickname, islogin: 'login' });
                res.end();
            }
        });
    } else {
        res.render('../views/users/mypage.ejs', { name: 'testfail', islogin: 'no' });
    }
}); //마이페이지에 접속 시 유저 정보를 가져옵니다!

router.post('/user/login', function (req, res) {
    console.log('user/login 호출됨');
    var paramID = req.body.user;
    var paramPW = req.body.pass;
    console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);

    if (db) {
        db.authUser(paramID, paramPW,
            function (err, data) {
                if (db) {
                    if (err) {
                        console.log('오류 발생!');
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
                        console.log('유저가 존재하지 않아요!');
                        res.status(401).send('<script type="text/javascript">alert("유저가 존재하지 않습니다!"); document.location.href="/user/signup";</script>');
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
    var ID = req.body.user || req.query.user;
    console.log('ID : ' + ID);

    if (db) {
        db.findPassword(ID, function (err, data) {
                if (db) {
                    if (err) {
                        console.log('오류 발생!');
                        res.status(401).send('<script type="text/javascript">alert("에러가 발생하였습니다."); document.location.href="/user";</script>');
                        res.end();
                        return;
                    }
                    if (data) {
                        console.log("비밀번호 발견: " + data[0].passwords);
                        res.status(200).send('<script type="text/javascript">alert("당신의 비밀번호는 '+data[0].passwords+' 입니다."); document.location.href="/user";</script>');
                        res.end();
                    }
                    else {
                        console.log('유저가 존재하지 않아요!');
                        res.status(401).send('<script type="text/javascript">alert("유저가 존재하지 않습니다!"); document.location.href="/user";</script>');
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
    var ID = req.body.user;
    var PW = req.body.pass;
    var Name = req.body.name;
    var PW_Correct = req.body.pass_correct;
    console.log('ID : ' + ID + ', PW : ' + PW + ' Name: ' + Name + ' PW_Correct ' + PW_Correct);

    if(ID == null || PW == null){
        res.status(401).send('<script type="text/javascript">alert("아이디 또는 비밀번호를 입력해주세요!"); document.location.href="/user/signup";</script>');
        res.end();
    } else {
        if (PW == PW_Correct) {
            
            if (db) {
                db.sameUser(ID, 
                    function(err, show){
                        if (err) {
                            console.log('오류 발생!');
                            res.status(401).send('<script type="text/javascript">alert("에러가 발생했습니다."); document.location.href="/user/signup";</script>');
                            res.end();
                            return;
                        }

                        if(show){
                            if(show == false){
                                console.log('유저가 이미 존재함!');
                                res.status(401).send('<script type="text/javascript">alert("이미 있는 회원입니다."); document.location.href="/user/signup";</script>');
                                res.end();
                                return;
                            }else{
                                db.addUser(ID, PW, Name,
                                    function (err, result) {
                                        if (err) {
                                            console.log('오류 발생!');
                                            res.status(401).send('<script type="text/javascript">alert("에러가 발생했습니다.")document.location.href="/user/signup";</script>');
                                            res.end();
                                            return;
                                        }

                                        if (result) {
                                            console.dir(result);
                                            console.log("회원가입 성공!");
                                            res.status(200).send('<script type="text/javascript">alert("회원가입 성공! 로그인해주시기 바랍니다."); document.location.href="/user";</script>');
                                            res.end();
                                            return;
                                        }
                                        else {
                                            console.log('추가에 실패했어요...');
                                            res.status(401).send('<script type="text/javascript">alert("추가에 실패했습니다.")document.location.href="/user/signup";</script>');
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
                res.status(401).send('<script type="text/javascript">alert("DB가 연결되어 있지 않습니다!"); document.location.href="/user/signup";</script>');
                res.end();
                return;
            }
        } else {
            res.status(401).send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다!"); document.location.href="/user/signup";</script>');
            res.end();
            return;
        }
}
}); //유저 정보 전송

router.post('/upload', upload.single('profile'), function (req, res) {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    var reqImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    number += 1;
    String(number);
    console.log(reqImg);

    db.profile(number, reqImg, function (success) {
        if (success != true) {
            console.log(req.file.path);

            db.showprofile(number, reqImg, function (showprofile) {
                res.contentType(showprofile.contentType);
                res.send(showprofile.data);
                number = parseInt(number);
                res.end();
            });
        } else {
            console.log('오류 발생!');
            res.status(401).send('<script type="text/javascript">alert("등록중 에러가 발생했습니다.");</script>');
            res.end();
            return;
        }
    });
}); //프로필 사진을 DB에 넣어요!


module.exports = router; //라우터를 모듈화