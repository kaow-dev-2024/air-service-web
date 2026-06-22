<template>
  <div class="daily-flight-form">
    <v-container fluid class="daily-flight-form__container">
      <section
        class="daily-flight-form__section daily-flight-form__section--status"
      >
        <div>
          <div class="daily-flight-form__section-title">Flight Status</div>
          <div class="daily-flight-form__section-note">
            Set the operational state before saving this daily flight record.
          </div>
        </div>
        <div class="daily-flight-form__status-toggle">
          <v-switch
            label="Active"
            v-model="item.is_active"
            inset
            color="success"
            hide-details
          ></v-switch>
        </div>
      </section>

      <section class="daily-flight-form__section">
        <div class="daily-flight-form__section-title">Flight Profile</div>
        <!-- <div class="daily-flight-form__section-note">
          Start with direction, category, current status, airline, and flight
          number.
        </div> -->
        <v-row dense>
          <v-col cols="12" md="4">
            <v-autocomplete
              dense
              :items="itemsDirections"
              item-text="name"
              item-value="direction_id"
              v-model="item.direction_id"
              label="Direction"
              hide-details="auto"
              outlined
              required
              clearable
              prepend-inner-icon="mdi-swap-horizontal"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              dense
              :items="itemsFlightCategories"
              item-text="name"
              item-value="flight_category_id"
              v-model="item.flight_category_id"
              label="Category"
              hide-details="auto"
              outlined
              required
              clearable
              prepend-inner-icon="mdi-shape-outline"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              dense
              :items="itemsFlightStatusByDirection"
              item-text="name"
              item-value="flight_status_id"
              v-model="item.flight_status_id"
              label="Status"
              hide-details="auto"
              clearable
              outlined
              required
              :disabled="item.direction_id == null"
              prepend-inner-icon="mdi-flag-checkered"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              dense
              :items="itemsAirlines"
              item-text="iata_code"
              item-value="airline_id"
              v-model="item.airline_id"
              label="Airline"
              hide-details="auto"
              required
              outlined
              clearable
              prepend-inner-icon="mdi-airplane-marker"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              dense
              label="Flight No"
              v-model="item.flight_no"
              hide-details="auto"
              required
              outlined
              clearable
              prepend-inner-icon="mdi-pound"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              dense
              :items="itemsAircraftTypes"
              item-text="model"
              item-value="aircraft_type_id"
              v-model="item.aircraft_type_id"
              label="Aircraft Type"
              hide-details="auto"
              required
              outlined
              clearable
              prepend-inner-icon="mdi-airplane"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </section>

      <section class="daily-flight-form__section">
        <div class="daily-flight-form__section-title">Date & Schedule</div>
        <!-- <div class="daily-flight-form__section-note">
          Configure the flight date and all planned, estimated, and actual time
          values.
        </div> -->
        <v-row dense>
          <v-col cols="12" md="3">
            <v-text-field
              dense
              label="Flight Date"
              type="date"
              v-model="item.flight_date"
              hide-details="auto"
              required
              outlined
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              dense
              label="Sched. Departure"
              type="time"
              v-model="item.std"
              hide-details="auto"
              required
              clearable
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              dense
              label="Sched. Arrival"
              type="time"
              v-model="item.sta"
              hide-details="auto"
              required
              clearable
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" v-if="item.direction_id == 2">
            <v-text-field
              dense
              label="Est. Departure"
              type="time"
              v-model="item.etd"
              hide-details="auto"
              required
              clearable
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" v-if="item.direction_id == 1">
            <v-text-field
              dense
              label="Est. Arrival"
              type="time"
              v-model="item.eta"
              hide-details="auto"
              required
              clearable
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" v-if="item.direction_id == 2">
            <v-text-field
              dense
              label="Actual Departure"
              type="time"
              v-model="item.atd"
              hide-details="auto"
              clearable
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" v-if="item.direction_id == 1">
            <v-text-field
              dense
              label="Actual Arrival"
              type="time"
              v-model="item.ata"
              hide-details="auto"
              clearable
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </section>

      <section class="daily-flight-form__section">
        <div class="daily-flight-form__section-title">Route & Assignment</div>
        <!-- <div class="daily-flight-form__section-note">
          Assign route, terminal, and operational resources for this flight.
        </div> -->
        <v-row dense>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="itemsAirports"
              item-text="iata_code"
              item-value="airport_id"
              v-model="item.origin_airport_id"
              label="Origin"
              hide-details="auto"
              outlined
              required
              clearable
              prepend-inner-icon="mdi-map-marker-outline"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="itemsAirports"
              item-text="iata_code"
              item-value="airport_id"
              v-model="item.destination_airport_id"
              label="Destination"
              hide-details="auto"
              outlined
              required
              clearable
              prepend-inner-icon="mdi-map-marker-check-outline"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="itemsTerminals"
              item-text="name"
              item-value="terminal_id"
              v-model="item.terminal_id"
              label="Terminal"
              hide-details="auto"
              required
              outlined
              clearable
              prepend-inner-icon="mdi-office-building-outline"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3" v-if="item.direction_id == 1">
            <v-autocomplete
              dense
              :items="itemsBelts"
              item-text="name"
              item-value="belt_id"
              v-model="item.belt_id"
              label="Belt"
              hide-details="auto"
              required
              clearable
              outlined
              prepend-inner-icon="mdi-briefcase-variant-outline"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3" v-if="item.direction_id == 2">
            <v-autocomplete
              dense
              :items="itemsGates"
              item-text="name"
              item-value="gate_id"
              v-model="item.gate_id"
              label="Gate"
              hide-details="auto"
              required
              clearable
              outlined
              prepend-inner-icon="mdi-door"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="6" v-if="item.direction_id == 2">
            <v-autocomplete
              dense
              :items="itemsCounters"
              item-text="name"
              item-value="counter_id"
              v-model="item.counters"
              label="Counters"
              hide-details="auto"
              multiple
              :required="!item.counters.length"
              clearable
              outlined
              chips
              small-chips
              prepend-inner-icon="mdi-counter"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </section>

      <section class="daily-flight-form__section">
        <div class="daily-flight-form__section-title">Code Share</div>
        <!-- <div class="daily-flight-form__section-note">
          Manage additional airline references if this flight is shared with
          other carriers.
        </div> -->
        <div class="daily-flight-form__code-share-head">
          <v-switch
            label="Enable Code Share"
            v-model="item.is_code_share"
            inset
            color="success"
            hide-details
          ></v-switch>
          <v-btn
            color="success"
            :disabled="!item.is_code_share"
            @click="addCodeShare"
          >
            <v-icon left>mdi-plus</v-icon>
            Add Code Share
          </v-btn>
        </div>

        <div
          v-if="
            item.is_code_share && item.code_shares && item.code_shares.length
          "
          class="daily-flight-form__code-share-grid"
        >
          <div
            v-for="(share, i) in item.code_shares"
            :key="`${share.airline_id || 'share'}-${i}`"
            class="daily-flight-form__code-share-card"
          >
            <v-btn
              fab
              x-small
              color="error"
              class="daily-flight-form__code-share-remove"
              @click="removeCodeShare(share)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <div class="daily-flight-form__code-share-logo">
              <img :src="share.logo_url" :alt="share.iata_code || share.name" />
            </div>
            <div class="daily-flight-form__code-share-meta">
              <div class="daily-flight-form__code-share-airline">
                {{ share.iata_code || share.name || "-" }}
              </div>
              <div class="daily-flight-form__code-share-flight">
                {{ share.flight_no || "-" }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="item.is_code_share"
          class="daily-flight-form__empty-state"
        >
          Add one or more code share flights for this record.
        </div>
      </section>

      <section class="daily-flight-form__section">
        <div class="daily-flight-form__section-title">Remark</div>
        <!-- <div class="daily-flight-form__section-note">
          Add an optional operation note for the FIDS display or internal use.
        </div> -->
        <v-row dense>
          <v-col cols="12">
            <v-textarea
              placeholder="Add remark if needed"
              v-model="item.remark"
              label="Remark"
              auto-grow
              clearable
              outlined
              hide-details="auto"
              rows="3"
              prepend-inner-icon="mdi-text-box-outline"
            ></v-textarea>
          </v-col>
        </v-row>
      </section>
    </v-container>

    <v-dialog
      v-model="dialogCodeShare"
      persistent
      max-width="560px"
      transition="dialog-transition"
    >
      <form @submit.prevent="saveCodeShare">
        <v-card class="daily-flight-form__code-share-dialog">
          <v-card-title primary-title>
            Code Share
            <v-spacer></v-spacer>
            <v-icon @click="dialogCodeShare = false">mdi-close</v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="itemsAirlines"
                  item-text="iata_code"
                  item-value="airline_id"
                  v-model="code_share"
                  label="Airline"
                  hide-details="auto"
                  required
                  outlined
                  return-object
                  prepend-inner-icon="mdi-airplane-marker"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  label="Flight No"
                  v-model="flight_no"
                  hide-details="auto"
                  required
                  outlined
                  prepend-inner-icon="mdi-pound"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="daily-flight-form__code-share-actions">
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
  props: [
    "item",
    "dialog",
    "itemsAirlines",
    "itemsAircraftTypes",
    "itemsAirports",
    "itemsDirections",
    "itemsFlightCategories",
    "itemsTerminals",
    "itemsBelts",
    "itemsGates",
    "itemsCounters",
    "itemsOperationDays",
    "itemsFlightStatus",
    "itemsFlightStatusArrival",
    "itemsFlightStatusDeparture",
  ],

  data() {
    return {
      dialogCodeShare: false,
      code_share: null,
      flight_no: "",
    };
  },

  computed: {
    itemsFlightStatusByDirection() {
      let items = [];
      if (this.item.direction_id == 1) {
        items = this.itemsFlightStatusArrival;
      } else if (this.item.direction_id == 2) {
        items = this.itemsFlightStatusDeparture;
      } else {
        this.item.flight_status_id = null;
      }

      return items;
    },
  },

  methods: {
    async addCodeShare() {
      this.dialogCodeShare = true;
      this.code_share = null;
      this.flight_no = "";
    },

    async saveCodeShare() {
      this.dialogCodeShare = false;
      const arr = {
        airline_id: this.code_share.airline_id,
        name: this.code_share.name,
        iata_code: this.code_share.iata_code,
        icao_code: this.code_share.icao_code,
        logo_url: this.code_share.logo_url,
        country: this.code_share.country,
        remark: this.code_share.remark,
        is_active: this.code_share.is_active,
        flight_no: this.flight_no,
      };

      await this.item.code_shares.push(arr);
    },

    async removeCodeShare(item) {
      const index = this.item.code_shares.indexOf(item);
      this.item.code_shares.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.daily-flight-form {
  color: var(--text-primary);
}

.daily-flight-form__container {
  padding: 0;
}

.daily-flight-form__section {
  padding: 20px;
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    var(--surface-1) 0%,
    var(--surface-2) 100%
  );
}

.daily-flight-form__section + .daily-flight-form__section {
  margin-top: 16px;
}

.daily-flight-form__section--status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.daily-flight-form__section-title {
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.daily-flight-form__section-note {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.6;
}

.daily-flight-form__status-toggle {
  min-width: 140px;
  display: flex;
  justify-content: flex-end;
}

.daily-flight-form__code-share-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.daily-flight-form__code-share-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.daily-flight-form__code-share-card {
  position: relative;
  padding: 16px;
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background: var(--surface-3);
}

.daily-flight-form__code-share-remove {
  position: absolute;
  top: -12px;
  right: 10px;
}

.daily-flight-form__code-share-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 72px;
  padding: 8px;
  border-radius: 14px;
  background: var(--surface-1);
}

.daily-flight-form__code-share-logo img {
  max-width: 100%;
  max-height: 56px;
  object-fit: contain;
}

.daily-flight-form__code-share-meta {
  margin-top: 12px;
  display: grid;
  gap: 4px;
}

.daily-flight-form__code-share-airline {
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.daily-flight-form__code-share-flight {
  color: var(--text-primary);
  font-size: 1.05rem;
  font-weight: 800;
}

.daily-flight-form__empty-state {
  padding: 16px;
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  color: var(--text-secondary);
  background: var(--surface-2);
}

.daily-flight-form__code-share-actions {
  padding: 16px 20px 20px;
}

::v-deep .daily-flight-form .v-input__slot {
  background: var(--field-bg, var(--surface-1));
}

@media (max-width: 960px) {
  .daily-flight-form__section {
    padding: 16px;
  }

  .daily-flight-form__section--status,
  .daily-flight-form__code-share-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .daily-flight-form__status-toggle {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
