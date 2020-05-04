<template>
    <div>
        <GmapMap  ref="map" style="width: '100%; height: 300px;" :zoom="1" :center="{lat: 0, lng: 0}">
            <vue-component v-if="mapLoaded" ></vue-component>
        </GmapMap>
    </div>
</template>

<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAnpBN3XcUxdUV56dXxTfuhHBvEySitlY&callback=initMap">
    </script>
<script>
import {gmapApi} from 'vue2-google-maps'

export default {
    computed: {
        google: gmapApi
    },
    name: 'Coba',
    directionsService: null,
    directionsDisplay: null,
    data(){
        return{
            mapLoaded: false
        }
    },   
    mounted() {

        this.$refs.map.$mapPromise.then((map) => {
            this.getRoute();
        })
    },
    
    methods: {
        getRoute() {
            this.directionsService = new google.maps.DirectionsService()
            this.directionsDisplay = new google.maps.DirectionsRenderer()
            this.directionsDisplay.setMap(this.$refs.map.$mapObject)
            var vm = this
            vm.directionsService.route({
                origin: new google.maps.LatLng(-7.942637178081287, 112.70264024097918),
                waypoints: [
                    {
                        location: 'Taman Harmoni, Surabaya',
                        stopover: true
                    }
                ],
                destination: new google.maps.LatLng(-7.276420, 112.793199),
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

