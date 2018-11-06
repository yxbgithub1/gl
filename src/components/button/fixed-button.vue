<template>
    <div class="fixed-button">
        <v-button :link="link" @click.native="_onSave" role="link">
            <slot></slot>
        </v-button>
    </div>
</template>
<script>
    export default {
        props:{
            link:{
                type:String,
                default:''
            },
            onSave:{
                type:Function
            }
        },
        methods:{
            _onSave(){
                // this.$emit('editSave');
                if(this.onSave){
                    this.onSave();
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './button';
</style>



