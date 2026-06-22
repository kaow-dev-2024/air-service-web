<template>
  <v-app>
    <v-main class="login-page">
      <div class="login-bg">
        <div class="stars"></div>
        <div class="grid"></div>
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
      </div>

      <v-container fluid class="fill-height pa-0">
        <v-row align="center" justify="center" class="fill-height ma-0">
          <v-col cols="12" sm="10" md="7" lg="5" xl="4">
            <div class="text-center mb-8 brand-wrap">
              <div class="brand-logo">
                <img
                  src="/favicon.ico"
                  alt="PAI Logo"
                  class="brand-logo__img"
                />
              </div>
              <h1 class="brand-title">PATAYA AI TERMINAL</h1>
              <p class="brand-subtitle">
                Airport Operations Intelligence Platform
              </p>
            </div>

            <v-card class="login-card" outlined>
              <div class="card-frame"></div>

              <v-card-text class="pa-8 pa-md-10">
                <div class="text-center mb-8">
                  <div class="panel-chip">SECURE ACCESS</div>
                  <h2 class="login-title">User Login</h2>
                  <div class="login-title-line"></div>
                </div>

                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  autocomplete="off"
                  @submit.prevent="submitLogin"
                >
                  <v-text-field
                    v-model="form.login"
                    :rules="usernameRules"
                    dark
                    filled
                    rounded
                    dense
                    prepend-inner-icon="mdi-account-outline"
                    label="Username/Email"
                    color="cyan accent-2"
                    class="sci-input"
                    autocomplete="off"
                    autocapitalize="off"
                    autocorrect="off"
                    spellcheck="false"
                    name="login-no-save"
                  />

                  <v-text-field
                    v-model="form.password"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    dark
                    filled
                    rounded
                    dense
                    prepend-inner-icon="mdi-lock-outline"
                    :append-icon="
                      showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                    "
                    label="Password"
                    color="cyan accent-2"
                    class="sci-input"
                    autocomplete="new-password"
                    name="password-no-save"
                    data-lpignore="true"
                    @click:append="showPassword = !showPassword"
                  />

                  <!-- <div
                    class="d-flex align-center justify-space-between flex-wrap mb-6 mt-2 login-options"
                  >
                    <v-checkbox
                      v-model="form.remember"
                      dark
                      dense
                      hide-details
                      color="amber lighten-1"
                      label="Remember me"
                      class="mt-0 pt-0"
                    />

                    <nuxt-link to="/forgot-password" class="helper-link">
                      Forgot password?
                    </nuxt-link>
                  </div> -->

                  <v-btn
                    type="submit"
                    block
                    x-large
                    depressed
                    :loading="loading"
                    class="login-btn mb-6"
                  >
                    <v-icon left>mdi-shield-key-outline</v-icon>
                    Login
                  </v-btn>

                  <!-- <div class="text-center helper-row">
                    <span class="helper-text">Need an account?</span>
                    <nuxt-link to="/register" class="helper-link ml-2">
                      Create account
                    </nuxt-link>
                  </div> -->
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "LoginPage",
  layout: "empty",
  data() {
    return {
      valid: false,
      loading: false,
      showPassword: false,
      form: {
        login: "",
        password: "",
        remember: true,
      },
      usernameRules: [(v) => !!v || "Username/Email is required"],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },
  methods: {
    async submitLogin() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      this.loading = true;

      try {
        // Replace with your real auth flow.
        // Example:
        await this.$auth.loginWith("local", {
          data: this.form,
        });
        // await this.$router.push("/dashboard");
        // await new Promise((resolve) => setTimeout(resolve, 800));
        this.$swal.fire({
          toast: true,
          position: "top-end",
          type: "success",
          title: "Login success",
          showConfirmButton: false,
          timer: 2500,
        });
      } catch (error) {
        // Handle API errors here
        this.$swal.fire({
          toast: true,
          position: "top-end",
          type: "error",
          title: "Invalid username or password",
          showConfirmButton: false,
          timer: 8000,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  --login-bg-start: #06101d;
  --login-bg-mid: #081a2f;
  --login-bg-end: #020711;
  --login-border: rgba(116, 222, 255, 0.22);
  --login-text: #eef8ff;
  --login-text-muted: rgba(201, 231, 255, 0.72);
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(
      180deg,
      rgba(3, 9, 17, 0.3) 0%,
      rgba(3, 9, 17, 0.6) 52%,
      rgba(2, 7, 17, 0.88) 100%
    ),
    radial-gradient(circle at top, rgba(53, 127, 255, 0.22), transparent 32%),
    radial-gradient(circle at 20% 80%, rgba(0, 229, 255, 0.1), transparent 28%),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 167, 38, 0.14),
      transparent 24%
    ),
    url("/background.jpg") center center / cover no-repeat,
    linear-gradient(
      135deg,
      var(--login-bg-start) 0%,
      var(--login-bg-mid) 42%,
      var(--login-bg-end) 100%
    );
}

.login-bg,
.stars,
.grid {
  position: absolute;
  inset: 0;
}

.login-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(3, 8, 15, 0.74), rgba(3, 8, 15, 0.24)),
    radial-gradient(
      circle at center,
      transparent 36%,
      rgba(2, 7, 17, 0.54) 100%
    );
}

.stars {
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1.5px),
    radial-gradient(circle, rgba(111, 199, 255, 0.5) 1px, transparent 1.5px),
    radial-gradient(circle, rgba(255, 196, 112, 0.35) 1px, transparent 1.5px);
  background-size:
    160px 160px,
    220px 220px,
    280px 280px;
  background-position:
    0 0,
    40px 70px,
    110px 30px;
  opacity: 0.18;
}

.grid {
  inset: auto 0 0 0;
  height: 42vh;
  background-image:
    linear-gradient(rgba(77, 195, 255, 0.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(77, 195, 255, 0.18) 1px, transparent 1px);
  background-size: 48px 48px;
  transform: perspective(240px) rotateX(72deg);
  transform-origin: bottom;
  opacity: 0.22;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
}

.glow-1 {
  width: 360px;
  height: 360px;
  top: 8%;
  left: 8%;
  background: rgba(0, 229, 255, 0.12);
}

.glow-2 {
  width: 300px;
  height: 300px;
  right: 8%;
  top: 16%;
  background: rgba(255, 171, 64, 0.14);
}

.brand-wrap {
  position: relative;
  z-index: 2;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  margin-bottom: 16px;
  border-radius: 24px;
  background: linear-gradient(
    135deg,
    rgba(16, 33, 64, 0.9),
    rgba(7, 18, 36, 0.72)
  );
  box-shadow:
    0 0 0 1px rgba(126, 222, 255, 0.18),
    0 0 30px rgba(0, 229, 255, 0.18),
    inset 0 0 24px rgba(255, 255, 255, 0.04);
}

.brand-logo__img {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.brand-title {
  margin: 0;
  color: var(--login-text);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-shadow: 0 0 18px rgba(0, 229, 255, 0.12);
}

.brand-subtitle {
  margin: 10px 0 0;
  color: var(--login-text-muted);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
}

.login-card {
  position: relative;
  z-index: 2;
  overflow: hidden;
  border: 1px solid var(--login-border) !important;
  border-radius: 28px !important;
  background: linear-gradient(
    180deg,
    rgba(10, 23, 43, 0.84),
    rgba(5, 13, 26, 0.92)
  ) !important;
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(124, 221, 255, 0.08),
    0 0 40px rgba(0, 229, 255, 0.12);
  backdrop-filter: blur(14px);
}

.card-frame {
  position: absolute;
  inset: 14px;
  border: 1px solid rgba(122, 219, 255, 0.16);
  border-radius: 22px;
  pointer-events: none;
}

.panel-chip {
  display: inline-block;
  padding: 6px 12px;
  border: 1px solid rgba(255, 183, 77, 0.35);
  border-radius: 999px;
  color: #ffcc80;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: rgba(255, 167, 38, 0.08);
}

.login-title {
  margin: 16px 0 10px;
  color: var(--login-text);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-title-line {
  width: 120px;
  height: 3px;
  margin: 0 auto;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(0, 229, 255, 0),
    rgba(0, 229, 255, 0.95),
    rgba(255, 171, 64, 0.9),
    rgba(255, 171, 64, 0)
  );
  box-shadow: 0 0 18px rgba(0, 229, 255, 0.4);
}

.sci-input ::v-deep .v-input__slot {
  background: rgba(10, 26, 47, 0.88) !important;
  border: 1px solid rgba(101, 213, 255, 0.16);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.sci-input ::v-deep input {
  color: var(--login-text) !important;
}

.sci-input ::v-deep .v-label,
.sci-input ::v-deep .v-icon {
  color: rgba(190, 228, 255, 0.78) !important;
}

.login-options {
  color: #d8ecff;
}

.helper-text {
  color: rgba(204, 229, 255, 0.72);
}

.helper-link {
  color: #7ce8ff;
  text-decoration: none;
  font-weight: 600;
}

.helper-link:hover {
  color: #ffcc80;
}

.login-btn {
  height: 56px !important;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #04111f !important;
  background: linear-gradient(
    90deg,
    #3ee7ff 0%,
    #7ee7ff 35%,
    #ffb74d 100%
  ) !important;
  box-shadow:
    0 12px 30px rgba(0, 229, 255, 0.22),
    0 8px 20px rgba(255, 167, 38, 0.18);
}

.helper-row {
  color: #d8ecff;
}

@media (max-width: 600px) {
  .brand-title {
    font-size: 1.35rem;
    letter-spacing: 0.12em;
  }

  .brand-subtitle {
    font-size: 0.82rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>
