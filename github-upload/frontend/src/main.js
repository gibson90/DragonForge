// frontend/src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/router/router';

import SocketService from '@/services/socket';
import {CircleCheckBig, EllipsisVertical, FilePlus2, FileMinus2, Plus, Trash2, Search, Eye, ArrowRight, Crown, Sparkles, Grid, Settings, RefreshCcw, CircleX } from 'lucide-vue-next';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// Icon Global Declaration
app.component('FilePlus2', FilePlus2);
app.component('FileMinus2', FileMinus2);
app.component('EllipsisVertical', EllipsisVertical);
app.component('PlusIcon', Plus);
app.component('TrashIcon', Trash2);
app.component('SearchIcon', Search);
app.component('EyeIcon', Eye);
app.component('ArrowRight', ArrowRight);
app.component('CrownIcon', Crown);
app.component('SparklesIcon', Sparkles);
app.component('GridIcon', Grid);
app.component('SettingsIcon', Settings);
app.component('RefreshIcon', RefreshCcw);
app.component('CircleXIcon', CircleX);
app.component('CircleCheckIcon', CircleCheckBig);

app.mount('#app');

// Initialize Socket.io after mounting the app
SocketService.initialize();
