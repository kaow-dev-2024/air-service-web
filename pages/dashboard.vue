<template>
  <div class="dashboard-page">
    <section class="dashboard-hero">
      <div class="dashboard-hero__copy">
        <div class="dashboard-kicker">LPQ Airport Operations</div>
        <h1 class="dashboard-title">Flight Information Dashboard</h1>
        <p class="dashboard-subtitle">
          Real-time FIDS overview for arrivals, departures, operational status,
          and airline activity at Luang Prabang International Airport.
        </p>
      </div>
      <div class="dashboard-hero__meta">
        <div class="dashboard-live-pill">
          <span class="dashboard-live-dot"></span>
          Live FIDS Monitor
        </div>
        <div class="dashboard-updated-at">Updated {{ lastUpdatedLabel }}</div>
      </div>
    </section>

    <v-row class="dashboard-kpi-grid" dense>
      <v-col v-for="card in kpiCards" :key="card.key" cols="12" sm="6" lg="2">
        <v-card class="dashboard-kpi-card" flat>
          <div class="dashboard-kpi-card__top">
            <div>
              <div class="dashboard-kpi-card__label">{{ card.label }}</div>
              <div class="dashboard-kpi-card__value">{{ card.value }}</div>
            </div>
            <div class="dashboard-kpi-card__icon" :class="card.iconClass">
              <v-icon>{{ card.icon }}</v-icon>
            </div>
          </div>
          <div class="dashboard-kpi-card__hint">{{ card.hint }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="dashboard-filter-card" flat>
      <v-card-title class="dashboard-section-head">
        <div>
          <div class="dashboard-section-kicker">Flight Filters</div>
          <div class="dashboard-section-title">Operations control panel</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="filters.direction_id"
              :items="directionOptions"
              item-text="name"
              item-value="direction_id"
              label="Direction"
              clearable
              dense
              hide-details="auto"
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="filters.airline_id"
              :items="availableAirlines"
              item-text="iata_code"
              item-value="airline_id"
              label="Airline"
              clearable
              dense
              hide-details="auto"
              outlined
              :disabled="isAirlineStaff"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="filters.flight_status_id"
              :items="itemsFlightStatus"
              item-text="name"
              item-value="flight_status_id"
              label="Status"
              clearable
              dense
              hide-details="auto"
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.search"
              label="Search Flight / Route"
              prepend-inner-icon="mdi-magnify"
              clearable
              dense
              hide-details="auto"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="dashboard-filter-card__actions">
        <div class="dashboard-filter-card__summary">
          Showing {{ filteredFlights.length }} of {{ itemsDailyFlights.length }}
          flights
        </div>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="resetFilters" title="Reset">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-row dense class="dashboard-analytics-grid">
      <v-col cols="12" lg="4">
        <v-card class="dashboard-panel" flat>
          <v-card-title class="dashboard-section-head">
            <div>
              <div class="dashboard-section-kicker">Status</div>
              <div class="dashboard-section-title">Current flight states</div>
            </div>
          </v-card-title>
          <v-card-text class="dashboard-status-list">
            <div
              v-for="item in statusSummary"
              :key="item.key"
              class="dashboard-status-item"
            >
              <div class="dashboard-status-item__top">
                <div class="dashboard-status-item__meta">
                  <span
                    class="dashboard-status-item__dot"
                    :style="{ backgroundColor: item.color }"
                  ></span>
                  <span>{{ item.label }}</span>
                </div>
                <strong>{{ item.count }}</strong>
              </div>
              <div class="dashboard-progress">
                <span
                  class="dashboard-progress__bar"
                  :style="{
                    width: item.percent + '%',
                    backgroundColor: item.color,
                  }"
                ></span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="dashboard-panel" flat>
          <v-card-title class="dashboard-section-head">
            <div>
              <div class="dashboard-section-kicker">Airlines</div>
              <div class="dashboard-section-title">Top active carriers</div>
            </div>
          </v-card-title>
          <v-card-text class="dashboard-ranking-list">
            <div
              v-for="airline in topAirlines"
              :key="airline.key"
              class="dashboard-ranking-item"
            >
              <div class="dashboard-ranking-item__left">
                <div class="dashboard-ranking-item__rank">
                  {{ airline.rank }}
                </div>
                <div>
                  <div class="dashboard-ranking-item__title">
                    {{ airline.label }}
                  </div>
                  <div class="dashboard-ranking-item__subtitle">
                    {{ airline.description }}
                  </div>
                </div>
              </div>
              <div class="dashboard-ranking-item__value">
                {{ airline.count }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="dashboard-panel" flat>
          <v-card-title class="dashboard-section-head">
            <div>
              <div class="dashboard-section-kicker">Schedule Window</div>
              <div class="dashboard-section-title">Traffic by time slot</div>
            </div>
          </v-card-title>
          <v-card-text class="dashboard-timeline-list">
            <div
              v-for="slot in timelineSummary"
              :key="slot.label"
              class="dashboard-timeline-item"
            >
              <div class="dashboard-timeline-item__head">
                <span>{{ slot.label }}</span>
                <strong>{{ slot.count }}</strong>
              </div>
              <div class="dashboard-progress">
                <span
                  class="dashboard-progress__bar dashboard-progress__bar--soft"
                  :style="{ width: slot.percent + '%' }"
                ></span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="dashboard-board-card" flat>
      <v-card-title class="dashboard-board-card__header">
        <div>
          <div class="dashboard-section-kicker">Live FIDS Board</div>
          <div class="dashboard-section-title">Recent LPQ flights</div>
        </div>
        <v-spacer></v-spacer>
        <div class="dashboard-board-card__legend">
          <span>Desktop: table view</span>
          <span>Mobile: card list</span>
        </div>
      </v-card-title>

      <div v-if="isMobile" class="dashboard-mobile-list">
        <v-card
          v-for="flight in boardFlights"
          :key="flight.daily_flight_id || flight.key"
          class="dashboard-mobile-card"
          flat
        >
          <div class="dashboard-mobile-card__top">
            <div>
              <div class="dashboard-mobile-card__flight">
                {{ flight.flight_no || "-" }}
              </div>
              <div class="dashboard-mobile-card__route">
                {{ flight.routeLabel }}
              </div>
            </div>
            <v-chip
              small
              label
              :style="statusChipStyle(flight)"
              class="dashboard-status-chip"
            >
              {{ getFlightStatusName(flight) }}
            </v-chip>
          </div>

          <div class="dashboard-mobile-card__grid">
            <div class="dashboard-mobile-field">
              <span class="dashboard-mobile-field__label">Date</span>
              <strong>{{ flight.flightDateLabel }}</strong>
            </div>
            <div class="dashboard-mobile-field">
              <span class="dashboard-mobile-field__label">Direction</span>
              <strong>{{ flight.directionLabel }}</strong>
            </div>
            <div class="dashboard-mobile-field">
              <span class="dashboard-mobile-field__label">Scheduled</span>
              <strong>{{ flight.scheduledLabel }}</strong>
            </div>
            <div class="dashboard-mobile-field">
              <span class="dashboard-mobile-field__label">Actual</span>
              <strong>{{ flight.actualLabel }}</strong>
            </div>
            <div class="dashboard-mobile-field">
              <span class="dashboard-mobile-field__label">Airline</span>
              <strong>{{ flight.airlineLabel }}</strong>
            </div>
            <div class="dashboard-mobile-field">
              <span class="dashboard-mobile-field__label">Terminal</span>
              <strong>{{ flight.terminalLabel }}</strong>
            </div>
          </div>
        </v-card>
      </div>

      <v-data-table
        v-else
        :headers="headers"
        :items="boardFlights"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:[`item.flight_no`]="{ item }">
          <div class="dashboard-table-flight">
            <strong>{{ item.flight_no || "-" }}</strong>
            <span>{{ item.airlineLabel }}</span>
          </div>
        </template>
        <template v-slot:[`item.routeLabel`]="{ item }">
          {{ item.routeLabel }}
        </template>
        <template v-slot:[`item.directionLabel`]="{ item }">
          <v-chip
            small
            label
            :color="item.direction_id === 1 ? 'info' : 'success'"
            text-color="white"
          >
            {{ item.directionLabel }}
          </v-chip>
        </template>
        <template v-slot:[`item.scheduledLabel`]="{ item }">
          {{ item.scheduledLabel }}
        </template>
        <template v-slot:[`item.actualLabel`]="{ item }">
          {{ item.actualLabel }}
        </template>
        <template v-slot:[`item.statusLabel`]="{ item }">
          <v-chip
            small
            label
            :style="statusChipStyle(item)"
            class="dashboard-status-chip"
          >
            {{ item.statusLabel }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      lastUpdatedAt: null,
      currentUser: null,
      itemsDailyFlights: [],
      itemsAirlines: [],
      itemsFlightStatus: [],
      filters: {
        direction_id: null,
        airline_id: null,
        flight_status_id: null,
        search: "",
      },
      headers: [
        { text: "Date", value: "flightDateLabel", align: "center" },
        { text: "Flight", value: "flight_no", align: "center" },
        { text: "Route", value: "routeLabel", align: "center" },
        { text: "Direction", value: "directionLabel", align: "center" },
        { text: "Scheduled", value: "scheduledLabel", align: "center" },
        { text: "Actual", value: "actualLabel", align: "center" },
        { text: "Status", value: "statusLabel", align: "center" },
      ],
      directionOptions: [
        { direction_id: 1, name: "Arrival" },
        { direction_id: 2, name: "Departure" },
      ],
    };
  },

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },

    isAirlineStaff() {
      return (
        this.currentUser &&
        this.currentUser.Role &&
        this.currentUser.Role.name === "staff-airline"
      );
    },

    scopedAirlineId() {
      if (!this.isAirlineStaff) {
        return null;
      }

      return Number(this.currentUser.airline_id || 0) || null;
    },

    availableAirlines() {
      if (!this.isAirlineStaff) {
        return this.itemsAirlines;
      }

      return this.itemsAirlines.filter(
        (item) => Number(item.airline_id) === this.scopedAirlineId
      );
    },

    filteredFlights() {
      const search = String(this.filters.search || "")
        .trim()
        .toLowerCase();

      return this.itemsDailyFlights.filter((flight) => {
        const matchScopedAirline = this.scopedAirlineId
          ? Number(flight.airline_id) === this.scopedAirlineId
          : true;
        const matchDirection = this.filters.direction_id
          ? Number(flight.direction_id) === Number(this.filters.direction_id)
          : true;
        const matchAirline = this.filters.airline_id
          ? Number(flight.airline_id) === Number(this.filters.airline_id)
          : true;
        const matchStatus = this.filters.flight_status_id
          ? Number(flight.flight_status_id) ===
            Number(this.filters.flight_status_id)
          : true;
        const searchable = [
          flight.flight_no,
          flight.routeLabel,
          flight.airlineLabel,
          flight.directionLabel,
          flight.statusLabel,
        ]
          .join(" ")
          .toLowerCase();
        const matchSearch = search ? searchable.includes(search) : true;

        return (
          matchScopedAirline &&
          matchDirection &&
          matchAirline &&
          matchStatus &&
          matchSearch
        );
      });
    },

    boardFlights() {
      return this.filteredFlights.slice(0, 12);
    },

    totalFlights() {
      return this.filteredFlights.length;
    },

    arrivalFlights() {
      return this.filteredFlights.filter(
        (item) => Number(item.direction_id) === 1
      ).length;
    },

    departureFlights() {
      return this.filteredFlights.filter(
        (item) => Number(item.direction_id) === 2
      ).length;
    },

    delayedFlights() {
      return this.filteredFlights.filter((item) =>
        this.getFlightStatusName(item).toLowerCase().includes("delay")
      ).length;
    },

    activeAirlines() {
      return new Set(
        this.filteredFlights
          .map((item) => item.airline_id)
          .filter((item) => item !== null && item !== undefined)
      ).size;
    },

    onTimeFlights() {
      return this.filteredFlights.filter((item) => {
        const scheduled = this.getScheduledTime(item);
        const actual = this.getActualTime(item);

        if (!scheduled || !actual) {
          return false;
        }

        const diff = this.$moment(actual, "HH:mm").diff(
          this.$moment(scheduled, "HH:mm"),
          "minutes"
        );

        return Math.abs(diff) <= 15;
      }).length;
    },

    onTimeRate() {
      const completedFlights = this.filteredFlights.filter(
        (item) => this.getActualTime(item) && this.getScheduledTime(item)
      ).length;

      if (!completedFlights) {
        return 0;
      }

      return Math.round((this.onTimeFlights / completedFlights) * 100);
    },

    kpiCards() {
      return [
        {
          key: "total",
          label: "Total Flights",
          value: this.totalFlights,
          hint: "Filtered flights in the current live board",
          icon: "mdi-airplane",
          iconClass: "dashboard-kpi-card__icon--blue",
        },
        {
          key: "arrivals",
          label: "Arrivals",
          value: this.arrivalFlights,
          hint: "Inbound movements to LPQ",
          icon: "mdi-airplane-landing",
          iconClass: "dashboard-kpi-card__icon--cyan",
        },
        {
          key: "departures",
          label: "Departures",
          value: this.departureFlights,
          hint: "Outbound movements from LPQ",
          icon: "mdi-airplane-takeoff",
          iconClass: "dashboard-kpi-card__icon--green",
        },
        {
          key: "ontime",
          label: "On-Time Rate",
          value: `${this.onTimeRate}%`,
          hint: "Flights within 15 minutes of schedule",
          icon: "mdi-timer-check-outline",
          iconClass: "dashboard-kpi-card__icon--olive",
        },
        {
          key: "delayed",
          label: "Delayed",
          value: this.delayedFlights,
          hint: "Flights flagged as delayed",
          icon: "mdi-clock-alert-outline",
          iconClass: "dashboard-kpi-card__icon--amber",
        },
        {
          key: "airlines",
          label: "Active Airlines",
          value: this.activeAirlines,
          hint: "Carriers operating in the filtered list",
          icon: "mdi-domain",
          iconClass: "dashboard-kpi-card__icon--slate",
        },
      ];
    },

    statusSummary() {
      const map = {};
      this.filteredFlights.forEach((flight) => {
        const name = this.getFlightStatusName(flight);
        if (!map[name]) {
          map[name] = 0;
        }
        map[name] += 1;
      });

      return Object.keys(map)
        .sort((a, b) => map[b] - map[a])
        .slice(0, 6)
        .map((name) => ({
          key: name,
          label: name,
          count: map[name],
          percent: this.totalFlights
            ? Math.round((map[name] / this.totalFlights) * 100)
            : 0,
          color: this.getStatusColor(name),
        }));
    },

    topAirlines() {
      const airlineMap = {};

      this.filteredFlights.forEach((flight) => {
        const label = flight.airlineLabel || "Unknown";
        if (!airlineMap[label]) {
          airlineMap[label] = {
            count: 0,
            arrivals: 0,
            departures: 0,
          };
        }

        airlineMap[label].count += 1;
        if (Number(flight.direction_id) === 1) {
          airlineMap[label].arrivals += 1;
        } else if (Number(flight.direction_id) === 2) {
          airlineMap[label].departures += 1;
        }
      });

      return Object.keys(airlineMap)
        .sort((a, b) => airlineMap[b].count - airlineMap[a].count)
        .slice(0, 5)
        .map((label, index) => ({
          key: `${label}-${index}`,
          rank: index + 1,
          label,
          count: airlineMap[label].count,
          description: `${airlineMap[label].arrivals} arrivals / ${airlineMap[label].departures} departures`,
        }));
    },

    timelineSummary() {
      const slots = [
        { label: "00:00-05:59", start: 0, end: 5, count: 0 },
        { label: "06:00-11:59", start: 6, end: 11, count: 0 },
        { label: "12:00-17:59", start: 12, end: 17, count: 0 },
        { label: "18:00-23:59", start: 18, end: 23, count: 0 },
      ];

      this.filteredFlights.forEach((flight) => {
        const timeValue = this.getScheduledTime(flight);
        if (!timeValue) {
          return;
        }

        const hour = Number(String(timeValue).split(":")[0]);
        const slot = slots.find(
          (item) => hour >= item.start && hour <= item.end
        );
        if (slot) {
          slot.count += 1;
        }
      });

      const max = Math.max(...slots.map((item) => item.count), 0);

      return slots.map((slot) => ({
        ...slot,
        percent: max ? Math.round((slot.count / max) * 100) : 0,
      }));
    },

    lastUpdatedLabel() {
      if (!this.lastUpdatedAt) {
        return "-";
      }

      return this.$moment(this.lastUpdatedAt).format("DD MMM YYYY, HH:mm");
    },
  },

  async mounted() {
    await this.loadDashboard();
  },

  methods: {
    async loadDashboard() {
      this.loading = true;
      this.currentUser = await this.$auth.user;
      if (this.scopedAirlineId) {
        this.filters.airline_id = this.scopedAirlineId;
      }
      await Promise.all([
        this.getDailyFlights(),
        this.getAirlines(),
        this.getFlightStatus(),
      ]);
      this.lastUpdatedAt = new Date();
      this.loading = false;
    },

    async getDailyFlights() {
      this.itemsDailyFlights = await this.$axios
        .get("/daily-flights")
        .then((res) => {
          const items = this.normalizeDailyFlights(res.data || []);
          if (!this.scopedAirlineId) {
            return items;
          }

          return items.filter(
            (item) => Number(item.airline_id) === this.scopedAirlineId
          );
        })
        .catch(() => []);
    },

    async getAirlines() {
      this.itemsAirlines = await this.$axios
        .get("/airlines")
        .then((res) => {
          const items = (res.data || []).filter(
            (item) => item.is_active == true
          );
          if (!this.scopedAirlineId) {
            return items;
          }

          return items.filter(
            (item) => Number(item.airline_id) === this.scopedAirlineId
          );
        })
        .catch(() => []);
    },

    async getFlightStatus() {
      this.itemsFlightStatus = await this.$axios
        .get("/flight-status")
        .then((res) =>
          (res.data || []).filter((item) => item.is_active == true)
        )
        .catch(() => []);
    },

    normalizeDailyFlights(items) {
      return items.map((item, index) => {
        const flight = { ...item };
        flight.std = this.normalizeTime(flight.std);
        flight.sta = this.normalizeTime(flight.sta);
        flight.etd = this.normalizeTime(flight.etd);
        flight.eta = this.normalizeTime(flight.eta);
        flight.atd = this.normalizeTime(flight.atd);
        flight.ata = this.normalizeTime(flight.ata);
        flight.airlineLabel =
          (flight.Airline &&
            (flight.Airline.iata_code || flight.Airline.name)) ||
          "-";
        flight.originCode =
          (flight.OriginDaily && flight.OriginDaily.iata_code) ||
          (flight.Origin && flight.Origin.iata_code) ||
          "-";
        flight.destinationCode =
          (flight.DestinationDaily && flight.DestinationDaily.iata_code) ||
          (flight.Destination && flight.Destination.iata_code) ||
          "-";
        flight.routeLabel = `${flight.originCode} - ${flight.destinationCode}`;
        flight.directionLabel =
          (flight.Direction && flight.Direction.name) ||
          (Number(flight.direction_id) === 1 ? "Arrival" : "Departure");
        flight.statusLabel = this.getFlightStatusName(flight);
        flight.flightDateLabel = this.formatFlightDate(
          flight.flight_date || flight.date
        );
        flight.scheduledLabel = this.getScheduledTime(flight) || "-";
        flight.actualLabel = this.getActualTime(flight) || "-";
        flight.terminalLabel = (flight.Terminal && flight.Terminal.name) || "-";
        flight.key = `${flight.daily_flight_id || "flight"}-${index}`;
        return flight;
      });
    },

    normalizeTime(value) {
      if (!value || value === "Invalid date") {
        return "";
      }
      const timezone = this.$config.appTimezone || "Asia/Bangkok";
      const utcTime = this.$moment.tz(value, "HH:mm:ss", true, "UTC");
      if (utcTime.isValid()) {
        return utcTime.tz(timezone).format("hh:mm A");
      }

      const localTime = this.$moment.tz(
        value,
        ["HH:mm:ss", "hh:mm A"],
        true,
        timezone
      );
      return localTime.isValid() ? localTime.format("hh:mm A") : "";
    },

    formatFlightDate(value) {
      if (!value) {
        return "-";
      }

      const date = this.$moment(value);
      return date.isValid() ? date.format("DD MMM YYYY") : "-";
    },

    getScheduledTime(item) {
      return Number(item.direction_id) === 1
        ? item.sta || item.std
        : item.std || item.sta;
    },

    getActualTime(item) {
      return Number(item.direction_id) === 1
        ? item.ata || item.eta || ""
        : item.atd || item.etd || "";
    },

    getFlightStatusName(item) {
      return (
        (item.FlightStatus && item.FlightStatus.name) ||
        item.statusLabel ||
        "Unknown"
      );
    },

    getStatusColor(statusName) {
      if (statusName === "Scheduled") {
        return "#25459f";
      }
      if (statusName === "Check-in") {
        return "#3a78fc";
      }
      if (statusName === "Boarding") {
        return "#377c34";
      }
      if (statusName === "Gate Open") {
        return "#41c460";
      }
      if (statusName === "Gate Closing") {
        return "#212937";
      }
      if (statusName === "Departed") {
        return "#757575";
      }
      if (statusName === "Arrived") {
        return "#377c34";
      }
      if (statusName === "Delayed") {
        return "#f4c135";
      }
      if (statusName === "Cancelled") {
        return "#d3332e";
      }
      if (statusName === "Final Call" || statusName === "Last Call") {
        return "#e17329";
      }
      if (statusName === "Gate Change") {
        return "#8e5bf4";
      }
      return "#64748b";
    },

    statusChipStyle(item) {
      const color = this.getStatusColor(this.getFlightStatusName(item));
      return {
        backgroundColor: color,
        color: "#ffffff",
      };
    },

    resetFilters() {
      this.filters.direction_id = null;
      this.filters.airline_id = this.scopedAirlineId;
      this.filters.flight_status_id = null;
      this.filters.search = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-page {
  display: grid;
  gap: 16px;
}

.dashboard-hero {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 28px;
  border: 1px solid var(--border-default);
  border-radius: 24px;
  background: radial-gradient(
      circle at top right,
      rgba(127, 174, 50, 0.12),
      transparent 32%
    ),
    linear-gradient(180deg, var(--surface-1) 0%, var(--surface-2) 100%);
}

.dashboard-kicker,
.dashboard-section-kicker {
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.dashboard-title {
  margin: 8px 0 10px;
  color: var(--text-primary);
  font-size: clamp(1.7rem, 2.4vw, 2.5rem);
  line-height: 1.05;
}

.dashboard-subtitle {
  max-width: 760px;
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.98rem;
  line-height: 1.7;
}

.dashboard-hero__meta {
  min-width: 210px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.dashboard-live-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  background: var(--surface-3);
  color: var(--text-primary);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.dashboard-live-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #52a447;
  box-shadow: 0 0 0 5px rgba(82, 164, 71, 0.14);
}

.dashboard-updated-at {
  color: var(--text-secondary);
  font-size: 0.85rem;
  text-align: right;
}

.dashboard-kpi-grid,
.dashboard-analytics-grid {
  margin: 0;
}

.dashboard-kpi-card,
.dashboard-panel,
.dashboard-filter-card,
.dashboard-board-card {
  border: 1px solid var(--border-default);
  border-radius: 22px;
  background: var(--surface-1);
}

.dashboard-kpi-card {
  height: 100%;
  padding: 18px;
}

.dashboard-kpi-card__top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.dashboard-kpi-card__label {
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.dashboard-kpi-card__value {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 1.85rem;
  font-weight: 800;
  line-height: 1;
}

.dashboard-kpi-card__hint {
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.6;
}

.dashboard-kpi-card__icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: var(--surface-3);
}

.dashboard-kpi-card__icon :deep(.v-icon) {
  color: #fff;
}

.dashboard-kpi-card__icon--blue {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.dashboard-kpi-card__icon--cyan {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
}

.dashboard-kpi-card__icon--green {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.dashboard-kpi-card__icon--olive {
  background: linear-gradient(135deg, #7fae32, #587d1c);
}

.dashboard-kpi-card__icon--amber {
  background: linear-gradient(135deg, #d39b1d, #b7791f);
}

.dashboard-kpi-card__icon--slate {
  background: linear-gradient(135deg, #64748b, #475569);
}

.dashboard-section-head {
  padding-bottom: 8px;
}

.dashboard-section-title {
  margin-top: 5px;
  color: var(--text-primary);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.dashboard-filter-card__actions {
  padding: 0 16px 16px;
}

.dashboard-filter-card__summary,
.dashboard-board-card__legend {
  color: var(--text-secondary);
  font-size: 0.84rem;
}

.dashboard-board-card__legend {
  display: flex;
  gap: 14px;
}

.dashboard-status-list,
.dashboard-ranking-list,
.dashboard-timeline-list {
  display: grid;
  gap: 14px;
}

.dashboard-status-item__top,
.dashboard-timeline-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.dashboard-status-item__meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-weight: 600;
}

.dashboard-status-item__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dashboard-progress {
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--surface-3);
}

.dashboard-progress__bar {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.dashboard-progress__bar--soft {
  background: linear-gradient(90deg, #7fae32, #b8e35a);
}

.dashboard-ranking-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border-default);
  border-radius: 16px;
  background: var(--surface-2);
}

.dashboard-ranking-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-ranking-item__rank {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--surface-3);
  color: var(--text-primary);
  font-weight: 800;
}

.dashboard-ranking-item__title {
  color: var(--text-primary);
  font-weight: 700;
}

.dashboard-ranking-item__subtitle {
  margin-top: 2px;
  color: var(--text-secondary);
  font-size: 0.82rem;
}

.dashboard-ranking-item__value {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 800;
}

.dashboard-board-card__header {
  padding-bottom: 8px;
}

.dashboard-mobile-list {
  display: grid;
  gap: 12px;
  padding: 0 16px 16px;
}

.dashboard-mobile-card {
  padding: 16px;
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    var(--surface-1) 0%,
    var(--surface-2) 100%
  );
}

.dashboard-mobile-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.dashboard-mobile-card__flight {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 800;
}

.dashboard-mobile-card__route {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 0.84rem;
}

.dashboard-mobile-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.dashboard-mobile-field {
  display: grid;
  gap: 4px;
}

.dashboard-mobile-field__label {
  color: var(--text-muted);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dashboard-mobile-field strong {
  color: var(--text-primary);
  font-size: 0.92rem;
}

.dashboard-status-chip {
  font-weight: 700;
  letter-spacing: 0.03em;
}

.dashboard-table-flight {
  display: grid;
  gap: 2px;
}

.dashboard-table-flight strong {
  color: var(--text-primary);
}

.dashboard-table-flight span {
  color: var(--text-secondary);
  font-size: 0.78rem;
}

@media (max-width: 1264px) {
  .dashboard-hero {
    flex-direction: column;
  }

  .dashboard-hero__meta {
    min-width: 0;
    align-items: flex-start;
  }

  .dashboard-updated-at {
    text-align: left;
  }
}

@media (max-width: 600px) {
  .dashboard-hero {
    padding: 18px;
    border-radius: 20px;
  }

  .dashboard-board-card__legend {
    display: none;
  }

  .dashboard-mobile-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>
