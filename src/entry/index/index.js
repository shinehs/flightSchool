import 'yyl-flexlayout';
import '@babel/polyfill';
import Vue from 'vue';
import { mapActions } from 'vuex';
import VueRouter from 'vue-router';

import store from '../../vuex/store.js';
import './index.scss';
import pgindex from '../../components/page/index/index.vue';
import room from '../../components/page/room/room.vue';
import test from '../../components/page/test/test.vue';
// const pgindex = () => import(/* webpackChunkName: "pgindex" */ '../../components/page/index/index.vue');
// const room = () => import(/* webpackChunkName: "room" */ '../../components/page/room/room.vue');

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [{
        path: '/index',
        component: pgindex
    }, {
        path: '/room',
        component: room
    }, {
        path: '/test',
        component: test
    },{
        path: '*',
        redirect: '/index'
    }]
});

new Vue({
    store,
    router,
    methods: {
    },
    mounted() {
    }
}).$mount('#app');
// fixed active
document.body.addEventListener('touchstart', () => { });

