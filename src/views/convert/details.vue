<template>
    <div class="page">
        <v-page-content>
            <div class="details" v-if="order.length">
                <!--img-->
                <div class="img _01" :class="{
                    '_01':(order[0].Tag === 0),
                    '_02':(order[0].Tag === 1),
                    '_03':(order[0].Tag === 2),
                }"></div>

                <!--查看物流-->
                <div class="box" v-if="order[0].Tag === 1">
                    <div class="top">
                        <label>{{ `${order[0].ExpressName}：${order[0].ExperssNO}`}}</label>
                        <a href="javascript:;" @click="queryRoutes(order[0].ExpressName, order[0].ExperssNO)">查看快递信息</a>
                    </div>
                    <!--<div>
                        <div class="darken">商品发货、售后由格力官方负责,如未收到商品可联系</div>
                        <a href="tel:4008-098-098">跨越客服400-809-8098</a>
                    </div>-->
                </div>

                <!--收货地址-->
                <div class="box">
                    <div  class="top">
                        <label>收货地址</label>
                    </div>
                    <div>
                        <div class="tel">{{ order[0].CustomerName }} <span>{{ order[0].ReceiveMobile}}</span></div>
                        <a>{{ `${order[0].Province} ${order[0].City} ${order[0].Area} ${order[0].Address}`}}</a>
                    </div>
                </div>

                <!--产品-->
                <div class="box">
                    <div class="top">
                        <label>兑换内容</label>
                        <a href="tel:4008365315"><i class="fa fa-phone"></i> 格力客服 400-836-5315</a>
                    </div>
                    <div class="details-order">
                        <img :src="goods.GoodsPicUrl" role="img" style="width:1.7rem; height:1.7rem;" alt="图片请求错误" :title="goods.GoodsName"/>
                        <div>
                            <span class="title">{{ goods.GoodsName }}</span>
                            <span class="details-stress">{{ Math.floor(goods.Integral / 100)/100 }}万积分 X 1</span>
                        </div>
                    </div>
                </div>

                <!--订单-->
                <div class="box">
                    <div>订单编号：{{ goods.OrderNO}}</div>
                    <div>下单时间：{{ order[0].CreateDate }}</div>
                    <div v-if="order[0].ExpressName">配送方式：{{ order[0].ExpressName }} </div>
                    <div>购买类型：积分兑换</div>
                </div>

                <!--商品金额-->
                <div class="box sum">
                    <div class="top">
                        <label>商品总额</label>
                        <span>{{ Math.floor(goods.Integral / 100)/100 }}万积分</span>
                    </div>
                    <b class="details-stress">总计：{{ Math.floor(goods.Integral / 100)/100 }}万积分</b>
                </div>
                <div class="remark darken">商品售后服务由格力官方负责，咨询热线<a href="tel:4008365315">400-836-5315</a></div>
            </div>
        </v-page-content>

        <!--Loading-->
        <v-loading :show="loading" />

        <!--提示框-->
        <v-message :horizontal=".4" :vertical=".3" :show="messageShow">
            <i slot="icon" class="fa fa-exclamation-circle"></i>
            <span slot="text">{{ message }}</span>
        </v-message>
    </div>
</template>
<style lang="scss" scoped>
    @import './convert';
</style>
<script>
    import { glExchangOrderDetail } from '@http';
    export default {
        data(){
            return{
                order:[],
                goods:{},
            }
        },
        created(){
            this.loading = true;
        },
        mounted(){
            window.getShopInfo = (data)=>{
                var params = {
                    user: {
                        phone: data.phone,
                        uuid: data.uuid
                    },
                    merchantNO: data.merchantNO,
                    orderNO: data.orderNO
                }
                console.log(params);
                glExchangOrderDetail(params).then(resp => {
                    const data = resp.data;
                    if (data.errCode != '0000') {
                        this.loading = false;
                        return this.messageDialg(data.errMsg);
                    }
                    console.log(data.result);
                    setTimeout(() => {
                        this.loading = false;
                        this.order = data.result;
                        this.goods = data.result[0].OrderGoods[0];
                    }, 1000);
                });    
            }

            var u = window.navigator.userAgent,
                isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端,
                isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);             //ios终端
            if (isAndroid) {
                console.log('安卓25');
                window.kye_exchange.getShopInfo();
            } else if (isIOS) {
                console.log('IOS25');
                document.location = "objc:/" + 'getShopInfo';
            }

            // var params = {
            //     user: {
            //         phone: '18565857402',
            //         uuid: '8bff031c-bfb5-456d-875f-0133269258f7',
            //     },
            //     merchantNO: '10101010',
            //     orderNO: 'GL171125-000003'
            // }
            // glExchangOrderDetail(params).then(resp => {
            //     const data = resp.data; 
            //     if (data.errCode != '0000') {
            //         this.loading = false;
            //         return this.messageDialg(data.errMsg);
            //     }
            //     setTimeout(()=>{
            //         this.loading = false;
            //         this.order = data.result;
            //         this.goods = data.result[0].OrderGoods[0];
            //     }, 1000);
            // });
        },
        methods:{
            //查询快递信息
            queryRoutes(name,id){
                var coding = this.queryCoding(name);
                console.log(coding);
                window.location.href = `http://www.kuaidi100.com/chaxun?com=${coding}&nu=${id}`;
            }
        }
    }
</script>
