<template>
    <div class="page">
        <v-page-content>
            <div class="goods-details">
                <!--基本信息-->
                <div class="box goods-info">
                    <div class="img">
                        <!--:style="`background:url(${detail.GoodsPicUrl}) no-repeat;`" style="background-size:cover; width:4rem; height:4rem; margin:0 auto;"-->
                        <img :src="detail.GoodsPicUrl" role="img" style="" alt="图片请求错误" :title="detail.BrandName + detail.CategoryName + detail.GoodsUnits"/>
                    </div>
                    <div class="goods-title">{{ detail.BrandName + detail.CategoryName + detail.GoodsUnits }}</div>
                    <div class="goods-subtitle">{{ detail.GoodsContent }}</div>
                    <div>
                        <span>价值：¥{{ detail.JDLowPrice}}</span>
                        <span>消耗积分：{{ Math.floor(detail.CreditRate / 100)/100 }}万</span>
                    </div>
                </div>
                <!--产品参数-->
                <div class="box">
                    <div class="remark">青海、西藏、新疆地区暂不支持配送</div>
                    <table class="goods-params">
                        <tr v-for="s in detail.GoodsSpec" :key="s.SpecName">
                            <td>{{ s.SpecName }}</td>
                            <td>{{ s.SpecValue }}</td>
                        </tr>
                    </table>
                </div>   
            </div>
        </v-page-content>
        
        <!--提示框-->
        <v-message :horizontal=".4" :vertical=".3" :show="messageShow">
            <i slot="icon" class="fa fa-exclamation-circle"></i>
            <span slot="text">{{ message }}</span>
        </v-message>

        <!--Loading-->
        <v-loading :show="loading" />

        <!--积分不足提示弹窗-->
        <alert :content="mesg" ref="alert" />

        <!--立即兑换按钮-->
        <v-save-button :on-save="save">立即兑换</v-save-button>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';
    import { Alert } from '../../components/modal';
    import { isCanUse } from '@http'
    export default{
        data(){
            return{
                mesg:''
            }
        },
        computed: {
            ...mapGetters(['detail','user','isEnough'])
        },
        components: { Alert },
        watch:{
            '$route':function(){
                 this.$refs.alert.close();
            }
        },
        methods:{
            ...mapActions(['addressList','getDynaic','setSmschannel']),
            save(){      
                this.loading = true;

                //验证账号消费权限
                isCanUse(this.user).then(resp => {
                    var data = resp.data;
                    console.log(resp);
                    if (data.result.ISTelBlack === '2') {
                        this.loading = false;
                        this.mesg = data.result.retMsg;
                        return this.$refs.alert.open();
                    }

                    //保存setSmschannel值
                    this.setSmschannel(data.smschannel);

                    //积分不足
                    if (!this.isEnough) {
                        this.loading = false;
                        this.mesg = '您的当天可用积分不足，无法兑换';
                        return this.$refs.alert.open();
                    }

                    //获取地址列表
                    this.addressList(this.user).then(resp => {
                        if (resp.data.errCode != '0000') {
                            this.loading = false;
                            return this.messageDialg(resp.data.errMsg);
                        }
                        //获取图形动态码
                        this.getDynaic(this.user.phone);
                        setTimeout(() => {
                            this.loading = false;
                            this.$router.push('/convert'); //跳转兑换信息页
                        }, 500);
                    });
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './index';
</style>
