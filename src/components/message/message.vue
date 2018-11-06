<template>
    <transition name="message">
        <div class="message" v-show="show">
            <div class="inner" :style='`padding:${vertical}rem ${horizontal}rem;`'>
                <div class="message-icon"><slot name="icon"></slot></div>
                <div class="message-text"><slot name="text"></slot></div>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        props:{
            vertical:{
                type:Number,
                default:0
            },
            horizontal: {
                type: Number,
                default: 0
            },
            show:{
                type:Boolean,
                default:false
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './message';
</style>
