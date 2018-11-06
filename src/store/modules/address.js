import {
    queryAddress,
    addOrUpdateAddress,
    historyAddress,
    setDefaultAddress
} from "@http";
import * as types from '../mutation-types';

export default {
    state: {
        allProvincs: [],
        allCounty: [],
        allArea: [],
        allList: [],
        receiveAddress: {},
        useAddress: false
    },
    getters: {
        provincs: state => {
            return state.allProvincs.map((i, index) => {
                return { name: `${i.col_002}` };
            });
        },
        countys: state => {
            return state.allCounty.map((i, index) => {
                return { name: `${i.col_003}` };
            });
        },
        areas: state => {
            return state.allArea.map((i, index) => {
                return { name: `${i.col_004}` };
            });
        },
        addressList: state => state.allList,
        useAddress:state => state.useAddress,
        receiveAddress:state => state.receiveAddress,
    },
    mutations: {
        [types.QUERYPROVINCS](state, provincs) {
            state.allProvincs = provincs;
        },
        [types.QUERYCOUNTY](state, countys) {
            state.allCounty = countys
        },
        [types.QUERYAREA](state, areas) {
            state.allArea = areas;
        },
        [types.ADDRESSLIST](state, addressList) { 
            state.allList = addressList;
        },
        [types.STUFFADDRESS](state, address) { 
            state.receiveAddress = address;
        },
        [types.USEADDRESS](state, address) { 
            state.useAddress = address.length == 0 ? false : address[0];
        }
    },
    actions: {
        queryProvincs({ commit }, params) {
            return queryAddress(params).then(resp => {
                var { datas } = resp.data.result;
                commit(types.QUERYPROVINCS, datas);
                return resp;
            });
        },
        queryCounty({ commit }, params) {
            return queryAddress(params).then(resp => {
                var { datas } = resp.data.result;
                commit(types.QUERYCOUNTY, datas);
                return resp;
            });
        },
        queryArea({ commit }, params) {
            return queryAddress(params).then(resp => {
                var { datas } = resp.data.result;
                commit(types.QUERYAREA, datas);
                return resp;
            });
        },
        addOrUpdateAddress({ commit }, params) { 

            //console.log(params);

            return addOrUpdateAddress(params).then(resp => { 
                return resp;
            })
        },

        addressList({ commit }, user) { 
            return historyAddress(user).then(resp => { 
                var addressList = resp.data.result,
                    dtAddress = addressList.filter((i, index) => {
                            return i.IsDefault === 1;
                        }
                    );
                commit(types.ADDRESSLIST, addressList);
                commit(types.USEADDRESS, dtAddress);
                return resp;
            });

        },
        setEditAddress({ commit }, address) { 
            commit(types.STUFFADDRESS, address);
        },
        useAddress({ commit }, address) { 

            console.log(address);
            commit(types.USEADDRESS, [address]);
        }
    }
}