<template>
    <div>
        <v-overlay :show="show" @click="show=!show" />
        <transition name="area">
            <div class="area" v-if="show">
                <div class="title">
                    <label>选择所在省市区</label>
                    <i class="fa fa-close" @click="close"></i>
                </div>
                <section class="selects">
                    <div>
                        <label>省/直辖市</label>
                        <div class="cells">
                            <v-select :options="provincs" point="请选择省/直辖市" :on-change="provincChange" />
                            <i class="fa fa-angle-right"></i>
                        </div>
                    </div>
                    <div>
                        <label>州/市</label>
                        <div class="cells">
                            <v-select :options="countys" :disabled="countysDisabled"  point="请选择州/市" :on-change="cityChange" />
                            <i class="fa fa-angle-right"></i>
                        </div>
                    </div>
                    <div>
                        <label>区/县</label>
                        <div class="cells">
                            <v-select :options="allAreas" :disabled="areaDisabled" point="请选择区/县" :on-change="areaChange"/>
                            <i class="fa fa-angle-right"></i>
                        </div>
                    </div>
                    <div>
                        <label>目标地区</label>
                        <div class="cells">
                            {{ `${provinc} ${county} ${area}` }}
                        </div>
                        <span class="remark">(青海、西藏、新疆地区暂不支持配送)</span>
                    </div>
                </section>
            </div>
        </transition>
        <!--提示框-->
        <v-message :horizontal=".4" :vertical=".3" :show="messageShow">
            <i slot="icon" class="fa fa-exclamation-circle"></i>
            <span slot="text">{{ message }}</span>
        </v-message>

        <!--Loading-->
        <v-loading :show="loading" />
    </div>
</template>
<script>
    import { mapGetters,mapActions } from 'vuex';

    export default{
        props:{
            show:{
                type:Boolean,
                default:false
            }
        },
        computed:{
            ...mapGetters(['addUer','user','provincs','countys','areas'])
        },
        data(){
            return{
                allAreas:[],
                provinc: '',
                county:'',
                area:'',
                countysDisabled:true,
                areaDisabled:true
            }
        },
        methods:{
            ...mapActions(['queryCounty','queryArea']),
            reset(){
                this.provinc = this.county = this.area = '';
                this.countysDisabled = this.areaDisabled = true;
            },
            close(){
                this.$emit('areaShow', {});
            },
            //省份选择事件
            provincChange(provinc){
                this.allAreas = [];
                this.provinc = provinc;
                this.county = this.area = '';
                this.loading = true;
                this.queryCounty({
                    "area": "",
                    "county": "",
                     provinc,
                    "phoneNumber": this.user.phoneNumber,
                    "uuid": this.user.uuid
                }).then(resp => {
                    if (resp.data.retStatus !='1') {
                        this.loading = false;
                        return this.messageDialg(resp.data.errMsg);
                    }
                    this.countysDisabled = false;
                    this.loading = false;
                }); 
            },
            //城市选择事件
            cityChange(county){    
                this.county = county;
                this.loading = true;
                this.area = '';
                this.queryArea({
                    "area": "",
                     county,
                    "provinc": this.provinc,
                    "phoneNumber": this.user.phoneNumber,
                    "uuid": this.user.uuid
                }).then(resp => {
                    if (resp.data.retStatus != '1') {
                        this.loading = false;
                        return this.messageDialg(resp.data.errMsg);
                    }
                    this.areaDisabled = false;
                    this.allAreas = this.areas;
                    this.loading = false;
                });   
            },
            areaChange(area){
                this.area = area;
                this.$emit('areaShow', {
                    provinceStr: this.provinc,
                    cityStr: this.county,
                    countryStr: this.area,
                });
            },
            stuffAddress(cond = {},){
                return this.queryCounty(Object.assign({
                    "area": "",
                    "county": "",
                    "provinc": "",
                    "phoneNumber": this.user.phoneNumber,
                    "uuid": this.user.uuid
                }, cond));
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './area';
</style>
