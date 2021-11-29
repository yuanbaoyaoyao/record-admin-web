import {
    createApp
} from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {
    fas
} from '@fortawesome/free-solid-svg-icons';
import {
    fab
} from '@fortawesome/free-brands-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
import {
    dom
} from '@fortawesome/fontawesome-svg-core'


library.add(fas, fab)
dom.watch()

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
app.use(store)
    .use(router)
    .use(ElementPlus)
    .mount('#app')