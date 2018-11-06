<template>
    <div class="page">
        <v-page-content>
            <form>
                <div>
                    <v-input
                        label="收货人名" 
                        placeholder="请输入收货人名" 
                        v-model="form.reviceName" />
                </div>
                <div>
                    <v-input 
                        type="tel" 
                        label="手机号码"
                        maxlen=11
                        placeholder="请输入手机号码" 
                        v-model="form.revicePhone" />
                </div>
                <div class="area">
                    <label>所在地区</label>
                    <span @click="selectAddress" :class="{'lacunae':form.provinceStr}">{{ `${form.provinceStr}${form.cityStr}${form.countryStr}` || '请输入所在地区' }}</span>
                    <i class="fa fa-angle-right"></i>
                </div>
                <div class="last">
                    <v-input
                        label="详细地址" 
                        placeholder="请输入详细地址" 
                        v-model="form.address" />
                </div>
            </form>
        </v-page-content>

        <!--省市区选择-->
        <v-area :show="show" @areaShow="stuffAddress" ref="area"></v-area>
        
        <!--提示框-->
        <v-message :horizontal=".4" :vertical=".3" :show="messageShow">
            <i slot="icon" class="fa fa-exclamation-circle"></i>
            <span slot="text">{{ message }}</span>
        </v-message>

        <!--Loading-->
        <v-loading :show="loading" />

        <!--保存按钮-->
        <v-fixed-button :on-save="saveForm">保存地址</v-fixed-button>
    </div>
</template>
<script>
    import area from './area';
    import Bus from '../../utils/bus';
    import { mapGetters,mapActions } from 'vuex';
    export default{
        data(){
            return{
                form:{
                    provinceStr: '',
                    cityStr    : '',
                    countryStr : '',
                    revicePhone: '',
                    address    : '',
                    reviceName : '',
                    id         : ''
                },
                show:false,
            }
        },
        components:{
            'v-area':area
        },
        computed:{
            ...mapGetters(['provinc','user','receiveAddress'])
        },
        mounted(){
            Object.assign(this.form, this.receiveAddress);
            Bus.$on('stuffReceiveAddress', address => {
                address ? Object.assign(this.form, address):this.resetForm(); 
            });
        },
        watch: {
            '$route': function() {        
                setTimeout(()=>{
                    this.show = false;
                    this.$refs.area.reset();
                }, 1000);
            }
        },
        methods:{
            ...mapActions(['addOrUpdateAddress','addressList','useAddress']),
            selectAddress(){
                this.show =!this.show;
                this.$refs.area.reset();
            },
            saveForm(){
                let { values, assign, keys } = Object,
                    addressStr = `${this.form.provinceStr}${this.form.cityStr}${this.form.countryStr}`;

                if(!this.checkBlank(this.form.address) || !this.checkBlank(this.form.revicePhone) || !this.checkBlank(this.form.reviceName) || !this.checkBlank(addressStr)){
                    return this.messageDialg('地址信息不完整');
                }
                if (!this.checkPhone(this.form.revicePhone)) {
                    return this.messageDialg('手机号码格式有误');
                }

                this.loading = true;
                this.addOrUpdateAddress(assign({}, this.form, this.user)).then(
                    resp=>{
                        console.log(resp)
                        if (resp.data.errCode != '0000') {
                            this.loading = false;
                            return this.messageDialg(resp.data.errMsg);
                        }

                        this.addressList(this.user).then(resp=>{
                            if (resp.data.errCode != '0000') {
                                this.loading = false;
                                return this.messageDialg(resp.data.errMsg);
                            }

                            this.loading = false;
                            this.useAddress({
                                ProvinceStr: this.form.provinceStr,
                                CityStr: this.form.cityStr,
                                CountryStr: this.form.countryStr,
                                RevicePhone: this.form.revicePhone,
                                Address: this.form.address,
                                ReviceName: this.form.reviceName,
                            });
                            this.$router.push('/convert')//跳转地址列表
                            this.resetForm();//清空填写内容
                        })
                });
            },
            stuffAddress(address){        
                this.show = !this.show;
                this.form = Object.assign(this.form, address);
            },
            resetForm(){
                for (var i in this.form) { //清空填写内容
                    this.form[i] = '';
                }
            }
        }
    }

</script>
<style lang="scss" scoped>
    @import './edit';
</style>
