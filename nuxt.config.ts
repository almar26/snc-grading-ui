import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: `%s %separator %siteName`,
      templateParams: {
        siteName: "SNC Grading System",
        separator: "|",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  ssr: false,
  build: {
    transpile: ["vuetify", "vue-toastification"],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins?.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
  ],

  vite: {
    vue: {
     template: {
       transformAssetUrls,
     }
    },
   },
 
   typescript: {
     strict: false,
   },

   runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
      loginURL: process.env.LOGIN_URL
    }
  }
});
