import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
  return () => import(`./components/${path}.vue`);
}

Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: importComponent("HelloWorld"),
      children: [
        //Dashboard
        {
          path: "/",
          name: "Root",
          header: importComponent("Navbar"),
          component: importComponent("HelloWorld"),
        },
      ],
    },
  ],
});
export default router;
