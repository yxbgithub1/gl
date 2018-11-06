<template>
    <modal ref="modal" :show="show">
        <div slot="title">{{ title }}</div>
        <div slot="content">
            <span class="message">{{ content }}</span>
            <div class="prompt-row">      
                <input type="tel" class="prompt-input" :value="phone"  disabled/>
            </div>
            <div class="prompt-row auth-code">   
                <input type="tel" v-model="dynaicCode" @input="onInput && onInput(dynaicCode)" placeholder="请输入图形码" maxlength="4" />
                <button @click="onGetDynaic && onGetDynaic()" :disabled="dynaicDisabled"><img :src="`data:image/jpeg;base64,${dynaic}`" /></button>
            </div>
            <div class="prompt-row auth-code">   
                <input type="tel" v-model="authCode" @input="onInput && onInput(authCode)" placeholder="请输入验证码" maxlength="6" />
                <button class="a" @click="onClick && onClick(dynaicCode)" :disabled="btnDisabled" :class="{'disabled':btnDisabled}" >{{ timing }}</button>
            </div>
            <div class="prompt-row error" v-show="error">
                <span>{{ error }}</span>
            </div>
        </div>
        <div slot="buttons" class="modal-buttons">
            <span class="modal-button modal-cancel-button" @click="_onCancel()">{{ cancelText }}</span>
            <span class="modal-button" @click="_onOk()">{{ okText }}</span>
        </div>
    </modal>
</template>
<script>
    import Modal from './modal';
    export default{
        props:{
            show:{
                type:Boolean,
                default:false
            },
            title:{
                type:String,
                default:'兑换验证'
            },
            content:{
                type:String,
                default:'内容描述'
            },
            cancelText:{
                type:String,
                default:'取消'
            },
            okText:{
                type:String,
                default:'兑换'
            },
            onOk:{
                type:Function,
                default:undefined
            },
            onCancel:{
                type:Function,
                default:undefined
            },
            error:{
                type:String,
                default:''
            },
            onInput:{
                type:Function,
                default:undefined
            },
            onClick:{
                type:Function,
                default:undefined
            },
            timing:{
                type:String,
                default:''
            },
            btnDisabled:{
                type:Boolean,
                default:false
            },
            phone:{
                type:String,
                default:''
            },
            onGetDynaic:{
                type:Function,
                default:undefined
            },
            dynaic:{
                type:String,
                default:''
            },
            dynaicDisabled:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                authCode:'',
                dynaicCode:''
            }
        },
        components:{ Modal },
        methods:{
            open(){
                this.$refs.modal.open();
            },
            close(){
                this.$refs.modal.close();
                this.authCode = this.dynaicCode = ''
            },
            _onCancel(){
                if(this.onCancel){
                    this.onCancel();
                }
                this.close();
            },
            _onOk(){
                if(this.onOk){
                    this.onOk(this.authCode,this.dynaicCode);
                }
            }
        }
    }
</script>
<style lang="sass" scoped>
    @import './modal';
</style>