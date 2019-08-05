import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import util from '@/util/index.js'

import Home from '@/views/home/index'

Vue.use(Router)

var routes = [
    {
      path: '/',
      name: 'home',
      component: Home
    }
   

  ];


var router = new Router({
  // mode: 'history',
  routes: routes
});


export default router;

