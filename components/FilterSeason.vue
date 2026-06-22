<template>
  <div>
    <v-card class="my-2 season-filter-card">
      <v-card-title class="filter-card-title">
        <div class="filter-card-title-content">
          <div class="filter-card-kicker">Filter Panel</div>
          <div class="filter-card-heading">
            <v-icon large class="mr-2 filter-card-heading-icon">
              mdi-calendar-month</v-icon
            >
            Season Flight Filters
          </div>
        </div>
        <div class="filter-card-title-note">
          Auto updates when fields change
        </div>
      </v-card-title>
      <v-card-text class="filter-card-body">
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
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="filter-card-actions">
        <v-btn
          color="info"
          @click="$emit('refresh')"
          title="Reset"
          aria-label="Reset"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: [
    "itemsFilter",
    "itemsDirections",
    "itemsFlightCategories",
    "itemsAirlines",
    "itemsAirports",
    "itemsOperationDays",
    "refresh",
  ],
  methods: {
    isDaySelected(dayId) {
      return this.itemsFilter.operation_days.includes(dayId);
    },
    toggleOperationDay(dayId) {
      const selectedDays = [...this.itemsFilter.operation_days];
      const existingIndex = selectedDays.indexOf(dayId);

      if (existingIndex >= 0) {
        selectedDays.splice(existingIndex, 1);
      } else {
        selectedDays.push(dayId);
      }

      this.$emit("update:itemsFilter", {
        ...this.itemsFilter,
        operation_days: selectedDays,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.season-filter-card {
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

:deep(.theme--light) .filter-card-title-note,
:deep(.app-theme-light) .filter-card-title-note {
  color: #5f6b57;
}

:deep(.theme--light) .filter-card-kicker,
:deep(.app-theme-light) .filter-card-kicker {
  color: #4f5d46;
}

:deep(.theme--light) .filter-card-heading,
:deep(.app-theme-light) .filter-card-heading,
:deep(.theme--light) .filter-card-heading-icon,
:deep(.app-theme-light) .filter-card-heading-icon {
  color: #0d110f;
}

:deep(.theme--dark) .filter-card-title-note,
:deep(.app-theme-dark) .filter-card-title-note {
  color: rgba(243, 246, 239, 0.74);
}

:deep(.theme--dark) .filter-card-kicker,
:deep(.app-theme-dark) .filter-card-kicker {
  color: rgba(232, 239, 225, 0.82);
}

:deep(.theme--dark) .filter-card-heading {
  color: #f3f6ef;
}

:deep(.theme--dark) .filter-card-heading-icon,
:deep(.app-theme-dark) .filter-card-heading-icon {
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
</style>
