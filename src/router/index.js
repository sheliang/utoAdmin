import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/home'
import regionManage from '../components/view/regionManage'
import cityManage from '../components/view/cityManage'
import positionManage from '../components/view/positionManage' 
import cityDetail from '../components/view/cityDetail' 

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        component: Home,
        name: '城市参数',
        //iconCls: 'el-icon-message', //图标样式class
        children: [
            { path: '/home', component: cityManage, name: '城市参数' },
            { path: '/region', component: regionManage, name: '区域管理' },
            { path: '/position', component: positionManage, name: '定点管理' },
            { path: '/detail', component: cityDetail, name: '城市详情' },
        ]
    }]
})
