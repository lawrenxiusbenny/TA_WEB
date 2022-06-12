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
      component: importComponent("DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token") == null) {
          next("/login");
        } else {
          next();
        }
      },
      children: [
        {
          path: "/",
          name: "Home",
          meta: { title: "Home" },
          component: importComponent("Karyawan"),
          beforeEnter: (to, from, next) => {
            if (localStorage.getItem("id_role") == 1) {
              next();
            } else {
              if (localStorage.getItem("id_role") == 2) {
                next("/customer");
              } else {
                next("/pesanan");
              }
            }
          },
        },
        {
          path: "/karyawan",
          name: "Karyawan",
          meta: { title: "Karyawan" },
          component: importComponent("Karyawan"),
          beforeEnter: (to, from, next) => {
            if (localStorage.getItem("id_role") == 1) {
              next();
            } else {
              if (localStorage.getItem("id_role") == 2) {
                next("/customer");
              } else {
                next("/pesanan");
              }
            }
          },
        },
        {
          path: "/customer",
          name: "Customer",
          meta: { title: "Customer" },
          component: importComponent("Customer"),
          beforeEnter: (to, from, next) => {
            if (
              localStorage.getItem("id_role") == 1 ||
              localStorage.getItem("id_role") == 2
            ) {
              next();
            } else {
              next("/pesanan");
            }
          },
        },
        {
          path: "/menu",
          name: "Menu",
          meta: { title: "Menu" },
          component: importComponent("Menu"),
          beforeEnter: (to, from, next) => {
            if (localStorage.getItem("id_role") == 1) {
              next();
            } else if (localStorage.getItem("id_role") == 2) {
              next("/customer");
            } else if (localStorage.getItem("id_role") == 3) {
              next("/pesanan");
            }
          },
        },
        {
          path: "/pesanan",
          name: "Pesanan",
          meta: { title: "Pesanan" },
          component: importComponent("Pesanan"),
        },
        {
          path: "/kupon",
          name: "Kupon",
          meta: { title: "Kupon" },
          component: importComponent("DataKupon"),
          beforeEnter: (to, from, next) => {
            if (localStorage.getItem("id_role") == 1) {
              next();
            } else {
              if (localStorage.getItem("id_role") == 2) {
                next("/customer");
              } else if (localStorage.getItem("id_role") == 3) {
                next("/pesanan");
              }
            }
          },
        },
        {
          path: "/royalty-point",
          name: "Royalty Point",
          meta: { title: "Royalty Point" },
          component: importComponent("DataPoint"),
          beforeEnter: (to, from, next) => {
            if (localStorage.getItem("id_role") == 1) {
              next();
            } else {
              if (localStorage.getItem("id_role") == 2) {
                next("/customer");
              } else if (localStorage.getItem("id_role") == 3) {
                next("/pesanan");
              }
            }
          },
        },
        {
          path: "/transaksi",
          name: "Transaksi",
          meta: { title: "Transaksi" },
          component: importComponent("Transaksi"),
          beforeEnter: (to, from, next) => {
            if (
              localStorage.getItem("id_role") == 1 ||
              localStorage.getItem("id_role") == 2
            ) {
              next();
            } else {
              next("/pesanan");
            }
          },
        },
        {
          path: "/laporan-penjualan",
          name: "Laporan Penjualan",
          meta: { title: "Laporan Penjualan" },
          component: importComponent("LaporanPenjualan"),
          beforeEnter: (to, from, next) => {
            if (localStorage.getItem("id_role") == 1) {
              next();
            } else {
              if (localStorage.getItem("id_role") == 2) {
                next("/customer");
              } else if (localStorage.getItem("id_role") == 3) {
                next("/pesanan");
              }
            }
          },
        },
        {
          path: "/laporan-pendapatan",
          name: "Laporan Pendapatan",
          meta: { title: "Laporan Pendapatan" },
          component: importComponent("LaporanPendapatan"),
          beforeEnter: (to, from, next) => {
            if (localStorage.getItem("id_role") == 1) {
              next();
            } else {
              if (localStorage.getItem("id_role") == 2) {
                next("/customer");
              } else if (localStorage.getItem("id_role") == 3) {
                next("/pesanan");
              }
            }
          },
        },
      ],
    },
    //login
    {
      path: "/login",
      name: "login",
      meta: { title: "Login" },
      component: importComponent("Login"),
    },
    //show menu
    {
      path: "/show-menu",
      name: "Menu",
      meta: { title: "Show Menu" },
      component: importComponent("DataMenu"),
    },
  ],
});

//meng-set judul
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
