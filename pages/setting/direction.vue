<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="success"
          class="float-right"
          @click="add"
          title="Add"
          aria-label="Add"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <h1>🧭</h1>
        DIRECTION
        <v-spacer></v-spacer>
        <v-text-field
          dense
          v-model="search"
          label="Search"
          hide-details
          autofocus
          prepend-icon="mdi-magnify"
        ></v-text-field>
      </v-card-title>
    </v-card>

    <v-card class="mt-2">
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :sort-by="['id']"
        :sort-desc="[false]"
        :mobile-breakpoint="960"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="warning" @click="edit(item)">
            <v-icon>mdi-pencil</v-icon> edit
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
            Direction
            <v-spacer></v-spacer>
            <v-icon @click="dialog = false"> mdi-close </v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Direction Name"
                  autofocus
                  required
                  hide-details
                  v-model="item.name"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" block type="submit">
              <v-icon>mdi-content-save</v-icon>
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
        { text: "NAME", value: "name" },
        { text: "ACTIONS", value: "actions", align: "center", sortable: false },
      ],
      item: {
        id: null,
        name: "",
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
    this.getDirection();
  },

  methods: {
    async save() {
      this.dialog = false;

      let res = false;
      if (this.item.id) {
        res = await this.update();
      } else {
        res = await this.create();
      }

      if (!res) {
        this.alertError();
        return;
      }

      await this.alertSuccess();
      await this.getDirection();

      // await this.getDirection();
    },

    async create() {
      let item = await this.$axios
        .post("/Direction", this.item)
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
        .put("/Direction/" + this.item.id, this.item)
        .then((res) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
      return item;
    },

    async edit(item) {
      this.item = Object.assign({}, item);
      this.dialog = true;
    },
    async add() {
      this.dialog = true;
      this.item.id = null;
      this.item.name = "";
    },

    async getDirection() {
      this.items = await this.$axios
        .get("/Direction")
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
