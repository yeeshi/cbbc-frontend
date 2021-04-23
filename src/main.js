import Vue from 'vue'
import Vuex from 'vuex';
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
Vue.use(Vuex)
var store = new Vuex.Store({
  state: {
    defaultAccount:"",
    defaultChainId:1,
    login : false,
  }
})

Vue.config.productionTip = false;


/// 注册监听token方法
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'token') {

      // 创建一个StorageEvent事件
      var newStorageEvent = document.createEvent('StorageEvent');
      const storage = {
          setItem: function (k, val) {
              sessionStorage.setItem(k, val);

              // 初始化创建的事件
              newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

              // 派发对象
              window.dispatchEvent(newStorageEvent)
          }
      }
      return storage.setItem(key, newVal);
  }
};

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app');
