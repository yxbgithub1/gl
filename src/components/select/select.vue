<template>
    <select v-model="selected" @change="select" :disabled="disabled" >
        <option disabled value="">{{ point }}</option>
        <template v-for="(o, index) in options" >
            <option :value="o.name" :key="o.name" v-if="o.name == '新疆' || o.name == '西藏' || o.name == '青海省'" disabled>
                {{ o.name }}
            </option>
            <option :value="o.name" :key="o.name" v-else>
                {{ o.name }}
            </option>
        </template>
    </select>
</template>
<script>
    export default{
        props:{
            point:{
                type:String,
                default:''
            },
            options:{
                type:Array,
                default:function(){
                    return [{ name: '空值' }]
                }
            },
            disabled:{
                type:Boolean,
                default:false
            },
            onChange:{
                type:Function
            }
        },
        data(){
            return{
                selected:''
            }
        },
        methods:{
            select(){
                if(this.onChange){
                    this.onChange(this.selected);
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './select';
</style>
