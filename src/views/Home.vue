<template>
  <div>
    <div class="row" style="margin-top: 30px;">
      <div
        class="col-md-6 mx-auto"
        style="border: 1px solid grey; padding: 20px; border-radius: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.51);"
      >
        <div class="form-group">
          <label for="coordinate">Lokasi Awal:</label>
          <div class="row">
            <div class="col-md-9">
              <vue-google-autocomplete
                ref="alamat"
                id="map"
                class="form-control"
                types="establishment"
                placeholder="Masukkan lokasi awal anda"
                v-on:placechanged="getAddressData"
                :country="['id']"
                v-model="lokasiAwal"
              ></vue-google-autocomplete>
            </div>
            <div class="col-md-3">
              <button class="btn btn-sm btn-success" v-on:click="geolocation()">Locate Me</button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="coordinate">Tanggal Mulai Wisata:</label>
          <br />
          <input type="date" class="form-control" v-model="tanggalAwal" />
        </div>
        <div class="form-group">
          <label for="coordinate">Tanggal Selesai Wisata:</label>
          <br />
          <input type="date" class="form-control" v-model="tanggalAkhir" />
        </div>

        <div class="form-group">
          <label for="coordinate">Pilih Kategori:</label>
          <br />
          <multiselect
            v-model="kategori"
            :options="listKategori"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Pilih Tujuan"
          ></multiselect>
        </div>

        <button class="btn btn-sm btn-primary" style="width: 100%" v-on:click="submit()">Submit</button>
      </div>
    </div>

    <div
      class="modal fade bd-example-modal-lg"
      id="modalMap"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <GmapMap
            v-if="showMaps"
            ref="map"
            style="width: '50%; height: 300px;"
            :zoom="5"
            :center="{ lat: 10, lng: 10 }"
            :minZoom="8"
          ></GmapMap>
        </div>
      </div>
    </div>

    <div class="row">
      <div
        class="col-md-12"
        v-for="(hari, indexHari) in dataItinerary.response"
        v-bind:key="indexHari"
      >
        <br />
        <br />
        <h2>Hari ke - {{ indexHari + 1 }}</h2>
        <br />
        <br />
        <button class="btn btn-info" v-on:click="getMap(indexHari)">Tampilkan Rute</button>

        <v-client-table :data="hari" :columns="columns" :options="optionsTable">
          <div slot="action" slot-scope="props">
            <button
              v-if="props.row.rute == undefined"
              class="btn btn-info btn-sm"
              v-on:click="detailTujuan(props.row)"
            >
              <font-awesome-icon icon="eye" />Detail
            </button>

            <a
              :href="props.row.rute"
              v-if="props.row.rute != undefined"
              class="btn btn-success btn-sm"
              target="_blank"
            >Lihat Rute</a>

          </div>
        </v-client-table>
        
      </div>
    </div>

    <!-- Modal Detail Wisata -->
    <div
      class="modal fade"
      id="detailModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ modalDetail.nama }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="word-break: break-all;">
            <div class="row">
              <div class="col-md-4">Nama</div>
              <div class="col-md-8">
                <b>{{ modalDetail.nama }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">Alamat</div>
              <div class="col-md-8">
                <b>{{ modalDetail.alamat }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">Kategori</div>
              <div class="col-md-8">
                <b>{{ modalDetail.kategori }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">Nilai Sentiment</div>
              <div class="col-md-8">
                <b>
                  {{
                  modalDetail.sentimentScore
                  }}
                  dari 100 orang menilai positif
                </b>
                <br />
                <br />
                <router-link
                  target="_blank"
                  class="btn btn-sm btn-success"
                  :to="{ name: 'review', params: { id: modalDetail._id } }"
                >Lihat Review</router-link>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">Sumber</div>
              <div class="col-md-8">
                <a :href="modalDetail.url" target="_blank">
                  <b>Google Places</b>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="dataItinerary != '' && dataItinerary.response.length != 0">
      <i>
        *Sumber perkiraan cuaca berasa dari
        <a href="https://openweathermap.org/" target="_blank">
          <b>openwheatermap.org</b>
        </a>
      </i>
    </p>
    <div style="text-align: center">
      <h2
        style="margin-top: 70px; margin-bottom: 70px"
        v-if="dataItinerary != '' && dataItinerary.response.length == 0"
      >Itinerary tidak ditemukan</h2>
    </div>
  </div>
</template>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<script>
import axios from "axios";
import "vue-loading-overlay/dist/vue-loading.css";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { loaded } from "vue2-google-maps";
import Multiselect from "vue-multiselect";

export default {
  components: { VueGoogleAutocomplete, Multiselect },
  name: "home",
  data() {
    return {
      kategori: [],
      listKategori: [
        "Air Terjun",
        "Taman Hiburan",
        "Museum",
        "Edukasi",
        "Religi",
        "Taman",
        "Rekreasi Air",
        "Pantai",
        "Taman Kota",
        "Kebun Binatang"
      ],
      gmap: "map",
      showMaps: true,
      tanggalAwal: "",
      tanggalAkhir: "",
      zoomMap: 8,
      dataItinerary: "",
      waypoints: "",
      userLocation: {
        latitude: "-7.942637178081287",
        longitude: "112.70264024097918"
      },
      modalDetail: "",
      // url: "http://127.0.0.1:3000/",
      url: "https://travel-main-proccess.herokuapp.com/",

      lokasiAwal: "",
      columns: ["waktu", "keterangan", "cuaca", "status", "action"],
      optionsTable: {
        headings: {
          waktu: "Waktu",
          keterangan: "Keterangan",
          cuaca: "Cuaca",
          status: "Status",
          action: "Action"
        }
        // sortable: ["tempat", "alamat", "kota"],
        // filterable: ["tempat", "alamat", "kota"],
      }
    };
  },

  mounted() {},

  watch: {
    dataItinerary: function(val) {
      // this.getRoute();
    }
  },

  methods: {
    getAddressData: function(addressData, placeResultData, id) {
      this.lokasiAwal = addressData;
      this.userLocation.latitude = addressData.latitude;
      this.userLocation.longitude = addressData.longitude;
    },

    submit() {
      let loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false
      });
      const newComponent = new URLSearchParams();
      newComponent.append("latitude", this.userLocation.latitude);
      newComponent.append("longitude", this.userLocation.longitude);
      for (let index = 0; index < this.kategori.length; index++) {
        newComponent.append("kategori", this.kategori[index]);
      }
      newComponent.append("tanggalMulai", this.tanggalAwal);
      newComponent.append("tanggalAkhir", this.tanggalAkhir);

      axios
        .post(this.url + "mainfeature", newComponent)
        .then(response => {
          loader.hide();
          this.dataItinerary = response.data;
        })
        .catch(e => {
          /* eslint-disable no-console */
          console.log(e);
          /* eslint-enable no-console */
        });
    },
    geolocation() {
      navigator.geolocation.getCurrentPosition(this.buildUrl, this.geoError);
    },

    buildUrl(position) {
      this.userLocation.latitude = position.coords.latitude;
      this.userLocation.longitude = position.coords.longitude;
      axios
        .get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            position.coords.latitude +
            "," +
            position.coords.longitude +
            "&key=AIzaSyBAnpBN3XcUxdUV56dXxTfuhHBvEySitlY"
        )
        .then(response => {
          this.$refs.alamat.update(response.data.results[0].formatted_address);
        })
        .catch(e => {
          /* eslint-disable no-console */
          console.log(e);
          /* eslint-enable no-console */
        });
    },

    geoError() {
      /* eslint-disable no-console */

      console.log("error");
      /* eslint-enable no-console */
    },

    async getRoute(indexData) {
      this.showMaps = false;
      this.waypoints = await this.setWaypoints(
        this.dataItinerary.response[indexData]
      );
      await this.resetMap();
      let destination = this.waypoints[this.waypoints.length - 1].location;
      this.waypoints.splice(this.waypoints.length - 1, 1);
      this.$refs.map.$mapPromise.then(map => {
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(this.$refs.map.$mapObject);
        var vm = this;
        vm.directionsService.route(
          {
            origin: new google.maps.LatLng(
              this.userLocation.latitude,
              this.userLocation.longitude
            ),
            waypoints: this.waypoints,
            destination: destination,
            travelMode: "DRIVING"
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

    setWaypoints(data) {
      let waypoints = [];
      for (let index = 0; index < data.length; index++) {
        if (data[index].location != undefined) {
          waypoints.push({
            location: new google.maps.LatLng(
              data[index].location.latitude,
              data[index].location.longitude
            ),
            stopover: true
          });
        }
      }

      return waypoints;
    },

    resetMap() {
      this.showMaps = true;
    },

    async getMap(index) {
      $("#modalMap").modal("show");

      await this.getRoute(index);
    },

    detailTujuan(tujuan) {
      this.modalDetail = tujuan;
      $("#detailModal").modal("show");
    }
  }
};
</script>
