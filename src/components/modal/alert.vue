<template>
    <modal :show="show" ref="modal">
        <div slot="title">{{ title }}</div>
        <div style="text-align:justify;" slot="content">{{ content }}</div>
        <div slot="buttons" class="modal-buttons">
            <span class="modal-button modal-cancel-button" @click="_onCancel()">{{ cancelText }}</span>
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
                type:String,
                default:'确定'
            }
        },
        components:{ Modal },
        methods:{
            open(){
                this.$refs.modal.open();
            },
            close(){
                this.$refs.modal.close();
            },
            _onCancel(){
                this.close();
            }
        }
    }
</script>
<style lang="sass" scoped>
    @import './modal';
</style>