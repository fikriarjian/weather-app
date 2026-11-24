import { createApp } from 'vue'
import '@/assets/css/style.css'
import App from '@/App.vue'
import ApiService from '@/services/ApiService'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'

const app = createApp(App)
ApiService.init()

// Pinia
import { createPinia } from 'pinia'
app.use(createPinia())

// Router
import router from '@/router'
app.use(router)

app.mount('#app')