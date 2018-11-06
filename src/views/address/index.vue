<template>
    <div class="page">
        <v-page-content>   
            <!--地址列表-->
            <ul role="list" >
                <li v-for="(item, index) in addressList" :key="item.Id" :class="{'selected':index === 0}" @click="select(item)">
                    <div>
                        <label class="name">{{ item.ReviceName}}</label>
                        <span>{{ item.RevicePhone | shieldPhone}}</span>
                    </div>
                    <div class="address">{{ `${item.ProvinceStr} ${item.CityStr} ${item.CountryStr} ${item.Address}`}}</div>
                    <div class="use">
                        <section @click.stop="setDtAddress(item.Id)">
                            <i class="fa" :class="item.IsDefault === 0 ? 'fa-circle-thin':'fa-check-circle-o'"></i>
                            <span>设为默认地址</span>
                        </section>
                        <section class="ft-r">
                            <a @click.stop="editAddress({
                                address    : item.Address,
                                provinceStr: item.ProvinceStr,
                                countryStr : item.CountryStr,
                                cityStr    : item.CityStr,
                                reviceName : item.ReviceName,
                                revicePhone: item.RevicePhone,
                                id:item.Id
                            })"><i class="fa fa-pencil-square-o"></i>编辑</a>
                            <a @click.stop="delAddress(item.Id)" class="delete"><i class="fa fa-trash-o"></i>删除</a>
                        </section>
                    </div>
                </li>
            </ul>
        </v-page-content>
        
        <confirm content="确定要删除该地址吗?" :on-ok="ok" ref="confirm"></confirm>

        <!--提示框-->
        <v-message :horizontal=".4" :vertical=".3" :show="show">
            <i slot="icon" class="fa fa-check-circle"></i>
            <span slot="text">删除成功</span>
        </v-message>

        <!--按钮-->  
        <v-fixed-button :on-save="addAddress">新增地址</v-fixed-button>

        <!--Loading-->
        <v-loading :show="loading" />
    </div>
</template>
<script>
    import { setDefaultAddress, delHistoryAddress } from '@http';
    import { mapActions,mapGetters } from 'vuex';
    import Bus from '../../utils/bus';
    import { Confirm, Modal } from '../../components/modal';
    export default{
        data(){
            return{
                selected:true,
                show:false,
                id:''
            }
        },
        computed:{
            ...mapGetters(['user','addressList'])
        },
        components:{
            Confirm
        },
        methods:{
            ok(){
                delHistoryAddress(this.user, this.id).then(resp=>{
                    if (resp.data.errCode !='0000') {
                        this.loading = false;
                        return this.messageDialg(resp.data.errMsg);
                    } 
                    this.stuffList();
                    this.show = true;
                    setTimeout(function() {
                        this.show = false;
                    }.bind(this), 2000);
                });
            },
            select(address){
                console.log(address);
                this.$store.dispatch('useAddress',address)
                this.$router.push('convert');
            },
            //设为默认
            setDtAddress(id){
                this.loading = true;
                setDefaultAddress(this.user,id).then(resp=>{

                    if (resp.data.errCode != '0000') {
                        this.loading = false;
                        return this.messageDialg(resp.data.errMsg);
                    } 
                    this.stuffList();
                })
            },
            //填充省份数据
            stuffProvinc(address = {}){
                this.loading = true;
                this.$store.dispatch('queryProvincs',Object.assign({
                    "area": "",
                    "county": "",
                    "provinc": "",
                    "phoneNumber": this.user.phone,
                    "uuid": this.user.uuid
                },address)).then(resp =>{
                    //错误处理
                    if(resp.data.retStatus !='1'){                         
                        this.loading = false;
                        return this.messageDialg(resp.data.errMsg);
                    }

                    setTimeout(function() {
                        this.loading = false;
                        this.$router.push('address/edit');
                    }.bind(this), 500);
                });
            },
            //填充地址列表
            stuffList(){
                this.$store.dispatch('addressList', this.user).then(resp => {
                    this.loading = false;
                    if (resp.data.errCode != '0000') {
                        this.loading = false;
                        return this.messageDialg(resp.data.errMsg);
                    } 
                });
            },
            //删除地址
            delAddress(id){
                this.id = id;
                this.$refs.confirm.open();
            },
            //新增地址
            addAddress(){
                this.stuffProvinc();
                Bus.$emit('stuffReceiveAddress');
            },
            //编辑地址
            editAddress(address){ 
                this.stuffProvinc();  
                Bus.$emit('stuffReceiveAddress', address);     
                this.$store.dispatch('setEditAddress', address);
                this.$router.push('address/edit');
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './index';
</style>
