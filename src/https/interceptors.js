import qs from "qs"
import Vue from "vue"
import axios from "axios"
import store from "../store"

import { Loading } from "element-ui";

var loading;

//请求拦截器
axios.interceptors.request.use(
    config => {

        //loading
        // loading = Loading.service({
        //     body: true,
        //     text: "正在加载中...",
        //     fullscreen: true,
        //     customClass: "loading"
        // })

        //发起请求前的逻辑处理,如配置请求header
        // var token = store.getters.user.AccessToken;
        // if (token) {
        //     config.headers["AccessToken"] = token;
        // }

        //处理发起请求的参数，Vue的data会使用defineProperty转化为可枚举对象,如果使用data内的键值对作为请求参数时，需要转为普通对象
        if (config.data) {
            config.data = qs.parse(config.data);
        }

        return config;
    },
    error => {
        //loading.close();
        return Promise.reject(error);
    }
);

//响应拦截器
axios.interceptors.response.use(
    response => {

       
        //响应请求后逻辑处理
        var data = response.data.data;
        switch (data.errCode) {
            case "-9":
                console.log(data.errMsg);    
                break;
            case "1212":
                //console.log(data.errMsg);        
                break;
            default:
                break;
        }
        //loading.close();
        return response.data;
    },
    error => {

        console.log(error);

        const resp = error.response;
        if (resp) {
            switch (resp.status) {
                case 401: //未经授权登录
                    console.log(resp.status);
                    break;
                case 403: //服务器拒绝响应
                    console.log(resp.status);
                    break;
                case 504: //停止接口服务
                case 404: //请求页面不存在
                case 500: //无网络
                    console.log('网络异常，请稍后再试');
                    break;

                default:
                    //其他...
                    console.log("其他请求错误");
            }
        }

        return Promise.reject(error);
    }
);

export default axios;