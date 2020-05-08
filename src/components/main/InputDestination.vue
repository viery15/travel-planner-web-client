<template>
    <div style="margin-bottom: 30px">
        <div v-for="(selectDestination, index) in selectedDestination" v-bind:key="selectDestination.number" class="row">
            <div class="col-md-6">
                <h3>Destinasi {{index+1}}</h3>
                <div class="form-group" style="width:60%; float:left;">
                <label for="sel1">Destinasi: </label>
                <select class="form-control" v-model="selectDestination.destinasi">
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

        <div class="row" v-if="selectedDestination.length > 0">
            <div class="col-md-6">
                <div class="text-center" style="clear:both">
                    <button v-on:click="addDestination()" class="btn btn-success btn-sm center" id="btnTambahDestinasi"><font-awesome-icon icon="plus"/></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        dataDestinasi() {  
            return this.$store.state.dataDestinasi
        },

        selectedDestination() {
            return this.$store.state.selectedDestination
        }
    },

    methods: {
        addDestination() {
            this.$store.dispatch('addSelectedDestinasi')
        }
    }
}
</script>