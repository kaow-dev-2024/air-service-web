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
          >mdi-star</v-icon
        >
        FLIGHT STATUS
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
        :sort-by="['flight_status_id']"
        :sort-desc="[false]"
        :mobile-breakpoint="960"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.is_arrival`]="{ item }">
          <v-chip color="success" v-if="item.is_arrival">Yes</v-chip>
          <v-chip color="error" v-else>No</v-chip>
        </template>
        <template v-slot:[`item.is_departure`]="{ item }">
          <v-chip color="success" v-if="item.is_departure">Yes</v-chip>
          <v-chip color="error" v-else>No</v-chip>
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
            Flight Status
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
              <v-col cols="12" md="6">
                <v-switch
                  label="Use with Arrival"
                  v-model="item.is_arrival"
                  hide-details
                  inset
                  color="primary"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  label="Use with Departure"
                  v-model="item.is_departure"
                  hide-details
                  inset
                  color="primary"
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="FlightStatus Name"
                  autofocus
                  required
                  hide-details
                  v-model="item.name"
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
        { text: "NAME", value: "name", align: "center" },
        {
          text: "USE WITH ARRIVAL",
          value: "is_arrival",
          align: "center",
          sortable: false,
        },
        {
          text: "USE WITH DEPARTURE",
          value: "is_departure",
          align: "center",
          sortable: false,
        },
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
        flight_status_id: null,
        name: "",
        is_arrival: true,
        is_departure: true,
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
    this.getFlightStatus();
  },

  methods: {
    async save() {
      this.dialog = false;

      let res = false;
      if (this.item.flight_status_id) {
        res = await this.update();
      } else {
        res = await this.create();
      }

      if (!res) {
        this.alertError();
        return;
      }

      await this.alertSuccess();
      await this.getFlightStatus();

      // await this.getFlightStatus();
    },

    async create() {
      let item = await this.$axios
        .post("/flight-status", this.item)
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
        .put("/flight-status/" + this.item.flight_status_id, this.item)
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
              .delete("/flight-status/" + this.item.flight_status_id)
              .then((res) => {
                this.alertSuccess();
                this.getFlightStatus();
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

      this.item.flight_status_id = null;
      this.item.name = "";
      this.item.is_arrival = true;
      this.item.is_departure = true;
      this.item.remark = "";
      this.item.is_active = true;
    },

    async getFlightStatus() {
      this.items = await this.$axios
        .get("/flight-status")
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
