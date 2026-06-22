<template>
  <v-app :class="['app-shell', themeClass]">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      width="300px"
    >
      <v-list nav dense>
        <template v-for="(item, i) in items">
          <v-list-item
            v-if="!item.lists"
            :to="item.link"
            :key="i"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            v-else
            no-action
            :prepend-icon="item.icon"
            :key="i"
            color="primary"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(list, i) in item.lists"
              :key="i"
              :to="list.link"
            >
              <v-list-item-icon>
                <v-icon>
                  {{ list.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ list.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>

      <template v-slot:append>
        <v-btn block tile class="shell-logout-btn" @click="logout()">
          <v-icon>mdi-logout</v-icon>
          LOGOUT
        </v-btn>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app flat class="app-bar-shell">
      <v-app-bar-nav-icon
        class="shell-nav-toggle"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title class="app-title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="shell-theme-toggle" depressed @click="toggleTheme">
        <v-icon left>{{
          isDarkTheme ? "mdi-weather-sunny" : "mdi-weather-night"
        }}</v-icon>
        {{ isDarkTheme ? "Light" : "Dark" }}
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid class="app-content">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  // middleware: ["auth"],

  data() {
    return {
      clipped: false,
      drawer: false,
      miniVariant: false,
      title: "PAiFIDS",

      selectedItem: 0,

      items: [],
      itemsAdmin: [
        {
          name: "DASHBOARD",
          icon: "mdi-home",
          link: "/dashboard",
        },
        {
          name: "SEASON FlIGHTS",
          icon: "mdi-calendar-month",
          link: "/season",
        },
        {
          name: "DAILY FlIGHTS",
          icon: "mdi-calendar-clock",
          link: "/daily",
        },
        {
          name: "USERS",
          icon: "mdi-account",
          link: "/user",
        },
        {
          name: "SETTINGS",
          icon: "mdi-cog",
          link: "",
          lists: [
            {
              name: "AIRPORT",
              icon: "mdi-airport",
              link: "/setting/airport",
            },
            {
              name: "AIRLINE",
              icon: "mdi-airplane",
              link: "/setting/airline",
            },
            {
              name: "AIRCRAFT TYPE",
              icon: "mdi-airplane-check",
              link: "/setting/aircraft-type",
            },
            {
              name: "TERMINAL",
              icon: "mdi-office-building",
              link: "/setting/terminal",
            },
            {
              name: "GATE",
              icon: "mdi-door",
              link: "/setting/gate",
            },
            {
              name: "BELT",
              icon: "mdi-briefcase-variant",
              link: "/setting/belt",
            },
            {
              name: "COUNTER",
              icon: "mdi-counter",
              link: "/setting/counter",
            },
            {
              name: "FLIGHTS STATUS",
              icon: "mdi-star",
              link: "/setting/flight-status",
            },
          ],
        },
      ],
      itemsStaffAirport: [
        {
          name: "DASHBOARD",
          icon: "mdi-home",
          link: "/dashboard",
        },
        {
          name: "SEASON FlIGHTS",
          icon: "mdi-calendar-month",
          link: "/season",
        },
        {
          name: "DAILY FlIGHTS",
          icon: "mdi-calendar-clock",
          link: "/daily",
        },
      ],
      itemsStaffAirline: [
        {
          name: "DASHBOARD",
          icon: "mdi-home",
          link: "/dashboard",
        },
        {
          name: "SEASON FlIGHTS",
          icon: "mdi-calendar-month",
          link: "/season-flights",
        },
        {
          name: "DAILY FlIGHTS",
          icon: "mdi-calendar-clock",
          link: "/daily-flights",
        },
      ],

      user: null,
      themeKey: "pai-fids-theme",
      isDarkTheme: false,
    };
  },

  created() {
    this.protected();
  },

  mounted() {
    const savedTheme = window.localStorage.getItem(this.themeKey);
    if (savedTheme === "dark") {
      this.setTheme(true);
      return;
    }
    this.setTheme(false);
  },

  computed: {
    themeClass() {
      return this.isDarkTheme ? "app-theme-dark" : "app-theme-light";
    },
  },

  methods: {
    setTheme(isDark) {
      this.isDarkTheme = isDark;
      this.$vuetify.theme.dark = isDark;
      document.body.classList.toggle("dark-theme", isDark);
      document.body.classList.toggle("light-theme", !isDark);
      window.localStorage.setItem(this.themeKey, isDark ? "dark" : "light");
    },
    toggleTheme() {
      this.setTheme(!this.isDarkTheme);
    },
    async logout() {
      try {
        // Let @nuxtjs/auth handle redirect flow to avoid double navigation.
        await this.$auth.logout();
        // await this.$router.push("/login");
        window.location.reload();
      } catch (err) {
        const message = (err && err.message) || "";
        // Ignore expected redirect/cancel navigation errors in dev mode.
        if (
          !/Redirected|Navigation cancelled|Navigation duplicated/i.test(
            message
          )
        ) {
          throw err;
        }
      }
    },

    async protected() {
      this.user = await this.$auth.user;
      if (!this.user || !this.user.Role) {
        this.items = [];
        return;
      }
      let role = this.user.Role.name;
      if (role === "staff-airline") {
        this.items = this.itemsStaffAirline;
      } else if (role === "staff-airport") {
        this.items = this.itemsStaffAirport;
      } else if (role === "admin") {
        this.items = this.itemsAdmin;
      }
    },
  },
};
</script>

<style scoped>
.app-shell {
  position: relative;
}

.app-title {
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.app-content {
  padding-top: 24px;
}

.app-bar-shell {
  backdrop-filter: blur(14px);
}

.shell-theme-toggle {
  margin-left: 12px;
}

.shell-logout-btn {
  position: relative;
  justify-content: center;
  gap: 10px;
  min-height: 56px;
  border-top: 1px solid rgba(127, 174, 50, 0.2) !important;
  background: linear-gradient(
    135deg,
    rgba(8, 12, 10, 0.96) 0%,
    rgba(18, 30, 20, 0.98) 55%,
    rgba(10, 20, 14, 1) 100%
  ) !important;
  color: #d8ff9a !important;
  font-weight: 800 !important;
  letter-spacing: 0.14em !important;
  text-transform: uppercase !important;
  box-shadow: inset 0 1px 0 rgba(184, 227, 90, 0.14),
    0 -12px 24px rgba(8, 12, 10, 0.28);
}

.shell-logout-btn::before {
  content: "";
  position: absolute;
  inset: 8px 14px;
  border: 1px solid rgba(184, 227, 90, 0.28);
  border-radius: 10px;
  pointer-events: none;
}

.shell-logout-btn:hover {
  color: #f3ffd6 !important;
  background: linear-gradient(
    135deg,
    rgba(10, 16, 12, 0.98) 0%,
    rgba(26, 44, 28, 1) 55%,
    rgba(14, 28, 18, 1) 100%
  ) !important;
  box-shadow: inset 0 1px 0 rgba(184, 227, 90, 0.22),
    0 0 24px rgba(127, 174, 50, 0.16);
}

.shell-logout-btn :deep(.v-icon) {
  color: #b8e35a !important;
  text-shadow: 0 0 12px rgba(184, 227, 90, 0.32);
}
</style>
