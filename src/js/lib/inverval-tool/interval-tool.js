/*
* @Author: shine
* @Date:   2016-09-21 17:07:30
* @desc: 小流光生命周期通知，每隔3S通知一次，代替setinterval使用，配合observe实现简单的广播通知。
* @version: 1.0.0
* @Last Modified by:   hs
* @Last Modified time: 2016-10-08 14:50:29
*/
//兼容性处理办法，因为 android 4.4- 不支持此方法，还是需要借用settimeout
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

//计时器
var interval = {};
//TODO  修改成其他也可用的工具类
((function(i){
    var fns = {},
        intervalId = 0;

    //事件监测函数
    function interval(){
        for (var m in fns) {
            if (fns[m]) {
                //每当发现计数堆栈中有到时的计时器就要发布信息
                for (var i = 0, j = fns[m].length; i < j; i++) {
                    if((new Date() - fns[m][i].begin) > fns[m][i].dur){
                        fns[m][i].begin = new Date();
                        window.observers.publish(m);
                    }
                }
            }
        }
        window.requestAnimationFrame(interval);
    }
    //开始计时
    i.start = function(topic,dur,observers){
        if (!fns[topic]) {
            fns[topic] = [];
        }
        var token = (++intervalId).toString();
        var begin = new Date();
        fns[topic].push({
            begin: begin,
            dur: dur,
            token:token
        });
        return token;
    }
    //暂停计时
    i.stop = function(token){
        for (var m in fns) {
            if (fns[m]) {
                for (var i = 0, j = fns[m].length; i < j; i++) {
                    if (fns[m][i].token === token) {
                        fns[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    }
    window.requestAnimationFrame(interval);
})(interval));

module.exports = interval;