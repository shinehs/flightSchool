<template lang="pug">
    .toast(:class="{'active':active == true}")
        span.toast__txt {{msg}}

</template>
<script>

export default {
    name: 'toast',
    props: {
        active: {
            type: [Boolean, String],
            default: 1
        },
        msg: {
            type: String,
            default: ''
        },
        live: {
            type: [Number, String],
            default: 3000
        }
    },
    watch: {
        active(val) {
            const self = this;
            if (val) {
                clearTimeout(self.timerId);
                self.timerId = setTimeout(() => {
                    self.$emit('update:active', false);
                }, self.live);
            }
        }
    },
    computed: {

    },
    data() {
        return {
            timerId: 0
        };
    },
    components: {

    },
    mounted() {

    }
};
</script>
<style lang="scss">
@import '@/sass/_variables.scss';
@import '@/sass/_mixin.scss';
.toast{
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    max-width: 100%;
    height: 100px;
    line-height: 100px;
    padding: 0px 40px;
    transform: translate(-50%,0);

    font-size: 27px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;

    text-align: center;
    z-index: 20;
    border-radius: 8px;
    background-color: rgba(0,0,0,.45);

    &.active{
        display: block;
    }
}
</style>