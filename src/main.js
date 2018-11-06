// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from "./App";
import router from './router';
import store from './store';
import mixin from './mixin';
//import './utils/vconsole.min';

//公共组件
import components from "@comp";
Object.keys(components).forEach(key => {
    Vue.component(`v${key}`, components[key]);
});

/*global scss*/
import './assets/sass/global'
/**Font-Awemose图标*/
import "../node_modules/font-awesome/css/font-awesome.min";


/*关闭生产环境提示*/
Vue.config.productionTip = false
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})

var rem = (function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = clientWidth / 7.5 + 'px';// `${clientWidth / 7.5}px`;
        };
    win.addEventListener(resizeEvt, recalc);
    doc.addEventListener('DOMContentLoaded', recalc);
})(document, window);