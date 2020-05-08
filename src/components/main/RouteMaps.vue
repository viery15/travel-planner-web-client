<template>
    <div>
        <GmapMap  ref="map" style="width: '100%; height: 300px;" :zoom="1" :center="{lat: 0, lng: 0}"></GmapMap>
    </div>
</template>

<script>
export default {
    name: 'RouteMaps',
    props: {
        latitude: String,
        longitude: String,
        latitude_akhir: String,
        longitude_akhir: String,
        waypoints: Array,
       
    },
    methods: {
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