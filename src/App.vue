<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

 @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap');
  :root {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    overflow-x: hidden;
  }

  body{
    font-family: 'Open Sans', sans-serif;
    font-weight: normal;
    color: #7A9B57 !important;
    background-color: #f2f5f7 !important;
  }

    /*---------scrollbar-----------*/
  /* Let's get this party started */
  ::-webkit-scrollbar {
    width: 8px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    display: none;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #7A9B57;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #455E14;
    cursor: pointer;
  }

  #color-1{
    background-color: #E5EEDA;
  }

  .form-control {
    border: 1px solid #f6f6f6;
    border-radius: 0 .5rem .5rem 0 !important;
    background-color: #F6F6F6!important;
  }

</style>
