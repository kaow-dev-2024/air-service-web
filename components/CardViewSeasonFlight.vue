<template>
  <div class="season-flight-view">
    <div class="season-flight-view__hero">
      <div class="season-flight-view__hero-main">
        <div class="season-flight-view__eyebrow">Season Flight Overview</div>
        <div class="season-flight-view__flight-row">
          <div class="season-flight-view__flight-no">
            {{ item.flight_no || "-" }}
          </div>
          <v-chip
            small
            label
            :color="item.is_active ? 'success' : 'error'"
            class="season-flight-view__status"
          >
            {{ item.is_active ? "Active" : "Inactive" }}
          </v-chip>
        </div>
        <div class="season-flight-view__route">
          {{ item.Origin.iata_code || "-" }}
          <v-icon small class="season-flight-view__route-icon">
            mdi-chevron-right
          </v-icon>
          {{ item.Destination.iata_code || "-" }}
        </div>
      </div>

      <div class="season-flight-view__hero-side">
        <div class="season-flight-view__hero-chip">
          <span class="season-flight-view__hero-label">Direction</span>
          <strong>{{ item.Direction.name || "-" }}</strong>
        </div>
        <div class="season-flight-view__hero-chip">
          <span class="season-flight-view__hero-label">Category</span>
          <strong>{{ item.FlightCategory.name || "-" }}</strong>
        </div>
      </div>
    </div>

    <div class="season-flight-view__grid">
      <section class="season-flight-view__card">
        <div class="season-flight-view__card-title">Schedule</div>
        <div class="season-flight-view__stats two-col">
          <div class="season-flight-view__stat">
            <span>Valid From</span>
            <strong>{{ item.valid_from || "-" }}</strong>
          </div>
          <div class="season-flight-view__stat">
            <span>Valid To</span>
            <strong>{{ item.valid_to || "-" }}</strong>
          </div>
          <div class="season-flight-view__stat">
            <span>Sched. Departure</span>
            <strong>{{
              $moment
                .utc(item.std, "HH:mm:ss")
                .tz("Asia/Bangkok")
                .format("hh:mm A")
            }}</strong>
          </div>
          <div class="season-flight-view__stat">
            <span>Sched. Arrival</span>
            <strong>{{ formatTime(item.sta) }}</strong>
          </div>
        </div>
      </section>

      <section class="season-flight-view__card">
        <div class="season-flight-view__card-title">Flight Profile</div>
        <div class="season-flight-view__stats">
          <div class="season-flight-view__stat">
            <span>Airline</span>
            <strong>{{ item.Airline.name || "-" }}</strong>
          </div>
          <div class="season-flight-view__stat">
            <span>Aircraft</span>
            <strong>{{ item.AircraftType.model || "-" }}</strong>
          </div>
          <div class="season-flight-view__stat">
            <span>Terminal</span>
            <strong>{{ item.Terminal.name || "-" }}</strong>
          </div>
          <div class="season-flight-view__stat">
            <span>Operation Days</span>
            <strong>{{ item.operation_days || "-" }}</strong>
          </div>
        </div>
      </section>

      <section class="season-flight-view__card">
        <div class="season-flight-view__card-title">Operations</div>
        <div class="season-flight-view__stats">
          <div
            v-if="item.direction_id === 1 && dialog"
            class="season-flight-view__stat"
          >
            <span>Belt</span>
            <strong>{{ item.Belt.name || "-" }}</strong>
          </div>
          <div
            v-if="item.direction_id === 2 && dialog"
            class="season-flight-view__stat"
          >
            <span>Gate</span>
            <strong>{{ item.Gate.name || "-" }}</strong>
          </div>
          <div
            v-if="item.direction_id === 2 && dialog"
            class="season-flight-view__stat season-flight-view__stat--wide"
          >
            <span>Counters</span>
            <strong>{{ countersDisplay }}</strong>
          </div>
          <div
            v-if="!hasOperationAssignment"
            class="season-flight-view__stat season-flight-view__stat--wide"
          >
            <span>Assignment</span>
            <strong>-</strong>
          </div>
        </div>
      </section>

      <section class="season-flight-view__card season-flight-view__card--wide">
        <div class="season-flight-view__card-title">Remark</div>
        <div class="season-flight-view__remark">
          {{ item.remark || "No remark" }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: ["season_flight_id", "itemsCounters", "dialog"],
  data() {
    return {
      headers: [
        { text: "#", value: "index", align: "center", sortable: false },
        { text: "DATE", value: "flight_date", align: "center" },
        { text: "Sched. Dep.", value: "std", align: "center" },
        { text: "Sched. Arr.", value: "sta", align: "center" },
        { text: "Est. Dep.", value: "etd", align: "center" },
        { text: "Est. Arr.", value: "eta", align: "center" },
        { text: "Actual Dep.", value: "atd", align: "center" },
        { text: "Actual Arr.", value: "ata", align: "center" },
        { text: "REMARK", value: "remark" },
      ],
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
          name: "",
        },
        Origin: {
          iata_code: "",
        },
        Destination: {
          iata_code: "",
        },
        Belt: {
          name: "",
        },
        Gate: {
          name: "",
        },
        Direction: {
          name: "",
        },
        AircraftType: {
          model: "",
        },
        FlightCategory: {
          name: "",
        },
        Terminal: {
          name: "",
        },
        DailyFlights: [],
      },
    };
  },

  computed: {
    countersDisplay() {
      if (!Array.isArray(this.item.counters) || !this.item.counters.length) {
        return "-";
      }
      const selectedCounters = this.itemsCounters
        .filter((counter) => this.item.counters.includes(counter.counter_id))
        .map((counter) => counter.name);

      return selectedCounters.length ? selectedCounters.join(", ") : "-";
    },
    hasOperationAssignment() {
      return (
        (this.item.direction_id === 1 && this.item.Belt.name) ||
        (this.item.direction_id === 2 &&
          (this.item.Gate.name || this.countersDisplay !== "-"))
      );
    },
  },

  created() {
    this.getSeasonFlightById();
  },

  watch: {
    dialog(val) {
      if (val) {
        this.getSeasonFlightById();
      }
    },
  },

  methods: {
    formatTime(value) {
      if (!value) {
        return "-";
      }
      // return this.$moment(value, "HH:mm:ss").format("hh:mm A");
      return this.$moment
        .tz(value, "HH:mm:ss", "UTC")
        .tz(process.env.TIMEZONE)
        .format("hh:mm A");
    },

    async getSeasonFlightById() {
      try {
        const res = await this.$axios.get(
          `/season-flights/${this.season_flight_id}`
        );
        this.item = res.data;
      } catch (error) {
        alert(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.season-flight-view {
  display: grid;
  gap: 16px;
}

.season-flight-view__hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--border-default);
  border-radius: 20px;
  background: var(--surface-2);
}

.season-flight-view__hero-main {
  min-width: 0;
}

.season-flight-view__eyebrow {
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.season-flight-view__flight-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.season-flight-view__flight-no {
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 800;
}

.season-flight-view__route {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 700;
}

.season-flight-view__route-icon {
  color: var(--season-view-icon, var(--primary)) !important;
}

.season-flight-view__hero-side {
  display: grid;
  gap: 10px;
  min-width: 220px;
}

.season-flight-view__hero-chip {
  padding: 12px 14px;
  border: 1px solid var(--border-default);
  border-radius: 16px;
  background: var(--surface-1);
}

.season-flight-view__hero-label {
  display: block;
  margin-bottom: 4px;
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.season-flight-view__hero-chip strong {
  color: var(--text-primary);
}

.season-flight-view__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.season-flight-view__card {
  padding: 16px;
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background: var(--surface-1);
}

.season-flight-view__card--wide {
  grid-column: 1 / -1;
}

.season-flight-view__card-title {
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.season-flight-view__stats {
  display: grid;
  gap: 12px;
}

.season-flight-view__stats.two-col {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.season-flight-view__stat {
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 14px;
  background: var(--surface-2);
}

.season-flight-view__stat--wide {
  grid-column: 1 / -1;
}

.season-flight-view__stat span {
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.season-flight-view__stat strong,
.season-flight-view__remark {
  color: var(--text-primary);
  font-size: 0.92rem;
  word-break: break-word;
}

.season-flight-view__remark {
  min-height: 76px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--surface-2);
  line-height: 1.6;
}

:deep(.app-theme-light) .season-flight-view,
:deep(.theme--light) .season-flight-view {
  --season-view-icon: #7dd3fc;
}

:deep(.app-theme-dark) .season-flight-view,
:deep(.theme--dark) .season-flight-view {
  --season-view-icon: #2563eb;
}

@media (max-width: 960px) {
  .season-flight-view__hero {
    flex-direction: column;
  }

  .season-flight-view__hero-side {
    min-width: 0;
  }

  .season-flight-view__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .season-flight-view__hero,
  .season-flight-view__card {
    padding: 14px;
  }

  .season-flight-view__grid,
  .season-flight-view__stats.two-col {
    grid-template-columns: 1fr;
  }
}
</style>
