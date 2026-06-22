export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  target: "static",
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s",
    title: "PAiFIDS",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~assets/global.scss",
    // "~/assets/variables.scss"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // { src: '~/plugins/vue-chartjs.js', mode: 'client' }
    // '~/plugins/primevue.js',
    // { src: '~/plugins/google-maps.js', mode: 'client' },
    { src: "~/plugins/global-button-tooltip.client.js", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/vuetify"],

  // moment: {
  //   defaultLocale: "th",
  //   locales: ["th"],
  //   defaultTimezone: "Asia/Bangkok",
  // },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "@nuxtjs/moment",
    "@nuxtjs/auth",
    "nuxt-sweetalert2",
    "@nuxtjs/dotenv",
  ],

  publicRuntimeConfig: {
    appTimezone: process.env.TIMEZONE || "Asia/Bangkok",
  },

  moment: {
    defaultTimezone: process.env.TIMEZONE || "Asia/Bangkok",
  },

  dotenv: {
    path: "./", // Path to .env
    filename: ".env", // File name
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      theme_color: "#050607",
    },
    manifest: {
      name: "PAiFIDS",
      short_name: "PAI FIDS",
      lang: "en",
      display: "standalone",
      start_url: "/",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/favicon.ico",
          sizes: "16x16 24x24 32x32 64x64",
          type: "image/vnd.microsoft.icon",
        },
      ],
    },
    workbox: {
      cleanupOutdatedCaches: true,
      // Do not cache API responses to avoid Cache API failures
      // such as: "Vary header contains *".
      runtimeCaching: [
        {
          urlPattern: /\/api\/.*/i,
          handler: "NetworkOnly",
          method: "GET",
        },
        {
          urlPattern: /^https?:\/\/.*\/api\/.*/i,
          handler: "NetworkOnly",
          method: "GET",
        },
      ],
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"], // ใช้ SCSS ของเรา
    treeShake: true, // เพื่อลดขนาด bundle
    defaultAssets: {
      icons: "mdi",
    },
    theme: {
      options: {
        customProperties: true,
      },
      dark: false,
      themes: {
        dark: {
          primary: "#7FAE32",
          secondary: "#FFFFFF",
          accent: "#E9F5D3",
          error: "#C94B4B",
          info: "#3E8ED0",
          success: "#52A447",
          warning: "#D39B1D",
          anchor: "#6D9A27",
          background: "#050607",
          surface: "#1E1E1E",
        },
        light: {
          primary: "#7FAE32",
          secondary: "#FFFFFF",
          accent: "#E9F5D3",
          error: "#C94B4B",
          info: "#3E8ED0",
          success: "#52A447",
          warning: "#D39B1D",
          anchor: "#6D9A27",
          background: "#FFFFFF",
          surface: "#F5F5F5",
        },
      },
    },
  },

  router: {
    middleware: ["auth"],
  },

  auth: {
    strategies: {
      local: {
        scheme: "local",
        token: {
          property: "token",
          global: true,
          type: "Bearer",
        },
        user: {
          property: "user",
          autoFetch: true,
        },
        endpoints: {
          login: { url: "/auth/login", method: "post" },
          logout: { url: "/auth/logout", method: "post" },
          user: { url: "/auth/me", method: "get" },
        },
      },
    },
    redirect: {
      login: "/login",
      logout: "/login",
      callback: "/login",
      home: "/",
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["vuetify"],
  },

  server: {
    host: process.env.NUXT_HOST || "0.0.0.0",
    port: process.env.NUXT_PORT || 3000,
  },
};
