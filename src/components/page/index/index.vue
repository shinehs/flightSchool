<template lang="pug">
    .gameIndex
        h1.gameIndex__title 互怼学院web版
        .gameIndex__logo
            img(src="./images/logo.png")
            span.gameIndex__logo__icon
            span.gameIndex__logo__icon.type__bom
            span.gameIndex__logo__icon.type__lightning
        input.userName(type="text" v-model="name" placeholder="请输入用户名")
        .gameIndex__startBtn(@click="joinRoom")
            a 开始比赛
</template>

<script>
import { findIndex } from 'lodash';
import dialog from '../../widget/dialog/dialog.vue';

export default {
    name: 'index',
    components: {
        wDialog: dialog
    },
    mixins: [],
    data() {
        return {
            dialogActive: false,
            roomId: '',
            name: ''
        };
    },
    watch: {

    },
    computed: {

    },
    methods: {
        gameStart() {
            const self = this;
            this.dialogActive = true;
            setTimeout(() => {
                self.$refs.input.focus();
            }, 0);
        },
        onIntInput(e) {
            // 去掉小数点
            if (e.data === '.') {
                const strNumber = `${e.target.value}`;
                e.target.value = '';
                e.target.value = parseInt(strNumber, 10);
            }
        },
        joinRoom() {
            this.$router.push({
                path: '/room',
                query: {
                    name: this.name ? escape(this.name) : `用户${Math.floor(Math.random() * 100)}`
                }
            });
        }
    },
    mounted() {
    },
    created() {}
};
</script>

<style lang="scss">
@import "../../../sass/_mixin.scss";
#app{
    position: relative;
}
.gameIndex{
    padding-top: 100px;
    .gameIndex__title{
        font-size: 42px;
        text-align: center;
        background-image: linear-gradient(to right, red , blue);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .gameIndex__logo{
        position: relative;
        width: 258*2px;
        height: 190*2px;
        margin: 200px auto 0;
        img{
            width: 100%;
            height: 100%;
        }
        .gameIndex__logo__icon{
            display: block;
            position: absolute;
            width: 64px;
            height: 64px;
            right: 50px;
            top: 30px;
            background-image: url('./images/cp.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            animation: scaleAni 1s infinite linear 0s;
            &.type__bom{
                width: 96px;
                height: 96px;
                right: 300px;
                top: 230px;
                background-image: url('./images/bom.png');
                animation: scaleAni 0.9s infinite linear 0s;
            }
            &.type__lightning{
                width: 96px;
                height: 96px;
                right: 140px;
                top: 210px;
                background-image: url('./images/lightning.png');
                animation: scaleAni 1.2s infinite linear 0s;
            }
        }
    }
    .userName{
        display: block;
        margin: 40px auto 0;
        width: 80%;
        height: 80px;
        text-indent: 20px;
        font-size: 40px;
        text-align: center;
        outline: none;
    }
    .gameIndex__startBtn{
        width: 450px;
        height: 88px;
        line-height: 88px;
        margin: 100px auto 0px;
        @include btnLiner;
        font-size: 32px;
        color: #fff;
        text-align: center;
        border-radius: 44px;
        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.25);
        transition: all 0.25s linear;
        a{
            text-decoration: underline;
            color:#fff;
            text-decoration:none; 
            background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='%23ffffff' stroke-width='2' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E") repeat-x 0 100%; 
            background-size: 40px auto; 
            background-position: 4px 0;
            animation:waveMove 1s infinite linear;
        }
            
        &:active{
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
        }
    }
    .roomNumber{
        position: relative;
        width: 80%;
        height: 60px;
        border-radius: 80px;
        border: none;
        outline: none;
        padding: 20px;
        font-size: 40px;
        text-indent: 20px;
        &::-webkit-input-placeholder{
            color: #c8c8c8;
        }
    }
}
@keyframes scaleAni {
    0%{
        transform: matrix(1.2,0,0,1.2,0,0);
    }
    50%{
        transform: matrix(1,0,0,1,0,0);
    }
    100%{
        transform: matrix(1.2,0,0,1.2,0,0);
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
@keyframes waveMove {
    from { background-position: 0 100%; }
    to { background-position:-40px 100%; }
}
</style>


