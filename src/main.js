import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import router from "./router";
import axios from "axios";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import SweetAlertIcons from "vue-sweetalert-icons";
import VueApexCharts from "vue-apexcharts";

Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

Vue.use(SweetAlertIcons);

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$api = "https://api.roemahsoto.xyz/api";
Vue.prototype.$url = "https://api.roemahsoto.xyz/";

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
