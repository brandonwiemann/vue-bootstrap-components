import './global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminComponents from '../main';
import App from './App.vue';
import Vue from 'vue';

Vue.use(AdminComponents);

new Vue({
    el: '#app',
    render: h => h(App)
});