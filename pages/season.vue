<template>
  <div class="season-page">
    <!-- fliters -->
    <filter-season
      :itemsFilter.sync="itemsFilter"
      :itemsDirections="itemsDirections"
      :itemsFlightCategories="itemsFlightCategories"
      :itemsAirlines="itemsAirlines"
      :itemsAirports="itemsAirports"
      :itemsOperationDays="itemsOperationDays"
      @refresh="refresh"
    ></filter-season>

    <!-- data table -->
    <v-card class="my-2 season-table-card">
      <v-card-actions class="season-table-toolbar">
        <div class="season-table-toolbar-copy">
          <div class="season-section-kicker">Flight Records</div>
          <div class="season-section-heading">Season flight list</div>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          fab
          color="primary"
          @click="generateDailySelected"
          :disabled="!seasonFlightIds.length"
        >
          <v-icon>mdi-auto-fix</v-icon>
        </v-btn>
        <v-btn
          fab
          color="error"
          @click="unGenerateDailySelected"
          :disabled="!seasonFlightIds.length"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <v-btn
          fab
          color="error"
          @click="removeSelected"
          :disabled="!seasonFlightIds.length"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn fab color="success" @click="add">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn fab color="info" @click="downloadImportTemplate">
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn fab color="accent" @click="addFile">
          <v-icon>mdi-paperclip-plus</v-icon>
        </v-btn>
      </v-card-actions>
      <!-- <v-divider></v-divider> -->
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
              <span class="season-mobile-label">Airline</span>
              <strong>{{
                item.Airline && item.Airline.name
                  ? item.Airline.name
                  : "-"
              }}</strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">Direction</span>
              <strong>
                {{
                  item.Direction && item.Direction.name
                    ? item.Direction.name
                    : "-"
                }}
              </strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">Sched. Dep.</span>
              <strong>{{ formatSeasonTime(item.std) }}</strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">Sched. Arr.</span>
              <strong>{{ formatSeasonTime(item.sta) }}</strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">Op. Days</span>
              <strong>{{ item.operation_days || "-" }}</strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">Valid From</span>
              <strong>{{ item.valid_from || "-" }}</strong>
            </div>
            <div class="season-mobile-field">
              <span class="season-mobile-label">Valid To</span>
              <strong>{{ item.valid_to || "-" }}</strong>
            </div>
          </div>

          <div class="season-mobile-meta">
            <v-chip color="success" v-if="item.is_active">Active</v-chip>
            <v-chip color="error" v-else>Inactive</v-chip>

            <v-btn
              v-if="!item.is_active"
              color="primary"
              small
              class="season-generate-btn"
              @click="generateDailyBySeasonId(item)"
              :disabled="isSeasonActionDisabled(item)"
            >
              <v-icon left small>mdi-auto-fix</v-icon>
              Generate
            </v-btn>
            <v-btn
              v-else
              color="error"
              small
              class="season-ungenerate-btn"
              @click="unGenerateDailyBySeasonId(item)"
            >
              <v-icon left small>mdi-close-circle-outline</v-icon>
              Ungenerate
            </v-btn>
          </div>

          <div class="season-mobile-actions">
            <v-btn
              color="secondary"
              fab
              x-small
              @click="view(item)"
              :disabled="isSeasonActionDisabled(item)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              :disabled="item.is_active"
              color="warning"
              fab
              x-small
              @click="edit(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              :disabled="item.is_active"
              color="error"
              fab
              x-small
              @click="remove(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-card>
      </div>

      <v-data-table
        v-else
        :headers="headers"
        :items="itemsSeasonFlights"
        :item-class="getSeasonRowClass"
        :search="search"
        mobile-breakpoint
        show-select
        item-key="season_flight_id"
        v-model="seasonFlightIds"
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
        <template v-slot:[`item.std`]="{ item }">
          {{ formatSeasonTime(item.std) }}
        </template>
        <template v-slot:[`item.sta`]="{ item }">
          {{ formatSeasonTime(item.sta) }}
        </template>
        <template v-slot:[`item.from_to`]="{ item }">
          <div class="season-fromto-cell">
            <span>{{
              item.Origin && item.Origin.iata_code ? item.Origin.iata_code : "-"
            }}</span>
            <v-icon small class="season-cell-icon">mdi-airplane</v-icon>
            <span>{{
              item.Destination && item.Destination.iata_code
                ? item.Destination.iata_code
                : "-"
            }}</span>
          </div>
        </template>
        <template v-slot:[`item.is_active`]="{ item }">
          <v-chip color="success" v-if="item.is_active">Active</v-chip>
          <v-chip color="error" v-else>Inactive</v-chip>
        </template>
        <template v-slot:[`item.generate_daily`]="{ item }">
          <v-btn
            v-if="!item.is_active"
            color="primary"
            block
            small
            class="season-generate-btn"
            @click="generateDailyBySeasonId(item)"
            :disabled="isSeasonActionDisabled(item)"
          >
            <v-icon left small>mdi-auto-fix</v-icon>
            Generate
          </v-btn>
          <v-btn
            v-else
            color="error"
            block
            small
            class="season-ungenerate-btn"
            @click="unGenerateDailyBySeasonId(item)"
          >
            <v-icon left small>mdi-close-circle-outline</v-icon>
            Ungenerate
          </v-btn>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            color="secondary"
            fab
            x-small
            @click="view(item)"
            :disabled="isSeasonActionDisabled(item)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            :disabled="item.is_active"
            color="warning"
            fab
            x-small
            @click="edit(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- dialog form -->
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      max-width="1120px"
      content-class="season-form-dialog"
      transition="season-form-slide-x-transition"
    >
      <form @submit.prevent="save">
        <v-card>
          <v-card-title primary-title>
            {{ formTitle }}
            <span
              v-if="item.direction_id != null"
              class="mx-2"
              style="color: red"
              >{{ directionName }}</span
            >
            Flight Season
            <v-spacer></v-spacer>

            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-card-title>
          <!-- <v-divider></v-divider> -->
          <v-card-text>
            <form-season-flight
              :item="item"
              :dialog="dialog"
              :itemsAirlines="itemsAirlines"
              :itemsAircraftTypes="itemsAircraftTypes"
              :itemsAirports="itemsAirports"
              :itemsDirections="itemsDirections"
              :itemsFlightCategories="itemsFlightCategories"
              :itemsTerminals="itemsTerminals"
              :itemsBelts="itemsBelts"
              :itemsGates="itemsGates"
              :itemsCounters="itemsCounters"
              :itemsOperationDays="itemsOperationDays"
            ></form-season-flight>
          </v-card-text>

          <!-- <v-divider></v-divider> -->
          <v-card-actions class="season-form-actions">
            <v-btn color="primary" block type="submit">
              <v-icon left>mdi-content-save</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>

    <!-- dialog view -->
    <v-dialog
      v-model="dialogView"
      max-width="1120px"
      persistent
      scrollable
      content-class="season-view-dialog"
      transition="season-view-slide-x-transition"
    >
      <v-card class="season-view-card">
        <v-card-title primary-title>
          <span
            v-if="item.direction_id != null"
            class="mx-2"
            style="color: red"
            >{{ directionName }}</span
          >
          Flight Season Detail
          <v-spacer></v-spacer>
          <v-icon @click="dialogView = false">mdi-close</v-icon>
        </v-card-title>
        <!-- <v-divider></v-divider> -->
        <v-card-text>
          <card-view-season-flight
            :season_flight_id="item.season_flight_id"
            :itemsCounters="itemsCounters"
            :dialog="dialogView"
          ></card-view-season-flight>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- dialog file -->
    <v-dialog v-model="dialogFile" max-width="500px" persistent scrollable>
      <form @submit.prevent="importFileSchedule">
        <v-card>
          <v-card-title primary-title>
            <span
              v-if="item.direction_id != null"
              class="mx-2"
              style="color: red"
              >{{ directionName }}</span
            >
            Import File Schedule
            <v-spacer></v-spacer>
            <v-icon @click="dialogFile = false">mdi-close</v-icon>
          </v-card-title>
          <!-- <v-divider></v-divider> -->
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    label="File Import"
                    v-model="file"
                    hide-details
                    accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    small-chips
                    required
                    outlined
                  >
                  </v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <!-- <v-divider></v-divider> -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn fab color="accent" type="submit">
              <v-icon>mdi-upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>

    <Overlay :overlay.sync="overlay"></Overlay>
  </div>
</template>

<script>
import CardViewSeasonFlight from "~/components/CardViewSeasonFlight.vue";
import FilterSeason from "~/components/FilterSeason.vue";
import FormSeasonFlight from "~/components/FormSeasonFlight.vue";
import Overlay from "~/components/Overlay.vue";
export default {
  components: { CardViewSeasonFlight, FormSeasonFlight, FilterSeason, Overlay },
  data() {
    return {
      overlay: false,
      dialog: false,
      dialogView: false,
      dialogFile: false,
      search: null,
      seasonFlightIds: [],
      headers: [
        { text: "#", value: "index", align: "center", sortable: false },
        { text: "Flight", value: "flight_no", align: "center" },
        { text: "From / To", value: "from_to", align: "center", sortable: false },
        {
          text: "Sched. Dep.",
          value: "std",
          align: "center",
        },
        {
          text: "Sched. Arr.",
          value: "sta",
          align: "center",
        },
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
      filterDebounce: null,
      suppressAutoFilter: false,

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
          item.Airline && item.Airline.name,
          item.Origin && item.Origin.iata_code,
          item.Destination && item.Destination.iata_code,
          item.Direction && item.Direction.name,
          item.FlightCategory && item.FlightCategory.name,
          item.operation_days,
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
    if (user.Role.name == "staff-airline") {
      this.$router.push("/");
    }
  },

  watch: {
    itemsFilter: {
      deep: true,
      handler() {
        if (this.suppressAutoFilter) {
          return;
        }
        this.scheduleRealtimeFilter();
      },
    },
  },

  async created() {
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

  beforeDestroy() {
    if (this.filterDebounce) {
      clearTimeout(this.filterDebounce);
    }
  },

  methods: {
    normalizeSeasonFlights(items) {
      const date = this.$moment().format("YYYY-MM-DD");
      return items.map((item) => {
        const seasonFlight = { ...item };
        seasonFlight.std = this.$moment
          .utc(`${date} ${seasonFlight.std}`, "YYYY-MM-DD HH:mm:ss")
          .local()
          .format("HH:mm");
        seasonFlight.sta = this.$moment
          .utc(`${date} ${seasonFlight.sta}`, "YYYY-MM-DD HH:mm:ss")
          .local()
          .format("HH:mm");
        return seasonFlight;
      });
    },
    matchesSelectedOperationDays(operationDays) {
      if (!this.itemsFilter.operation_days.length) {
        return true;
      }

      const flightDays = String(operationDays || "")
        .split(",")
        .map((day) => Number(String(day).trim()))
        .filter((day) => !Number.isNaN(day));

      return this.itemsFilter.operation_days.every((day) =>
        flightDays.includes(Number(day))
      );
    },
    matchesFlightNo(flightNo) {
      const query = String(this.itemsFilter.flight_no || "")
        .trim()
        .toLowerCase();

      if (!query) {
        return true;
      }

      return String(flightNo || "")
        .toLowerCase()
        .includes(query);
    },
    applySeasonClientFilters(items) {
      return items.filter(
        (item) =>
          this.matchesSelectedOperationDays(item.operation_days) &&
          this.matchesFlightNo(item.flight_no)
      );
    },
    scheduleRealtimeFilter() {
      if (this.filterDebounce) {
        clearTimeout(this.filterDebounce);
      }
      this.filterDebounce = setTimeout(() => {
        this.filterSeasonFlights();
      }, 350);
    },
    formatSeasonTime(value) {
      return value
        ? this.$moment(value, "HH:mm").local().format("hh:mm A")
        : "-";
    },
    isSeasonActionDisabled(item) {
      return (
        !item.airline_id ||
        !item.origin_airport_id ||
        !item.destination_airport_id ||
        !item.aircraft_type_id ||
        !item.terminal_id
      );
    },
    getSeasonRowClass(item) {
      return item && item.is_active ? "season-row-active" : "";
    },
    async importFileSchedule() {
      this.dialogFile = false;
      let formData = new FormData();
      formData.append("file", this.file);

      await this.$axios
        .post("/season-flights/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (res) => {
          await this.alertSuccess();
          await this.getSeasonFlights();
        })
        .catch((err) => {
          this.alertError();
        });
    },
    async generateDailyBySeasonId(item) {
      this.item = Object.assign({}, item);
      let season_flight_ids = [];
      season_flight_ids.push(this.item.season_flight_id);

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to generate this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.value) {
            this.overlay = true;
            await this.$axios
              .post("/season-flights/generate-daily", { season_flight_ids })
              .then((res) => {
                this.getSeasonFlights();
                this.alertSuccess();
              })
              .catch((err) => {
                this.alertError();
                return;
              });
            this.overlay = false;
          }
        });
    },
    async generateDailySelected() {
      const season_flight_ids = (this.seasonFlightIds || [])
        .map((entry) =>
          typeof entry === "object" && entry !== null
            ? entry.season_flight_id
            : entry
        )
        .filter(Boolean);

      if (!season_flight_ids.length) {
        return;
      }

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to generate selected flights!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.value) {
            this.overlay = true;
            await this.$axios
              .post("/season-flights/generate-daily", { season_flight_ids })
              .then(async () => {
                this.seasonFlightIds = [];
                await this.getSeasonFlights();
                await this.alertSuccess();
              })
              .catch(() => {
                this.alertError();
              });
            this.overlay = false;
          }
        });
    },
    async unGenerateDailySelected() {
      const season_flight_ids = (this.seasonFlightIds || [])
        .map((entry) =>
          typeof entry === "object" && entry !== null
            ? entry.season_flight_id
            : entry
        )
        .filter(Boolean);

      if (!season_flight_ids.length) {
        return;
      }

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to ungenerate selected flights!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.value) {
            this.overlay = true;
            await this.$axios
              .post("/season-flights/ungenerate-daily", { season_flight_ids })
              .then(async () => {
                this.seasonFlightIds = [];
                await this.getSeasonFlights();
                await this.alertSuccess();
              })
              .catch(() => {
                this.alertError();
              });
            this.overlay = false;
          }
        });
    },
    async removeSelected() {
      const season_flight_ids = (this.seasonFlightIds || [])
        .map((entry) =>
          typeof entry === "object" && entry !== null
            ? entry.season_flight_id
            : entry
        )
        .filter(Boolean);

      if (!season_flight_ids.length) {
        return;
      }

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to delete selected flights!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.value) {
            this.overlay = true;
            const deletePromises = season_flight_ids.map((id) =>
              this.$axios.delete("/season-flights/" + id)
            );
            await Promise.all(deletePromises)
              .then(async () => {
                this.seasonFlightIds = [];
                await this.getSeasonFlights();
                await this.alertSuccess();
              })
              .catch(() => {
                this.alertError();
              });
            this.overlay = false;
          }
        });
    },
    async unGenerateDailyBySeasonId(item) {
      this.item = Object.assign({}, item);
      let season_flight_ids = [];
      season_flight_ids.push(this.item.season_flight_id);

      this.$swal
        .fire({
          title: "Are you sure?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.value) {
            this.removeConfirm(season_flight_ids);
          }
        });
    },

    async removeConfirm(ids) {
      this.$swal
        .fire({
          title: "Confirm?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.value) {
            this.overlay = true;
            await this.$axios
              .post("/season-flights/ungenerate-daily", {
                season_flight_ids: ids,
              })
              .then((res) => {
                this.getSeasonFlights();
                this.alertSuccess();
              })
              .catch((err) => {
                this.alertError();
                return;
              });
            this.overlay = false;
          }
        });
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
    async getSeasonFlights() {
      this.overlay = true;
      this.itemsSeasonFlights = await this.$axios
        .get("/season-flights")
        .then((res) => {
          return this.normalizeSeasonFlights(res.data);
        })
        .catch((err) => {
          return [];
        });
      this.overlay = false;
    },
    async formatToAmPm(timeStr) {
      return await this.$moment(timeStr, "HH:mm:ss").format("hh:mm A");
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
              .delete("/season-flights/" + this.item.season_flight_id)
              .then((res) => {
                this.alertSuccess();
                this.getSeasonFlights();
              })
              .catch((err) => {
                this.alertError();
              });
          }
        });
    },
    async downloadImportTemplate() {
      this.overlay = true;
      await this.$axios
        .get("/season-flights/import-template", {
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data], {
            type:
              res.headers["content-type"] ||
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          const disposition = res.headers["content-disposition"] || "";
          const matchedName = disposition.match(/filename="?([^"]+)"?/i);
          const fileName = matchedName
            ? matchedName[1]
            : "season-flight-import-template.xlsx";

          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(() => {
          this.alertError();
        });
      this.overlay = false;
    },

    async filterSeasonFlights() {
      const payload = {
        ...this.itemsFilter,
        operation_days: [],
        flight_no: "",
      };
      this.itemsSeasonFlights = await this.$axios
        .post("/filters/season-flights", payload)
        .then((res) => {
          const seasonFlights = this.normalizeSeasonFlights(res.data);
          return this.applySeasonClientFilters(seasonFlights);
        })
        .catch((err) => {
          return [];
        });
    },
    async refresh() {
      this.suppressAutoFilter = true;
      this.itemsFilter.direction_id = null;
      this.itemsFilter.flight_category_id = null;
      this.itemsFilter.flight_no = "";
      this.itemsFilter.airline_id = null;
      this.itemsFilter.origin_airport_id = null;
      this.itemsFilter.destination_airport_id = null;
      this.itemsFilter.operation_days = [];

      this.itemsSelected = [];

      await this.getSeasonFlights();
      this.$nextTick(() => {
        this.suppressAutoFilter = false;
      });
    },
    async save() {
      this.dialog = false;

      let res = false;
      if (this.item.season_flight_id) {
        res = await this.update();
      } else {
        res = await this.create();
      }

      if (!res) {
        this.alertError();
        return;
      }

      await this.alertSuccess();
      await this.getSeasonFlights();
    },

    async create() {
      let item = await this.$axios
        .post("/season-flights", this.item)
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
        .put("/season-flights/" + this.item.season_flight_id, this.item)
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
      this.item.sta = this.$moment(this.item.sta, "hh:mm A").format("HH:mm");
      this.item.std = this.$moment(this.item.std, "hh:mm A").format("HH:mm");

      this.dialog = true;
    },

    async add() {
      this.dialog = true;

      this.item.season_flight_id = null;
      this.item.origin_airport_id = null;
      this.item.destination_airport_id = null;
      this.item.airline_id = null;
      this.item.aircraft_type_id = null;
      this.item.direction_id = null;
      this.item.flight_category_id = null;
      this.item.terminal_id = null;
      this.item.belt_id = null;
      this.item.gate_id = null;
      this.item.counters = [];
      this.item.flight_no = "";
      this.item.valid_from = "";
      this.item.valid_to = "";
      this.item.std = "";
      this.item.sta = "";
      this.item.operation_days = [];
      this.item.is_import = false;
      this.item.remark = "";
      this.item.is_active = false;
    },

    async addFile() {
      this.dialogFile = true;
      this.file = null;
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
.season-view-slide-x-transition-enter-active,
.season-view-slide-x-transition-leave-active {
  transition: opacity 0.24s ease, transform 0.28s ease;
}

.season-view-slide-x-transition-enter,
.season-view-slide-x-transition-leave-to {
  opacity: 0;
  transform: translateX(56px);
}

.season-form-slide-x-transition-enter-active,
.season-form-slide-x-transition-leave-active {
  transition: opacity 0.24s ease, transform 0.28s ease;
}

.season-form-slide-x-transition-enter,
.season-form-slide-x-transition-leave-to {
  opacity: 0;
  transform: translateX(56px);
}

.season-form-actions {
  padding: 16px 24px 24px;
}

:deep(.season-form-dialog) {
  margin: 0 0 0 auto !important;
  min-height: 100vh;
  max-height: 100vh;
  border-radius: 0 !important;
  overflow: hidden;
}

:deep(.season-form-dialog > .v-card) {
  min-height: 100vh;
  border-radius: 0 !important;
}

:deep(.season-view-dialog) {
  margin: 0 0 0 auto !important;
  min-height: 100vh;
  max-height: 100vh;
  border-radius: 0 !important;
  overflow: hidden;
}

:deep(.season-view-dialog > .v-card) {
  min-height: 100vh;
  border-radius: 0 !important;
}

.season-view-card {
  background: var(--surface-1) !important;
}

.season-form-card {
  transition: background-color 0.24s ease, color 0.24s ease,
    border-color 0.24s ease;
}

.season-form-card--dark {
  background: #121712 !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  color: #f3f6ef !important;
}

.season-form-card--dark :deep(.v-card__title) {
  color: #f3f6ef !important;
}

.season-form-card--dark :deep(.v-card__text) {
  color: rgba(243, 246, 239, 0.9) !important;
}

.season-form-card--dark :deep(.v-divider) {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.season-form-actions.season-form-card--dark {
  background: #121712;
}

.season-form-card--light {
  background: #ffffff !important;
  border-color: #d8e2cf !important;
  color: #0d110f !important;
}

.season-form-card--light :deep(.v-card__title) {
  color: #0d110f !important;
}

.season-form-card--light :deep(.v-card__text) {
  color: #253021 !important;
}

.season-form-card--light :deep(.v-divider) {
  border-color: #d8e2cf !important;
}

.season-form-actions.season-form-card--light {
  background: #ffffff;
}

.season-page {
  display: grid;
  gap: 12px;
}

.season-page-header,
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

.season-generate-btn,
.season-ungenerate-btn {
  font-weight: 800 !important;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.season-generate-btn .v-icon,
.season-ungenerate-btn .v-icon {
  color: inherit !important;
}

.app-theme-light .season-generate-btn.v-btn {
  color: #ffffff !important;
  border-color: #7fae32 !important;
  background: linear-gradient(180deg, #88b83a 0%, #6d9a27 100%) !important;
  box-shadow: 0 8px 18px rgba(127, 174, 50, 0.18) !important;
}

.app-theme-light .season-generate-btn.v-btn:hover {
  background: linear-gradient(180deg, #7aa92f 0%, #628d21 100%) !important;
}

.app-theme-light .season-ungenerate-btn.v-btn {
  color: #9e3c3c !important;
  border-color: #e7bbbb !important;
  background: linear-gradient(180deg, #fff7f7 0%, #fde9e9 100%) !important;
  box-shadow: 0 8px 18px rgba(201, 75, 75, 0.08) !important;
}

.app-theme-light .season-ungenerate-btn.v-btn:hover {
  background: linear-gradient(180deg, #fff0f0 0%, #f8dddd 100%) !important;
}

.app-theme-dark .season-generate-btn.v-btn {
  color: #ffffff !important;
  border-color: #3b82f6 !important;
  background: linear-gradient(
    180deg,
    rgba(59, 130, 246, 0.96) 0%,
    rgba(29, 78, 216, 0.98) 100%
  ) !important;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.26) !important;
}

.app-theme-dark .season-generate-btn.v-btn:hover {
  background: linear-gradient(
    180deg,
    rgba(96, 165, 250, 0.98) 0%,
    rgba(37, 99, 235, 1) 100%
  ) !important;
}

.app-theme-dark .season-ungenerate-btn.v-btn {
  color: #ffffff !important;
  border-color: #f59e0b !important;
  background: linear-gradient(
    180deg,
    rgba(249, 115, 22, 0.96) 0%,
    rgba(234, 88, 12, 0.99) 100%
  ) !important;
  box-shadow: 0 10px 24px rgba(249, 115, 22, 0.24) !important;
}

.app-theme-dark .season-ungenerate-btn.v-btn:hover {
  background: linear-gradient(
    180deg,
    rgba(251, 146, 60, 0.98) 0%,
    rgba(245, 158, 11, 0.98) 100%
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

.season-mobile-logo {
  width: 100px;
  flex: 0 0 100px;
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

@media (max-width: 600px) {
  :deep(.season-form-dialog) {
    max-width: 100vw !important;
    width: 100vw !important;
  }

  :deep(.season-view-dialog) {
    max-width: 100vw !important;
    width: 100vw !important;
  }

  .season-table-toolbar {
    gap: 10px;
  }

  .season-table-toolbar {
    flex-wrap: wrap;
  }

  .season-mobile-top,
  .season-mobile-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .season-mobile-logo {
    width: 100%;
    flex: none;
  }

  .season-mobile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
