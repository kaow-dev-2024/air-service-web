<template>
  <div>
    <!-- fliters -->
    <v-card class="my-2 daily-filter-card">
      <v-card-title class="filter-card-title">
        <div class="filter-card-title-content">
          <div class="filter-card-kicker">Filter Panel</div>
          <div class="filter-card-heading">
            <v-icon large class="mr-2 filter-card-heading-icon">
              mdi-calendar-clock</v-icon
            >
            Daily Flight Filters
          </div>
        </div>
        <div class="filter-card-title-note">
          Auto updates when fields change
        </div>
      </v-card-title>
      <v-card-text class="filter-card-body">
        <div class="filter-section">
          <div class="filter-group-label">Date Range</div>
          <v-row dense class="filter-row">
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-text-field
                dense
                label="Start Date"
                type="date"
                v-model="itemsFilter.startDate"
                hide-details
                required
                clearable
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-text-field
                dense
                label="End Date"
                type="date"
                v-model="itemsFilter.endDate"
                hide-details
                required
                clearable
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <div class="filter-section">
          <div class="filter-group-label">Flight Info</div>
          <v-row dense class="filter-row">
            <v-col cols="12" sm="6" md="4" lg="2">
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
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
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
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field
                dense
                v-model="itemsFilter.flight_no"
                label="Flight No"
                hide-details
                clearable
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-autocomplete
                dense
                :items="itemsAirlines"
                item-text="iata_code"
                item-value="airline_id"
                v-model="itemsFilter.airline_id"
                label="Airline"
                hide-details
                clearable
                outlined
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
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
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
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
              ></v-autocomplete>
            </v-col>
          </v-row>
        </div>

        <div class="filter-section">
          <div class="filter-group-label">Schedule</div>
          <v-row dense class="filter-row">
            <v-col cols="12" lg="12">
              <div class="weekday-checkbox-group">
                <label
                  v-for="day in itemsOperationDays"
                  :key="day.operation_day_id"
                  class="weekday-checkbox-item"
                  :class="{
                    'weekday-checkbox-item--active':
                      isDailyOperationDaySelected(day.operation_day_id),
                  }"
                >
                  <v-checkbox
                    :input-value="
                      isDailyOperationDaySelected(day.operation_day_id)
                    "
                    :label="day.name"
                    hide-details
                    dense
                    class="weekday-checkbox"
                    @change="toggleDailyOperationDay(day.operation_day_id)"
                  ></v-checkbox>
                </label>
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="filter-section">
          <div class="filter-group-label">Schedule</div>
          <v-row dense class="filter-row">
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-autocomplete
                dense
                :items="itemsFlightStatus"
                item-text="name"
                item-value="flight_status_id"
                v-model="itemsFilter.flight_status_id"
                label="Flight Status"
                hide-details
                clearable
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <v-card-actions class="filter-card-actions">
        <v-btn color="info" @click="refresh" title="Reset" aria-label="Reset">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- data table -->
    <v-card class="my-2 daily-table-card">
      <v-card-title primary-title>
        <div class="daily-table-toolbar-copy">
          <div class="daily-section-kicker">Flight Records</div>
          <div class="daily-section-heading">Daily flight list</div>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          fab
          color="success"
          class="mr-2"
          data-tooltip="Active Selected"
          :disabled="!dailyFlightIds.length"
          @click="setActiveSelected"
        >
          <v-icon>mdi-check-circle</v-icon>
        </v-btn>
        <v-btn
          fab
          color="grey darken-1"
          class="mr-2"
          data-tooltip="Inactive Selected"
          :disabled="!dailyFlightIds.length"
          @click="setInactiveSelected"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          fab
          color="warning"
          class="mr-2"
          data-tooltip="Force Selected"
          :disabled="!dailyFlightIds.length"
          @click="setForceSelected"
        >
          <v-icon>mdi-lightning-bolt</v-icon>
        </v-btn>
        <v-btn
          fab
          color="blue-grey darken-1"
          class="mr-2"
          data-tooltip="Unforce Selected"
          :disabled="!dailyFlightIds.length"
          @click="setUnforceSelected"
        >
          <v-icon>mdi-lightning-bolt-off</v-icon>
        </v-btn>
        <v-btn
          fab
          color="error"
          class="mr-2"
          data-tooltip="Delete Selected"
          :disabled="!dailyFlightIds.length"
          @click="deleteSelected"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn fab color="success" class="float-right" @click="add">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        class="daily-premium-table"
        :headers="headers"
        :items="itemsDailyFlights"
        :item-class="getDailyRowClass"
        :search="search"
        :mobile-breakpoint="960"
        :items-per-page="-1"
        show-select
        item-key="daily_flight_id"
        v-model="dailyFlightIds"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.std`]="{ item }">
          <div class="premium-time-cell">
            <v-icon small class="premium-cell-icon">mdi-clock-outline</v-icon>
            <span>{{ formatRouteTime(item.std) }}</span>
          </div>
        </template>
        <template v-slot:[`item.sta`]="{ item }">
          <div class="premium-time-cell">
            <v-icon small class="premium-cell-icon">mdi-clock-outline</v-icon>
            <span>{{ formatRouteTime(item.sta) }}</span>
          </div>
        </template>
        <template v-slot:[`item.flight_no`]="{ item }">
          <div class="premium-flight-cell">
            <v-avatar size="24" class="premium-airline-logo">
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
          <div class="premium-fromto-cell">
            <span>{{
              item.OriginDaily && item.OriginDaily.iata_code
                ? item.OriginDaily.iata_code
                : "-"
            }}</span>
            <v-icon small class="premium-cell-icon">mdi-airplane</v-icon>
            <span>{{
              item.DestinationDaily && item.DestinationDaily.iata_code
                ? item.DestinationDaily.iata_code
                : "-"
            }}</span>
          </div>
        </template>
        <template v-slot:[`item.Terminal.name`]="{ item }">
          <div class="premium-badge-cell">
            <span>{{
              item.Terminal && item.Terminal.name ? item.Terminal.name : "-"
            }}</span>
          </div>
        </template>
        <template v-slot:[`item.is_active`]="{ item }">
          <div class="daily-active-switch">
            <v-switch
              inset
              color="success"
              v-model="item.is_active"
              @click="actived(item)"
            ></v-switch>
          </div>
        </template>
        <template v-slot:[`item.force`]="{ item }">
          <div class="daily-force-switch">
            <v-switch
              inset
              color="warning"
              :input-value="resolveForceValue(item)"
              @change="forced(item, $event)"
            ></v-switch>
          </div>
        </template>
        <template v-slot:[`item.counters`]="{ item }">
          <div class="premium-badge-cell">
            <span>{{ formatCounters(item.counters) }}</span>
          </div>
        </template>
        <template v-slot:[`item.Gate.name`]="{ item }">
          <div class="premium-badge-cell">
            <span>{{
              item.Gate && item.Gate.name ? item.Gate.name : "-"
            }}</span>
          </div>
        </template>
        <template v-slot:[`item.Belt.name`]="{ item }">
          <div class="premium-badge-cell">
            <span>{{
              item.Belt && item.Belt.name ? item.Belt.name : "-"
            }}</span>
          </div>
        </template>
        <template v-slot:[`item.etd`]="{ item }">
          {{ $moment(item.etd, "HH:mm:ss").format("hh:mm A") }}
        </template>
        <template v-slot:[`item.eta`]="{ item }">
          {{ $moment(item.eta, "HH:mm:ss").format("hh:mm A") }}
        </template>
        <template v-slot:[`item.atd`]="{ item }">
          {{ $moment(item.atd, "HH:mm:ss").format("hh:mm A") }}
        </template>
        <template v-slot:[`item.ata`]="{ item }">
          {{ $moment(item.ata, "HH:mm:ss").format("hh:mm A") }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            class="premium-status-chip"
            :color="getColorByStatus(item)"
            dark
            >{{ item.FlightStatus.name }}</v-chip
          >
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="secondary" fab x-small @click="view(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn color="warning" fab x-small @click="edit(item)">
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
      max-width="1200"
      content-class="daily-form-dialog"
      transition="daily-form-slide-x-transition"
    >
      <form @submit.prevent="save">
        <v-card class="daily-form-card">
          <v-card-title primary-title>
            {{ formTitle }}
            <span
              v-if="item.direction_id != null"
              class="mx-2 daily-dialog-direction"
              >{{ directionName }}</span
            >
            Flight Daily
            <v-spacer></v-spacer>
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <form-daily-flight
              :item.sync="item"
              :dialog.sync="dialog"
              :itemsAirlines.sync="itemsAirlines"
              :itemsAircraftTypes.sync="itemsAircraftTypes"
              :itemsAirports.sync="itemsAirports"
              :itemsDirections.sync="itemsDirections"
              :itemsFlightCategories.sync="itemsFlightCategories"
              :itemsTerminals.sync="itemsTerminals"
              :itemsBelts.sync="itemsBelts"
              :itemsGates.sync="itemsGates"
              :itemsCounters.sync="itemsCounters"
              :itemsOperationDays.sync="itemsOperationDays"
              :itemsFlightStatus.sync="itemsFlightStatus"
              :itemsFlightStatusArrival.sync="itemsFlightStatusArrival"
              :itemsFlightStatusDeparture.sync="itemsFlightStatusDeparture"
            ></form-daily-flight>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="daily-form-actions">
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
      max-width="1100"
      persistent
      scrollable
      content-class="daily-view-dialog"
      transition="daily-view-slide-x-transition"
    >
      <v-card class="daily-view-card">
        <v-card-title primary-title>
          <span
            v-if="item.direction_id != null"
            class="mx-2 daily-dialog-direction"
            >{{ directionName }}</span
          >
          Flight Daily Detail
          <v-spacer></v-spacer>
          <v-icon @click="dialogView = false">mdi-close</v-icon>
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <card-view-daily-flight
            :item="item"
            :itemsCounters="itemsCounters"
            :dialog="dialogView"
          ></card-view-daily-flight>
        </v-card-text>
      </v-card>
    </v-dialog>

    <Overlay :overlay.sync="overlay"></Overlay>
  </div>
</template>

<script>
import CardViewDailyFlight from "~/components/CardViewDailyFlight.vue";
import FormDailyFlight from "~/components/FormDailyFlight.vue";
import Overlay from "~/components/Overlay.vue";
export default {
  components: { CardViewDailyFlight, FormDailyFlight, Overlay },
  data() {
    return {
      overlay: false,
      dialog: false,
      dialogView: false,
      search: null,
      dailyFlightIds: [],
      headers: [
        { text: "#", value: "index", align: "center", sortable: false },
        { text: "Dep. Time", value: "std", align: "center" },
        { text: "Arr. Time", value: "sta", align: "center" },
        { text: "Flight", value: "flight_no", align: "center" },
        {
          text: "From / To",
          value: "from_to",
          align: "center",
          sortable: false,
        },
        { text: "Terminal", value: "Terminal.name", align: "center" },
        { text: "Couter", value: "counters", align: "center", sortable: false },
        { text: "Gate", value: "Gate.name", align: "center" },
        { text: "Belt", value: "Belt.name", align: "center" },
        {
          text: "Active",
          value: "is_active",
          align: "center",
          sortable: false,
        },
        { text: "Force", value: "force", align: "center", sortable: false },
        {
          text: "STATUS",
          value: "status",
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
        flight_status_id: null,
        operation_days: [],
        startDate: this.$moment().format("YYYY-MM-DD"),
        endDate: this.$moment().format("YYYY-MM-DD"),
      },
      itemsFlightStatus: [],
      itemsFlightStatusArrival: [],
      itemsFlightStatusDeparture: [],
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
      itemsDailyFlights: [],
      itemsDailyFlight: [],
      filterDebounce: null,
      suppressAutoFilter: false,

      item: {
        daily_flight_id: null,
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
        flight_status_id: null,
        flight_no: "",
        flight_date: "",
        sta: "",
        std: "",
        eta: "",
        etd: "",
        ata: null,
        atd: null,
        operation_day: null,
        remark: null,
        is_active: true,
        force: false,
        is_force: false,
        is_code_share: false,
        code_shares: [],
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
        OriginDaily: {
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
        DestinationDaily: {
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
          seat_capacity: null,
          range_km: null,
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
        FlightStatus: {
          flight_status_id: null,
          name: "",
          is_arrival: true,
          is_departure: true,
          remark: "",
          is_active: true,
        },
        SeasonFlight: {
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
          is_active: true,
        },
      },
    };
  },

  watch: {
    dialog(val) {
      if (!val) {
        this.filterDailyFlights();
      }
    },
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

  computed: {
    formTitle() {
      return this.item.daily_flight_id === null ? "CREATE" : "UPDATE";
    },
    disabledByItemsSelected() {
      let isDisabled = true;
      if (!this.itemsSelected.length) {
        isDisabled = true;
      } else {
        isDisabled = false;
      }
      return isDisabled;
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
    await this.getFlightStatus();
    await this.refresh();
    // await this.getDailyFlights();
  },

  beforeDestroy() {
    if (this.filterDebounce) {
      clearTimeout(this.filterDebounce);
    }
  },

  methods: {
    formatCounters(counters) {
      if (!counters) {
        return "-";
      }

      if (Array.isArray(counters)) {
        const labels = counters
          .map((counter) => {
            if (typeof counter === "string") {
              return counter;
            }
            if (typeof counter === "number") {
              const matched = this.itemsCounters.find(
                (item) => Number(item.counter_id) === Number(counter)
              );
              return matched ? matched.name : String(counter);
            }
            if (counter && counter.name) {
              return counter.name;
            }
            if (counter && counter.counter_id) {
              const matched = this.itemsCounters.find(
                (item) => Number(item.counter_id) === Number(counter.counter_id)
              );
              return matched ? matched.name : String(counter.counter_id);
            }
            return "";
          })
          .filter(Boolean);
        return labels.length ? labels.join(", ") : "-";
      }

      if (typeof counters === "string") {
        const chunks = counters
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
        if (!chunks.length) {
          return "-";
        }
        const labels = chunks.map((chunk) => {
          const matched = this.itemsCounters.find(
            (item) =>
              String(item.counter_id) === chunk || String(item.name) === chunk
          );
          return matched ? matched.name : chunk;
        });
        return labels.join(", ");
      }

      if (typeof counters === "object" && counters.name) {
        return counters.name;
      }

      return "-";
    },
    getDailyRowClass(item) {
      return item && item.is_active ? "premium-row-active" : "";
    },
    formatRouteTime(value) {
      if (!value) {
        return "-";
      }
      const format = String(value).length > 5 ? "HH:mm:ss" : "HH:mm";
      return this.$moment(value, format).format("hh:mm A");
    },
    setForceValue(targetItem, forceValue) {
      const normalizedForceValue = Boolean(forceValue);
      targetItem.force = normalizedForceValue;
      targetItem.is_force = normalizedForceValue;
    },
    resolveForceValue(item) {
      return Boolean(item && (item.force ?? item.is_force));
    },
    normalizeDailyFlights(items) {
      return items.map((item) => {
        const dailyFlight = { ...item };
        const hasForceValue =
          Object.prototype.hasOwnProperty.call(dailyFlight, "force") ||
          Object.prototype.hasOwnProperty.call(dailyFlight, "is_force");
        const forceValue = hasForceValue
          ? this.resolveForceValue(dailyFlight)
          : false;
        dailyFlight.force = forceValue;
        dailyFlight.is_force = forceValue;
        dailyFlight.std = this.$moment
          .utc(dailyFlight.std, "HH:mm:ss")
          .local()
          .format("HH:mm");
        dailyFlight.sta = this.$moment
          .utc(dailyFlight.sta, "HH:mm:ss")
          .local()
          .format("HH:mm");
        dailyFlight.etd = this.$moment
          .utc(dailyFlight.etd, "HH:mm:ss")
          .local()
          .format("HH:mm");
        dailyFlight.eta = this.$moment
          .utc(dailyFlight.eta, "HH:mm:ss")
          .local()
          .format("HH:mm");
        dailyFlight.atd = this.$moment
          .utc(dailyFlight.atd, "HH:mm:ss")
          .local()
          .format("HH:mm");
        dailyFlight.ata = this.$moment
          .utc(dailyFlight.ata, "HH:mm:ss")
          .local()
          .format("HH:mm");
        return dailyFlight;
      });
    },
    matchesDailyFlightNo(flightNo) {
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
    matchesDailyOperationDay(operationDay) {
      if (!this.itemsFilter.operation_days.length) {
        return true;
      }

      return this.itemsFilter.operation_days.includes(Number(operationDay));
    },
    applyDailyClientFilters(items) {
      return items.filter(
        (item) =>
          this.matchesDailyFlightNo(item.flight_no) &&
          this.matchesDailyOperationDay(item.operation_day)
      );
    },
    isDailyOperationDaySelected(dayId) {
      return this.itemsFilter.operation_days.includes(dayId);
    },
    toggleDailyOperationDay(dayId) {
      const selectedDays = [...this.itemsFilter.operation_days];
      const existingIndex = selectedDays.indexOf(dayId);

      if (existingIndex >= 0) {
        selectedDays.splice(existingIndex, 1);
      } else {
        selectedDays.push(dayId);
      }

      this.itemsFilter.operation_days = selectedDays;
    },
    scheduleRealtimeFilter() {
      if (this.filterDebounce) {
        clearTimeout(this.filterDebounce);
      }
      this.filterDebounce = setTimeout(() => {
        if (!this.itemsFilter.startDate || !this.itemsFilter.endDate) {
          return;
        }
        this.filterDailyFlights();
      }, 350);
    },
    async actived(item) {
      this.item = Object.assign({}, item);

      await this.$axios
        .put("/daily-flights/active/" + this.item.daily_flight_id, {
          is_active: this.item.is_active,
        })
        .then(async (res) => {
          await this.filterDailyFlights();
          await this.alertSuccess();
        })
        .catch((err) => {
          this.alertError();
        });
    },
    getSelectedDailyFlightIds() {
      return (this.dailyFlightIds || [])
        .map((entry) =>
          typeof entry === "object" && entry !== null
            ? entry.daily_flight_id
            : entry
        )
        .filter(Boolean);
    },
    async setActiveSelected() {
      const ids = this.getSelectedDailyFlightIds();
      if (!ids.length) {
        return;
      }

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to active selected flights!",
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
            await Promise.all(
              ids.map((id) =>
                this.$axios.put("/daily-flights/active/" + id, {
                  is_active: true,
                })
              )
            )
              .then(async () => {
                this.dailyFlightIds = [];
                await this.filterDailyFlights();
                await this.alertSuccess();
              })
              .catch(() => {
                this.alertError();
              });
            this.overlay = false;
          }
        });
    },
    async setInactiveSelected() {
      const ids = this.getSelectedDailyFlightIds();
      if (!ids.length) {
        return;
      }

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to inactive selected flights!",
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
            await Promise.all(
              ids.map((id) =>
                this.$axios.put("/daily-flights/active/" + id, {
                  is_active: false,
                })
              )
            )
              .then(async () => {
                this.dailyFlightIds = [];
                await this.filterDailyFlights();
                await this.alertSuccess();
              })
              .catch(() => {
                this.alertError();
              });
            this.overlay = false;
          }
        });
    },
    async forced(item, value) {
      const previousValue = this.resolveForceValue(item);
      const forceValue = Boolean(value);
      this.setForceValue(item, forceValue);

      await this.$axios
        .put("/daily-flights/force/" + item.daily_flight_id, {
          force: forceValue,
          is_force: forceValue,
        })
        .then(async (res) => {
          await this.filterDailyFlights();
          await this.alertSuccess();
        })
        .catch((err) => {
          this.setForceValue(item, previousValue);
          this.alertError();
        });
    },
    async setForceSelected() {
      const ids = this.getSelectedDailyFlightIds();
      if (!ids.length) {
        return;
      }

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to force selected flights!",
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
            await Promise.all(
              ids.map((id) =>
                this.$axios.put("/daily-flights/force/" + id, {
                  force: true,
                  is_force: true,
                })
              )
            )
              .then(async () => {
                this.dailyFlightIds = [];
                await this.filterDailyFlights();
                await this.alertSuccess();
              })
              .catch(() => {
                this.alertError();
              });
            this.overlay = false;
          }
        });
    },
    async setUnforceSelected() {
      const ids = this.getSelectedDailyFlightIds();
      if (!ids.length) {
        return;
      }

      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to unforce selected flights!",
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
            await Promise.all(
              ids.map((id) =>
                this.$axios.put("/daily-flights/force/" + id, {
                  force: false,
                  is_force: false,
                })
              )
            )
              .then(async () => {
                this.dailyFlightIds = [];
                await this.filterDailyFlights();
                await this.alertSuccess();
              })
              .catch(() => {
                this.alertError();
              });
            this.overlay = false;
          }
        });
    },
    getColorByStatus(item) {
      let color = "";
      if (item.FlightStatus.name === "Scheduled") {
        color = "#25459f";
      } else if (item.FlightStatus.name === "Check-in") {
        color = "#3a78fc";
      } else if (item.FlightStatus.name === "Boarding") {
        color = "#377c34";
      } else if (item.FlightStatus.name === "Gate Open") {
        color = "#41c460";
      } else if (item.FlightStatus.name === "Gate Closing") {
        color = "#212937";
      } else if (item.FlightStatus.name === "Departed") {
        color = "#757575";
      } else if (item.FlightStatus.name === "Arrived") {
        color = "#377c34";
      } else if (item.FlightStatus.name === "Delayed") {
        color = "#f4c135";
      } else if (item.FlightStatus.name === "Cancelled") {
        color = "#d3332e";
      } else if (item.FlightStatus.name === "Final Call") {
        color = "#e17329";
      } else if (item.FlightStatus.name === "Last Call") {
        color = "#e17329";
      } else if (item.FlightStatus.name === "Gate Change") {
        color = "#8e5bf4";
      }

      return color;
    },

    async getFlightStatus() {
      this.itemsFlightStatus = await this.$axios
        .get("/flight-status")
        .then((res) => {
          const items = res.data.filter((item) => item.is_active == true);

          this.itemsFlightStatusArrival = items.filter(
            (status) => status.is_arrival == true
          );
          this.itemsFlightStatusDeparture = items.filter(
            (status) => status.is_departure == true
          );

          return items;
        })
        .catch((err) => {
          return [];
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
    async getDailyFlights() {
      this.itemsDailyFlights = await this.$axios
        .get("/daily-flights")
        .then((res) => {
          return this.normalizeDailyFlights(res.data);
        })
        .catch((err) => {
          return [];
        });
    },
    async formatToAmPm(timeStr) {
      return await this.$moment(timeStr, "HH:mm:ss").format("hh:mm A");
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
              .delete("/daily-flights/" + this.item.daily_flight_id)
              .then((res) => {
                this.alertSuccess();
                this.filterDailyFlights();
              })
              .catch((err) => {
                this.alertError();
              });
          }
        });
    },
    async deleteSelected() {
      const ids = this.getSelectedDailyFlightIds();
      if (!ids.length) {
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
            await Promise.all(
              ids.map((id) => this.$axios.delete("/daily-flights/" + id))
            )
              .then(async () => {
                this.dailyFlightIds = [];
                await this.filterDailyFlights();
                await this.alertSuccess();
              })
              .catch(() => {
                this.alertError();
              });
            this.overlay = false;
          }
        });
    },
    async filterDailyFlights() {
      const payload = {
        ...this.itemsFilter,
        flight_no: "",
        operation_days: [],
      };
      this.overlay = true;
      this.itemsDailyFlights = await this.$axios
        .post("/filters/daily-flights", payload)
        .then((res) => {
          const dailyFlights = this.normalizeDailyFlights(res.data);
          return this.applyDailyClientFilters(dailyFlights);
        })
        .catch((err) => {
          return [];
        });
      this.overlay = false;
    },
    async refresh() {
      this.suppressAutoFilter = true;
      this.itemsFilter.direction_id = null;
      this.itemsFilter.flight_category_id = null;
      this.itemsFilter.flight_no = "";
      this.itemsFilter.airline_id = null;
      this.itemsFilter.origin_airport_id = null;
      this.itemsFilter.destination_airport_id = null;
      this.itemsFilter.flight_status_id = null;
      this.itemsFilter.operation_days = [];
      this.itemsFilter.startDate = this.$moment().format("YYYY-MM-DD");
      this.itemsFilter.endDate = this.$moment().format("YYYY-MM-DD");

      this.itemsSelected = [];
      this.dailyFlightIds = [];

      await this.filterDailyFlights();
      this.$nextTick(() => {
        this.suppressAutoFilter = false;
      });
    },
    async save() {
      if (!this.item.atd) {
        this.item.atd = null;
      }
      if (!this.item.ata) {
        this.item.ata = null;
      }

      const isoDay = this.$moment(this.item.flight_date).isoWeekday();
      this.item.operation_day = isoDay;

      this.dialog = false;

      if (!this.item.daily_flight_id) {
        this.create();
      } else {
        this.update();
      }
    },

    async create() {
      await this.$axios
        .post("/daily-flights", this.item)
        .then(async (res) => {
          await this.filterDailyFlights();
          await this.alertSuccess();
        })
        .catch((err) => {
          this.alertError();
        });
    },

    async update() {
      await this.$axios
        .put("/daily-flights/" + this.item.daily_flight_id, this.item)
        .then(async (res) => {
          await this.filterDailyFlights();
          await this.alertSuccess();
        })
        .catch((err) => {
          this.alertError();
        });
    },

    async edit(item) {
      this.item = Object.assign({}, item);
      if (this.item.atd == "Invalid date") {
        this.item.atd = null;
      }
      if (this.item.ata == "Invalid date") {
        this.item.ata = null;
      }

      // this.item.sta = this.$moment(this.item.sta, "hh:mm A").format("HH:mm");
      // this.item.std = this.$moment(this.item.std, "hh:mm A").format("HH:mm");
      this.dialog = true;
    },

    async add() {
      this.dialog = true;

      this.item.daily_flight_id = null;
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
      this.item.flight_status_id = null;
      this.item.flight_no = "";
      this.item.flight_date = "";
      this.item.sta = "";
      this.item.std = "";
      this.item.eta = "";
      this.item.etd = "";
      this.item.ata = "";
      this.item.atd = "";
      this.item.operation_day = null;
      this.item.remark = null;
      this.item.is_active = true;
      this.item.force = false;
      this.item.is_force = false;
      this.item.is_code_share = false;
      this.item.code_shares = [];
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
.daily-filter-card {
  overflow: hidden;
}

.filter-card-title {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
}

.filter-card-title-content {
  min-width: 0;
}

.filter-card-title-note {
  padding-top: 6px;
  color: rgba(223, 230, 234, 0.52);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-align: right;
  text-transform: uppercase;
}

.filter-card-kicker {
  color: rgba(223, 230, 234, 0.58);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.filter-card-heading {
  color: #f5f7f2;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.filter-card-heading-icon {
  color: var(--text-primary, #0d110f);
}

.filter-card-body {
  padding-top: 8px;
  display: grid;
  gap: 14px;
}

.filter-section {
  padding: 14px;
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    var(--surface-1) 0%,
    var(--surface-3) 100%
  );
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.filter-row {
  margin-top: 2px;
}

.filter-group-label {
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.weekday-checkbox-group {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
}

.weekday-checkbox-item {
  display: block;
  padding: 8px 12px;
  border: 1px solid var(--border-default);
  border-radius: 14px;
  background: var(--surface-2);
  transition: border-color 0.2s ease, background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.weekday-checkbox-item--active {
  border-color: var(--border-strong);
  background: var(--surface-active);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--primary) 18%, transparent);
}

.weekday-checkbox {
  margin-top: 0;
  padding-top: 0;
}

.weekday-checkbox::v-deep .v-input--selection-controls__input {
  margin-right: 8px;
}

.weekday-checkbox::v-deep .v-label {
  color: var(--text-primary);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.weekday-checkbox::v-deep .v-input--selection-controls {
  margin-top: 0;
  padding-top: 0;
}

.filter-card-actions {
  justify-content: flex-end;
  gap: 10px;
  padding: 16px;
}

.app-theme-light .filter-card-title-note,
.theme--light .filter-card-title-note {
  color: #5f6b57;
}

.app-theme-light .filter-card-kicker,
.theme--light .filter-card-kicker {
  color: #4f5d46;
}

.app-theme-light .filter-card-heading,
.theme--light .filter-card-heading {
  color: #0d110f;
}

.app-theme-light .filter-group-label,
.theme--light .filter-group-label {
  color: #34402d;
}

.app-theme-dark .filter-card-title-note,
.theme--dark .filter-card-title-note {
  color: rgba(243, 246, 239, 0.74);
}

.app-theme-dark .filter-card-kicker,
.theme--dark .filter-card-kicker {
  color: rgba(232, 239, 225, 0.82);
}

.app-theme-dark .filter-card-heading,
.theme--dark .filter-card-heading,
.app-theme-dark .filter-card-heading-icon,
.theme--dark .filter-card-heading-icon {
  color: #f3f6ef;
}

@media (max-width: 1264px) {
  .weekday-checkbox-group {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .filter-card-title {
    flex-direction: column;
  }

  .filter-card-title-note {
    padding-top: 0;
    text-align: left;
  }

  .filter-section {
    padding: 12px;
  }

  .weekday-checkbox-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-card-actions {
    justify-content: stretch;
  }

  .filter-card-actions :deep(.v-btn) {
    flex: 1 1 auto;
  }
}

.daily-dialog-direction {
  color: #d39b1d;
  font-weight: 700;
}

.daily-form-actions {
  padding: 16px 20px 20px;
}

.daily-table-card {
  border: 1px solid var(--border-default);
  border-radius: 20px !important;
  background: var(--card-bg);
  box-shadow: var(--shadow-sm), var(--theme-glow);
}

.daily-premium-table::v-deep .v-data-table__wrapper {
  border-radius: 16px;
  overflow: hidden;
}

.daily-premium-table::v-deep thead th {
  background: var(--surface-1) !important;
  color: var(--text-primary) !important;
  font-size: 0.74rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-default) !important;
}

.daily-premium-table::v-deep tbody tr {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.daily-premium-table::v-deep tbody tr:nth-child(odd) {
  background: var(--surface-1);
}

.daily-premium-table::v-deep tbody tr:nth-child(even) {
  background: var(--surface-1);
}

.daily-premium-table::v-deep tbody tr:hover {
  background: var(--surface-2);
}

.daily-premium-table::v-deep td {
  border-bottom: 1px solid var(--border-default) !important;
  vertical-align: middle;
}

.daily-premium-table::v-deep .v-data-table-header th:first-child,
.daily-premium-table::v-deep tbody td:first-child {
  width: 56px;
}

.daily-premium-table::v-deep .v-btn.v-size--x-small {
  border-radius: 10px !important;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
}

.daily-premium-table::v-deep tbody tr.premium-row-active {
  background: linear-gradient(
    90deg,
    rgba(52, 142, 84, 0.34) 0%,
    rgba(24, 56, 38, 0.62) 100%
  ) !important;
}

.premium-route-cell {
  min-width: 220px;
  text-align: left;
}

.premium-route-line {
  line-height: 1.25;
}

.premium-route-line--top {
  color: #f7e9c4;
  font-weight: 700;
}

.premium-route-line--middle {
  color: #d9e0ec;
  font-weight: 600;
}

.premium-route-line--time {
  color: var(--text-secondary);
  font-size: 0.82rem;
}

.premium-status-chip::v-deep .v-chip__content {
  font-weight: 800;
  letter-spacing: 0.05em;
}

.premium-time-cell,
.premium-flight-cell,
.premium-fromto-cell,
.premium-badge-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.premium-flight-cell {
  font-weight: 700;
}

.premium-airline-logo {
  background: linear-gradient(
    180deg,
    rgba(233, 245, 211, 0.22) 0%,
    rgba(127, 174, 50, 0.16) 100%
  );
  border: 1px solid rgba(127, 174, 50, 0.36);
}

.premium-airline-logo img {
  object-fit: contain;
}

.premium-airline-name {
  color: var(--text-primary);
}

.premium-cell-icon {
  color: var(--text-secondary) !important;
  opacity: 0.9;
}

.premium-badge-cell {
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid var(--border-default);
  background: var(--surface-2);
}

:deep(.daily-form-dialog),
:deep(.daily-view-dialog) {
  align-self: stretch;
  margin: 0 0 0 auto;
  max-height: 100% !important;
  height: 100%;
  width: min(100%, 1100px);
}

:deep(.daily-form-dialog .v-card),
:deep(.daily-view-dialog .v-card) {
  min-height: 100%;
  border-radius: 24px 0 0 24px !important;
}

:deep(.daily-form-slide-x-transition-enter-active),
:deep(.daily-form-slide-x-transition-leave-active),
:deep(.daily-view-slide-x-transition-enter-active),
:deep(.daily-view-slide-x-transition-leave-active) {
  transition: transform 0.28s ease, opacity 0.28s ease;
}

:deep(.daily-form-slide-x-transition-enter),
:deep(.daily-form-slide-x-transition-leave-to),
:deep(.daily-view-slide-x-transition-enter),
:deep(.daily-view-slide-x-transition-leave-to) {
  opacity: 0;
  transform: translateX(42px);
}

@media (max-width: 960px) {
  :deep(.daily-form-dialog),
  :deep(.daily-view-dialog) {
    width: 100%;
  }

  :deep(.daily-form-dialog .v-card),
  :deep(.daily-view-dialog .v-card) {
    border-radius: 0 !important;
  }
}
</style>

<style scoped>
.daily-table-toolbar-copy {
  display: grid;
  gap: 4px;
}

.daily-section-kicker {
  color: rgba(223, 230, 234, 0.58);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.daily-section-heading {
  color: #f5f7f2;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.daily-active-switch {
  display: flex;
  justify-content: center;
}

.daily-force-switch {
  display: flex;
  justify-content: center;
}

.daily-active-switch ::v-deep .v-input--selection-controls {
  margin: 0 auto !important;
  padding-top: 0 !important;
}

.daily-force-switch ::v-deep .v-input--selection-controls {
  margin: 0 auto !important;
  padding-top: 0 !important;
}

.daily-active-switch ::v-deep .v-input__slot {
  margin-bottom: 0 !important;
}

.daily-force-switch ::v-deep .v-input__slot {
  margin-bottom: 0 !important;
}
</style>
