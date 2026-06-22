<template>
  <div>
    <!-- title -->
    <v-card>
      <v-card-title>
        <v-icon
          :color="$vuetify.theme.dark ? 'white' : 'black'"
          large
          class="mr-2"
          >mdi-calendar-month</v-icon
        >
        SEASON FLIGHTS
        <v-spacer></v-spacer>
      </v-card-title>
    </v-card>

    <!-- fliters -->
    <v-card class="my-2 season-flights-filter-card">
      <v-card-title class="season-flights-filter-card__title">
        <div>
          <div class="season-flights-filter-card__kicker">Filter Panel</div>
          <div class="season-flights-filter-card__heading">
            Season flight filters
          </div>
        </div>
        <div class="season-flights-filter-card__note">
          Auto search when fields change
        </div>
      </v-card-title>
      <v-card-text class="season-flights-filter-card__body">
        <v-row>
          <v-col cols="12" md="2">
            <v-autocomplete
              dense
              :items="itemsDirections"
              item-text="name"
              item-value="direction_id"
              v-model="itemsFilter.direction_id"
              label="Direction"
              hide-details
              clearable
              outlined
              @change="handleSeasonFilterChange"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              dense
              :items="itemsFlightCategories"
              item-text="name"
              item-value="flight_category_id"
              v-model="itemsFilter.flight_category_id"
              label="Category"
              hide-details
              clearable
              outlined
              @change="handleSeasonFilterChange"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              dense
              v-model="itemsFilter.flight_no"
              label="Flight No"
              hide-details
              clearable
              outlined
              @change="handleSeasonFilterChange"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              dense
              :items="itemsAirports"
              item-text="iata_code"
              item-value="airport_id"
              v-model="itemsFilter.origin_airport_id"
              label="Origin"
              hide-details
              clearable
              outlined
              @change="handleSeasonFilterChange"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              dense
              :items="itemsAirports"
              item-text="iata_code"
              item-value="airport_id"
              v-model="itemsFilter.destination_airport_id"
              label="Destination"
              hide-details
              clearable
              outlined
              @change="handleSeasonFilterChange"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              dense
              :items="itemsOperationDays"
              item-text="operation_day_id"
              item-value="operation_day_id"
              v-model="itemsFilter.operation_days"
              label="Operation Days"
              hide-details
              clearable
              outlined
              multiple
              @change="handleSeasonFilterChange"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="season-flights-filter-card__actions">
        <div class="season-flights-filter-card__summary">
          Results update automatically
        </div>
        <v-spacer></v-spacer>
        <v-btn color="info" fab @click="refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- data table -->
    <v-card class="my-2 season-table-card">
      <v-card-actions class="season-table-toolbar">
        <div class="season-table-toolbar-copy">
          <div class="season-section-kicker">Flight Records</div>
          <div class="season-section-heading">Season flight list</div>
        </div>
        <v-spacer></v-spacer>
      </v-card-actions>
      <div v-if="isMobile" class="season-mobile-list">
        <v-card
          v-for="(item, index) in mobileSeasonFlights"
          :key="item.season_flight_id || index"
          class="season-mobile-card"
          flat
        >
          <div class="season-mobile-top">
            <div class="season-mobile-flight">
              <div class="season-mobile-no">
                {{ index + 1 }}. {{ item.flight_no || "-" }}
              </div>
              <div class="season-mobile-route">
                {{
                  item.Origin && item.Origin.iata_code
                    ? item.Origin.iata_code
                    : "-"
                }}
                -
                {{
                  item.Destination && item.Destination.iata_code
                    ? item.Destination.iata_code
                    : "-"
                }}
              </div>
            </div>
          </div>

          <div class="season-mobile-grid">
            <div class="season-mobile-field">
              <span class="season-mobile-label">Sched. Dep.</span>
              <strong>{{ formatSeasonTime(item.std) }}</strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">Sched. Arr.</span>
              <strong>{{ formatSeasonTime(item.sta) }}</strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">Operation Day</span>
              <strong>{{ item.operation_days || "-" }}</strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">Start</span>
              <strong>{{ item.valid_from || "-" }}</strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">End</span>
              <strong>{{ item.valid_to || "-" }}</strong>
            </div>
          </div>

          <div class="season-mobile-meta">
            <v-chip color="success" v-if="item.is_active">Active</v-chip>
            <v-chip color="error" v-else>Inactive</v-chip>
          </div>

          <div class="season-mobile-actions">
            <v-btn color="secondary" fab x-small @click="view(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </div>
        </v-card>
      </div>
      <v-data-table
        v-else
        class="season-flights-table"
        :headers="headers"
        :items="itemsSeasonFlights"
        :item-class="getSeasonRowClass"
        :search="search"
        :mobile-breakpoint="960"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.flight_no`]="{ item }">
          <div class="season-flight-cell">
            <v-avatar size="24" class="season-airline-logo">
              <img
                v-if="item.Airline && item.Airline.logo_url"
                :src="item.Airline.logo_url"
                alt="airline-logo"
              />
              <v-icon v-else small>mdi-airplane</v-icon>
            </v-avatar>
            <span>{{ item.flight_no || "-" }}</span>
          </div>
        </template>
        <template v-slot:[`item.from_to`]="{ item }">
          <div class="season-fromto-cell">
            <span>{{ item.Origin && item.Origin.iata_code ? item.Origin.iata_code : "-" }}</span>
            <v-icon small class="season-cell-icon">mdi-airplane</v-icon>
            <span>{{
              item.Destination && item.Destination.iata_code
                ? item.Destination.iata_code
                : "-"
            }}</span>
          </div>
        </template>

        <template v-slot:[`item.std`]="{ item }">
          {{ $moment(item.std, "HH:mm").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.sta`]="{ item }">
          {{ $moment(item.sta, "HH:mm").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.is_active`]="{ item }">
          <v-chip color="success" v-if="item.is_active">Active</v-chip>
          <v-chip color="error" v-else>Inactive</v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="secondary" fab x-small @click="view(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- dialog view -->
    <v-dialog
      v-model="dialogView"
      max-width="1100"
      persistent
      scrollable
      content-class="season-flights-view-dialog"
      transition="season-flights-view-slide-x-transition"
    >
      <v-card class="season-flights-view-card">
        <v-card-title primary-title>
          <span
            v-if="item.direction_id != null"
            class="mx-2 season-flights-dialog-direction"
            >{{ directionName }}</span
          >
          Flight Season Detail
          <v-spacer></v-spacer>
          <v-icon @click="dialogView = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <card-view-season-flight
            :item.sync="item"
            :season_flight_id.sync="item.season_flight_id"
            :itemsCounters.sync="itemsCounters"
            :dialog.sync="dialogView"
          ></card-view-season-flight>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CardViewSeasonFlight from "~/components/CardViewSeasonFlight.vue";
export default {
  components: { CardViewSeasonFlight },
  data() {
    return {
      dialog: false,
      dialogView: false,
      dialogFile: false,
      search: null,
      headers: [
        { text: "#", value: "index", align: "center", sortable: false },
        { text: "Flight", value: "flight_no", align: "center" },
        { text: "From / To", value: "from_to", align: "center", sortable: false },
        { text: "Sched. Dep.", value: "std", align: "center" },
        { text: "Sched. Arr.", value: "sta", align: "center" },
        {
          text: "Operation Day",
          value: "operation_days",
          align: "center",
        },
        {
          text: "Start",
          value: "valid_from",
          align: "center",
        },
        { text: "End", value: "valid_to", align: "center" },
        // {
        //   text: "ACFT",
        //   value: "AircraftType.model",
        //   align: "center",
        // },

        // {
        //   text: "TER",
        //   value: "Terminal.name",
        //   align: "center",
        // },
        // {
        //   text: "BLT",
        //   value: "Belt.name",
        //   align: "center",
        // },
        // {
        //   text: "GTE",
        //   value: "Gate.name",
        //   align: "center",
        // },
        // {
        //   text: "CTR",
        //   value: "counters",
        //   align: "center",
        // },
        // {
        //   text: "RMK",
        //   value: "remark",
        // },
        // {
        //   text: "GTD",
        //   value: "generated",
        //   align: "center",
        //   sortable: false,
        // },
        {
          text: "ACTIVE",
          value: "is_active",
          align: "center",
          sortable: false,
        },
        {
          text: "ACTIONS",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],

      itemsSelected: [],

      itemsFilter: {
        direction_id: null,
        flight_category_id: null,
        flight_no: null,
        airline_id: null,
        origin_airport_id: null,
        destination_airport_id: null,
        operation_days: [],
      },
      itemsDirections: [],
      itemsFlightCategories: [],
      itemsAirlines: [],
      itemsAirports: [],
      itemsAircraftTypes: [],
      itemsTerminals: [],
      itemsBelts: [],
      itemsGates: [],
      itemsCounters: [],
      itemsOperationDays: [
        { name: "Monday", operation_day_id: 1 },
        { name: "Tuesday", operation_day_id: 2 },
        { name: "Wednesday", operation_day_id: 3 },
        { name: "Thursday", operation_day_id: 4 },
        { name: "Friday", operation_day_id: 5 },
        { name: "Saturday", operation_day_id: 6 },
        { name: "Sunday", operation_day_id: 7 },
      ],
      itemsSeasonFlights: [],
      itemsDailyFlight: [],

      item: {
        season_flight_id: null,
        origin_airport_id: null,
        destination_airport_id: null,
        airline_id: null,
        aircraft_type_id: null,
        direction_id: null,
        flight_category_id: null,
        terminal_id: null,
        belt_id: null,
        gate_id: null,
        counters: [],
        flight_no: "",
        valid_from: "",
        valid_to: "",
        std: "",
        sta: "",
        operation_days: [],
        is_import: false,
        remark: "",
        is_active: false,
        Airline: {
          airline_id: null,
          name: "",
          iata_code: "",
          icao_code: "",
          logo_url: "",
          country: "",
          remark: "",
          is_active: true,
        },
        Airport: {
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
        Origin: {
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
        Destination: {
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
        Belt: {
          belt_id: null,
          name: "",
          remark: "",
          is_active: true,
        },
        Gate: {
          gate_id: null,
          name: "",
          remark: "",
          is_active: true,
        },
        Direction: {
          direction_id: null,
          name: "",
          remark: "",
          is_active: true,
        },
        AircraftType: {
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
        FlightCategory: {
          flight_category_id: null,
          name: "",
          remark: "",
          is_active: true,
        },
        Terminal: {
          terminal_id: null,
          name: "",
          remark: "",
          is_active: true,
        },
        DailyFlights: [],
      },

      file: null,
      user: null,
    };
  },

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    mobileSeasonFlights() {
      if (!this.search) {
        return this.itemsSeasonFlights;
      }
      const query = String(this.search).toLowerCase();
      return this.itemsSeasonFlights.filter((item) => {
        return [
          item.flight_no,
          item.Origin && item.Origin.iata_code,
          item.Destination && item.Destination.iata_code,
          item.operation_days,
          item.valid_from,
          item.valid_to,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      });
    },
    formTitle() {
      return this.item.season_flight_id === null ? "Create" : "Update";
    },

    directionName() {
      if (!this.item || !this.item.direction_id) {
        return "";
      }
      return this.item.direction_id === 1 ? "ARRIVAL" : "DEPARTURE";
    },
  },

  async beforeCreate() {
    let user = await this.$auth.user;
    if (user.Role.name != "staff-airline") {
      this.$router.push("/");
    }
  },
  async created() {
    await this.getUser();
    await this.getDirections();
    await this.getFlightCategories();
    await this.getAirlines();
    await this.getAirports();
    await this.getAircraftTypes();
    await this.getTerminals();
    await this.getBelts();
    await this.getGates();
    await this.getCounters();
    await this.getSeasonFlights();
  },

  methods: {
    getSeasonRowClass(item) {
      return item && item.is_active ? "season-row-active" : "";
    },
    formatSeasonTime(value) {
      return value
        ? this.$moment(value, "HH:mm").local().format("hh:mm A")
        : "-";
    },
    async getUser() {
      this.user = await this.$auth.user;
    },
    async getAircraftTypes() {
      this.itemsAircraftTypes = await this.$axios
        .get("/aircraft-types")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async getAirlines() {
      this.itemsAirlines = await this.$axios
        .get("/airlines")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async getAirports() {
      this.itemsAirports = await this.$axios
        .get("/airports")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async getDirections() {
      this.itemsDirections = await this.$axios
        .get("/directions")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async getTerminals() {
      this.itemsTerminals = await this.$axios
        .get("/terminals")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async getBelts() {
      this.itemsBelts = await this.$axios
        .get("/belts")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async getGates() {
      this.itemsGates = await this.$axios
        .get("/gates")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async getCounters() {
      this.itemsCounters = await this.$axios
        .get("/counters")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async getSeasonFlights() {
      this.itemsSeasonFlights = await this.$axios
        .get("/season-flights")
        .then((res) => {
          res.data.forEach((e) => {
            let date = this.$moment().format("YYYY-MM-DD");
            e.std = this.$moment
              .utc(`${date} ${e.std}`, "YYYY-MM-DD HH:mm:ss")
              .local()
              .format("HH:mm");
            e.sta = this.$moment
              .utc(`${date} ${e.sta}`, "YYYY-MM-DD HH:mm:ss")
              .local()
              .format("HH:mm");
          });
          const items = res.data.filter(
            (item) => item.airline_id == this.user.airline_id
          );
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async getFlightCategories() {
      this.itemsFlightCategories = await this.$axios
        .get("/flight-categories")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async view(item) {
      this.item = Object.assign({}, item);
      this.dialogView = true;
    },
    async handleSeasonFilterChange() {
      await this.filterSeasonFlights();
    },
    async filterSeasonFlights() {
      this.itemsSeasonFlights = await this.$axios
        .post("/filters/season-flights", this.itemsFilter)
        .then((res) => {
          res.data.forEach((e) => {
            let date = this.$moment().format("YYYY-MM-DD");
            e.std = this.$moment
              .utc(`${date} ${e.std}`, "YYYY-MM-DD HH:mm:ss")
              .local()
              .format("HH:mm");
            e.sta = this.$moment
              .utc(`${date} ${e.sta}`, "YYYY-MM-DD HH:mm:ss")
              .local()
              .format("HH:mm");
          });
          const items = res.data.filter(
            (item) => item.airline_id == this.user.airline_id
          );
          return items;
        })
        .catch((err) => {
          return [];
        });
    },
    async refresh() {
      this.itemsFilter.direction_id = null;
      this.itemsFilter.flight_category_id = null;
      this.itemsFilter.flight_no = "";
      this.itemsFilter.airline_id = null;
      this.itemsFilter.origin_airport_id = null;
      this.itemsFilter.destination_airport_id = null;
      this.itemsFilter.operation_days = [];

      this.itemsSelected = [];

      await this.getSeasonFlights();
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

<style lang="scss" scoped>
.season-flights-filter-card,
.season-table-card {
  overflow: hidden;
}

.season-table-toolbar-copy {
  display: grid;
  gap: 4px;
}

.season-section-kicker {
  color: rgba(223, 230, 234, 0.58);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.season-section-heading {
  color: #f5f7f2;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.season-table-toolbar {
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.season-table-card {
  border: 1px solid var(--border-default) !important;
  border-radius: 20px !important;
  background: var(--card-bg) !important;
  box-shadow: var(--shadow-sm), var(--theme-glow);
}

.season-flights-table::v-deep .v-data-table__wrapper {
  border-radius: 14px;
  overflow: hidden;
}

.season-flights-table::v-deep thead th {
  background: var(--surface-1) !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-default) !important;
  font-size: 0.74rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.season-flights-table::v-deep tbody tr {
  border-bottom: 1px solid var(--border-soft);
}

.season-flights-table::v-deep tbody tr:nth-child(odd),
.season-flights-table::v-deep tbody tr:nth-child(even) {
  background: var(--surface-1);
}

.season-flights-table::v-deep tbody tr:hover {
  background: var(--surface-2) !important;
}

.season-flights-table::v-deep .v-data-footer {
  background: var(--surface-1);
  border-top: 1px solid var(--border-default);
}

.season-flights-filter-card__title {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
}

.season-flights-filter-card__kicker {
  color: rgba(223, 230, 234, 0.58);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.season-flights-filter-card__heading {
  color: #f5f7f2;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.season-flights-filter-card__note,
.season-flights-filter-card__summary {
  color: rgba(223, 230, 234, 0.62);
  font-size: 0.78rem;
}

.season-flights-filter-card__body {
  padding-top: 8px;
}

.season-flights-filter-card__actions {
  padding: 16px;
}

.season-flights-filter-card::v-deep .v-card__title {
  background: var(--surface-1);
}

.season-flights-filter-card::v-deep .v-card__text {
  background: var(--card-bg);
}

.season-flights-dialog-direction {
  color: #d39b1d;
  font-weight: 700;
}

.season-flight-cell,
.season-fromto-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.season-flight-cell {
  font-weight: 700;
}

.season-airline-logo {
  background: linear-gradient(
    180deg,
    rgba(233, 245, 211, 0.22) 0%,
    rgba(127, 174, 50, 0.16) 100%
  );
  border: 1px solid rgba(127, 174, 50, 0.36);
}

.season-airline-logo img {
  object-fit: contain;
}

.season-cell-icon {
  color: var(--text-secondary) !important;
  opacity: 0.9;
}

:deep(.season-table-card .v-data-table tbody tr.season-row-active) {
  background: linear-gradient(
    90deg,
    rgba(52, 142, 84, 0.34) 0%,
    rgba(24, 56, 38, 0.62) 100%
  ) !important;
}

.season-mobile-list {
  display: grid;
  gap: 12px;
}

.season-mobile-card {
  padding: 14px;
  border: 1px solid var(--border-default) !important;
  border-radius: 18px !important;
  background: var(--card-bg) !important;
  box-shadow: var(--shadow-sm), var(--theme-glow);
}

.season-mobile-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.season-mobile-flight {
  min-width: 0;
}

.season-mobile-no {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.season-mobile-route {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 0.84rem;
  word-break: break-word;
}

.season-mobile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.season-mobile-field {
  padding: 10px 12px;
  border-radius: 14px;
  background: var(--surface-2);
  border: 1px solid var(--border-soft);
}

.season-mobile-label {
  display: block;
  margin-bottom: 6px;
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.season-mobile-field strong {
  color: var(--text-primary);
  font-size: 0.9rem;
  word-break: break-word;
}

.season-mobile-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border-soft);
}

.season-mobile-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
}

:deep(.season-flights-view-dialog) {
  align-self: stretch;
  margin: 0 0 0 auto;
  max-height: 100% !important;
  height: 100%;
  width: min(100%, 1100px);
}

:deep(.season-flights-view-dialog .v-card) {
  min-height: 100%;
  border-radius: 24px 0 0 24px !important;
}

:deep(.season-flights-view-slide-x-transition-enter-active),
:deep(.season-flights-view-slide-x-transition-leave-active) {
  transition: transform 0.28s ease, opacity 0.28s ease;
}

:deep(.season-flights-view-slide-x-transition-enter),
:deep(.season-flights-view-slide-x-transition-leave-to) {
  opacity: 0;
  transform: translateX(42px);
}

@media (max-width: 960px) {
  .season-flights-filter-card__title {
    flex-direction: column;
  }

  :deep(.season-flights-view-dialog) {
    width: 100%;
  }

  :deep(.season-flights-view-dialog .v-card) {
    border-radius: 0 !important;
  }

  .season-mobile-top,
  .season-mobile-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .season-mobile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
