<style lang="scss">
    .view {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        transition: all .35s;
        overflow: hidden;
        width:100%;
        height: 100%;
    }

    .slide-enter-active, .slide-leave-active {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        transform-origin:center center;
        transition: all .35s;
    }
    .slide-enter {
        opacity: 0;
        transform-origin:center center;
        //transform: translate3d(70%, 0, 0) scale(.9);
        transform: translate3d(70%, 0, 0);
    }
    .slide-leave-active {
        transform-origin:center center;
        opacity: 0;
        //transform: translate3d(-70%, 0, 0) scale(.9);
        transform: translate3d(-70%, 0, 0);
    }
    .reverse {
        .slide-enter {
            opacity: 0;
            transform-origin:center center;
            //transform: translate3d(-70%, 0, 0) scale(.9);
            transform: translate3d(-70%, 0, 0);
        }
        .slide-leave-active {
            opacity: 0;
            transform-origin:center center;
            //transform: translate3d(70%, 0, 0) scale(.9);
            transform: translate3d(70%, 0, 0);
        }
    }
</style>
<template>
    <div id="app" :class="{'reverse':isBack}">
        <!--视图-->
        <transition name="slide">
            <keep-alive>
                <router-view class="view" />
            </keep-alive>
        </transition>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    data() {
        return {
            isBack:false,
            toIndex:0,
            fromIndex:0
        }
    },
    watch: {
        '$route'(to, from) {
            const routes = this.$router.options.routes;
            routes.find((item,index)=>{
                if (item.name === to.name) {
                    this.toIndex = index;
                }else if (item.name === from.name) {
                    this.fromIndex = index;
                }
            })
            this.isBack = this.fromIndex > this.toIndex ? true:false;
        }
    }
}
</script>
