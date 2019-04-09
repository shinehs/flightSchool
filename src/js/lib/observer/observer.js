/*
* @Author: shine
* @Date:   2016-09-21 17:07:30
* @desc: 订阅者模式简单工具，用于根据订阅者类型，发送简单的事件广播
* @version: 1.0.0
* @Last Modified by:   hs
* @Last Modified time: 2016-09-29 17:44:20
*/
'use strict';
    //观察者
    var observers = {};

    //使用闭包，不对外提供订阅事件列表
    (function (o) {
        // 订阅事件函数
        var subs = {}, 
        //内置订阅ID
            subUid = -1;

        // 发布方法你 pararm:事件类型(广播名)，参数
        o.publish = function (topic, args) {

            if (!subs[topic]) {
                return false;
            }

            setTimeout(function () {
                var subscribers = subs[topic],
                    len = subscribers ? subscribers.length : 0;

                while (len--) {
                    subscribers[len].func(topic, args);
                }
            }, 0);

            return true;

        };
        //订阅方法  pararm:事件类型(广播名)，参数
        o.subscribe = function (topic, func) {

            if (!subs[topic]) {
                subs[topic] = [];
            }

            var token = (++subUid).toString();
            subs[topic].push({
                token: token,
                func: func
            });
            return token;
        };
        //退订方法  pararm:事件类型，参数
        o.unsubscribe = function (token) {
            for (var m in subs) {
                if (subs[m]) {
                    for (var i = 0, j = subs[m].length; i < j; i++) {
                        if (subs[m][i].token === token) {
                            subs[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return false;
        };
    } (observers));

    if(!window.observers){
        window.observers = observers;
    }
	module.exports = observers;

//demo

//先订阅
// observer.subscribe('demo', function (topics, data) {
//     console.log('广播类型--'+ topics+ " 发起了通知: " + data);
// });
//再发布通知，通知类型为demo
// observer.publish('demo', 'hallo!');
// observer.publish('demo', ['this', 'is', 'simple', 'demo']);
// observer.publish('demo', [{ 'color1': 'blue' }, { 'color2': 'red'}]);