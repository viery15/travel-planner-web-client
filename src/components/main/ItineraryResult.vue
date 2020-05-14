<template>
  <div style="margin-top: 30px; margin-bottom: 30px; display:none;" id="result">
    <GmapMap
      v-if="showMaps"
      ref="map"
      style="width: '100%; height: 300px;"
      :zoom="1"
      :center="{ lat: 0, lng: 0 }"
    ></GmapMap>

    <table class="table table-bordered table-hover" style="margin-top: 20px">
      <tr>
        <th>Waktu</th>
        <th>Keterangan</th>
        <th>Perkiraan Cuaca</th>
        <th>Status</th>
      </tr>
      <tr v-for="(tempat, index) in dataItinerary.response" v-bind:key="index">
        <td>{{ tempat.waktu }}</td>
        <td>{{ tempat.nama }}</td>
        <th>{{ tempat.cuaca }}</th>
        <th>{{ tempat.status }}</th>
      </tr>
    </table>
  </div>
</template>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<script>
export default {
  data() {
    return {
      waypoints: [],
      showMaps: true,
    };
  },

  computed: {
    dataItinerary() {
      return this.$store.state.dataItinerary;
    },
  },

  mounted() {},

  watch: {
    waypoints: function(val) {
      $("#result").show();
    },
    dataItinerary: function(val) {
      this.getRoute();
    },
  },

  methods: {
    async getRoute() {
      this.showMaps = false;
      this.waypoints = await this.setWaypoints();
      await this.resetMap();
      this.$refs.map.$mapPromise.then((map) => {
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();

        this.directionsDisplay.setMap(this.$refs.map.$mapObject);
        var vm = this;
        vm.directionsService.route(
          {
            origin: new google.maps.LatLng(
              "-7.942637178081287",
              "112.70264024097918"
            ),
            waypoints: this.waypoints,
            destination: new google.maps.LatLng(
              "-7.942637178081287",
              "112.70264024097918"
            ),
            travelMode: "DRIVING",
          },
          function(response, status) {
            if (status === "OK") {
              vm.directionsDisplay.setDirections(response);
            } else {
              console.log("Directions request failed due to " + status);
            }
          }
        );
      });
    },

    setWaypoints() {
      let waypoints = [];
      for (let index = 0; index < this.dataItinerary.response.length; index++) {
        if (this.dataItinerary.response[index].location != undefined) {
          waypoints.push({
            location: new google.maps.LatLng(
              this.dataItinerary.response[index].location.latitude,
              this.dataItinerary.response[index].location.longitude
            ),
            stopover: true,
          });
        }
      }

      return waypoints;
    },

    resetMap() {
      this.showMaps = true;
    },
  },
};
</script>
