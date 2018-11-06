<template>
    <router-link 
        :class="'btn ' + (type?type:'')" 
        :to="link ? link: 'javascript:;'" 
        @click.native="handleClick">
        <slot></slot>
    </router-link>
</template>
<style lang="scss" scoped>
    @import './button';
</style>

<script>
    export default{
        props:{
            link:{
                type:String,
                default:' '
            },
            type:{
                type:String,
                default:''
            }
        },
        methods:{
            handleClick(){
                this.$emit('buttonClick')
            }
        }
    }
</script>