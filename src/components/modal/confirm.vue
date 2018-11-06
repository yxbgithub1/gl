<template>
    <modal :show="show" ref="modal">
        <div slot="title">{{ title }}</div>
        <div slot="content">{{ content }}</div>
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
                default:'温馨提示'
            },
            content:{
                type:String,
                default:'提示内容'
            },
            cancelText:{
                type: String,
                default: '取消'
            },
            okText: {
                type: String,
                default: '确定'
            },
            onOk: {
                type: Function
            },
            onCancel: {
                type: Function
            }
        },
        components:{
            Modal
        },
        methods:{
            open(){
                this.$refs.modal.open();
                //this.$emit('open',this);
            },
            close(){
                this.$refs.modal.close();
                //this.$emit('close', this)
            },
            _onOk(){
                if (this.onOk) {
                    this.onOk()
                }
                this.close();
            },
            _onCancel(){
                if(this.onCancel){
                    this.onCancel()
                }
                this.close();
            }
        }
    }
</script>
<style lang="sass" scoped>
    @import './modal';
</style>