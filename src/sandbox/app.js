import Vue from 'vue';
import App from './App.vue';
import AdminComponents from '../';
import VueResource from 'vue-resource';

Vue.use(AdminComponents);
Vue.use(VueResource);

const app = new Vue({
    el: '#app',
    render: h => h(App)
});