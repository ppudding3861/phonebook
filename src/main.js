import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useKakao } from 'vue3-kakao-maps/@utils';

useKakao('b2a0131f4a53bec9033cfe18aad009d5');

createApp(App).use(router).mount('#app');
