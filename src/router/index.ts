import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
// import { useAuthStore } from "@/stores/auth";
// import { useAppStore } from "@/stores/app";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  //   Dashboard Route
  {
    path: "/",
    component: () => import("@/layouts/MainLayouts.vue"),
    meta: { middleware: "auth" },
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/Dashboard.vue"),
        meta: { pageTitle: "Dashboard", middleware: "auth" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory("/weather-app/"),
  linkExactActiveClass: "active",
  routes,
//   scrollBehavior(to, from, savedPosition) {
//     if (savedPosition) {
//       return savedPosition;
//     } else {
//       return { left: 0, top: 0 };
//     }
//   },
});

// router.beforeEach((to, from, next) => {
//     const authStore = useAuthStore();
//     const appStore = useAppStore();

//     appStore.showLoader();

//     const isAuthenticated = authStore.isAuthenticated || !!localStorage.getItem("token");

//     const requiresAuth = to.matched.some((record) => record.meta.middleware === "auth");

//     if (requiresAuth) {
//         if (!isAuthenticated) {
//             next({ name: "SignIn" });
//         } else {
//             next();
//         }
//     } else if (to.name === "SignIn" && isAuthenticated) {
//         next({ name: "Dashboard" });
//     } else {
//         next();
//     }
// })

// router.afterEach(() => {
//     const appStore = useAppStore();

//     setTimeout(() => {
//         appStore.hideLoader();
//     }, 500);
// })

export default router;
