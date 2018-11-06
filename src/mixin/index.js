import Vue from 'vue'
import { filters } from '../utils'

Vue.mixin({
    data() { 
        return {
            message: '',
            loading:false,
            messageShow: false,
            isAndroid: false,
            isIOS: false
        }
    },
    mounted() { 
        var u = navigator.userAgent;

        this.isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端,
        this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        //console.log([this.isAndroid, this.isIOS]);
    },
    methods: {
        dateFormat(str) {
            if (!str) return '';
            var date = new Date(str),
                month = date.getMonth() + 1,
                day = date.getDate();

            if (month < 10) month = `0${month}`;
            if (day < 10) day = `0${day}`;

            return `${date.getFullYear()}-${month}-${day}`;
        },
        checkPhone(phone) {
            return !!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/);
        },
        messageDialg(m) {
            this.message = m || '加载中...';
            this.messageShow = true;
            setTimeout(function() {
                this.messageShow = false;
            }.bind(this), 2000);
        },
        requestError(s) { 
            if (!s) {
                this.loading = false;
                this.messageDialg("加载失败,请检查网络");
                return true;
            }
        },
        checkBlank(str) { /*验证不能为空*/
            return /\S/.test(str);
        },
        queryCoding(name) { 
            // 申通快递;
            // 韵达快递;
            // 顺丰;
            // 圆通快递;
            // 中通快递;
            // 百世汇通;
            // 天天快递;
            // 德邦;
            // EMS;
            var coding = '';
            switch (name) { 
                case '申通快递':
                    coding = 'shentong';
                    break;
                case '韵达快递':
                    coding = 'yunda';
                    break;
                case '顺丰':
                    coding = 'shunfeng';
                    break;
                case '圆通快递':
                    coding = 'yuantong';
                    break;
                case '中通快递':
                    coding = 'zhongtong'
                    break;
                case '百世汇通':
                    coding = 'huitongkuaidi'
                    break;
                case '天天快递':
                    coding = 'tiantian'
                    break;
                case '德邦':
                    coding = 'debangwuliu'
                    break;
                case 'EMS':
                    coding = "ems";
                    break; 
                default:
                    coding = '';
            }
            return coding;
        }
    },
    filters: filters
});