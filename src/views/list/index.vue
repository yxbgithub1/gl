<template>
    <div>
        <!--提示框-->
        <v-message :horizontal=".4" :vertical=".3" :show="messageShow">
            <i slot="icon" class="fa fa-exclamation-circle"></i>
            <span slot="text">{{ message }}</span>
        </v-message>

        <!--loading-->
        <v-loading :show="loading" />
       
        <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :enableInfinite="infinite">
            
            <div id="list">
                <a v-for="g in goods" :key="g.GoodsNO" @click="stuffGoodsDetail(g.GoodsNO)">
                    <b :style="`background:url(${g.GoodsPicUrl}) no-repeat center; background-size: contain;`"></b>
                    <strong>{{ g.BrandName + g.CategoryName + g.GoodsUnits }}</strong>
                    <span class="number">
                        <label>消耗积分：{{ Math.floor(g.CreditRate / 100)/100 }}万</label>
                        <span>¥{{ g.JDLowPrice }}</span>
                    </span>
                </a>
            </div>
        </v-scroll>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            infinite:true,
            goods:''
        }
    },
    computed: {
        ...mapGetters(['accessToken'])
    },
    created(){
        this.infinite = false;
    },
    mounted(){
        window.getData = (data)=>{
             var accessToken = {
                user: {
                    phone: data.phone,
                    uuid: data.uuid
                },
                merchantCode: data.merchantCode
            }
            //设置用户
            this.setUser(accessToken);

            //获取商品列表数据
            this.loading = true;
            this.stuffGoods(500);
        };

        var u = window.navigator.userAgent,
            isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端,
            isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            //console.log('安卓8')
            window.kye_exchange.getMerchantCode();
        } else if (isIOS) {
            //console.log('IOS8')
            document.location = "objc:/" + 'getMerchantCode';
        }

        // var accessToken = {
        //     // user: {
        //     //     phone: '13485500855',
        //     //     uuid: '71f5ffbe-e464-46a9-9416-4fe057ec5b23'
        //     // },
        //     user: {
        //         phone: '18565857402',
        //         uuid: '8bff031c-bfb5-456d-875f-0133269258f7'
        //     },
        //     merchantCode: '10101010'
        // }
        // //设置用户
        // this.setUser(accessToken);
        // //获取商品列表数据
        // this.loading = true;
        // this.stuffGoods(500);
    },
    methods: {
        ...mapActions(['goodsList','goodsDetail','getScores','setUser']),
        //上拉刷新
        onRefresh(done) {
            this.stuffGoods(2000,done);
        },
        //下拉加载
        onInfinite(done) {   
            setTimeout(function() {  
                // var f = document.createDocumentFragment();   
                // for (let i = 0; i < 4; i++) {
                //     let a = document.createElement('a');
                //     a.innerHTML = '<b><img src="http://192.168.56.56/webapp/yxb/webs/product.jpg" alt=""></b><strong>商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称</strong><span class="number"><label>￥168</label><span>消耗积分：68.8万</span></span>';
                //     f.appendChild(a);
                // }
                // document.getElementById('list').appendChild(f)
                done()  // call done()
            }, 2000)
        },
        stuffGoods(time, done) {
            this.goodsList(this.accessToken).then(data => {
                //请求失败
                if (data.errCode != '0000') {
                    this.loading = false; 
                    return this.messageDialg(data.errMsg);
                }
                setTimeout(()=>{
                    this.loading = false;
                    this.goods = data.result.Datas;
                    if (done) done();
                }, time);
            });
        },
        stuffGoodsDetail(skuno){
            this.loading = true;
            this.goodsDetail(Object.assign({ skuno },this.accessToken)).then(data=>{
                //请求失败
                if (data.errCode != '0000') {
                    this.loading = false;
                    return this.messageDialg(data.errMsg);
                }
                //验证用户是否有兑换权限
                this.getScoresEnough('835025F35B3202115B1436B33B923FDF');
                setTimeout(()=>{
                    this.loading = false;
                    this.$router.push({ path: `details/${skuno}` });
                }, 500); 
            })
        },
        getScoresEnough(sign){
            this.getScores({ 
                'kySign': sign,
                'data'  : this.accessToken.user 
            });
        }
    }
}
</script>
<style lang="scss">
    @import './index';
</style>

