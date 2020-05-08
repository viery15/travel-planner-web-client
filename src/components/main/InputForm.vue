<template>
    <div>
        <div class="row" style="margin-top: 30px" >
            <div class="col-md-6">
                <div class="form-group">
                    <label for="coordinate">Tanggal:</label><br>
                    <input type="date" class="form-control" v-model="tanggal">
                </div>
                <div class="form-group">
                    <label for="coordinate">Titik awal:</label><br>
                    <input type="text" class="form-control" v-model="coordStart.latitude" style="width:30%; float:left; margin-right:2%">
                    <input type="text" class="form-control" v-model="coordStart.longitude" style="width:30%; margin-right:2%">
                    <button class="btn btn-sm btn-primary" v-on:click="titikPens()">PENS</button>
                    <button class="btn btn-sm btn-primary" v-on:click="titikMalang()">Malang</button>
                    <button class="btn btn-sm btn-success" v-on:click="geolocation()">Locate Me</button>
                </div>
                <div class="form-group">
                    <label for="coordinate">Titik akhir:</label><br>
                    <input type="text" class="form-control" v-model="coordFinish.latitude" style="width:30%; float:left; margin-right:2%">
                    <input type="text" class="form-control" v-model="coordFinish.longitude" style="width:30%; margin-right:2%">
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

        <InputDestination />

        <button v-on:click="submit()" type="button" class="btn btn-primary" style="width:100%">Submit</button>

    </div>
</template>
<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAnpBN3XcUxdUV56dXxTfuhHBvEySitlY&callback=initMap">
</script>

<script>
import axios from 'axios'
import InputDestination from './InputDestination';

export default {
    components:{
        InputDestination
    },

    data(){
        return {
            tanggal: "",
            coordStart: {
                latitude: "",
                longitude: ""
            },
            coordFinish: {
                latitude: "",
                longitude: ""
            },
            jam_mulai: "",
            menit_mulai: "",
            url: "https://travel-main-proccess.herokuapp.com/",
            res: "",
           
        }
    },

    computed: {
        selectedDestination() {
            return this.$store.state.selectedDestination
        },

        dataDestinasi() {  
            return this.$store.state.dataDestinasi
        },

        
    },

    methods: {
        titikAkhir(){
            this.coordFinish.latitude = this.coordStart.latitude;
            this.coordFinish.longitude = this.coordStart.longitude;
        },

        titikPens(){
            this.coordStart.latitude = "-7.276420",
            this.coordStart.longitude = "112.793199"
        },

        titikMalang(){
            this.coordStart.latitude = "-7.942637178081287";
            this.coordStart.longitude = "112.70264024097918";
        },


        geolocation() {
            navigator.geolocation.getCurrentPosition(this.buildUrl, this.geoError);
        },

        buildUrl(position) {
            this.coordStart.latitude = position.coords.latitude;
            this.coordStart.longitude = position.coords.longitude;
        },

        geoError() {
            console.log("error");
        },

        async getDestination(){
            const newComponent = new URLSearchParams()
            newComponent.append('latitude', this.coordStart.latitude)
            newComponent.append('longitude', this.coordStart.longitude)

            axios.post(this.url, newComponent)
                .then((response) => {
                    console.log(response)
                    this.$store.dispatch('updateDestinasi', response.data.response)
                    
                })
                .catch((e) => {
                    console.log(e)
                })
        },

        submit(){
            const newComponent = new URLSearchParams()
            newComponent.append('data', JSON.stringify(this.selectedDestination))
            newComponent.append('latitude', this.coordStart.latitude)
            newComponent.append('longitude', this.coordStart.longitude)
            newComponent.append('latitude_akhir', this.coordFinish.latitude)
            newComponent.append('longitude_akhir', this.coordFinish.longitude)
            newComponent.append('jam_mulai', this.jam_mulai)
            newComponent.append('menit_mulai', this.menit_mulai)
            newComponent.append('tanggal', this.tanggal)

            let temp_waypoints = [];

            for (let index = 0; index < this.selectedDestination.length; index++) {
                let coord = this.dataDestinasi.find(x => x._id === this.selectedDestination[index].destinasi).location;
                
                temp_waypoints.push({
                    location: new google.maps.LatLng(coord.latitude, coord.longitude),
                    stopover: true
                });
            }

            this.$store.dispatch('updateWaypoints', temp_waypoints)

            axios.post(this.url+"main", newComponent)
                .then((response) => {
                    this.$store.dispatch('addDataItinerary', response.data)
                    console.log(response.data)
                })
                .catch((e) => {
                    /* eslint-disable no-console */
                    console.log(e)
                    /* eslint-enable no-console */
                })

        },
        
    }
}
</script>