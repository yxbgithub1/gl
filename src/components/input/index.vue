<template>
    <section class="box" :class="{ warning : isPhone}">
        <label>手机号码：</label>

        <!--输入框-->
        <input 
            type="tel" 
            maxlength="11"
            placeholder="请输入手机号码" 
            v-model.trim="val" 
            @input="handleChange"/>

        <!--小图标-->
        <span class="icons">
            <i class="fa fa-plus-circle" v-show="val" @click="handleBlank"></i>
            <i class="fa fa-exclamation-circle" v-show="isPhone"></i>
        </span>
    </section>
</template>
<script>
    export default {
        data(){
            return{
                val:'',
                isPhone:false
            }
        },
        proprs:{
            
        },
        methods:{
            handleChange(){ 
                if(!this.val){
                   return this.handleBlank();
                }

                this.isPhone = !this.checkPhone(this.val)? true : false;
                if(!this.isPhone){
                    this.$emit('getPhone', this.val);
                }
            },
            handleBlank(){
                this.isPhone = this.val = '';
                this.$emit('getPhone','');
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './input';
</style>
