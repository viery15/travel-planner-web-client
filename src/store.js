import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        dataDestinasi: [],
        selectedDestination: [],
        dataItinerary: '',
        waypoints: [],
    },

    mutations: {
        KONFIRMASI_DESTINASI: (state, destinasi) => {
            state.dataDestinasi = destinasi
        },

        RESET_DESTINASI: (state) => {
            state.selectedDestination = [
                {
                    
                    number: state.selectedDestination.length + 1,
                    destinasi: "",
                    lama_stay: ""
                   
                }
            ]
        },

        SAVE_DESTINASI: (state) => {
            state.selectedDestination.push({
                number: state.selectedDestination.length + 1,
                destinasi: "",
                lama_stay: ""
            });
        },

        SAVE_ITINERARY: (state, itinerary) => {
            state.dataItinerary = itinerary
        },

        SAVE_WAYPOINTS: (state, waypoints) => {
            state.waypoints = waypoints
        },
    },

    actions: {
        updateDestinasi({ commit }, destinasi) {
            commit('KONFIRMASI_DESTINASI', destinasi)
            commit('RESET_DESTINASI')
            
        },

        addSelectedDestinasi({ commit }) {
            commit('SAVE_DESTINASI')
        },

        addDataItinerary({ commit }, itinerary) {
            commit('SAVE_ITINERARY', itinerary)
        },

        updateWaypoints({ commit }, waypoints) {
            commit('SAVE_WAYPOINTS', waypoints)
            
        },
    }
})