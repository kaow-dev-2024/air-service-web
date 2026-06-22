<template>
  <div class="user-form">
    <v-container fluid class="user-form__container">
      <section class="user-form__section user-form__section--status">
        <div>
          <div class="user-form__section-title">User Status</div>
          <div class="user-form__section-note">
            Enable this account when the user is ready to access the system.
          </div>
        </div>
        <div class="user-form__status-toggle">
          <v-switch
            v-model="item.is_active"
            hide-details
            inset
            color="success"
            label="Active"
          ></v-switch>
        </div>
      </section>

      <section class="user-form__section">
        <div class="user-form__section-title">Account Access</div>
        <!-- <div class="user-form__section-note">
          Set the login credentials used to sign in to the FIDS dashboard.
        </div> -->
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              autofocus
              label="Username"
              v-model="item.username"
              hide-details="auto"
              outlined
              prepend-inner-icon="mdi-account-outline"
              :clearable="!item.user_id"
              required
              :readonly="item.user_id != null"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" v-if="!item.user_id">
            <v-text-field
              dense
              label="Password"
              v-model="item.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              @click:append="showPassword = !showPassword"
              hide-details="auto"
              outlined
              clearable
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" v-else>
            <div class="user-form__info-card">
              <div class="user-form__info-title">Password Management</div>
              <div class="user-form__info-text">
                Password updates are managed from the Change Password action in
                the user table.
              </div>
            </div>
          </v-col>
        </v-row>
      </section>

      <section class="user-form__section">
        <div class="user-form__section-title">Profile Details</div>
        <!-- <div class="user-form__section-note">
          Add the user contact details for operations and account support.
        </div> -->
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Full Name"
              v-model="item.full_name"
              hide-details="auto"
              outlined
              prepend-inner-icon="mdi-badge-account-outline"
              clearable
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Email"
              v-model="item.email"
              type="email"
              hide-details="auto"
              outlined
              prepend-inner-icon="mdi-email-outline"
              clearable
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Phone"
              v-model="item.phone"
              hide-details="auto"
              outlined
              prepend-inner-icon="mdi-phone-outline"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </section>

      <section class="user-form__section">
        <div class="user-form__section-title">Access Control</div>
        <!-- <div class="user-form__section-note">
          Assign a role and airline scope to control which records the user can
          manage.
        </div> -->
        <v-row dense>
          <v-col cols="12" md="6">
            <v-autocomplete
              dense
              label="Role"
              v-model="item.role_id"
              :items="itemsRoles"
              item-text="name"
              item-value="role_id"
              hide-details="auto"
              outlined
              prepend-inner-icon="mdi-shield-account-outline"
              clearable
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="6" v-if="item.role_id == 3">
            <v-autocomplete
              dense
              label="Airline"
              v-model="item.airline_id"
              :items="itemsAirlines"
              item-text="iata_code"
              item-value="airline_id"
              hide-details="auto"
              outlined
              prepend-inner-icon="mdi-airplane-marker"
              clearable
              required
            ></v-autocomplete>
            <div class="user-form__field-note">
              Airline assignment is required for airline-level users.
            </div>
          </v-col>
          <v-col cols="12" md="6" v-else>
            <div class="user-form__info-card user-form__info-card--muted">
              <div class="user-form__info-title">Airline Scope</div>
              <div class="user-form__info-text">
                Select an airline only when the chosen role needs airline-based
                access control.
              </div>
            </div>
          </v-col>
        </v-row>
      </section>

      <section class="user-form__section">
        <div class="user-form__section-title">Remark</div>
        <!-- <div class="user-form__section-note">
          Add any operational note or admin comment for this account.
        </div> -->
        <v-row dense>
          <v-col cols="12">
            <v-textarea
              label="Remark"
              v-model="item.remark"
              hide-details="auto"
              outlined
              prepend-inner-icon="mdi-text-box-outline"
              clearable
              rows="3"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>
      </section>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["item", "itemsRoles", "itemsAirlines"],

  data() {
    return {
      showPassword: false,

      rules: {
        // ต้องไม่น้อยกว่า 8 ตัวอักษร
        minLength: (v) =>
          (!!v && v.length >= 8) ||
          "Password must be at least 8 characters long",

        // ต้องประกอบด้วย ตัวพิมพ์เล็ก+ตัวพิมพ์ใหญ่+ตัวเลข
        upperLowerNumber: (v) => {
          const hasUpper = /[A-Z]/.test(v);
          const hasLower = /[a-z]/.test(v);
          const hasNumber = /\d/.test(v);
          return (
            (hasUpper && hasLower && hasNumber) ||
            "Must contain uppercase, lowercase, and a number"
          );
        },
      },
    };
  },

  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.user-form {
  color: var(--text-primary, #0d110f);
}

.user-form__container {
  padding: 0;
}

.user-form__section {
  background: var(--surface-2, #f7f9f5);
  border: 1px solid var(--border-default, #d8e2cf);
  border-radius: 18px;
  padding: 20px;
}

.user-form__section + .user-form__section {
  margin-top: 16px;
}

.user-form__section--status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.user-form__section-title {
  color: var(--text-primary, #0d110f);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.user-form__section-note,
.user-form__field-note,
.user-form__info-text {
  color: var(--text-secondary, #53604a);
  font-size: 0.88rem;
  line-height: 1.5;
}

.user-form__status-toggle {
  min-width: 140px;
  display: flex;
  justify-content: flex-end;
}

.user-form__info-card {
  height: 100%;
  min-height: 96px;
  background: var(--surface-3, #f3f8ee);
  border: 1px dashed var(--border-strong, #b9c9a9);
  border-radius: 14px;
  padding: 14px 16px;
}

.user-form__info-card--muted {
  background: var(--surface-1, #ffffff);
}

.user-form__info-title {
  color: var(--text-primary, #0d110f);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.user-form__field-note {
  margin-top: 8px;
}

::v-deep .user-form .v-input__slot {
  background: var(--surface-1, #ffffff);
}

::v-deep .user-form .v-input__prepend-inner .v-icon,
::v-deep .user-form .v-input__append-inner .v-icon,
::v-deep .user-form .v-input__icon .v-icon {
  color: var(--text-secondary, #53604a);
}

@media (max-width: 960px) {
  .user-form__section {
    padding: 16px;
    border-radius: 16px;
  }

  .user-form__section--status {
    align-items: flex-start;
    flex-direction: column;
  }

  .user-form__status-toggle {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
