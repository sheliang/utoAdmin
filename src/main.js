// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

//axios.defaults.baseURL = "http://192.168.0.244:8080";
axios.defaults.baseURL = "http://192.168.0.138:3600";
//axios.defaults.baseURL = "http://192.168.0.85:3600";

// 统一设置请求不成功的方法
axios.interceptors.response.use(response => {
	if(response.data.code != 200) {
		ElementUI.Notification({
			title: '错误',
			message: response.data.msg || '接口请求失败',
			type: 'error'
		});
	}
	return response.data;
}, error => {
	console.log(error);
});

Vue.prototype.$http = axios;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
})