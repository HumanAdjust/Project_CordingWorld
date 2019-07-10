const MongoClient = require('mongodb').MongoClient;
const dbName = 'CodingDB'; // Database Name

var database;

exports.connectDB = function() {
    var databaseURL = 'mongodb://localhost:27017';
    MongoClient.connect(databaseURL, { useNewUrlParser: true },
        function (err, client) {
            if (err) {
                console.log('MongoDB 접속 실패: ', err);
                return;
            }

            console.log('MongoDB 접속 성공: ' + databaseURL);

            database = client.db(dbName);
        }
    );
}; //DB 연결

exports.authUser = function (id, password, callback) {
    console.log('input id :' + id.toString() + '  :  pw : ' + password);

    var users = database.collection('users');

    var result = users.find({ "id": id, "passwords": password });

    result.toArray(
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }

            if (data.length > 0) {
                console.log('find user [ ' + data + ' ]');
                callback(null, data);
            }
            else {
                console.log('can not find user [ ' + data + ' ]');
                callback(null, null);
            }
        }

    );

}; //로그인

exports.addUser = function (id, passwords, nick, callback) {
    console.log('add User 호출됨: ' + id + '  , ' + passwords);
    var users = database.collection('users');

    users.insertMany([{ "id": id, "passwords": passwords, "nickname": nick }],
        function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }

            if (result.insertedCount > 0) {
                console.log('사용자 추가 됨: ' + result.insertedCount);
                callback(null, result);
            }
            else {
                console.log('사용자 추가 안됨: ' + result.insertedCount);
                callback(null, null);
            }

        }
    );
}; //회원가입

exports.findPassword = function(id, callback){
    console.log('findPassword 호출됨');
    var users = database.collection('users');

    var result = users.find({ "id": id });
    console.log(result);
    result.toArray(
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }

            if (data.length > 0) {
                console.log('사용자를 찾았어요: ' + result.count());
                callback(null, data);
            }
            else {
                console.log('사용자를 찾지 못했어요..');
                callback(null, null);
            }
        }

    );
}; //비밀번호 찾기

exports.sameUser = function(id, callback){
    console.log('sameUser 호출됨');
    var users = database.collection('users');
    var result = users.find({ "id": id });

    result.toArray(
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }

            if (data.length > 0) {
                console.log('일치하는 유저: ' + result.count());
                console.log(data);
                callback(null, data);
            }
            else {
                console.log('일치하는 유저 없음');
                callback(null, true);
            }
        }

    );
}; //아이디 중복 확인

exports.profile = function(id, callback){
    console.log('profile 호출됨');
    var users = database.collection('users');

    var result = users.find({ "id": id });
    console.log(result);
    result.toArray(
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }

            if (data.length > 0) {
                console.log('사용자를 찾았어요: ' + result.count());
                callback(null, data);
            }
            else {
                console.log('사용자를 찾지 못했어요..');
                callback(null, null);
            }
        }

    );
}; //마이페이지 프로필 가져오기

exports.profileupdate = function(id, solved_try, callback){
    console.log('profile 호출됨');
    var users = database.collection('users');
    var result = users.update({ "id": id }, { $set: { "solved": solved_try } });
    console.log(result);
    callback(null, true);
};