<template>
  <div>
    <div v-if="title == 'Flights'">
      <v-data-table
        :headers="headersFlights"
        :items="items"
        :sort-by="['flight_date']"
        :sort-asc="[true]"
        :search="search"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.dir`]="{ item }">
          {{ mapDirection(item.Direction.name) }}
        </template>
        <template v-slot:[`item.cat`]="{ item }">
          {{ mapCategory(item.FlightCategory.name) }}
        </template>
        <template v-slot:[`item.al`]="{ item }">
          <div class="table-logo-cell">
            <img :src="item.Airline.logo_url" class="table-logo" />
          </div>
        </template>
        <template v-slot:[`item.std`]="{ item }">
          {{ $moment.utc(item.std, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.sta`]="{ item }">
          {{ $moment.utc(item.sta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.etd`]="{ item }">
          {{ $moment.utc(item.etd, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.eta`]="{ item }">
          {{ $moment.utc(item.eta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.atd`]="{ item }">
          <div v-if="item.atd">
            {{ $moment.utc(item.atd, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.ata`]="{ item }">
          <div v-if="item.ata">
            {{ $moment.utc(item.ata, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip label :color="getColorByStatus(item)" dark>{{
            item.FlightStatus.name
          }}</v-chip>
        </template>
      </v-data-table>
    </div>

    <div v-if="title == 'Arrivals'">
      <v-data-table
        :headers="headersArrivals"
        :items="items"
        :sort-by="['flight_date']"
        :sort-asc="[true]"
        :search="search"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.dir`]="{ item }">
          {{ mapDirection(item.Direction.name) }}
        </template>
        <template v-slot:[`item.cat`]="{ item }">
          {{ mapCategory(item.FlightCategory.name) }}
        </template>
        <template v-slot:[`item.al`]="{ item }">
          <div class="table-logo-cell">
            <img :src="item.Airline.logo_url" class="table-logo" />
          </div>
        </template>
        <template v-slot:[`item.std`]="{ item }">
          {{ $moment.utc(item.std, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.sta`]="{ item }">
          {{ $moment.utc(item.sta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.eta`]="{ item }">
          {{ $moment.utc(item.eta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.ata`]="{ item }">
          <div v-if="item.ata">
            {{ $moment.utc(item.ata, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip label :color="getColorByStatus(item)" dark>{{
            item.FlightStatus.name
          }}</v-chip>
        </template>
      </v-data-table>
    </div>

    <div v-if="title == 'Departures'">
      <v-data-table
        :headers="headersDepartures"
        :items="items"
        :sort-by="['flight_date']"
        :sort-asc="[true]"
        :search="search"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.dir`]="{ item }">
          {{ mapDirection(item.Direction.name) }}
        </template>
        <template v-slot:[`item.cat`]="{ item }">
          {{ mapCategory(item.FlightCategory.name) }}
        </template>
        <template v-slot:[`item.al`]="{ item }">
          <div class="table-logo-cell">
            <img :src="item.Airline.logo_url" class="table-logo" />
          </div>
        </template>
        <template v-slot:[`item.std`]="{ item }">
          {{ $moment.utc(item.std, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.sta`]="{ item }">
          {{ $moment.utc(item.sta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.etd`]="{ item }">
          {{ $moment.utc(item.etd, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.eta`]="{ item }">
          {{ $moment.utc(item.eta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.atd`]="{ item }">
          <div v-if="item.atd">
            {{ $moment.utc(item.atd, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.ata`]="{ item }">
          <div v-if="item.ata">
            {{ $moment.utc(item.ata, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip label :color="getColorByStatus(item)" dark>{{
            item.FlightStatus.name
          }}</v-chip>
        </template>
      </v-data-table>
    </div>

    <div v-if="title == 'Ontime'">
      <v-data-table
        :headers="headersOntime"
        :items="items"
        :sort-by="['flight_date']"
        :sort-asc="[true]"
        :search="search"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.dir`]="{ item }">
          {{ mapDirection(item.Direction.name) }}
        </template>
        <template v-slot:[`item.cat`]="{ item }">
          {{ mapCategory(item.FlightCategory.name) }}
        </template>
        <template v-slot:[`item.al`]="{ item }">
          <div class="table-logo-cell">
            <img :src="item.Airline.logo_url" class="table-logo" />
          </div>
        </template>
        <template v-slot:[`item.std`]="{ item }">
          {{ $moment.utc(item.std, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.sta`]="{ item }">
          {{ $moment.utc(item.sta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.etd`]="{ item }">
          <div v-if="item.direction_id == 2">
            {{ $moment.utc(item.etd, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.eta`]="{ item }">
          <div v-if="item.direction_id == 1">
            {{ $moment.utc(item.eta, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.atd`]="{ item }">
          <div v-if="item.direction_id == 2">
            <div v-if="item.atd">
              {{ $moment.utc(item.atd, "HH:mm:ss").local().format("hh:mm A") }}
            </div>
          </div>
        </template>
        <template v-slot:[`item.ata`]="{ item }">
          <div v-if="item.direction_id == 1">
            <div v-if="item.ata">
              {{ $moment.utc(item.ata, "HH:mm:ss").local().format("hh:mm A") }}
            </div>
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip label :color="getColorByStatus(item)" dark>{{
            item.FlightStatus.name
          }}</v-chip>
        </template>
      </v-data-table>
    </div>

    <div v-if="title == 'Delayed'">
      <v-data-table
        :headers="headersDelayed"
        :items="items"
        :sort-by="['flight_date']"
        :sort-asc="[true]"
        :search="search"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.dir`]="{ item }">
          {{ mapDirection(item.Direction.name) }}
        </template>
        <template v-slot:[`item.cat`]="{ item }">
          {{ mapCategory(item.FlightCategory.name) }}
        </template>
        <template v-slot:[`item.al`]="{ item }">
          <div class="table-logo-cell">
            <img :src="item.Airline.logo_url" class="table-logo" />
          </div>
        </template>
        <template v-slot:[`item.std`]="{ item }">
          {{ $moment.utc(item.std, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.sta`]="{ item }">
          {{ $moment.utc(item.sta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.etd`]="{ item }">
          <div v-if="item.direction_id == 2">
            {{ $moment.utc(item.etd, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.eta`]="{ item }">
          <div v-if="item.direction_id == 1">
            {{ $moment.utc(item.eta, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.atd`]="{ item }">
          <div v-if="item.direction_id == 2">
            <div v-if="item.atd">
              {{ $moment.utc(item.atd, "HH:mm:ss").local().format("hh:mm A") }}
            </div>
          </div>
        </template>
        <template v-slot:[`item.ata`]="{ item }">
          <div v-if="item.direction_id == 1">
            <div v-if="item.ata">
              {{ $moment.utc(item.ata, "HH:mm:ss").local().format("hh:mm A") }}
            </div>
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip label :color="getColorByStatus(item)" dark>{{
            item.FlightStatus.name
          }}</v-chip>
        </template>
      </v-data-table>
    </div>

    <div v-if="title == 'Cancelled'">
      <v-data-table
        :headers="headersCancelled"
        :items="items"
        :sort-by="['flight_date']"
        :sort-asc="[true]"
        :search="search"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.dir`]="{ item }">
          {{ mapDirection(item.Direction.name) }}
        </template>
        <template v-slot:[`item.cat`]="{ item }">
          {{ mapCategory(item.FlightCategory.name) }}
        </template>
        <template v-slot:[`item.al`]="{ item }">
          <div class="table-logo-cell">
            <img :src="item.Airline.logo_url" class="table-logo" />
          </div>
        </template>
        <template v-slot:[`item.std`]="{ item }">
          {{ $moment.utc(item.std, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.sta`]="{ item }">
          {{ $moment.utc(item.sta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.etd`]="{ item }">
          {{ $moment.utc(item.etd, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.eta`]="{ item }">
          {{ $moment.utc(item.eta, "HH:mm:ss").local().format("hh:mm A") }}
        </template>
        <template v-slot:[`item.atd`]="{ item }">
          <div v-if="item.atd">
            {{ $moment.utc(item.atd, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.ata`]="{ item }">
          <div v-if="item.ata">
            {{ $moment.utc(item.ata, "HH:mm:ss").local().format("hh:mm A") }}
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip label :color="getColorByStatus(item)" dark>{{
            item.FlightStatus.name
          }}</v-chip>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["items", "title", "search"],
  data() {
    return {
      headersFlights: [
        { text: "#", value: "index", align: "center", sortable: false },
        {
          text: "DATE",
          value: "flight_date",
          align: "center",
          sortable: false,
        },
        {
          text: "Flight No",
          value: "flight_no",
          align: "center",
          sortable: false,
        },
        {
          text: "Dir.",
          value: "dir",
          align: "center",
          sortable: false,
        },
        {
          text: "Category",
          value: "cat",
          align: "center",
          sortable: false,
        },
        {
          text: "Airline",
          value: "al",
          align: "center",
          sortable: false,
        },
        {
          text: "Origin",
          value: "OriginDaily.iata_code",
          align: "center",
          sortable: false,
        },
        {
          text: "Dest.",
          value: "DestinationDaily.iata_code",
          align: "center",
          sortable: false,
        },
        { text: "Sched. Dep.", value: "std", align: "center", sortable: false },
        { text: "Sched. Arr.", value: "sta", align: "center", sortable: false },
        { text: "Est. Dep.", value: "etd", align: "center", sortable: false },
        { text: "Est. Arr.", value: "eta", align: "center", sortable: false },
        { text: "Actual Dep.", value: "atd", align: "center", sortable: false },
        { text: "Actual Arr.", value: "ata", align: "center", sortable: false },
        {
          text: "STATUS",
          value: "status",
          align: "center",
          sortable: false,
        },
        {
          text: "REMARK",
          value: "remark",
          sortable: false,
        },
      ],
      headersArrivals: [
        { text: "#", value: "index", align: "center", sortable: false },
        {
          text: "DATE",
          value: "flight_date",
          align: "center",
          sortable: false,
        },
        {
          text: "Flight No",
          value: "flight_no",
          align: "center",
          sortable: false,
        },
        {
          text: "Dir.",
          value: "dir",
          align: "center",
          sortable: false,
        },
        {
          text: "Category",
          value: "cat",
          align: "center",
          sortable: false,
        },
        {
          text: "Airline",
          value: "al",
          align: "center",
          sortable: false,
        },
        {
          text: "Origin",
          value: "OriginDaily.iata_code",
          align: "center",
          sortable: false,
        },
        {
          text: "Dest.",
          value: "DestinationDaily.iata_code",
          align: "center",
          sortable: false,
        },
        { text: "Sched. Dep.", value: "std", align: "center", sortable: false },
        { text: "Sched. Arr.", value: "sta", align: "center", sortable: false },
        { text: "Est. Arr.", value: "eta", align: "center", sortable: false },
        { text: "Actual Arr.", value: "ata", align: "center", sortable: false },
        {
          text: "STATUS",
          value: "status",
          align: "center",
          sortable: false,
        },
        {
          text: "REMARK",
          value: "remark",
          sortable: false,
        },
      ],
      headersDepartures: [
        { text: "#", value: "index", align: "center", sortable: false },
        {
          text: "DATE",
          value: "flight_date",
          align: "center",
          sortable: false,
        },
        {
          text: "Flight No",
          value: "flight_no",
          align: "center",
          sortable: false,
        },
        {
          text: "Dir.",
          value: "dir",
          align: "center",
          sortable: false,
        },
        {
          text: "Category",
          value: "cat",
          align: "center",
          sortable: false,
        },
        {
          text: "Airline",
          value: "al",
          align: "center",
          sortable: false,
        },
        {
          text: "Origin",
          value: "OriginDaily.iata_code",
          align: "center",
          sortable: false,
        },
        {
          text: "Dest.",
          value: "DestinationDaily.iata_code",
          align: "center",
          sortable: false,
        },
        { text: "Sched. Dep.", value: "std", align: "center", sortable: false },
        { text: "Sched. Arr.", value: "sta", align: "center", sortable: false },
        { text: "Est. Dep.", value: "etd", align: "center", sortable: false },
        { text: "Actual Dep.", value: "atd", align: "center", sortable: false },
        {
          text: "STATUS",
          value: "status",
          align: "center",
          sortable: false,
        },
        {
          text: "REMARK",
          value: "remark",
          sortable: false,
        },
      ],
      headersOntime: [
        { text: "#", value: "index", align: "center", sortable: false },
        {
          text: "DATE",
          value: "flight_date",
          align: "center",
          sortable: false,
        },
        {
          text: "Flight No",
          value: "flight_no",
          align: "center",
          sortable: false,
        },
        {
          text: "Dir.",
          value: "dir",
          align: "center",
          sortable: false,
        },
        {
          text: "Category",
          value: "cat",
          align: "center",
          sortable: false,
        },
        {
          text: "Airline",
          value: "al",
          align: "center",
          sortable: false,
        },
        {
          text: "Origin",
          value: "OriginDaily.iata_code",
          align: "center",
          sortable: false,
        },
        {
          text: "Dest.",
          value: "DestinationDaily.iata_code",
          align: "center",
          sortable: false,
        },
        { text: "Sched. Dep.", value: "std", align: "center", sortable: false },
        { text: "Sched. Arr.", value: "sta", align: "center", sortable: false },
        { text: "Est. Dep.", value: "etd", align: "center", sortable: false },
        { text: "Est. Arr.", value: "eta", align: "center", sortable: false },
        { text: "Actual Dep.", value: "atd", align: "center", sortable: false },
        { text: "Actual Arr.", value: "ata", align: "center", sortable: false },
        {
          text: "STATUS",
          value: "status",
          align: "center",
          sortable: false,
        },
        {
          text: "REMARK",
          value: "remark",
          sortable: false,
        },
      ],
      headersDelayed: [
        { text: "#", value: "index", align: "center", sortable: false },
        {
          text: "DATE",
          value: "flight_date",
          align: "center",
          sortable: false,
        },
        {
          text: "Flight No",
          value: "flight_no",
          align: "center",
          sortable: false,
        },
        {
          text: "Dir.",
          value: "dir",
          align: "center",
          sortable: false,
        },
        {
          text: "Category",
          value: "cat",
          align: "center",
          sortable: false,
        },
        {
          text: "Airline",
          value: "al",
          align: "center",
          sortable: false,
        },
        {
          text: "Origin",
          value: "OriginDaily.iata_code",
          align: "center",
          sortable: false,
        },
        {
          text: "Dest.",
          value: "DestinationDaily.iata_code",
          align: "center",
          sortable: false,
        },
        { text: "Sched. Dep.", value: "std", align: "center", sortable: false },
        { text: "Sched. Arr.", value: "sta", align: "center", sortable: false },
        { text: "Est. Dep.", value: "etd", align: "center", sortable: false },
        { text: "Est. Arr.", value: "eta", align: "center", sortable: false },
        { text: "Actual Dep.", value: "atd", align: "center", sortable: false },
        { text: "Actual Arr.", value: "ata", align: "center", sortable: false },
        {
          text: "STATUS",
          value: "status",
          align: "center",
          sortable: false,
        },
        {
          text: "REMARK",
          value: "remark",
          sortable: false,
        },
      ],
      headersCancelled: [
        { text: "#", value: "index", align: "center", sortable: false },
        {
          text: "DATE",
          value: "flight_date",
          align: "center",
          sortable: false,
        },
        {
          text: "Flight No",
          value: "flight_no",
          align: "center",
          sortable: false,
        },
        {
          text: "Dir.",
          value: "dir",
          align: "center",
          sortable: false,
        },
        {
          text: "Category",
          value: "cat",
          align: "center",
          sortable: false,
        },
        {
          text: "Airline",
          value: "al",
          align: "center",
          sortable: false,
        },
        {
          text: "Origin",
          value: "OriginDaily.iata_code",
          align: "center",
          sortable: false,
        },
        {
          text: "Dest.",
          value: "DestinationDaily.iata_code",
          align: "center",
          sortable: false,
        },
        { text: "Sched. Dep.", value: "std", align: "center", sortable: false },
        { text: "Sched. Arr.", value: "sta", align: "center", sortable: false },
        { text: "Est. Dep.", value: "etd", align: "center", sortable: false },
        { text: "Est. Arr.", value: "eta", align: "center", sortable: false },
        { text: "Actual Dep.", value: "atd", align: "center", sortable: false },
        { text: "Actual Arr.", value: "ata", align: "center", sortable: false },
        {
          text: "STATUS",
          value: "status",
          align: "center",
          sortable: false,
        },
        {
          text: "REMARK",
          value: "remark",
          sortable: false,
        },
      ],
    };
  },

  methods: {
    mapDirection(value) {
      switch (value) {
        case "Arrival":
          return "ARR";
        case "Departure":
          return "DEP";
        default:
          return value;
      }
    },
    mapCategory(value) {
      switch (value) {
        case "Domestic":
          return "DOM";
        case "International":
          return "INT";
        default:
          return value;
      }
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
  },
};
</script>

<style lang="scss" scoped></style>
