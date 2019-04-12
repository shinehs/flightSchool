<template lang="pug">
    .room
        .classRoomBg
            .battleInfo
                span.red
                    span.logoCover
                        img(src="http://downhdlogo.yy.com/hdlogo/6060/60/60/64/1090640639/u1090640639IUd4_BP.jpeg")
                    span.info
                        | 红方玩家
                span.time
                    span.icon
                    span.num {{time}}
                span.blue
                    span.logoCover
                        img(src="http://downhdlogo.yy.com/hdlogo/6060/60/60/93/1106939152/u1106939152nZVfxjs.png")
                    span.info
                        | 蓝方玩家
            span.window
            template(v-if="gameType != 'match'")
                template(v-if="gameStart >= 0 && time >= 59")
                    span.gameStart 
                        span.icon(v-if="gameStart > 0")
                        span.text {{gameStart == 0?'Go!': gameStart}}
                template(v-if="time >= 57")
                    span.gamer(:class="{'red': userType == 'red','blue': userType == 'blue'}")
            span.door(:class="{'teacher__came':masterType == 'normal'}")
                template(v-if="masterType == 'normal' && gameType === 'npc1'")
                    span.shadow
                template(v-else-if="masterType == 'watch' || teacherType == 'standUp'")
                    span.watch
                template(v-else-if="masterType == 'standUp'")
                    span.standUpMaster
            .teacherInfo
                template(v-if="teacherType=='normal'")
                    span.blackboard.writing
                template(v-else-if="teacherType=='watch' || masterType == 'standUp'")
                    span.blackboard.watch
                template(v-else-if="teacherType == 'standUp'")
                    span.blackboard.standUp
                span.table
            .studentInfo
                span.classMate
                span.gamer__blue(
                    :class="{'dese': standUpRed && attackTime > 100 && userType === 'blue','attack': attackTime > 100 &&  beAttacked !== 'blue', 'beAttacked': beAttacked === 'blue', 'standUp': standUpBlue}"
                )
                    span.gamer__score {{blueScore}}
                span.gamer__red(
                    :class="{'dese': standUpBlue && attackTime > 100 && userType === 'red', 'attack': attackTime > 100 && beAttacked !== 'red', 'beAttacked': beAttacked === 'red', 'standUp': standUpRed}"
                )
                    span.gamer__score {{redScore}}
                
            .fireContent(:class="{'red': userType == 'red','blue': userType == 'blue'}")
                template(v-if="userType == 'red'")
                    template(v-if="standUpBlue && !standUpRed")
                        span.btn(@click="attack" v-if="gameStart == 0") 嘚瑟
                    template(v-else-if="!standUpRed && !gameType.includes('npc2')")
                        span.btn(@click="attack" v-if="gameStart == 0") 打
                template(v-else)
                    template(v-if="standUpRed && !standUpBlue")
                        span.btn(@click="attack" v-if="gameStart == 0") 嘚瑟
                    template(v-else-if="!standUpBlue && !gameType.includes('npc2')")
                        span.btn(@click="attack" v-if="gameStart == 0") 打
        template(v-if=" gameType == 'match' || gameType == 'finish'")
            w-dialog(:active="dialogActive")
                template(slot="body" v-if="gameType == 'match'")
                    span.slogan__icon
                    template(v-if="roomNo === ''")
                        h2 正在为您匹配对手，请稍后。。。
                    template(v-else)
                        h2 匹配成功，已进入{{roomNo}}号房！
                    h3 小贴士：校长和老师的忍耐是有限度的！
                template(slot="body" v-else)
                    .resScore
                        span.blueScore {{blueScore}}
                        span.redScore {{redScore}}
                    span.result__bg(:class="{'red__win':winner === 'red' , 'blue__win': winner === 'blue'}")
</template>

<script>
import observers from '../../../js/lib/observer/observer.js';
import interval from '../../../js/lib/inverval-tool/interval-tool.js';
import dialog from '../../widget/dialog/dialog.vue';

export default {
    name: 'room',
    components: {
        wDialog: dialog
    },
    mixins: [],
    data() {
        return {
            dialogActive: true,
            time: 60,
            timeIntervalId: 0,
            startIntervalId: 0,
            attackIntervalId: 0,
            beAttackIntervalId: 0,
            blueScore: 0,
            redScore: 0,
            gameStart: 5,
            userType: '',
            teacherType: 'normal', // normal watch
            masterType: 'normal', // normal watch
            attackTime: 0,
            beAttacked: '',
            standUpBlue: false,
            standUpRed: false,
            wsObj: null,
            roomNo: '',
            gameType: 'match', // match
            winner: ''
        };
    },
    watch: {
    },
    computed: {

    },
    methods: {
        // 订阅广播，轮询查询充值结果。
        subscribe() {
            const self = this;
            observers.subscribe('countDown', () => {
                if (self.time > 0) {
                    self.time -= 1;
                } else {
                    interval.stop(this.timeIntervalId);
                }
            });
            observers.subscribe('gameStart', () => {
                if (self.gameStart > 0) {
                    self.gameStart -= 1;
                    if (self.gameStart === 1) {
                        self.countDown();
                        this.startAttack();
                    }
                } else {
                    interval.stop(this.startIntervalId);
                }
            });
            observers.subscribe('attack', () => {
                if (self.attackTime - 100 > 0) {
                    self.attackTime -= 100;
                    self.beAttacked = '';
                }
            });
            observers.subscribe('beAttack', () => {
                self.beAttacked = '';
            });
        },
        start() {
            this.startIntervalId = interval.start('gameStart', 1000);
        },
        countDown() {
            this.timeIntervalId = interval.start('countDown', 1000);
        },
        startAttack() {
            this.attackIntervalId = interval.start('attack', 100);
            this.startBeAttack();
        },
        startBeAttack() {
            this.beAttackIntervalId = interval.start('beAttack', 100);
        },
        attack() {
            // if (this.userType === 'red') {
            //     this.redScore += 1;
            //     this.beAttacked = 'blue';
            // } else {
            //     this.blueScore += 1;
            //     this.beAttacked = 'red';
            // }
            // this.attackTime += 100;
            this.wsObj.send('attack');
        },
        setUserType(type) {
            if (type === 'A') {
                this.userType = 'blue';
            } else {
                this.userType = 'red';
            }
        },
        setAttack(type) {
            if (type === 'AAttack') {
                this.blueScore += 1;
                this.beAttacked = 'red';
            } else {
                this.redScore += 1;
                this.beAttacked = 'blue';
            }
            this.attackTime += 100;
        },
        setRoomId(id) {
            this.roomNo = id;
        },
        createConnect() {
            const self = this;
            const ws = new WebSocket('ws://127.0.0.1:8888/game');

            ws.onopen = function () {
                ws.send('start');
            };

            ws.onmessage = function (evt) {
                const resData = JSON.parse(evt.data);
                if (resData.event === 'match') {
                    self.setUserType(resData.pos);
                    self.setRoomId(resData.roomNo);
                } else if (resData.event === 'ready') {
                    self.gameStart = resData.readyTime - 2;
                    self.start();
                } else if (resData.event === 'start') {
                    self.gameStart = 0;
                    self.startAttack();
                } else if (resData.event === 'attack') {
                    if (resData.AAttack) {
                        self.setAttack('AAttack');
                    } else if (resData.BAttack) {
                        self.setAttack('BAttack');
                    }
                    // self.setScore();
                } else if (resData.event === 'finish') {
                    if (resData.AScore > resData.BScore) {
                        self.winner = 'blue';
                    } else {
                        self.winner = 'red';
                    }
                } else if (resData.event.includes('npc')) {
                    // NPC1 warn
                    // npc2 catch
                    // npcObject: 'AB  C = both'，
                    if (resData.event === 'npc1') {
                        self.masterType = 'normal';
                        self.masterType = 'normal';
                        // 老师
                    } else if (resData.event === 'npc2') {
                        if (resData.npcObj !== 'D') {
                            self.teacherType = 'standUp';
                            self.masterType = 'watch';
                        } else {
                            self.masterType = 'watch';
                            self.teacherType = 'watch';
                        }
                        // 校长
                    } else if (resData.event === 'npc22') {
                        if (resData.npcObj !== 'D') {
                            self.teacherType = 'watch';
                            self.masterType = 'standUp';
                        } else {
                            self.masterType = 'watch';
                            self.teacherType = 'watch';
                        }
                    } else if (resData.event === 'npc3') {
                        self.teacherType = 'normal';
                        self.masterType = 'normal';
                    } else {
                        self.masterType = 'watch';
                        self.teacherType = 'watch';
                    }
                    // TODO 站起来的人
                    if (resData.npcObj === 'A') {
                        self.standUpBlue = 1;
                    } else if (resData.npcObj === 'B') {
                        self.standUpRed = 1;
                    } else if (resData.npcObj === 'C') {
                        self.standUpBlue = 1;
                        self.standUpRed = 1;
                    } else {
                        self.standUpBlue = false;
                        self.standUpRed = false;
                    }
                }
                self.gameType = resData.event;
            };

            ws.onclose = function (evt) {
                this.wsObj.close();
            };

            ws.onerror = function (evt) {
                this.wsObj.close();
            };
            this.wsObj = ws;
        }
    },
    mounted() {
    },
    created() {
        this.subscribe();
        this.createConnect();
    }
};
</script>

<style lang="scss">
@import "../../../sass/_mixin.scss";

.room{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #FCECCB;
    .battleInfo{
        @include flexRow;
        padding-top: 60px;
        justify-content: space-between;
        width: 100%;

        .red,.blue{
            display: flex;
            align-items: center;
            width: 300px;
            position: relative;
            overflow: hidden;
            .logoCover{
                position: relative;
                z-index: 2;
                width: 108px;
                height: 108px;
                border-radius: 50%;
                overflow: hidden;
                border: 2px solid red;
            }
            .img{
                position: relative;
                top: 1px;
                left: 1px;
                width: 100%;
                height: 100%;
            }
        }
        .red{
            .info{
                left: 20px;
                text-indent: 110px;
                background-color: #FC492F;
            }
        }
        .blue{
            .info{
                left: -20px;
                text-indent: 66px;
                background-color: #1D94E2;
            }
            .logoCover{
                border-color: blue;
                position: absolute;
                right: 0px;
            }
        }
        .time{
            display: flex;
            position: relative;
            top: -20px;
            .icon{
                display: flex;
                width: 160px;
                height: 170px;
                background-image: url('./images/clockIcon.png');
                background-position: center;
                background-repeat: no-repeat;

            }
            .num{
                position: absolute;
                display: block;
                width: 72px;
                top: 60px;
                left: 40px;
                font-size: 60px;
                color: #D59A09;
                text-align: center;
            }
        }
        .info{
            display: flex;
            position: absolute;
            z-index: 1;
            width: 300px;
            height: 80px;
            line-height: 80px;
            font-size: 30px;
            text-align: center;
            color: #fff;
        }
    }
    .window{
        display: block;
        position: absolute;
        top: 0px;
        width: 76*1.5px;
        height: 418*1.5px;
        background-image: url('./images/window.png');
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .gameStart{
        position: absolute;
        top: 500px;
        left: 300px;
        text-align: center;
        z-index: 4;
        .text{
            font-size: 120px;
            color: #fff;
            font-weight: bold;
            text-shadow: 0px 0px 15px #000;
        }
        .icon{
            display: block;
            width: 149*1.5px;
            height: 159*1.5px;
            background-image: url('./images/startClock.png');
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: cover;
            animation: clockShake 1s infinite cubic-bezier(.28,.52,.64,1.08) 0s;
        }
    }
    .gamer{
        display: block;
        position: absolute;
        left: 110px;
        top: 560px;
        width: 94*1.5px;
        height: 101*1.5px;
        background-image: url('./images/gamer.png');
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: cover;
        z-index: 5;
        animation: gamer 1.5s infinite cubic-bezier(.28,.52,.64,1.08) 0s;
        &.red{
            left: 510px;
        }
    }
    .door{
        display: block;
        position: absolute;
        top: 300px;
        right: 0px;
        width: 65*1.5px;
        height: 269*1.5px;
        background-image: url('./images/door.png');
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: cover;
        .shadow{
            display: none;
            position: absolute;
            width: 44*1.5px;
            height: 120*1.5px;
            top: 70px;
            right: 0px;
            background-image: url('./images/teachshadow.png');
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: cover;
        }
        .standUpMaster{
            display: block;
            position: absolute;
            width: 190*1.5px;
            height: 197*1.5px;
            top: 70px;
            right: 0px;
            background-image: url('./images/standUpMaster.png');
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: cover;
            z-index: 5;
        }
        .watch{
            display: block;
            position: absolute;
            width: 78*1.5px;
            height: 268*1.5px;
            top: 0px;
            right: 0px;
            background-image: url('./images/standUpMaster2.png');
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: cover;
            z-index: 5;
        }
        &.teacher__came{
            .shadow{
                display: block;
                animation: teacherCame 3s infinite cubic-bezier(.28,.52,.64,1.08) 0s;
            }
        }
    }
    .teacherInfo{
        .blackboard{
            display: block;
            position: absolute;
            top: 340px;
            left: 200px;
            width: 259*1.5px;
            height: 148*1.5px;
            background-image: url('./images/teachdef.png');
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: cover;
            &.writing{
                animation: writing 1s infinite linear 0s;
            }
            &.watch{
                background-image: url('./images/watch.png');
            }
            &.standUp{
                left: 106px;
                width: 313*1.5px;
                height: 152*1.5px;
                background-image: url('./images/teacherstandup.png');
            }
        }
        .table{
            display: block;
            position: absolute;
            top: 560px;
            left: 320px;
            width: 102*1.5px;
            height: 114*1.5px;
            background-image: url('./images/table.png');
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: cover;
        }
    }
    .studentInfo{
        position: relative;
        top: 380px;
        .classMate{
            display: block;
            position: absolute;
            
            left: 48px;
            width: 462*1.5px;
            height: 247*1.5px;
            background-image: url('./images/classMates.png');
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: cover;
        }
        .gamer__blue{
            display: block;
            position: absolute;
            left: 6px;
            top: 126px;
            width: 340*1.5px;
            height: 308*1.5px;
            background-image: url('./images/bluefire.png');
            background-position: -188px -46px;
            // background-position: -2174px -50px;
            background-repeat: no-repeat;
            background-size: cover;
            background-size: 1750*1.5px 331*1.5px;
            &.attack{
                left: -26px;
                animation: blueAttack .3s steps(3, start) infinite forwards;
            }
            &.beAttacked{
                background-position: 40px -48px;
                background-size: 231*1.5px 328*1.5px;
                background-image: url('./images/bbeattack.png');
                animation: none;
            }
            &.dese{
                background-image: url('./images/bdese.png') !important;
                background-position: 40px -10px !important;
                background-size: 231*1.5px 321*1.5px !important;
                animation: none;
            }
            &.standUp{
                top: 80px !important;
                height: 343*1.5px !important;
                background-position: 46px 0px !important;
                background-size: 197*1.5px 343*1.5px !important;
                background-image: url('./images/blueStand.png') !important;
                animation: none !important;
                z-index: 10 !important;
                .gamer__score{
                    top: 320px;
                }
            }
            .gamer__score{
                left: 144px;
            }
        }
        .gamer__red{
            display: block;
            position: absolute;
            right: 6px;
            top: 126px;
            width: 340*1.5px;
            height: 308*1.5px;
            background-image: url('./images/redfff.png');
            background-position: -16px -36px;
            background-repeat: no-repeat;
            background-size: 1750*1.5px 331*1.5px;
            &.attack{
                animation: redAttack .3s steps(3, start) infinite forwards;
            }
            &.beAttacked{
                background-position: -6px -76px;
                background-size: 350*1.5px 357*1.5px;
                background-image: url('./images/beattack.png');
                animation: none;
            }
            &.dese{
                background-image: url('./images/dese.png');
                background-position: -16px -50px;
                background-size: 1050*1.5px 337*1.5px;
                animation: deseRed .2s steps(2, start) infinite forwards;
            }
            &.standUp{
                top: 80px !important;
                height: 343*1.5px !important;
                background-position: 188px -4px !important;
                background-size: 213*1.5px 343*1.5px !important;
                background-image: url('./images/redStand.png') !important;
                animation: none !important;
                .gamer__score{
                    top: 320px;
                }
            }
            .gamer__score{
                left: 320px;
            }
            
        }
        
        .gamer__score{
            display: block;
            position: relative;
            top: 274px;
            width: 110px;
            height: 76px;
            line-height: 76px;
            position: absolute;
            background-color: #703900;
            color: #fff;
            font-size: 60px;
            font-weight: bold;
            text-align: center;
        }
    }
    .fireContent{
        display: block;
        position: absolute;
        bottom: 100px;
        width: 100%;
        height: 227*1.5px;
        background-image: url('./images/btnbg.png');
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: cover;
        &.blue{
            .btn{
                left: 80px;
                top: 60px;
                background-color: #3BAAFF;
            }
        }
        &.red{
            .btn{
                left: 480px;
                top: 90px;
                background-color: #FF4925;
                &:active{
                    top: 96px;
                }
            }
        }
        .btn{
            position: relative;
            display: block;
            width: 200px;
            height: 100px;
            line-height: 100px;
            color: #fff;
            padding: 4px;
            border-radius: 8px;
            box-shadow: 0px 9px 0px rgba(91,87,81,1), 0px 9px 25px rgba(0,0,0,.7);
            text-align: center;
            transition: all 0.05s ease;
            font-family: Microsoft Yahei,simsun,Tahoma,Helvetica,Arial,SimHei,sans-serif;
            font-size: 60px;
            font-weight: bold;
            
            &:active{
                box-shadow: 0px 3px 0px rgba(91,87,81,1), 0px 3px 6px rgba(0,0,0,.9);
                position: relative;
                top: 66px;
            }
        }
    }
    .dialog__content{
        padding-top: 600px;
        h2{
            margin: 0;
            padding: 0 0 20px; 
            font-size: 36px;
            color: #fff;
        }
        h3{
            margin:20px 0 0;
            padding: 0px;
            font-size: 26px;
            line-height: 40px;
            color: #fff;
            background-image: linear-gradient(to right, red , blue);
        }
        .slogan__icon{
            display: block;
            width: 96*1.5px;
            height: 96*1.5px;
            margin: 0 auto;
            background-image: url('./images/connect.gif');
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }
        // .slogan__icon{
        //     animation:shake 2s infinite linear
        // }
        .join__gameBtn{
            display: block;
            width: 180px;
            height: 88px;
            line-height: 88px;
            margin: 40px auto 0px;
            @include btnLiner;
            font-size: 32px;
            color: #fff;
            text-align: center;
            border-radius: 44px;
            box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.25);
            &:active{
                box-shadow: 0 0 0 5px rgba(0, 0, 0, 0);
            }
        }
        .resScore{
            display: flex;
            justify-content: space-around;
            flex-direction: row;
            font-size: 66px;
            font-weight: bold;
            color: #fff;
        }
        .result__bg{
            &.red__win,&.blue__win{
                display: block;
                width: 100%;
                height: 495 *1.5px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
            }
            &.red__win{
                background-image: url('./images/redwin.png');
            }
            &.blue__win{
                background-image: url('./images/blueWin.png');
            }
        }
    }
}
@keyframes writing {
    0%{
        background-image: url('./images/teachdef.png');
    }
    50%{
        background-image: url('./images/teachdef.png');
    }
    100%{
        background-image: url('./images/teacher2.png');
    }
}
@keyframes teacherCame {
    0%{
        right: 0px;
    }
    50%{
        right: -60px;
    }
    100%{
        right: 0px;
    }
}
@keyframes gamer {
    0%{
        top: 560px;
    }
    50%{
        top: 600px;
    }
    100%{
        right: 560px;
    }
}
@keyframes clockShake {
    0%{
        // transform: matrix(0.965926,0.258819,-0.258819,0.965926,0,0);
    }
    50%{
        transform: matrix(0.965926,-0.258819,0.258819,0.965926,0,0);
        // transform: matrix(1,0,0,1,0,0);
    }
    100%{
        // transform: matrix(0.965926,-0.258819,0.258819,0.965926,0,0);
    }
}
@keyframes redAttack {
    0%{
        background-position: -16px -36px;
    }
    100%{
        background-position: -1592px -36px;
    }
}
@keyframes blueAttack {
    0%{
        background-position: -16px -36px;
    }
    100%{
        background-position: -1592px -36px;
    }
}
@keyframes deseRed {
    0%{
        background-position: -16px -50px;
    }
    100%{
        background-position: -1068px -50px;
    }
}
@keyframes deseBlue {
    0%{
        background-position: 40px -10px;
    }
    100%{
        background-position: -1068px -50px;
    }
}
@keyframes shake {
    0%{
        transform: matrix(1,0,0,1,0,0);
    }
    20%{
        transform: matrix(0.965926,0.258819,-0.258819,0.965926,0,0);
    }
    40%{
        transform: matrix(1,0,0,1,0,0);
    }
    60%{
        transform: matrix(0.965926,-0.258819,0.258819,0.965926,0,0);
    }
    80%{
        transform: matrix(1,0,0,1,0,0);
    }
}
</style>


