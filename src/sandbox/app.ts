import Vue from 'vue';
import App from './App.vue';
import AdminComponents from '../main';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';

Vue.use(AdminComponents);

new Vue({
	el: '#app',
	render: h => h(App)
});