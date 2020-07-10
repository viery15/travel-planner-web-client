<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-info navbar-expand-lg">
      <a class="navbar-brand" href="#">Travel Planner</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-link" to="/itinerary" style="color:white"
            >Automatic Itinerary</router-link
          >
          <router-link class="nav-link" to="/ManualItinerary" style="color:white"
            >Manual Itinerary</router-link
          >
          <router-link class="nav-link" to="/daftar_wisata" style="color:white"
            >Daftar Wisata</router-link
          >
        </div>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>


