import * as types from '../mutation-types';

export default {
    state: {
        user: {},
        merchantCode:''
    },
    getters: {
        user: state => state.user,
        accessToken: state => state
    },
    mutations: {
        [types.SETUSER](state, params) {
            //localStorage.setItem(types.SETUSER, JSON.stringify(params.user));
            Object.assign(state, params);
        }
    },
    actions: {
        setUser({ commit }, params) {
            commit(types.SETUSER, params);
        }
    }
}
