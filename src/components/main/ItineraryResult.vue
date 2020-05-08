<template>
    <div style="margin-top: 30px; margin-bottom: 30px">

        <GmapMap  ref="map" style="width: '100%; height: 300px;" :zoom="1" :center="{lat: 0, lng: 0}"></GmapMap>

        <table class="table table-bordered table-hover" style="margin-top: 20px">
            <tr>
                <th>Waktu</th>
                <th>Keterangan</th>
                <th>Perkiraan Cuaca</th>
                <th>Status</th>
            </tr>
            <tr v-for="(tempat, index) in dataItinerary.response" v-bind:key="index">
                <td>{{tempat.waktu}}</td>
                <td>{{tempat.nama}}</td>
                <th>{{tempat.cuaca}}</th>
                <th>{{tempat.status}}</th>
            </tr>
        </table>

        
    </div>
</template>

<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAnpBN3XcUxdUV56dXxTfuhHBvEySitlY&callback=initMap">
</script>

<script>
export default {
    computed: {
        dataItinerary() {
            return this.$store.state.dataItinerary
        },

        waypoints() {
            return this.$store.state.waypoints
        }
    },

    mounted(){
    },

    watch: {
        waypoints: function (val) {
            this.getRoute()
        } 
    },

    methods: {
        getRoute() {
            this.$refs.map.$mapPromise.then((map) => {
                this.directionsService = new google.maps.DirectionsService()
                this.directionsDisplay = new google.maps.DirectionsRenderer()
                this.directionsDisplay.setMap(this.$refs.map.$mapObject)
                var vm = this
                vm.directionsService.route({
                    origin: new google.maps.LatLng('-7.942637178081287', '112.70264024097918'),
                    waypoints: this.waypoints,
                    destination: new google.maps.LatLng('-7.942637178081287', '112.70264024097918'),
                    travelMode: 'DRIVING'
                }, function (response, status) {
                    if (status === 'OK') {
                    vm.directionsDisplay.setDirections(response)
                    } else {
                    console.log('Directions request failed due to ' + status)
                    }
                })
            })
        },
        
    }
}
</script>