<template lang="pug">
    .dialog(:class="{'active': active == true }")
        .bg__cover
        .dialog__content
            slot(name="body")

</template>
<script>

export default {
    name: 'toast',
    props: {
        active: {
            type: [Boolean, String],
            default: 1
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
.dialog{
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    text-align: center;
    z-index: 20;
    border-radius: 8px;

    &.active{
        display: block;
    }
    .bg__cover{
        display: block;
        background-color: rgba(0,0,0,.5);
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
    }
    .dialog__content{
        position: relative;
        z-index: 15;
    }
}
</style>