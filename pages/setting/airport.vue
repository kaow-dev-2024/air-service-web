<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-btn color="success" fab class="float-right mb-2" @click="add">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-icon
          :color="$vuetify.theme.dark ? 'white' : 'black'"
          large
          class="mr-2"
          >mdi-airport</v-icon
        >
        AIRPORT
        <v-spacer></v-spacer>
        <v-text-field
          dense
          v-model="search"
          label="Search"
          hide-details
          autofocus
          prepend-icon="mdi-magnify"
          clearable
        ></v-text-field>
      </v-card-title>
    </v-card>

    <v-card class="mt-2">
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :sort-by="['airport_id']"
        :sort-desc="[false]"
        :mobile-breakpoint="960"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.is_active`]="{ item }">
          <v-chip color="success" v-if="item.is_active">Active</v-chip>
          <v-chip color="error" v-else>Inactive</v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="warning" fab x-small @click="edit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="error" fab x-small @click="remove(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      max-width="560px"
      content-class="airport-form-dialog"
      transition="airport-form-slide-x-transition"
    >
      <form @submit.prevent="save">
        <v-card>
          <v-card-title primary-title>
            Airport
            <v-spacer></v-spacer>
            <v-icon @click="dialog = false"> mdi-close </v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-switch
                  class="float-right"
                  label="Active"
                  v-model="item.is_active"
                  hide-details
                  inset
                  color="success"
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Airport Name"
                  autofocus
                  required
                  hide-details
                  v-model="item.name"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  label="IATA"
                  required
                  hide-details
                  v-model="item.iata_code"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  label="ICAO"
                  required
                  hide-details
                  v-model="item.icao_code"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  label="City"
                  required
                  hide-details
                  v-model="item.city"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  label="Country"
                  required
                  hide-details
                  v-model="item.country"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Timezone"
                  required
                  hide-details
                  v-model="item.timezone"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Remark"
                  hide-details
                  v-model="item.remark"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="airport-form-actions">
            <v-btn color="primary" block type="submit">
              <v-icon left>mdi-content-save</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      search: null,
      headers: [
        { text: "#", value: "index", align: "center", sortable: false },
        { text: "NAME", value: "name", align: "center" },
        { text: "IATA", value: "iata_code", align: "center" },
        { text: "ICAO", value: "icao_code", align: "center" },
        { text: "CITY", value: "city", align: "center" },
        { text: "COUNTRY", value: "country", align: "center" },
        { text: "TIMEZONE", value: "timezone", align: "center" },
        {
          text: "REMARK",
          value: "remark",
        },
        {
          text: "ACTIVE",
          value: "is_active",
          align: "center",
          sortable: false,
        },

        { text: "ACTIONS", value: "actions", align: "center", sortable: false },
      ],
      item: {
        airport_id: null,
        name: "",
        iata_code: "",
        icao_code: "",
        city: "",
        country: "",
        timezone: "",
        remark: "",
        is_active: true,
      },
      items: [],
    };
  },

  async beforeCreate() {
    let user = await this.$auth.user;
    if (user.Role.name == "staff-airline") {
      this.$router.push("/");
    }
  },
  created() {
    this.getAirports();
  },

  methods: {
    async save() {
      this.dialog = false;

      let res = false;
      if (this.item.airport_id) {
        res = await this.update();
      } else {
        res = await this.create();
      }

      if (!res) {
        this.alertError();
        return;
      }

      await this.alertSuccess();
      await this.getAirports();

      // await this.getAirports();
    },

    async create() {
      let item = await this.$axios
        .post("/airports", this.item)
        .then((res) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
      return item;
    },

    async update() {
      let item = await this.$axios
        .put("/airports/" + this.item.airport_id, this.item)
        .then((res) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
      return item;
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
              .delete("/airports/" + this.item.airport_id)
              .then((res) => {
                this.alertSuccess();
                this.getAirports();
              })
              .catch((err) => {
                this.alertError();
              });
          }
        });
    },

    async edit(item) {
      this.item = Object.assign({}, item);
      this.dialog = true;
    },
    async add() {
      this.dialog = true;

      this.item.airport_id = null;
      this.item.name = "";
      this.item.iata_code = "";
      this.item.icao_code = "";
      this.item.city = "";
      this.item.country = "";
      this.item.timezone = "";
      this.item.remark = "";
      this.item.is_active = true;
    },

    async getAirports() {
      this.items = await this.$axios
        .get("/airports")
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
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

<style lang="scss">
.airport-form-slide-x-transition-enter-active,
.airport-form-slide-x-transition-leave-active {
  transition: opacity 0.24s ease, transform 0.28s ease;
}

.airport-form-slide-x-transition-enter,
.airport-form-slide-x-transition-leave-to {
  opacity: 0;
  transform: translateX(48px);
}

.airport-form-dialog {
  margin: 0 0 0 auto !important;
  min-height: 100vh;
  max-height: 100vh;
  border-radius: 0 !important;
  overflow: hidden;
}

.airport-form-dialog > .v-card {
  min-height: 100vh;
  border-radius: 0 !important;
}

.airport-form-actions {
  padding: 16px 24px 24px;
}

@media (max-width: 600px) {
  .airport-form-dialog {
    max-width: 100vw !important;
    width: 100vw !important;
  }
}
</style>
