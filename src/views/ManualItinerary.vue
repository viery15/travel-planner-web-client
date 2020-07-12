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
                placeholder="Masukkan lokasi awal anda"
                types="establishment"
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
          <label for="coordinate">Waktu Mulai:</label>
          <br />
          <input type="time" class="form-control" v-model="waktuMulai" />
        </div>

        <div class="form-group" v-if="dataTujuan.length > 1">
          <label for="coordinate">Pilih Wisata:</label>
          <br />
          <multiselect
            v-model="valueTujuan"
            :options="dataTujuan"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            label="tempat"
            track-by="tempat"
            placeholder="Pilih Tujuan"
          ></multiselect>
        </div>

        <div v-for="(tujuan, index) in valueTujuan" v-bind:key="index">
          <div class="row">
            <div class="col-md-7">
              <b>Nama</b>
              <br />
              {{tujuan.tempat}}
            </div>
            <div class="col-md-5">
              <b>Durasi Berwisata (menit)</b>
              <br />
              <input type="text" class="form-control" v-model="dataDurasi[index]" />
            </div>
          </div>
          <hr />
        </div>

        <br />
        <br />
        <button class="btn btn-sm btn-primary" style="width: 100%" v-on:click="submit()">Submit</button>
      </div>
    </div>
    <br />
    <br />
    <div v-if="dataItinerary != ''">
      <h3>Rencana Perjalanan - {{tanggalAwal}}</h3>
      <button class="btn btn-info" v-on:click="getMap()">Tampilkan Rute</button>

      <v-client-table :data="dataItinerary.response" :columns="columns" :options="optionsTable">
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

      <!-- <table class="table table-primary table-bordered" style="margin-top: 20px">
        <tr style="background-color: #007bff; color: #fff6ff">
          <th class="text-center" style="width:13%">Waktu</th>
          <th class="text-center">Keterangan</th>
          <th class="text-center">Perkiraan Cuaca</th>
          <th class="text-center">Status</th>
          <th class="text-center" style="width:13%">Action</th>
        </tr>
        <tr v-for="(tempat, index) in dataItinerary.response" v-bind:key="index">
          <td>{{ tempat.waktu }}</td>
          <td>{{ tempat.keterangan }}</td>
          <th>{{ tempat.cuaca }}</th>
          <th>{{ tempat.status }}</th>
          <th class="text-center">
            <button
              v-if="tempat.rute == undefined"
              class="btn btn-info btn-sm"
              v-on:click="detailTujuan(tempat)"
            >
              <font-awesome-icon icon="eye" />Detail
            </button>
            <a
              :href="tempat.rute"
              v-if="tempat.rute != undefined"
              class="btn btn-success btn-sm"
              target="_blank"
            >Lihat Rute</a>
          </th>
        </tr>
      </table> -->

      <br />
      <br />
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
            <h5 class="modal-title" id="exampleModalLabel">
              {{ modalDetail.nama }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="word-break: break-all;">
            <div class="row">
              <div class="col-md-4">
                Nama
              </div>
              <div class="col-md-8">
                <b>{{ modalDetail.nama }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Alamat
              </div>
              <div class="col-md-8">
                <b>{{ modalDetail.alamat }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Kategori
              </div>
              <div class="col-md-8">
                <b>{{ modalDetail.kategori }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Nilai Sentiment
              </div>
              <div class="col-md-8">
                <b
                  >{{
                    modalDetail.sentimentScore
                  }}
                  dari 100 orang menilai positif</b
                ><br /><br />
                <router-link
                  target="_blank"
                  class="btn btn-sm btn-success"
                  :to="{ name: 'review', params: { id: modalDetail._id } }"
                  >Lihat Review</router-link
                >
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Sumber
              </div>
              <div class="col-md-8">
                <a :href="modalDetail.url" target="_blank"
                  ><b>Google Places</b></a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
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
  name: "ManualItinerary",
  data() {
    return {
      lokasiAwal: "",
      tanggalAwal: "",
      showMaps: true,
      userLocation: {
        latitude: "",
        longitude: ""
      },
      dataTujuan: [],
      // url: "http://127.0.0.1:3000/",
      url: "https://travel-main-proccess.herokuapp.com/",
      valueTujuan: [],
      dataDurasi: [],
      waktuMulai: "",
      dataItinerary: [],
      modalDetail: "",
      columns: ["waktu", "keterangan", "cuaca", "status", "action"],
      optionsTable: {
        headings: {
          waktu: "Waktu",
          keterangan: "Keterangan",
          cuaca: "Cuaca",
          status: "Status",
          action: "Action"
        }
      }
    };
  },

  watch: {
    valueTujuan: function(val) {
      this.dataDurasi = [];
      for (let index = 0; index < this.valueTujuan.length; index++) {
        this.dataDurasi.push(60);
      }
    }
  },

  methods: {
    getAddressData: function(addressData, placeResultData, id) {
      this.lokasiAwal = addressData;
      this.userLocation.latitude = addressData.latitude;
      this.userLocation.longitude = addressData.longitude;
      this.getDestination();
    },

    geolocation() {
      navigator.geolocation.getCurrentPosition(this.buildUrl, this.geoError);
    },

    buildUrl(position) {
      this.userLocation.latitude = position.coords.latitude;
      this.userLocation.longitude = position.coords.longitude;
      this.getDestination();
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

    getDestination() {
      let loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false
      });
      const newComponent = new URLSearchParams();
      newComponent.append("latitude", this.userLocation.latitude);
      newComponent.append("longitude", this.userLocation.longitude);

      axios
        .post(this.url + "ManualItinerary/tujuan", newComponent)
        .then(response => {
          loader.hide();
          this.valueTujuan = [];
          this.dataTujuan = response.data.response;
        })
        .catch(e => {
          /* eslint-disable no-console */
          console.log(e);
          /* eslint-enable no-console */
        });
    },

    submit() {
      let loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false
      });

      for (let index = 0; index < this.valueTujuan.length; index++) {
        this.valueTujuan[index].durasi = this.dataDurasi[index];
      }

      const newComponent = new URLSearchParams();
      newComponent.append("data", JSON.stringify(this.valueTujuan));
      newComponent.append("latitude", this.userLocation.latitude);
      newComponent.append("longitude", this.userLocation.longitude);
      newComponent.append("waktuMulai", this.waktuMulai);
      newComponent.append("tanggalMulai", this.tanggalAwal);

      axios
        .post(this.url + "ManualItinerary/", newComponent)
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

    async getRoute() {
      this.showMaps = false;
      this.waypoints = await this.setWaypoints(this.dataItinerary.response);
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

    async getMap() {
      $("#modalMap").modal("show");

      await this.getRoute();
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

    detailTujuan(tujuan) {
      this.modalDetail = tujuan;
      $("#detailModal").modal("show");
    },
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>