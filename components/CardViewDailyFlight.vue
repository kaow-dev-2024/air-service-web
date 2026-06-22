<template>
  <div class="daily-flight-view">
    <div class="daily-flight-view__hero">
      <div class="daily-flight-view__hero-main">
        <div class="daily-flight-view__eyebrow">Daily Flight Overview</div>
        <div class="daily-flight-view__flight-row">
          <div class="daily-flight-view__flight-no">
            {{ item.flight_no || "-" }}
          </div>
          <v-chip
            small
            label
            :color="item.is_active ? 'success' : 'error'"
            class="daily-flight-view__active-chip"
          >
            {{ item.is_active ? "Active" : "Inactive" }}
          </v-chip>
          <v-chip
            small
            label
            :style="statusChipStyle"
            class="daily-flight-view__status-chip"
          >
            {{ statusName }}
          </v-chip>
        </div>
        <div class="daily-flight-view__route">
          {{ originCode }}
          <v-icon small class="daily-flight-view__route-icon">
            mdi-chevron-right
          </v-icon>
          {{ destinationCode }}
        </div>
      </div>

      <div class="daily-flight-view__hero-side">
        <div class="daily-flight-view__hero-chip">
          <span class="daily-flight-view__hero-label">Direction</span>
          <strong>{{ directionName }}</strong>
        </div>
        <div class="daily-flight-view__hero-chip">
          <span class="daily-flight-view__hero-label">Category</span>
          <strong>{{ categoryName }}</strong>
        </div>
      </div>
    </div>

    <div class="daily-flight-view__grid">
      <section class="daily-flight-view__card">
        <div class="daily-flight-view__card-title">Schedule</div>
        <div class="daily-flight-view__stats two-col">
          <div class="daily-flight-view__stat">
            <span>Flight Date</span>
            <strong>{{ formatDate(item.flight_date) }}</strong>
          </div>
          <div class="daily-flight-view__stat">
            <span>Operation Day</span>
            <strong>{{ item.operation_day || "-" }}</strong>
          </div>
          <div class="daily-flight-view__stat">
            <span>Sched. Departure</span>
            <strong>{{ formatTime(item.std) }}</strong>
          </div>
          <div class="daily-flight-view__stat">
            <span>Sched. Arrival</span>
            <strong>{{ formatTime(item.sta) }}</strong>
          </div>
          <div class="daily-flight-view__stat">
            <span>Estimated</span>
            <strong>{{ estimatedTimeLabel }}</strong>
          </div>
          <div class="daily-flight-view__stat">
            <span>Actual</span>
            <strong>{{ actualTimeLabel }}</strong>
          </div>
        </div>
      </section>

      <section class="daily-flight-view__card">
        <div class="daily-flight-view__card-title">Flight Profile</div>
        <div class="daily-flight-view__stats">
          <div class="daily-flight-view__stat">
            <span>Airline</span>
            <strong>{{ airlineName }}</strong>
          </div>
          <div class="daily-flight-view__stat">
            <span>Aircraft</span>
            <strong>{{ aircraftName }}</strong>
          </div>
          <div class="daily-flight-view__stat">
            <span>Terminal</span>
            <strong>{{ terminalName }}</strong>
          </div>
          <div class="daily-flight-view__stat">
            <span>Status</span>
            <strong>{{ statusName }}</strong>
          </div>
        </div>
      </section>

      <section class="daily-flight-view__card">
        <div class="daily-flight-view__card-title">Operations</div>
        <div class="daily-flight-view__stats">
          <div class="daily-flight-view__stat">
            <span>Origin</span>
            <strong>{{ originCode }}</strong>
          </div>
          <div class="daily-flight-view__stat">
            <span>Destination</span>
            <strong>{{ destinationCode }}</strong>
          </div>
          <div
            v-if="item.direction_id === 1 && dialog"
            class="daily-flight-view__stat"
          >
            <span>Belt</span>
            <strong>{{ beltName }}</strong>
          </div>
          <div
            v-if="item.direction_id === 2 && dialog"
            class="daily-flight-view__stat"
          >
            <span>Gate</span>
            <strong>{{ gateName }}</strong>
          </div>
          <div
            v-if="item.direction_id === 2 && dialog"
            class="daily-flight-view__stat daily-flight-view__stat--wide"
          >
            <span>Counters</span>
            <strong>{{ countersDisplay }}</strong>
          </div>
          <div
            v-if="!hasOperationAssignment"
            class="daily-flight-view__stat daily-flight-view__stat--wide"
          >
            <span>Assignment</span>
            <strong>-</strong>
          </div>
        </div>
      </section>

      <section
        v-if="hasCodeShares"
        class="daily-flight-view__card daily-flight-view__card--wide"
      >
        <div class="daily-flight-view__card-title">Code Share</div>
        <div class="daily-flight-view__code-share-list">
          <div
            v-for="(share, index) in item.code_shares"
            :key="`${share.airline_id || 'share'}-${index}`"
            class="daily-flight-view__code-share-item"
          >
            <div class="daily-flight-view__code-share-logo">
              <img :src="share.logo_url" :alt="share.iata_code || share.name" />
            </div>
            <div class="daily-flight-view__code-share-meta">
              <span>{{ share.iata_code || share.name || "-" }}</span>
              <strong>{{ share.flight_no || "-" }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="daily-flight-view__card daily-flight-view__card--wide">
        <div class="daily-flight-view__card-title">Remark</div>
        <div class="daily-flight-view__remark">
          {{ item.remark || "No remark" }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item", "itemsCounters", "dialog"],

  computed: {
    statusName() {
      return (this.item.FlightStatus && this.item.FlightStatus.name) || "-";
    },
    directionName() {
      return (this.item.Direction && this.item.Direction.name) || "-";
    },
    categoryName() {
      return (this.item.FlightCategory && this.item.FlightCategory.name) || "-";
    },
    airlineName() {
      return (this.item.Airline && this.item.Airline.name) || "-";
    },
    aircraftName() {
      return (this.item.AircraftType && this.item.AircraftType.model) || "-";
    },
    terminalName() {
      return (this.item.Terminal && this.item.Terminal.name) || "-";
    },
    beltName() {
      return (this.item.Belt && this.item.Belt.name) || "-";
    },
    gateName() {
      return (this.item.Gate && this.item.Gate.name) || "-";
    },
    originCode() {
      return (
        (this.item.OriginDaily && this.item.OriginDaily.iata_code) ||
        (this.item.Origin && this.item.Origin.iata_code) ||
        "-"
      );
    },
    destinationCode() {
      return (
        (this.item.DestinationDaily && this.item.DestinationDaily.iata_code) ||
        (this.item.Destination && this.item.Destination.iata_code) ||
        "-"
      );
    },
    estimatedTimeLabel() {
      if (this.item.direction_id === 2) {
        return this.formatTime(this.item.etd);
      }
      if (this.item.direction_id === 1) {
        return this.formatTime(this.item.eta);
      }
      return "-";
    },
    actualTimeLabel() {
      if (this.item.direction_id === 2) {
        return this.formatTime(this.item.atd);
      }
      if (this.item.direction_id === 1) {
        return this.formatTime(this.item.ata);
      }
      return "-";
    },
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
        (this.item.direction_id === 1 && this.beltName !== "-") ||
        (this.item.direction_id === 2 &&
          (this.gateName !== "-" || this.countersDisplay !== "-"))
      );
    },
    hasCodeShares() {
      return (
        Array.isArray(this.item.code_shares) && this.item.code_shares.length
      );
    },
    statusChipStyle() {
      return {
        backgroundColor: this.getColorByStatus(this.item),
        color: "#ffffff",
      };
    },
  },

  methods: {
    formatTime(value) {
      console.log("vale", value);

      if (!value || value === "Invalid date") {
        return "-";
      }

      return this.$moment(value, "HH:mm:ss").format("hh:mm A");
      // return this.$moment
      //   .tz(value, "HH:mm:ss", "UTC")
      //   .tz(process.env.TIMEZONE)
      //   .format("hh:mm A");
    },
    formatDate(value) {
      if (!value) {
        return "-";
      }
      const date = this.$moment(value);
      return date.isValid() ? date.format("DD MMM YYYY") : "-";
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

      return color || "#64748b";
    },
  },
};
</script>

<style lang="scss" scoped>
.daily-flight-view {
  display: grid;
  gap: 16px;
}

.daily-flight-view__hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border: 1px solid var(--border-default);
  border-radius: 20px;
  background: linear-gradient(
    180deg,
    var(--surface-1) 0%,
    var(--surface-2) 100%
  );
}

.daily-flight-view__eyebrow {
  color: var(--text-secondary);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.daily-flight-view__flight-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0 8px;
}

.daily-flight-view__flight-no {
  color: var(--text-primary);
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1;
}

.daily-flight-view__route {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 700;
}

.daily-flight-view__route-icon {
  color: var(--text-secondary);
}

.daily-flight-view__hero-side {
  min-width: 220px;
  display: grid;
  gap: 10px;
}

.daily-flight-view__hero-chip {
  display: grid;
  gap: 3px;
  padding: 12px 14px;
  border: 1px solid var(--border-default);
  border-radius: 16px;
  background: var(--surface-3);
}

.daily-flight-view__hero-label {
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.daily-flight-view__hero-chip strong {
  color: var(--text-primary);
  font-size: 0.95rem;
}

.daily-flight-view__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.daily-flight-view__card {
  padding: 18px;
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background: var(--surface-1);
}

.daily-flight-view__card--wide {
  grid-column: 1 / -1;
}

.daily-flight-view__card-title {
  margin-bottom: 14px;
  color: var(--text-primary);
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.daily-flight-view__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.daily-flight-view__stats.two-col {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.daily-flight-view__stat {
  display: grid;
  gap: 5px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--surface-2);
}

.daily-flight-view__stat--wide {
  grid-column: 1 / -1;
}

.daily-flight-view__stat span {
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.daily-flight-view__stat strong {
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.daily-flight-view__code-share-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.daily-flight-view__code-share-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--border-default);
  border-radius: 16px;
  background: var(--surface-2);
}

.daily-flight-view__code-share-logo {
  width: 78px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 12px;
  background: var(--surface-1);
}

.daily-flight-view__code-share-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.daily-flight-view__code-share-meta {
  display: grid;
  gap: 4px;
}

.daily-flight-view__code-share-meta span {
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.daily-flight-view__code-share-meta strong {
  color: var(--text-primary);
  font-size: 1rem;
}

.daily-flight-view__remark {
  min-height: 72px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--surface-2);
  color: var(--text-primary);
  line-height: 1.7;
}

@media (max-width: 960px) {
  .daily-flight-view__hero {
    flex-direction: column;
  }

  .daily-flight-view__hero-side,
  .daily-flight-view__grid,
  .daily-flight-view__stats,
  .daily-flight-view__stats.two-col {
    grid-template-columns: 1fr;
  }
}
</style>
