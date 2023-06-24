import App from '@/App.vue'
import { createApp } from 'vue'
import 'virtual:uno.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
