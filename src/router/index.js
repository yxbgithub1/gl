import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
Vue.use(Router)


//主路由
const routes = [{
    path: '/',
    name: 'index',
    component: resolve => require(['@view/list'], resolve)
}, {
    path: '/details/:skuno',
    name: 'details',
    component: resolve => require(['@view/details'], resolve)
}, {
    path: '/convert',
    name: 'convert',
    component: resolve => require(['@view/convert'], resolve)
}, {
    path: '/convert/success',
    name: 'convert-success',
    component: resolve => require(['@view/convert/success'], resolve)
}, {
    path: '/convert/details', //convert/details
    name: 'convert-details',
    component: resolve => require(['@view/convert/details'], resolve)
}, {
    path: '/address',
    name: 'address',
    component: resolve => require(['@view/address'], resolve)
}, {
    path: "/address/edit",
    name: "address-edit",
    component: resolve => require(['@view/address/edit'], resolve)
}];

const router = new Router({
    //mode: 'history',
    routes
})

//路由钩子
router.beforeEach((to, from, next) => {

    //路由不存在时，跳转回上一个路由    
    if (!to.name) {
        let to = { path: from.path };
        return next(to);
    }
    // const token = store.getters.user.AccessToken;
    // if (to.matched.some(r => r.meta.account)) {
    //     if (!token) {
    //         return next({
    //             path: "/login",
    //             redirect: to.fullPath
    //         });
    //     } else next();
    // } else {
    //     if (token && to.name === 'login') {
    //         let to = { path: from.fullPath };
    //         return next(to);
    //     }
    // }

    next();
});

export default router;