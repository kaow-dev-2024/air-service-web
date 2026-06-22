<template>
  <div>
    <!-- title -->
    <v-card>
      <v-card-title>
        <v-icon :color="colorByTheme" large class="mr-2">mdi-account</v-icon>
        USERS
        <v-spacer></v-spacer>
        <v-btn color="info" fab @click="refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>

    <!-- fliters -->
    <v-card class="my-2 user-filter-card">
      <v-card-title class="user-filter-card__title">
        <div>
          <div class="user-filter-card__kicker">Filter Panel</div>
          <div class="user-filter-card__heading">User access filters</div>
        </div>
        <div class="user-filter-card__note">Auto search when fields change</div>
      </v-card-title>
      <v-card-text class="user-filter-card__body">
        <v-row>
          <v-col cols="12" md="2">
            <v-autocomplete
              dense
              :items="itemsRoles"
              item-text="name"
              item-value="role_id"
              v-model="itemFilters.role_id"
              label="Roles"
              hide-details
              clearable
              outlined
              @change="handleUserFilterChange"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              dense
              :items="itemsAirlines"
              item-text="iata_code"
              item-value="airline_id"
              v-model="itemFilters.airline_id"
              label="Airline"
              hide-details
              clearable
              outlined
              @change="handleUserFilterChange"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <!-- <v-card-actions class="user-filter-card__actions">
        <div class="user-filter-card__summary">
          Results update automatically
        </div>
        <v-spacer></v-spacer>
      </v-card-actions> -->
    </v-card>

    <!-- data table -->
    <v-card class="my-2">
      <v-card-title primary-title>
        <v-text-field
          dense
          v-model="search"
          label="Search"
          hide-details
          autofocus
          prepend-icon="mdi-magnify"
          clearable
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-btn fab color="success" class="float-right" @click="addItem">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="itemsUsers"
        :search="search"
        :mobile-breakpoint="960"
      >
        <!-- <template v-slot:[`item.data`]-table-select="{ item, isSelected, select }">
          <v-simple-checkbox
            :value="isSelected"
            :readonly="item.is_active"
            :disabled="item.is_active"
            @input="select($event)"
          ></v-simple-checkbox>
        </template> -->

        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.is_active`]="{ item }">
          <v-chip color="success" v-if="item.is_active">Active</v-chip>
          <v-chip color="error" v-else>Inactive</v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="primary" fab x-small @click="changePassword(item)">
            <v-icon>mdi-lock-reset</v-icon>
          </v-btn>
          <!-- <v-btn color="info" fab x-small @click="view(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn> -->
          <v-btn color="warning" fab x-small @click="edit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            color="error"
            fab
            x-small
            :disabled="item.Role.name == 'admin'"
            @click="remove(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- dialog form -->
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      max-width="1000"
      content-class="user-form-dialog"
      transition="user-form-slide-x-transition"
    >
      <form @submit.prevent="save">
        <v-card class="user-form-card">
          <v-card-title primary-title>
            {{ formTitle }} USERS
            <v-spacer></v-spacer>
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- FormUser -->
            <form-user
              :item.sync="item"
              :itemsAirlines.sync="itemsAirlines"
              :itemsRoles.sync="itemsRoles"
            ></form-user>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="user-form-actions">
            <v-btn color="primary" block type="submit">
              <v-icon left>mdi-content-save</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>

    <!-- dialog change password -->
    <v-dialog
      v-model="dialogEditPassword"
      persistent
      scrollable
      max-width="640px"
      transition="dialog-transition"
    >
      <form @submit.prevent="updatePassword">
        <v-card class="user-password-card">
          <v-card-title primary-title>
            Change Password
            <v-spacer></v-spacer>
            <v-icon @click="dialogEditPassword = false">mdi-close</v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="user-password-card__body">
            <div class="user-password-card__intro">
              <div class="user-password-card__kicker">Security Update</div>
              <div class="user-password-card__heading">
                Reset password for selected user
              </div>
              <div class="user-password-card__note">
                Set a new password for this account. The user will use this
                password on the next login.
              </div>
            </div>

            <div class="user-password-card__summary">
              <div class="user-password-card__summary-item">
                <div class="user-password-card__summary-label">User</div>
                <div class="user-password-card__summary-value">
                  {{ item.full_name || "-" }}
                </div>
              </div>
              <div class="user-password-card__summary-item">
                <div class="user-password-card__summary-label">Username</div>
                <div class="user-password-card__summary-value">
                  {{ item.username || "-" }}
                </div>
              </div>
              <div class="user-password-card__summary-item">
                <div class="user-password-card__summary-label">Role</div>
                <div class="user-password-card__summary-chip">
                  <v-chip small color="info" outlined>
                    {{ item.Role ? item.Role.name : "-" }}
                  </v-chip>
                </div>
              </div>
              <div class="user-password-card__summary-item">
                <div class="user-password-card__summary-label">Status</div>
                <div class="user-password-card__summary-chip">
                  <v-chip
                    small
                    :color="item.is_active ? 'success' : 'error'"
                    outlined
                  >
                    {{ item.is_active ? "Active" : "Inactive" }}
                  </v-chip>
                </div>
              </div>
            </div>

            <div class="user-password-card__section">
              <div class="user-password-card__section-title">New Password</div>
              <div class="user-password-card__section-note">
                Use at least 8 characters for better account security.
              </div>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    dense
                    autofocus
                    label="New Password"
                    v-model="item.newPassword"
                    :type="showPasswordReset ? 'text' : 'password'"
                    :append-icon="
                      showPasswordReset
                        ? 'mdi-eye-outline'
                        : 'mdi-eye-off-outline'
                    "
                    hide-details="auto"
                    outlined
                    required
                    prepend-inner-icon="mdi-lock-reset"
                    @click:append="showPasswordReset = !showPasswordReset"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    dense
                    label="Confirm Password"
                    v-model="confirmPasswordReset"
                    :type="showPasswordReset ? 'text' : 'password'"
                    hide-details="auto"
                    outlined
                    required
                    prepend-inner-icon="mdi-shield-check-outline"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>

            <div class="user-password-card__tips">
              <v-icon small>mdi-information-outline</v-icon>
              <span>
                Avoid using the old password again and share the new password
                only with the account owner.
              </span>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="user-password-card__actions">
            <v-btn color="primary" block type="submit">
              <v-icon left>mdi-content-save</v-icon>
              Save Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>

    <!-- loader -->
    <loader :overlay="overlay"></loader>
  </div>
</template>

<script>
import FormUser from "~/components/FormUser.vue";
import loader from "~/components/Overlay.vue";
export default {
  components: { loader, FormUser },
  data() {
    return {
      overlay: false,
      dialog: false,
      dialogView: false,
      dialogEditPassword: false,
      showPasswordReset: false,
      confirmPasswordReset: "",
      search: null,
      headers: [
        { text: "#", value: "index", align: "center", sortable: false },
        {
          text: "NAME",
          value: "full_name",
          align: "center",
        },
        {
          text: "EMAIL",
          value: "email",
          align: "center",
        },
        {
          text: "PHONE",
          value: "phone",
          align: "center",
        },
        {
          text: "ROLES",
          value: "Role.name",
          align: "center",
        },

        {
          text: "ACTIVE",
          value: "is_active",
          align: "center",
          sortable: false,
        },
        {
          text: "REMARK",
          value: "remark",
        },

        {
          text: "ACTIONS",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      item: {
        user_id: null,
        role_id: null,
        airline_id: null,
        username: "",
        password: "",
        full_name: "",
        phone: "",
        email: "",
        remark: "",
        is_active: true,
      },

      itemsUsers: [],
      itemsRoles: [],
      itemsAirlines: [],

      itemFilters: {
        role_id: null,
        airline_id: null,
      },
    };
  },

  computed: {
    formTitle() {
      return this.item.user_id === null ? "CREATE" : "UPDATE";
    },
    btnTitle() {
      return this.item.user_id === null ? "Insert" : "Update";
    },
    btnColor() {
      return this.item.user_id === null ? "primary" : "warning";
    },
    colorByTheme() {
      return this.$vuetify.theme.dark ? "white" : "black";
    },
  },

  async beforeCreate() {
    let user = await this.$auth.user;
    if (user.Role.name == "staff-airline") {
      this.$router.push("/");
    }
  },
  created() {
    this.getRoles();
    this.getAirlines();
    this.getUsers();
  },

  methods: {
    excludeHiddenUsers(users) {
      const hiddenUsernames = ["pai"];
      return (users || []).filter((user) => {
        const username = String((user && user.username) || "")
          .trim()
          .toLowerCase();
        return !hiddenUsernames.includes(username);
      });
    },
    async updatePassword() {
      if (!this.item.newPassword || this.item.newPassword.trim().length < 8) {
        this.$swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Password must be at least 8 characters",
          showConfirmButton: false,
          timer: 2500,
        });
        return;
      }

      if (this.item.newPassword !== this.confirmPasswordReset) {
        this.$swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Password confirmation does not match",
          showConfirmButton: false,
          timer: 2500,
        });
        return;
      }

      this.dialogEditPassword = false;
      let data = {
        user_id: this.item.user_id,
        new_password: this.item.newPassword,
      };

      await this.$axios
        .post("/users/change-password", data)
        .then(async (res) => {
          await this.getUsers();
          await this.alertSuccess();
        })
        .catch((err) => {
          this.alertError();
        });
    },
    async changePassword(item) {
      this.item = Object.assign({}, item);
      this.item.newPassword = "";
      this.confirmPasswordReset = "";
      this.showPasswordReset = false;
      this.dialogEditPassword = true;
    },

    async view(item) {
      this.item = Object.assign({}, item);
      this.dialogView = true;
    },

    async remove(item) {
      this.item = Object.assign({}, item);

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to delete this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.value) {
            await this.$axios
              .delete("/users/" + this.item.user_id)
              .then((res) => {
                this.alertSuccess();
                this.getUsers();
              })
              .catch((err) => {
                this.alertError();
              });
          }
        });
    },

    async save() {
      this.dialog = false;
      this.overlay = true;

      if (!this.item.user_id) {
        await this.createUser();
      } else {
        await this.updateUser();
      }
    },

    async createUser() {
      await this.$axios
        .post("/users", this.item)
        .then(async (res) => {
          await this.getUsers();
          await this.alertSuccess();
        })
        .catch((err) => {
          this.alertError();
        });
      this.overlay = false;
    },

    async updateUser() {
      await this.$axios
        .put("/users/" + this.item.user_id, this.item)
        .then(async (res) => {
          await this.getUsers();
          await this.alertSuccess();
        })
        .catch((err) => {
          this.alertError();
        });
      this.overlay = false;
    },

    async edit(item) {
      this.item = Object.assign({}, item);
      this.dialog = true;
    },

    async addItem() {
      this.dialog = true;

      this.item.user_id = null;
      this.item.role_id = null;
      this.item.airline_id = null;
      this.item.username = "";
      this.item.password = "";
      this.item.full_name = "";
      this.item.phone = "";
      this.item.email = "";
      this.item.remark = "";
      this.item.is_active = true;
    },

    async handleUserFilterChange() {
      await this.filterUsers();
    },

    async filterUsers() {
      this.itemsUsers = await this.$axios
        .post("/filters/users", this.itemFilters)
        .then((res) => {
          return this.excludeHiddenUsers(res.data);
        })
        .catch((err) => {
          return [];
        });
    },
    async refresh() {
      this.itemFilters.role_id = null;
      this.itemFilters.airline_id = null;

      await this.getUsers();
    },
    async getRoles() {
      this.itemsRoles = await this.$axios
        .get("/roles")
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          this.alertError();
        });
    },
    async getAirlines() {
      this.itemsAirlines = await this.$axios
        .get("/airlines")
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          this.alertError();
        });
    },
    async getUsers() {
      this.itemsUsers = await this.$axios
        .get("/users")
        .then((res) => {
          return this.excludeHiddenUsers(res.data);
        })
        .catch((err) => {
          this.alertError();
        });
    },
    async alertError() {
      this.$swal.fire({
        toast: true,
        position: "top-end",
        type: "error",
        title: "Error",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    async alertSuccess() {
      this.$swal.fire({
        toast: true,
        position: "top-end",
        type: "success",
        title: "Success",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
};
</script>

<style scoped>
.user-filter-card__title {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
}

.user-filter-card__kicker {
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.user-filter-card__heading {
  color: var(--text-primary);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.user-filter-card__note,
.user-filter-card__summary {
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.user-filter-card__body {
  padding-top: 8px;
}

.user-filter-card__actions {
  padding: 16px;
}

.user-form-slide-x-transition-enter-active,
.user-form-slide-x-transition-leave-active {
  transition: opacity 0.24s ease, transform 0.28s ease;
}

.user-form-slide-x-transition-enter,
.user-form-slide-x-transition-leave-to {
  opacity: 0;
  transform: translateX(56px);
}

:deep(.user-form-dialog) {
  margin: 0 0 0 auto !important;
  min-height: 100vh;
  max-height: 100vh;
  border-radius: 0 !important;
  overflow: hidden;
}

:deep(.user-form-dialog > .v-card) {
  min-height: 100vh;
  border-radius: 0 !important;
}

.user-form-card {
  background: var(--surface-1) !important;
}

.user-form-actions {
  padding: 16px 24px 24px;
}

.user-password-card__body {
  display: grid;
  gap: 18px;
  padding-top: 20px;
}

.user-password-card__intro {
  display: grid;
  gap: 6px;
}

.user-password-card__kicker {
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.user-password-card__heading {
  color: var(--text-primary);
  font-size: 1.08rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.user-password-card__note {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.6;
}

.user-password-card__summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.user-password-card__summary-item {
  padding: 14px 16px;
  border: 1px solid var(--border-default);
  border-radius: 16px;
  background: linear-gradient(180deg, var(--surface-2) 0%, var(--surface-1) 100%);
}

.user-password-card__summary-label {
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.user-password-card__summary-value {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 0.98rem;
  font-weight: 700;
}

.user-password-card__summary-chip {
  margin-top: 10px;
}

.user-password-card__section {
  padding: 16px;
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background: linear-gradient(180deg, var(--surface-1) 0%, var(--surface-2) 100%);
}

.user-password-card__section-title {
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  margin-bottom: 4px;
}

.user-password-card__section-note {
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.55;
  margin-bottom: 12px;
}

.user-password-card__tips {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--surface-3);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.55;
}

.user-password-card__actions {
  padding: 16px 24px 24px;
}

@media (max-width: 600px) {
  .user-filter-card__title {
    flex-direction: column;
  }

  :deep(.user-form-dialog) {
    max-width: 100vw !important;
    width: 100vw !important;
  }

  .user-password-card__summary {
    grid-template-columns: 1fr;
  }
}
</style>

<style lang="scss" scoped></style>
