

// 当我们想要调取this
// function (this:any,...arg:[]) 第一个参数加上this
function thisTest (fn:Function){
    return function (this:any, ...arg:any[]){
        fn.apply(this,arg)
    }
}
function fn1(this:any,...arg:any[]){
    console.log(arg)
    console.log(this.a)
}
const inner1 = thisTest(fn1)
inner1.call({a:"aaaa"}, 1)


function fn2(...arg:any[]){
    console.log(arg)
}
const inner2 = thisTest(fn2)
inner2(2)
