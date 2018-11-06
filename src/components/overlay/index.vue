<template>
    <transition name="overlay">
        <div class="overlay" v-if="show" @click="click && click()">
            <div class="inner"></div>
        </div>
    </transition>
</template>
<script>
    export default{
        props:{
            show:{
                type: Boolean,
                default:false
            },
            click:{
                type: Function,
                default:undefined
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './index';
</style>
