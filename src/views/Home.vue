<template>
  <div class="home">
    <br><br>
    <div class="row">
      <div class="col-md-6">
          <div class="form-group">
            <label for="coordinate">Tanggal:</label><br>
            <input type="date" class="form-control" v-model="tanggal">
          </div>
          <div class="form-group">
            <label for="coordinate">Titik awal:</label><br>
            <input type="text" class="form-control" v-model="latitude" style="width:30%; float:left; margin-right:2%">
            <input type="text" class="form-control" v-model="longitude" style="width:30%; margin-right:2%">
            <button class="btn btn-sm btn-primary" v-on:click="titikPens()">PENS</button>
            <button class="btn btn-sm btn-primary" v-on:click="titikMalang()">Malang</button>
            <button class="btn btn-sm btn-success" v-on:click="geolocation()">Locate Me</button>
          </div>
           <div class="form-group">
            <label for="coordinate">Titik akhir:</label><br>
            <input type="text" class="form-control" v-model="latitude_akhir" style="width:30%; float:left; margin-right:2%">
            <input type="text" class="form-control" v-model="longitude_akhir" style="width:30%; margin-right:2%">
            <button class="btn btn-sm btn-primary" v-on:click="titikAkhir()">Titik awal</button>
          </div>
          <div class="form-group">
            <label for="coordinate">Jam Mulai:</label><br>
            <input type="number" class="form-control" v-model="jam_mulai" style="width:15%; float:left">
            <input type="number" class="form-control" v-model="menit_mulai" style="width:15%">
          </div>
          <button v-on:click="getDestination();" type="button" class="btn btn-primary">Submit</button><br><br>
      </div>
    </div>
    <div v-for="(selectDestination, index) in selectedDestination" v-bind:key="selectDestination.number" class="row">
      <div class="col-md-6">
        <h3>Destinasi {{index+1}}</h3>
        <div class="form-group" style="width:60%; float:left;">
          <label for="sel1">Destinasi: </label>
          <select v-on:change="onChangeDestinasi($event)" class="form-control" v-model="selectDestination.destinasi">
            <option value="" disabled selected>Destinasi Wisata</option>
            <option v-for='destinasi in dataDestinasi' v-bind:key="destinasi._id" v-bind:value="destinasi._id">{{destinasi.tempat}}</option>
          </select>
        </div>
        <div class="form-group" style="width:35%; float:right; ">
          <label for="coordinate">Lama Stay (Jam):</label><br>
          <input type="number" class="form-control" v-model="selectDestination.lama_stay">
        </div>
        <br><br><br>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="text-center" style="clear:both">
          <button v-on:click="addDestination()" class="btn btn-success btn-sm center" id="btnTambahDestinasi" style="display:none"><font-awesome-icon icon="plus"/></button>
        </div>
      </div>
    </div>
    <br>
    <button v-on:click="submit()" type="button" class="btn btn-primary" style="width:100%">Submit</button>
    <br><br><br>
    <GmapMap  ref="map" style="width: '100%; height: 300px;" :zoom="1" :center="{lat: 0, lng: 0}"></GmapMap>
    <br><br><br>

    <table class="table table-bordered table-hover">
      <tr>
        <th>Waktu</th>
        <th>Keterangan</th>
        <th>Perkiraan Cuaca</th>
        <th>Status</th>
      </tr>
      <tr v-for="(tempat, index) in res.response" v-bind:key="index">
        <td>{{tempat.waktu}}</td>
        <td>{{tempat.nama}}</td>
        <th>{{tempat.cuaca}}</th>
        <th>{{tempat.status}}</th>
      </tr>
    </table>
    <div v-if="location">
    Your location data is {{ location.coords.latitude }}, {{ location.coords.longitude}}
  </div>
  </div>
</template>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAnpBN3XcUxdUV56dXxTfuhHBvEySitlY&callback=initMap">
</script>

<script>
import axios from 'axios'
import 'vue-loading-overlay/dist/vue-loading.css'
import {gmapApi} from 'vue2-google-maps'
// import RouteMaps from '../components/main/RouteMaps'

export default {
  name: 'home',
  directionsService: null,
  directionsDisplay: null,
  data(){
    return {
      latitude: "",
      longitude: "",
      latitude_akhir: "",
      longitude_akhir: "",
      dataDestinasi: [],
      selectedDestination:[],
      res: "",
      pens_latitude: "-7.276420",
      pens_longitude: "112.793199",
      jam_mulai: "",
      menit_mulai: "",
      tanggal: "",
      gettingLocation: false,
      location:null,
      errorStr:null,
      noLocation: false,
      coodinates: null,
      waypoints: [],
      url: "https://travel-main-proccess.herokuapp.com/"
    }
  },

  components: {
    // RouteMaps
  },

  mounted(){
    
  },

  methods:{
    async getDestination(){
      const newComponent = new URLSearchParams()
      newComponent.append('latitude', this.latitude)
      newComponent.append('longitude', this.longitude)

      axios.post(this.url, newComponent)
        .then((response) => {
            this.dataDestinasi = response.data.response;
            this.selectedDestination.push({
              number: this.selectedDestination.length + 1,
              destinasi: "",
              lama_stay: ""
            });
            $("#btnTambahDestinasi").show();
        })
        .catch((e) => {
            /* eslint-disable no-console */
            console.log(e)
            /* eslint-enable no-console */
        })
    },

    addDestination(){
      this.selectedDestination.push({
        number: this.selectedDestination.length + 1,
        destinasi: "",
        lama_stay: ""
      });
    },

    submit(){
      const newComponent = new URLSearchParams()
      newComponent.append('data', JSON.stringify(this.selectedDestination))
      newComponent.append('latitude', this.latitude)
      newComponent.append('longitude', this.longitude)
      newComponent.append('latitude_akhir', this.latitude_akhir)
      newComponent.append('longitude_akhir', this.longitude_akhir)
      newComponent.append('jam_mulai', this.jam_mulai)
      newComponent.append('menit_mulai', this.menit_mulai)
      newComponent.append('tanggal', this.tanggal)

      for (let index = 0; index < this.selectedDestination.length; index++) {
          let coord = this.dataDestinasi.find(x => x._id === this.selectedDestination[index].destinasi).location;
          
          this.waypoints.push({
            location: new google.maps.LatLng(coord.latitude, coord.longitude),
            stopover: true
          });
      }

      this.$refs.map.$mapPromise.then((map) => {
          this.getRoute();
      })

      axios.post(this.url+"main", newComponent)
        .then((response) => {
            this.res = response.data
        })
        .catch((e) => {
            /* eslint-disable no-console */
            console.log(e)
            /* eslint-enable no-console */
        })

    },

    titikAkhir(){
      this.latitude_akhir = this.latitude;
      this.longitude_akhir = this.longitude;
    },

    titikPens(){
      this.latitude = this.pens_latitude;
      this.longitude = this.pens_longitude;
    },

    titikMalang(){
      this.latitude = "-7.942637178081287";
      this.longitude = "112.70264024097918";
    },


    geolocation() {
      navigator.geolocation.getCurrentPosition(this.buildUrl, this.geoError);
    },
    buildUrl(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    },
    geoError(error) {
      console.log("error");
    },

    getRoute() {
      this.directionsService = new google.maps.DirectionsService()
      this.directionsDisplay = new google.maps.DirectionsRenderer()
      this.directionsDisplay.setMap(this.$refs.map.$mapObject)
      var vm = this
      vm.directionsService.route({
          origin: new google.maps.LatLng(this.latitude, this.longitude),
          waypoints: this.waypoints,
          destination: new google.maps.LatLng(this.latitude_akhir, this.longitude_akhir),
          travelMode: 'DRIVING'
      }, function (response, status) {
          if (status === 'OK') {
          vm.directionsDisplay.setDirections(response)
          } else {
          console.log('Directions request failed due to ' + status)
          }
      })
    }

    
  }
}
</script>
