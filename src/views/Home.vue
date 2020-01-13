<template>
  <div class="home">
    <br><br>
    <div class="row">
      <div class="col-md-6">
          <div class="form-group">
            <label for="coordinate">Titik awal:</label><br>
            <input type="text" class="form-control" v-model="latitude" style="width:30%; float:left; margin-right:2%">
            <input type="text" class="form-control" v-model="longitude" style="width:30%; margin-right:2%">
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
    <ol>
      <li v-for="(tempat, index) in res.response" v-bind:key="index">{{tempat.nama}}</li>
    </ol>
    {{res}}
  </div>
</template>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<script>
import axios from 'axios'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'home',
  data(){
    return {
      latitude: "-7.942637178081287",
      longitude: "112.70264024097918",
      latitude_akhir: "",
      longitude_akhir: "",
      dataDestinasi: [],
      selectedDestination:[],
      res: "",
      jam_mulai: "",
      menit_mulai: "",
      url: "http://127.0.0.1:3000/"
    }
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

    onChangeDestinasi(event) {
      // console.log(this.dataDestinasi[0])
      // for (let index = 0; index < this.dataDestinasi.length; index++) {
      //   if (this.dataDestinasi[index]['tempat'] == event.target.value) {
      //     this.dataDestinasi.splice(index, 1);
      //   }
        
      // }
    }
  }
}
</script>
