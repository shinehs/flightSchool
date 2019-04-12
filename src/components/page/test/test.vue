<template lang="pug">
    .gameTest
        h1.gameTest__title 客户端测试
        .inputContent
            template(v-for="item in count")
                label(:for="item") {{item}}
                input.gameTest__input(id="item" v-model="val[item]" type="text")
</template>

<script>
import dialog from '../../widget/dialog/dialog.vue';

export default {
    name: 'test',
    components: {
        wDialog: dialog
    },
    mixins: [],
    data() {
        return {
            count: 50,
            val: [],
            wsArr: []
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
    created() {
        let self = this;
        for (let i = 0; i < this.count; i++) {
            this.wsArr.push(new WebSocket('ws://127.0.0.1:8888/ws?appId=test&id=1'));
            this.wsArr[i].onmessage = function (evt) {
                // const resData = JSON.parse(evt.data);
                // if (data.msg) {
                // self.val[i] = evt.data;
                self.$set(self.val, i, evt.data);
                // }
                // debugger;
            };
        }
    }
};
</script>

<style lang="scss">
@import "../../../sass/_mixin.scss";

.gameTest{
    padding-top: 100px;
    .gameTest__title{
        font-size: 42px;
        text-align: center;
        background-image: linear-gradient(to right, red , blue);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .inputContent{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
        input:nth-child(2n + 1) {
            color: #006E90;
            border: 1px solid #006E90;
        }
        input:nth-child(3n + 2) {
            color: #F18F01;
            border: 1px solid #F18F01;
        }
        input:nth-child(5n + 3) {
            color: #ADCAD6;
            border: 1px solid #ADCAD6;
        }
        input:nth-child(7n + 4) {
            color: #99C24D;
            border: 1px solid #99C24D;
        }
        input:nth-child(11n + 5) {
            color: #41BBD9;
            border: 1px solid #41BBD9;
        }
        label{
            line-height: 80px;
            font-size: 20px;
            color: #000;
        }
        overflow: scroll;
    }
    .gameTest__input{
        width: 40%;
        height: 80px;
        margin-right: 20px;
        margin-bottom: 20px;
        font-size: 30px;
    }
}
#app{
    position: relative;
}
</style>


