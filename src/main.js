import scss from './stylesheets/app.scss'

import Vue from 'vue'
import Resource from 'vue-resource'
import Router from 'vue-router'
import Vue2Filters from 'vue2-filters'
import Papaparse from 'papaparse'
import Anchorme from 'anchorme'

import App from './components/App.vue'
import Home from './components/Home.vue'
import Tasks from './components/Tasks.vue'
import Builder from './components/Builder.vue'
import Monogram from './components/Monogram.vue'
import RedirectsGenerator from './components/RedirectsGenerator.vue'

// Install plugins
Vue.use(Router)
Vue.use(Resource)
Vue.use(Vue2Filters)
Vue.use(Papaparse)

// Custom Filters
Vue.filter('anchorme', function (value) {
  console.log(value)
  return Anchorme(value);
})

// Custom Filters
Vue.filter('lispCase', function (value) {
  return value.replace(/\s+/g, '-').toLowerCase();
})

Vue.filter('date', function (value) {
  const date = value.split("-");
  const year = date[0];
  const month = date[1];
  const day = date[2];
  const formattedDate =  month + "-" + day + "-" + year;

  return formattedDate;
})

// route config
let routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/monogram',
    name: 'monogram',
    component: Monogram
  },
  {
    path: '/redirects-generator',
    name: 'RedirectsGenerator',
    component: RedirectsGenerator
  },
  {
    path: '/builder',
    name: 'builder',
    component: Builder
  },
  {
    path: '/tasks/:employee',
    name: 'tasks',
    component: Tasks
  },
  { path: '*', redirect: '/home' }
]

// Set up a new router
let router = new Router({
  routes: routes
})

// Start up our app
new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
