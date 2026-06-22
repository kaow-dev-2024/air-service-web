<template>
  <div>
    <v-row>
      <v-col cols="12" md="3">
        <!-- Group box: Direction & Category -->
        <fieldset>
          <legend
            style="
              color: red;
              margin-left: 5px;
              padding: 0 5px 0 5px;
              font-size: 16px;
              font-weight: bold;
            "
          >
            Direction & Category
          </legend>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="itemsDirections"
                  item-text="name"
                  item-value="direction_id"
                  v-model="item.direction_id"
                  label="Direction"
                  hide-details
                  clearable
                  outlined
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="itemsFlightCategories"
                  item-text="name"
                  item-value="flight_category_id"
                  v-model="item.flight_category_id"
                  label="Category"
                  hide-details
                  clearable
                  outlined
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </fieldset>
      </v-col>
      <v-col cols="12" md="3">
        <!-- Group box: Airline -->
        <fieldset>
          <legend
            style="
              color: red;
              margin-left: 5px;
              padding: 0 5px 0 5px;
              font-size: 16px;
              font-weight: bold;
            "
          >
            Airline
          </legend>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  label="Flight No"
                  v-model="item.flight_no"
                  hide-details
                  required
                  clearable
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="itemsAirlines"
                  item-text="iata_code"
                  item-value="airline_id"
                  v-model="item.airline_id"
                  label="Airline"
                  hide-details
                  required
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </fieldset>
      </v-col>
      <v-col cols="12" md="3">
        <!-- Group box: Aircraft Type -->
        <fieldset>
          <legend
            style="
              color: red;
              margin-left: 5px;
              padding: 0 5px 0 5px;
              font-size: 16px;
              font-weight: bold;
            "
          >
            Aircraft Type
          </legend>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="12">
                <v-autocomplete
                  dense
                  :items="itemsAircraftTypes"
                  item-text="model"
                  item-value="aircraft_type_id"
                  v-model="item.aircraft_type_id"
                  label="Aircraft Type"
                  hide-details
                  required
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </fieldset>
      </v-col>
      <v-col cols="12" md="3">
        <!-- Group box: Origin & Destination -->
        <fieldset>
          <legend
            style="
              color: red;
              margin-left: 5px;
              padding: 0 5px 0 5px;
              font-size: 16px;
              font-weight: bold;
            "
          >
            Origin & Destination
          </legend>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="itemsAirports"
                  item-text="iata_code"
                  item-value="airport_id"
                  v-model="item.origin_airport_id"
                  label="Origin"
                  hide-details
                  clearable
                  outlined
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="itemsAirports"
                  item-text="iata_code"
                  item-value="airport_id"
                  v-model="item.destination_airport_id"
                  label="Destination"
                  hide-details
                  clearable
                  outlined
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </fieldset>
      </v-col>
      <v-col cols="12" md="9">
        <!-- Group box: Schedule -->
        <fieldset>
          <legend
            style="
              color: red;
              margin-left: 5px;
              padding: 0 5px 0 5px;
              font-size: 16px;
              font-weight: bold;
            "
          >
            Schedule
          </legend>

          <v-container fluid>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  dense
                  label="Schedule Time Departure"
                  type="time"
                  v-model="item.std"
                  hide-details
                  required
                  clearable
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  dense
                  label="Schedule Time Arrival"
                  type="time"
                  v-model="item.sta"
                  hide-details
                  required
                  clearable
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  dense
                  label="Valid From"
                  type="date"
                  v-model="item.valid_from"
                  hide-details
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
                  hide-details
                  required
                  clearable
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </fieldset>
      </v-col>
      <v-col cols="12" md="3">
        <!-- Group box: Operation Days -->
        <fieldset>
          <legend
            style="
              color: red;
              margin-left: 5px;
              padding: 0 5px 0 5px;
              font-size: 16px;
              font-weight: bold;
            "
          >
            Operation Days
          </legend>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="12">
                <v-autocomplete
                  dense
                  placeholder="Please select an item."
                  :items="itemsOperationDays"
                  item-text="operation_day_id"
                  item-value="operation_day_id"
                  v-model="item.operation_days"
                  hide-details
                  multiple
                  :required="!item.operation_days.length"
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </fieldset>
      </v-col>
      <v-col cols="12" md="9">
        <!-- Group box: RMS -->
        <fieldset>
          <legend
            style="
              color: red;
              margin-left: 5px;
              padding: 0 5px 0 5px;
              font-size: 16px;
              font-weight: bold;
            "
          >
            RMS
          </legend>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="2">
                <v-autocomplete
                  dense
                  :items="itemsTerminals"
                  item-text="name"
                  item-value="terminal_id"
                  v-model="item.terminal_id"
                  label="Terminal"
                  hide-details
                  required
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                md="2"
                v-if="
                  this.item.direction_id == 1 && this.item.direction_id != null
                "
              >
                <v-autocomplete
                  dense
                  :items="itemsBelts"
                  item-text="name"
                  item-value="belt_id"
                  v-model="item.belt_id"
                  label="Belt"
                  hide-details
                  required
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                md="2"
                v-if="
                  this.item.direction_id == 2 && this.item.direction_id != null
                "
              >
                <v-autocomplete
                  dense
                  :items="itemsGates"
                  item-text="name"
                  item-value="gate_id"
                  v-model="item.gate_id"
                  label="Gate"
                  hide-details
                  required
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                md="8"
                v-if="
                  this.item.direction_id == 2 && this.item.direction_id != null
                "
              >
                <v-autocomplete
                  dense
                  :items="itemsCounters"
                  item-text="name"
                  item-value="counter_id"
                  v-model="item.counters"
                  label="Counters"
                  hide-details
                  multiple
                  :required="!item.counters.length"
                  clearable
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </fieldset>
      </v-col>

      <v-col cols="12" md="12">
        <!-- Group box: Remark -->
        <fieldset>
          <legend
            style="
              color: red;
              margin-left: 5px;
              padding: 0 5px 0 5px;
              font-size: 16px;
              font-weight: bold;
            "
          >
            Remark
          </legend>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="12">
                <v-textarea
                  placeholder="If there is"
                  v-model="item.remark"
                  auto-grow
                  clearable
                  outlined
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </fieldset>
      </v-col>
    </v-row>
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
};
</script>

<style lang="scss" scoped></style>
