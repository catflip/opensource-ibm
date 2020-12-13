import { NuxtAxiosInstance } from '@nuxtjs/axios'
import Vue from 'vue'
import VueRouter, { Route} from 'vue-router'
declare module '*.vue' {

  export default Vue
}


declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $route: Route
  }
}

declare module '@nuxt/types' {
  interface Context {
    $axios: NuxtAxiosInstance
  }
}

