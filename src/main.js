import App from './App.vue';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import './assets/style.css';
import Aura from '@primeuix/themes/aura';
import router from './router';
import { createPinia } from 'pinia';
import ToastService from 'primevue/toastservice';

const pinia = createPinia();
const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(ToastService);
app.use(pinia);
app.use(router);
app.mount('#app');
