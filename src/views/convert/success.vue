<template>
    <div class="page">
        <v-page-content>
            <div class="success">
                <i class="fa fa-check-circle"></i>
                <span>兑换成功</span>
                <div class="success-buttons">
                    <v-button @click.native="exchangeList">兑换记录</v-button>
                    <v-button link="/" type="default">格力商城</v-button>
                </div>
            </div>
        </v-page-content>
    </div>
</template>
<style lang="scss" scoped>
    @import './convert';
</style>
<script>
export default {
    methods:{
        exchangeList(){
            var u = window.navigator.userAgent,
                isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端,
                isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 

            if (isAndroid) {
                console.log('安卓12-记录模块');
                window.click_num.gotoTypeActivity(28);
            } else if (isIOS) {
                console.log('IOS12-记录模块');
                //document.location = "objc:/" + 'gotoTypeActivity:' + '&28';
                document.location = `objc:/gotoTypeActivity:&28`
            }
        }
    }
}
</script>

