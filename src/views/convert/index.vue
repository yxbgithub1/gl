<template>
    <div class="page">
        <v-page-content>
              <div class="details" style="padding-bottom: 1.4rem;">
                <!--收货地址-->
                <div class="box">
                    <div  class="top">
                        <label>收货地址</label>
                    </div>
                    <template v-if="!useAddress">
                        <div class="top" @click="selectAddress">
                            <label>选择收货地址</label>
                            <i class="fa fa-angle-right"></i>
                        </div>
                        <div>
                            (青海、西藏、新疆地区暂不支持配送)
                        </div>
                    </template>
                    <template v-else>
                        <div class="address" @click="selectAddress">
                            <div>
                                {{ `${useAddress.ProvinceStr} ${useAddress.CityStr} ${useAddress.CountryStr} ${useAddress.Address}`}}
                            </div>
                            <div>
                                <label>{{ useAddress.ReviceName }}</label>
                                <span>{{ useAddress.RevicePhone | shieldPhone }}</span>
                            </div>
                            <i class="fa fa-angle-right"></i>
                        </div>
                    </template>
                </div>

                <!--产品-->
                <div class="box">
                    <div class="top">
                        <label>兑换内容</label>
                    </div>
                    <div class="details-order">
                        <img :src="detail.GoodsPicUrl" role="img" style="width:1.7rem; height:1.7rem;" alt="图片请求错误" :title="detail.BrandName + detail.CategoryName + detail.GoodsUnits"/>
                        <div>
                            <span class="title">{{ detail.BrandName + detail.CategoryName + detail.GoodsUnits }}</span>
                            <span class="details-stress">{{ Math.floor(detail.CreditRate / 100)/100 }}万积分 X 1</span>
                        </div>
                    </div>
                </div>

                <!--配送方式-->
                <div class="box reset">
                   <div class="top">
                        <label>配送方式</label>
                        <span>快递包邮</span>
                    </div>
                </div>

                <!--商品金额-->
                <div class="box sum">
                    <div class="top">
                        <label>商品总额</label>
                        <span>{{ Math.floor(detail.CreditRate / 100)/100 }}万积分万积分</span>
                    </div>
                    <b class="details-stress">总计：{{ Math.floor(detail.CreditRate / 100)/100 }}万积分</b>
                </div>
                <div class="remark darken">商品售后服务由格力官方负责，咨询热线<a href="tel:4008365315">400-836-5315</a></div>
            </div>
        </v-page-content>

        <prompt content="此商品兑换成功后不可退货" 
            :on-ok="ok" 
            :on-cancel="cancel" 
            :error='error' 
            :on-input="promptInput" 
            :on-click="getAuthCode"
            :timing="timingText" 
            :btn-disabled="disabled" 
            :phone="user.phone" 
            :dynaic="dynaic" 
            :on-get-dynaic="getNewDynaic" 
            :dynaic-disabled="dynaicDisabled" 
            ref="prompt" />

        <v-fixed-button :on-save="confirmSave">确认兑换</v-fixed-button>
        
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
    import { glExchangeOrder, getMsgCode, isCanUse } from '@http';
    import { mapGetters,mapActions } from 'vuex';
    import { Confirm, Prompt } from '../../components/modal';

    export default {
        data(){
            return{
                error:'',
                disabled:false,
                dynaicDisabled:false,
                timingText:'获取验证码',
                messageShow: false,
                step:0
            }
        },
        components:{
            Confirm,
            Prompt
        },
        computed:{
            ...mapGetters(['detail','accessToken','useAddress','user','dynaic','isEnough','smschannel'])
        },
        watch: {
            '$route': function() {
                this.loading = false;
                this.$refs.prompt.close();
                this.error = '';
                this.disabled = false;
                this.step = 0;
                this.timingText = '获取验证码';
            }
        },
        methods:{
            ...mapActions(['addressList','getDynaic','getScores']),
            cancel(){
                this.error = '';
                this.onSendMsgCompled();
            },
            //弹窗兑换按钮
            ok(authCode, dynaicCode) {
               
                if (!dynaicCode) {
                    this.error = '请输入图形动态码';
                    return;
                }
                if(!authCode){
                    this.error = '请输入短信验证码';
                    return;
                }
                
                var params = {
                    skuno: this.detail.GoodsNO,                 //商品编码
                    uuid:this.accessToken.user.uuid,            //uuid
                    merchantNO: this.accessToken.merchantCode,  //商户编号

                    consumeMobile: this.accessToken.user.phone, //消费手机(取当前登录用户且不允许修改)
                    authCode,                                   //验证码

                    province: this.useAddress.ProvinceStr,      //省份
                    city: this.useAddress.CityStr,              //城市
                    area: this.useAddress.CountryStr,           //区域 
                    address: this.useAddress.Address,           //详细地址
                    customerName: this.useAddress.ReviceName,   //收件手机
                    receiveMobile: this.useAddress.RevicePhone, //收件人名
                }
                console.log(params);
                //兑换下单
                this.loading = true,
                glExchangeOrder(params).then(resp =>{
                    console.log(resp);
                    //错误提示  
                    const result = resp.data;
                    if(result.errCode != '0000'){
                        this.loading = false;
                        return this.error = result.errMsg;
                    }
                    
                    //关闭兑换弹窗
                    this.$refs.prompt.close();
                    this.error = '';
                    this.disabled = false;
                    this.step = 0;
                    this.timingText = '获取验证码';

                    //安卓环境独有方法
                    this.onSendMsgCompled();

                    var u = window.navigator.userAgent,
                        isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端,
                        isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);             //ios终端
                    //通知APP扣除积分
                    if (isAndroid) {    //安卓  
                        console.log('Android扣除积分')
                        window.kye_exchange.refreshIntegral();
                    } else if (isIOS) { //IOS
                        console.log('IOS扣除积分')
                        document.location = `objc:/refreshIntegral`;
                    }

                    //跳转兑换成功页面
                    setTimeout(() => {
                        this.loading = false;
                        this.$router.push('convert/success');
                    }, 500);
                });

            },
            //获取短信验证码
            getAuthCode(dynaicCode){  
                if (!dynaicCode) {
                    this.error = '请输入图形动态码';
                    return;
                }
                
                //获取验证码
                getMsgCode({
                    uuid      : this.user.uuid,
                    strUserID : this.user.phone,
                    strKey    : dynaicCode,
                    intKndType: 2
                }).then(resp=>{
                    var data = resp.data;
                    console.log(data);
                    if(data.errCode =='-1'){
                        return this.error = data.errMsg;
                    }

                    this.step = 120;
                    var time = 1000, text = this.timingText,
                        decreas = function() {
                            this.disabled = true;
                            if (this.step > 1) {
                                this.timingText = `${--this.step}s`;
                                setTimeout(decreas, time);
                            } else {
                                this.disabled = false;
                                this.timingText = text;
                            }
                        }.bind(this);
                    setTimeout(decreas, time);
                });
            },
            //确认兑换按钮
            confirmSave(){
                this.loading = true;

                //获取当前账号积分，判断当天可用积分是否满足兑换要求
                this.getScoresEnough('835025F35B3202115B1436B33B923FDF');
                //积分不足
                if (!this.isEnough) {
                    this.loading = false;
                    return this.messageDialg('您的当天可用积分不足，无法兑换');
                }
                //判断收货地址是否为空
                if (!this.useAddress.ProvinceStr) {   
                    this.loading = false;
                    return this.messageDialg('请选择您的收货地址');
                }

                //发送通知短信结果
                window.messageSendSucess = (result) => {
                    //console.log('发送通知');
                    //更新图形动态码
                    this.getNewDynaic();
                    //弹出获取验证码弹出
                    this.$refs.prompt.open();
                    this.loading = false;
                }

                //APP取消按钮调用
                window.messageCancel = ()=>{
                    console.log('取消按钮')
                    console.log(this.useAddress);
                    this.loading = false;
                }

                let sku = '0001'
                var u = window.navigator.userAgent,
                    isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端,
                    isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);             //ios终端 

                //通知APP给管理后台发送通知短信
                if (isAndroid) {    //安卓
                    console.log("sku-android")
                    window.kye_exchange.doSendMsg(this.smschannel, sku);
                } else if (isIOS) { //IOS
                    console.log("sku-ios")
                    document.location = `objc:/sendMessageToChannel:&${this.smschannel}?${sku}`;
                }

                //验证账号消费权限
                // isCanUse(this.user).then(resp => {
                //     console.log(resp);
                //     var data = resp.data;
                //     if (data.retStatus != '1') {
                //         this.loading = false;
                //         return this.messageDialg('您的账号暂无消费权限');
                //     }
                //     let sku = '0001'
                //     var u = window.navigator.userAgent,
                //         isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端,
                //         isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);             //ios终端
                //     //通知APP给管理后台发送通知短信
                //     if (isAndroid) {    //安卓
                //         console.log("sku-android")
                //         window.kye_exchange.doSendMsg(data.smschannel, sku);
                //     } else if (isIOS) { //IOS
                //         console.log("sku-ios")
                //         document.location = `objc:/sendMessageToChannel:&${data.smschannel}?${sku}`;
                //     }
                //     // //更新图形动态码
                //     // this.getNewDynaic();
                //     // //弹出获取验证码弹出
                //     // this.$refs.prompt.open();
                //     // this.loading = false;
                // });
            },
            //更新图形动态码
            getNewDynaic(){
                this.getDynaic(this.user.phone);
                this.dynaicDisabled = true;
                setTimeout(()=>{
                    this.dynaicDisabled = false;
                }, 3000);
            },
            //选择地址
            selectAddress(){
                this.loading = true;
                this.addressList(this.user).then(resp => {
                    this.loading = false;
                    //错误提示
                    if (resp.data.errCode != '0000') {
                        this.loading = false;
                        return this.messageDialg(resp.data.errMsg);
                    } 
                    this.$router.push('address');//跳转地址列表
                })
            },
            promptInput(val){
                if(val){
                    this.error = ''
                }
            },
            getScoresEnough(sign) {
                this.getScores({
                    'kySign': sign,
                    'data': this.accessToken.user
                });
            },
            onSendMsgCompled(){
                var u = window.navigator.userAgent,
                    isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端

                if(isAndroid){
                    window.kye_exchange.onSendMsgCompled();
                };
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './convert';
</style>

