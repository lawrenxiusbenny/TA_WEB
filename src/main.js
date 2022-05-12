import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import router from "./router";
import axios from "axios";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$api = "http://127.0.0.1:8000/api";
Vue.prototype.$url = "http://127.0.0.1:8000/";

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
