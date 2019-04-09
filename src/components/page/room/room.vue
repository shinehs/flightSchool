<template lang="pug">
    .room
        .classRoomBg
            span.battleInfo
                span.red
                    span.logoCover
                        img(src="http://downhdlogo.yy.com/hdlogo/6060/60/60/64/1090640639/u1090640639IUd4_BP.jpeg")
                    span.info
                        | 红方玩家
                span.time
                    span.icon
                    span.num 10
                span.blue
                    span.logoCover
                        img(src="http://downhdlogo.yy.com/hdlogo/6060/60/60/93/1106939152/u1106939152nZVfxjs.png")
                    span.info
                        | 蓝方玩家
            span.window
            span.door
</template>

<script>
import { findroom } from 'lodash';

export default {
    name: 'room',
    components: {
    },
    mixins: [],
    data() {
        return {

        };
    },
    watch: {

    },
    computed: {

    },
    methods: {


    },
    mounted() {
    },
    created() {}
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
        padding-top: 100px;
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
                text-indent: 150px;
                background-color: #FC492F;
            }
        }
        .blue{
            border-color: blue;
            .info{
                background-color: #1D94E2;
            }
            .logoCover{
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
                top: 60px;
                left: 40px;
                font-size: 60px;
                color: #D59A09;
            }
        }
        .info{
            display: flex;
            position: absolute;
            z-index: 1;
            left: -30px;
            width: 380px;
            height: 80px;
            line-height: 80px;
            border-radius: 40px;
            font-size: 30px;
            text-align: center;
            text-indent: 86px;
            color: #fff;
        }
    }
}
</style>


