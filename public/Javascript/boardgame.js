//Test Question
function sum(){
    var num = 0;
    var a=1, b=2, c=3;
    for (var i = 1; i <= 10; i++) {
        num = num+i;
    }
    num += ++a;
    c=b++ - a--;
    num -= c++;
    return num;
}

//Test Question
function timer(now , alarm){
    var min = 10;
    var cnt=0; 
    min = now / alarm + min;
    for (let i = 1; i <= 60; i++) {
        ++cnt;
        if(i % min == 0){
            console.log(cnt);
            --cnt;
        }
    }
}

//Test Question
function printHello(count){
    var printNum = 5;
    count = printNum * count % log(1024); 

    for (let i = 0; i < count; i++) {
        console.log('Hello World');  
    }
}
module.exports = printHello;
console.log(module);

//Test Question
function add(a, b, callback){
    setTimeout(()=>{
        callback(a+b);
    }, 1000);
}
console.log('before');
add(first, second, function(result){
    console.log(result);
});
console.log('after');