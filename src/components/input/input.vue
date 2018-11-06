<template>
    <div class="box" :class="{ warning : isPhone}">
        <label :class="{ spacing : label.length === 3, visibile:!labelVisible }">{{ `${label}` }}</label>

        <!--输入框-->
        <input
            :type="type" 
            :maxlength="maxlen" 
            :placeholder="placeholder" 
            :value="value"
            @input="updateValue($event.target.value)" />

        <!--小图标-->
        <span class="icons">
            <i class="fa fa-plus-circle" v-show="value" @click="updateValue('')"></i>
            <i class="fa fa-exclamation-circle" v-show="isPhone"></i>
        </span>
    </div>
</template>
<script>
    export default {
        props:{
            type:{
                type:String,
                default:'text'
            },
            maxlen:{
                type:String,
                default:'1000'
            },
            placeholder:{
                type:String,
                default:'请输入内容'
            },
            label:{
                type:String,
                default:''
            },
            value:{
                type:String,
                default:''
            },
            labelVisible:{
                type:Boolean,
                default:true
            }
        },
        data() {
            return {
                isPhone: false
            }
        },
        methods:{
            updateValue(val){
                if (!val) {
                    this.isPhone = false;
                }else{
                    if(this.type === 'tel'){
                        this.isPhone = !this.checkPhone(val) ? true : false;
                    }
                }
                this.$emit('input', val);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './input';
</style>
