<template>
  <div class="home">
    <br><br>
    <div class="row">
      <div class="col-md-6">
        <form action="/action_page.php">
          <div class="form-group">
            <label for="coordinate">Coordinate:</label><br>
            <input type="text" class="form-control" v-model="latitude" style="width:40%; float:left; margin-right:2%">
            <input type="text" class="form-control" v-model="longitude" style="width:40%; float:left;"><br>
          </div>
          <div class="form-group">
            <label for="pwd">Password:</label>
            <input type="password" class="form-control" id="pwd">
          </div>
          <button type="button" class="btn btn-primary" disabled>Submit</button>
        </form>
      </div>
      
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  data(){
    return {
      latitude: "",
      longitude: "",
    }
  }
}
</script>
