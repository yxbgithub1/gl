import {
    queryGLGoodsList,
    queryGLGoodsDetail,
    getDynaic,
    getScores
} from "@http";

import * as types from '../mutation-types'

export default {
    state: {
        list: [],
        detail: {},
        dynaic: '',
        isEnough: false,
        smschannel:''
    },
    getters: {
        detail: state => state.detail,
        dynaic: state => state.dynaic,
        isEnough: state => state.isEnough,
        smschannel: state => state.smschannel
    },
    mutations: {
        [types.GOODSLIST](state, list) {
            state.list = list;
        },
        [types.GOODSDETAIL](state, detail) {
            state.detail = detail;
        },
        [types.GETDYNAIC](state,dynaic) { 
            state.dynaic = dynaic;
        },
        [types.GETSCORES](state, isEnough) { 
            state.isEnough = isEnough;
        },
        [types.SETSMSCHANNEL](state,sms) { 
            state.smschannel = sms;
        }
    },
    actions: {
        goodsList({ commit,state }, params) {
            return queryGLGoodsList(params).then(
                resp => {
                    var data = resp.data;   
                    setTimeout(function() {
                        commit(types.GOODSLIST, data.result.Datas);
                    }, 1000);
                    return data;
                }
            );
        },
        goodsDetail({ commit }, params) {
            return queryGLGoodsDetail(params).then(resp => {
                var data = resp.data;   
                commit(types.GOODSDETAIL, data.result.Datas[0]);
                return data;
            });
        },
        getDynaic({ commit }, phone) { 
            getDynaic(phone).then(resp => { 
                //console.log(resp);
                var dynaic = resp.data.result;
                commit(types.GETDYNAIC, dynaic);
            })
        },
        getScores({ commit, getters }, params) {        

            //商品所需积分
            const integral = getters.detail.CreditRate;

            getScores(params.data, params.kySign).then(resp => {
                
                console.log(resp.data.result);
                
                //账号当天可用积分
                const avbKYCredit = resp.data.result.avbKYCredit;

                console.log(`产品所需积分：${integral}\n 用户当天可用积分：${avbKYCredit}`);

                //账号当天可用积分大于登录商品所需积分，允许跳转兑换详情页.
                commit(types.GETSCORES, avbKYCredit >= integral ? true : false);
            });
        },
        setSmschannel({ commit }, sms) {
            commit(types.SETSMSCHANNEL, sms);
        }
    }
}