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
          >mdi-airplane-check</v-icon
        >
        AIRCRAFT TYPE
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
        :sort-by="['aircraft_type_id']"
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
      max-width="500px"
      content-class="setting-form-dialog"
      transition="setting-form-slide-x-transition"
    >
      <form @submit.prevent="save">
        <v-card>
          <v-card-title primary-title>
            Aircraft Type
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
                  label="Model"
                  autofocus
                  required
                  hide-details
                  v-model="item.model"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Category"
                  required
                  hide-details
                  v-model="item.category"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Manufacturer"
                  required
                  hide-details
                  v-model="item.manufacturer"
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
                  label="Seat Capacity"
                  type="number"
                  min="0"
                  required
                  hide-details
                  v-model="item.seat_capacity"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  label="Range (km)"
                  type="number"
                  min="0"
                  required
                  hide-details
                  v-model="item.range_km"
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" block type="submit">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
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
        { text: "MODEL", value: "model", align: "center" },
        { text: "CATEGORY", value: "category", align: "center" },
        { text: "MENUFACTURER", value: "manufacturer", align: "center" },
        { text: "IATA", value: "iata_code", align: "center" },
        { text: "ICAO", value: "icao_code", align: "center" },
        { text: "SEAT CAPACITY", value: "seat_capacity", align: "center" },
        { text: "RANGE (km)", value: "range_km", align: "center" },
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
        aircraft_type_id: null,
        iata_code: "",
        icao_code: "",
        manufacturer: "",
        model: "",
        category: "",
        seat_capacity: 0,
        range_km: 0,
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
    this.getAircraftTypes();
  },

  methods: {
    async save() {
      this.dialog = false;

      let res = false;
      if (this.item.aircraft_type_id) {
        res = await this.update();
      } else {
        res = await this.create();
      }

      if (!res) {
        this.alertError();
        return;
      }

      await this.alertSuccess();
      await this.getAircraftTypes();

      // await this.getAircraftTypes();
    },

    async create() {
      let item = await this.$axios
        .post("/aircraft-types", this.item)
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
        .put("/aircraft-types/" + this.item.aircraft_type_id, this.item)
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
              .delete("/aircraft-types/" + this.item.aircraft_type_id)
              .then((res) => {
                this.alertSuccess();
                this.getAircraftTypes();
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

      this.item.aircraft_type_id = null;
      this.item.iata_code = "";
      this.item.icao_code = "";
      this.item.manufacturer = "";
      this.item.model = "";
      this.item.category = "";
      this.item.seat_capacity = 0;
      this.item.range_km = 0;
      this.item.remark = "";
      this.item.is_active = true;
    },

    async getAircraftTypes() {
      this.items = await this.$axios
        .get("/aircraft-types")
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

<style lang="scss" scoped></style>
