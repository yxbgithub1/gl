<template>
    <div class="fixed-button">
        <button 
            :class="'btn ' + (type ? type:'')" 
            @click="_onSave">
            <slot></slot>
        </button>
    </div>
</template>
<style lang="scss" scoped>
@import './button';
</style>
<script>
export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        onSave:{
            type:Function
        }
    },
    methods: {
        _onSave(){
            if(this.onSave){
                this.onSave();
            }
        }
    }
}
</script>
