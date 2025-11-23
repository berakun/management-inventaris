import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import api from './api/axios.js'; 

const app = createApp(App);
app.config.globalProperties.$api = api;

app.use(router);
app.mount('#app');