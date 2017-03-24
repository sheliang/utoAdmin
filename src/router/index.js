import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/home'
import Home1 from '../components/home1'
import regionManage from '../components/view/regionManage'
import cityManage from '../components/view/cityManage'
import positionManage from '../components/view/positionManage'
import cityDetail from '../components/view/cityDetail'
import lineParam from '../components/view/lineParam'
import lineDetail from '../components/view/lineDetail'

import notFound from '../components/404.vue'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		component: Home,
		name: '城市管理'
	},{
		path: '/404',
		component: notFound,
		name: '页面找不到'
	}, {
		path: '/city',
		component: Home,
		name: '城市管理',
		children: [{
			path: 'home',
			component: cityManage,
			name: '城市参数'
		}, {
			path: 'region',
			component: regionManage,
			name: '区域管理'
		}, {
			path: 'position',
			component: positionManage,
			name: '定点管理'
		}, {
			path: 'detail',
			component: cityDetail,
			name: '城市详情'
		}, ]
	},{
		path: '/line',
		component: Home,
		name: '线路管理',
		children: [{
			path: 'lineParam',
			component: lineParam,
			name: '线路参数'
		},
		{
			path: 'lineDetail',
			component: lineDetail,
			name: '线路详情'
		}]
	}]
})