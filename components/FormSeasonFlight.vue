<template>
  <div class="season-flight-form">
    <v-container fluid class="season-flight-form__container">
      <section class="season-flight-form__section">
        <div class="season-flight-form__section-title">Schedule Window</div>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-text-field
              dense
              label="Valid From"
              type="date"
              v-model="item.valid_from"
              hide-details="auto"
              required
              clearable
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              dense
              label="Valid To"
              type="date"
              v-model="item.valid_to"
              hide-details="auto"
              required
              clearable
              outlined
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
        </v-row>
      </section>

      <section class="season-flight-form__section">
        <div class="season-flight-form__section-title">Flight Details</div>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="itemsAirlines"
              item-text="iata_code"
              item-value="airline_id"
              v-model="item.airline_id"
              label="Airline"
              hide-details="auto"
              required
              clearable
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              dense
              label="Flight No"
              v-model="item.flight_no"
              hide-details="auto"
              required
              clearable
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="itemsAircraftTypes"
              item-text="iata_code"
              item-value="aircraft_type_id"
              v-model="item.aircraft_type_id"
              label="Aircraft Type"
              hide-details="auto"
              required
              clearable
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="itemsFlightCategories"
              item-text="name"
              item-value="flight_category_id"
              v-model="item.flight_category_id"
              label="Category"
              hide-details="auto"
              clearable
              outlined
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="itemsDirections"
              item-text="name"
              item-value="direction_id"
              v-model="item.direction_id"
              label="Direction"
              hide-details="auto"
              clearable
              outlined
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="itemsAirports"
              item-text="iata_code"
              item-value="airport_id"
              v-model="item.origin_airport_id"
              label="Origin"
              hide-details="auto"
              clearable
              outlined
              required
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
              clearable
              outlined
              required
            ></v-autocomplete>
          </v-col>
        </v-row>
      </section>

      <section class="season-flight-form__section">
        <div class="season-flight-form__section-title">Operation Days</div>
        <div class="season-flight-form__section-note">
          Select one or more operating days for this flight.
        </div>
        <div class="weekday-checkbox-group">
          <label
            v-for="day in itemsOperationDays"
            :key="day.operation_day_id"
            class="weekday-checkbox-item"
            :class="{
              'weekday-checkbox-item--active': isDaySelected(
                day.operation_day_id
              ),
            }"
          >
            <v-checkbox
              :input-value="isDaySelected(day.operation_day_id)"
              :label="day.name"
              hide-details
              dense
              class="weekday-checkbox"
              @change="toggleOperationDay(day.operation_day_id)"
            ></v-checkbox>
          </label>
        </div>
      </section>

      <section class="season-flight-form__section">
        <div class="season-flight-form__section-title">
          Operation Assignment
        </div>
        <v-row dense>
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
              clearable
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            md="3"
            v-if="item.direction_id == 1 && item.direction_id != null"
          >
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
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            md="3"
            v-if="item.direction_id == 2 && item.direction_id != null"
          >
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
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            md="6"
            v-if="item.direction_id == 2 && item.direction_id != null"
          >
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
            ></v-autocomplete>
          </v-col>
        </v-row>
      </section>

      <section class="season-flight-form__section">
        <div class="season-flight-form__section-title">Remark</div>
        <v-row dense>
          <v-col cols="12">
            <v-textarea
              placeholder="Optional note for operation team"
              v-model="item.remark"
              label="Remark"
              auto-grow
              clearable
              outlined
              hide-details="auto"
              rows="3"
            ></v-textarea>
          </v-col>
        </v-row>
      </section>
    </v-container>
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
  ],
  methods: {
    isDaySelected(dayId) {
      return this.item.operation_days.includes(dayId);
    },
    toggleOperationDay(dayId) {
      const selectedDays = Array.isArray(this.item.operation_days)
        ? [...this.item.operation_days]
        : [];
      const existingIndex = selectedDays.indexOf(dayId);

      if (existingIndex >= 0) {
        selectedDays.splice(existingIndex, 1);
      } else {
        selectedDays.push(dayId);
      }

      this.item.operation_days = selectedDays;
    },
  },
};
</script>

<style lang="scss" scoped>
.season-flight-form {
  display: grid;
  gap: 16px;
  color: var(--season-form-text, var(--text-primary));
}

.season-flight-form__intro {
  padding: 4px 12px 0;
}

.season-flight-form__kicker {
  color: var(--season-form-text-muted, var(--text-muted));
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.season-flight-form__heading {
  margin-top: 4px;
  color: var(--season-form-text, var(--text-primary));
  font-size: 1.05rem;
  font-weight: 800;
}

.season-flight-form__note,
.season-flight-form__section-note {
  margin-top: 4px;
  color: var(--season-form-text-secondary, var(--text-secondary));
  font-size: 0.84rem;
}

.season-flight-form__container {
  padding-top: 0;
}

.season-flight-form__section {
  padding: 16px;
  border: 1px solid var(--season-form-border, var(--border-default));
  border-radius: 18px;
  background: var(--season-form-surface, var(--surface-1));
  box-shadow: 0 12px 28px rgba(15, 17, 15, 0.12);
}

.season-flight-form__section + .season-flight-form__section {
  margin-top: 12px;
}

.season-flight-form__section-title {
  margin-bottom: 12px;
  color: var(--season-form-text, var(--text-primary));
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.weekday-checkbox-group {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.weekday-checkbox-item {
  display: block;
  padding: 8px 12px;
  border: 1px solid var(--season-form-border, var(--border-default));
  border-radius: 14px;
  background: var(--season-form-surface-soft, var(--surface-2));
  transition: border-color 0.2s ease, background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.weekday-checkbox-item--active {
  border-color: var(--season-form-border-strong, var(--border-strong));
  background: var(--season-form-surface-active, var(--surface-3));
}

.weekday-checkbox {
  margin-top: 0;
  padding-top: 0;
}

.weekday-checkbox::v-deep .v-input--selection-controls__input {
  margin-right: 8px;
}

.weekday-checkbox::v-deep .v-label {
  color: var(--season-form-text, var(--text-primary));
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.weekday-checkbox::v-deep .v-input--selection-controls {
  margin-top: 0;
  padding-top: 0;
}

:deep(.app-theme-light) .season-flight-form,
:deep(.theme--light) .season-flight-form {
  --season-form-surface: #171c17;
  --season-form-surface-soft: #202620;
  --season-form-surface-active: #283028;
  --season-form-border: rgba(255, 255, 255, 0.1);
  --season-form-border-strong: rgba(184, 227, 90, 0.48);
  --season-form-text: #f3f6ef;
  --season-form-text-secondary: rgba(243, 246, 239, 0.72);
  --season-form-text-muted: rgba(243, 246, 239, 0.5);
  --season-form-picker-filter: invert(1) brightness(1.15);
}

:deep(.app-theme-dark) .season-flight-form,
:deep(.theme--dark) .season-flight-form {
  --season-form-surface: #ffffff;
  --season-form-surface-soft: #f4f7f1;
  --season-form-surface-active: #eaf3df;
  --season-form-border: #d8e2cf;
  --season-form-border-strong: #b9c9a9;
  --season-form-text: #0d110f;
  --season-form-text-secondary: #53604a;
  --season-form-text-muted: #7b8772;
  --season-form-picker-filter: invert(0.08) sepia(0.12) saturate(1.2)
    hue-rotate(12deg);
}

:deep(.season-flight-form .v-input__slot) {
  background: var(--season-form-surface-soft, var(--surface-2)) !important;
}

:deep(.season-flight-form .v-label) {
  color: var(--season-form-text-secondary, var(--text-secondary)) !important;
}

:deep(.season-flight-form input),
:deep(.season-flight-form textarea) {
  color: var(--season-form-text, var(--text-primary)) !important;
}

:deep(.season-flight-form .v-input input::placeholder),
:deep(.season-flight-form .v-input textarea::placeholder) {
  color: var(--season-form-text-muted, var(--text-muted)) !important;
}

:deep(.season-flight-form .v-text-field--outlined fieldset),
:deep(.season-flight-form .v-select--outlined fieldset),
:deep(.season-flight-form .v-autocomplete--outlined fieldset),
:deep(.season-flight-form .v-textarea--outlined fieldset) {
  border-color: var(--season-form-border, var(--border-default)) !important;
}

:deep(.season-flight-form .v-input--is-focused fieldset) {
  border-color: var(--season-form-border-strong, var(--border-strong)) !important;
}

:deep(.season-flight-form .v-select__selection),
:deep(.season-flight-form .v-select__selection--comma) {
  color: var(--season-form-text, var(--text-primary)) !important;
}

:deep(.season-flight-form .v-chip) {
  color: var(--season-form-text, var(--text-primary)) !important;
}

:deep(.season-flight-form input[type="date"]),
:deep(.season-flight-form input[type="time"]) {
  color-scheme: light;
}

:deep(.season-flight-form input[type="date"]::-webkit-calendar-picker-indicator),
:deep(.season-flight-form input[type="time"]::-webkit-calendar-picker-indicator) {
  cursor: pointer;
  opacity: 0.9;
  filter: var(--season-form-picker-filter);
}

@media (max-width: 1264px) {
  .weekday-checkbox-group {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .season-flight-form__intro {
    padding-inline: 4px;
  }

  .season-flight-form__section {
    padding: 12px;
    border-radius: 16px;
  }

  .weekday-checkbox-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
