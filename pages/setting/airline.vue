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
          >mdi-airplane</v-icon
        >
        AIRLINE
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
        :sort-by="['airline_id']"
        :sort-desc="[false]"
        :mobile-breakpoint="960"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.logo`]="{ item }">
          <div class="table-logo-cell">
            <v-img
              :src="item.logo_url"
              aspect-ratio="1.7778"
              contain
              class="table-logo ma-auto"
            ></v-img>
          </div>
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
      max-width="1120px"
      content-class="airline-form-dialog"
      transition="airline-form-slide-x-transition"
    >
      <form @submit.prevent="save">
        <v-card>
          <v-card-title primary-title>
            Airline
            <v-spacer></v-spacer>
            <v-icon @click="dialog = false"> mdi-close </v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="6">
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
                      <v-file-input
                        label="Airline Logo"
                        v-model="item.file"
                        hide-details
                        accept="image/jpeg,image/png,image/svg+xml,.svg"
                        small-chips
                        :required="!item.airline_id"
                        outlined
                      >
                      </v-file-input>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        dense
                        label="Airline Name"
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
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="Country"
                        required
                        hide-details
                        v-model="item.country"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="3">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="Check-in Open (International) (minutes)"
                        required
                        hide-details
                        v-model="item.checkin_open_inter"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="Check-in Close (International) (minutes)"
                        required
                        hide-details
                        v-model="item.checkin_close_inter"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="Boarding Time (International) (minutes)"
                        required
                        hide-details
                        v-model="item.boarding_time_inter"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="First Bag (International) (minutes)"
                        required
                        hide-details
                        v-model="item.first_bag_inter"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="Last Bag (International) (minutes)"
                        required
                        hide-details
                        v-model="item.last_bag_inter"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="3">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="Check-in Open (Domestic) (minutes)"
                        required
                        hide-details
                        v-model="item.checkin_open_dom"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="Check-in Close (Domestic) (minutes)"
                        required
                        hide-details
                        v-model="item.checkin_close_dom"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="Boarding Time (Domestic) (minutes)"
                        required
                        hide-details
                        v-model="item.boarding_time_dom"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="First Bag (Domestic) (minutes)"
                        required
                        hide-details
                        v-model="item.first_bag_dom"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        dense
                        label="Last Bag (Domestic) (minutes)"
                        required
                        hide-details
                        v-model="item.last_bag_dom"
                        outlined
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea
                    label="Remark"
                    hide-details
                    v-model="item.remark"
                    outlined
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="airline-form-actions">
            <v-btn color="primary" block type="submit">
              <v-icon left>mdi-content-save</v-icon>
              Save
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
        { text: "Logo", value: "logo", align: "center" },
        { text: "IATA", value: "iata_code", align: "center" },
        { text: "ICAO", value: "icao_code", align: "center" },
        { text: "COUNTRY", value: "country", align: "center" },
        // {
        //   text: "CHECKIN OPEN DOM",
        //   value: "checkin_open_dom",
        //   align: "center",
        // },
        // {
        //   text: "CHECKIN CLOSE DOM",
        //   value: "checkin_close_dom",
        //   align: "center",
        // },
        // {
        //   text: "BOARDING TIME DOM",
        //   value: "boarding_time_dom",
        //   align: "center",
        // },
        // {
        //   text: "CHECKIN OPEN INTER",
        //   value: "checkin_open_inter",
        //   align: "center",
        // },
        // {
        //   text: "CHECKIN CLOSE INTER",
        //   value: "checkin_close_inter",
        //   align: "center",
        // },
        // {
        //   text: "BOARDING TIME INTER",
        //   value: "boarding_time_inter",
        //   align: "center",
        // },
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
        airline_id: null,
        name: "",
        iata_code: "",
        icao_code: "",
        logo_url: "",
        country: "",
        remark: "",
        is_active: true,
        file: null,
        checkin_open_inter: 180,
        checkin_close_inter: 60,
        boarding_time_inter: 30,
        checkin_open_dom: 120,
        checkin_close_dom: 45,
        boarding_time_dom: 20,
        first_bag_inter: 15,
        last_bag_inter: 30,
        first_bag_dom: 15,
        last_bag_dom: 30,
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
    this.getAirlines();
  },

  methods: {
    async uploadFile() {
      let formData = new FormData();
      formData.append("file", this.item.file);

      let logo_url = await this.$axios
        .post("/uploads/single", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          return res.data.fileUrl;
        })
        .catch((err) => {
          return null;
        });

      return logo_url;
    },
    async save() {
      this.dialog = false;

      if (this.item.file) {
        this.item.logo_url = await this.uploadFile();
      }

      let res = false;
      if (this.item.airline_id) {
        res = await this.update();
      } else {
        res = await this.create();
      }

      if (!res) {
        this.alertError();
        return;
      }

      await this.alertSuccess();
      await this.getAirlines();
    },

    async create() {
      let item = await this.$axios
        .post("/airlines", this.item)
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
        .put("/airlines/" + this.item.airline_id, this.item)
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
              .delete("/airlines/" + this.item.airline_id)
              .then((res) => {
                this.alertSuccess();
                this.getAirlines();
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

      this.item.airline_id = null;
      this.item.name = "";
      this.item.iata_code = "";
      this.item.icao_code = "";
      this.item.logo_url = "";
      this.item.country = "";
      this.item.remark = "";
      this.item.is_active = true;
      this.item.file = null;

      this.item.checkin_open_inter = 180;
      this.item.checkin_close_inter = 60;
      this.item.boarding_time_inter = 30;
      this.item.checkin_open_dom = 120;
      this.item.checkin_close_dom = 45;
      this.item.boarding_time_dom = 20;
      this.item.first_bag_inter = 15;
      this.item.last_bag_inter = 30;
      this.item.first_bag_dom = 15;
      this.item.last_bag_dom = 30;
    },

    async getAirlines() {
      this.items = await this.$axios
        .get("/airlines")
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
.airline-form-slide-x-transition-enter-active,
.airline-form-slide-x-transition-leave-active {
  transition: opacity 0.24s ease, transform 0.28s ease;
}

.airline-form-slide-x-transition-enter,
.airline-form-slide-x-transition-leave-to {
  opacity: 0;
  transform: translateX(56px);
}

.airline-form-dialog {
  margin: 0 0 0 auto !important;
  min-height: 100vh;
  max-height: 100vh;
  border-radius: 0 !important;
  overflow: hidden;
}

.airline-form-dialog > .v-card {
  min-height: 100vh;
  border-radius: 0 !important;
}

.airline-form-actions {
  padding: 16px 24px 24px;
}

.table-logo-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 42px;
}

.table-logo {
  width: 56px;
  max-width: 56px;
  height: 28px;
  border-radius: 6px;
}

@media (max-width: 1264px) {
  .airline-form-dialog {
    max-width: min(100vw, 960px) !important;
  }
}

@media (max-width: 960px) {
  .airline-form-dialog {
    max-width: 100vw !important;
    width: 100vw !important;
  }
}
</style>
