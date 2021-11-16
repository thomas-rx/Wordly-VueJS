import { createWebHistory, createRouter } from "vue-router";
import App from "@/App";

const routes = [
    {
        path: "/",
        name: "Home",
        component: App, /* <--- Change it */
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
