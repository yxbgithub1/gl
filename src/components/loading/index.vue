<template>
    <v-message :horizontal=".45" :vertical=".4" :show="show" ref="message">
        <div slot="icon"  class="icon">
             <i></i>
        </div>
        <span slot="text">加载中...</span>
    </v-message>
</template>

<script>
    export default{
        props:{
            show:{
                type:Boolean,
                default:false
            },
            text:{
                type:String,
                default:'加载中...'
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './loading';
</style>
