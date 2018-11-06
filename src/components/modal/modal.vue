<template>
    <div>
        <!--遮罩-->
        <v-overlay :show="mutableShow" :click="overlayClick"></v-overlay>
        <transition name="modal">
            <div class="modal" v-if="mutableShow">
                <div class="modal-inner">
                    <!--标题-->
                    <div class="modal-title">
                        <slot name="title"></slot>
                    </div>
                    <!--描述-->
                    <div class="modal-text">
                        <slot name="content"></slot>
                    </div>
                </div>
                <!--按钮-->
                <slot name="buttons"></slot>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        props:{
            show:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                mutableShow:this.show
            }
        },
        methods:{
            open(){
                this.mutableShow = true;
                //this.$emit('open',this);
                //alert('modal子组件的open()');
            },
            close(){
                this.mutableShow = false;
                //this.$emit('close', this);
                //alert('modal组件的close()');
            },
            overlayClick(){
                this.mutableShow = false;
            }
        }
    }
</script>
<style lang="sass" scoped>
    @import './modal';
</style>

