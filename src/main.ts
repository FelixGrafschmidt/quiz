import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import "virtual:windi.css";
import VueAxios from "vue-axios";

createApp(App).use(VueAxios, axios).mount("#app");
