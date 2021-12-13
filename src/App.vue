<template>
  <v-app>
    <navbar-component></navbar-component>
    <router-view></router-view>
    <footer-component></footer-component>
  </v-app>
</template>

<script>
import Header from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: 'App',
  components: {
    "navbar-component": Header,
    "footer-component": Footer,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

 @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap');
  :root {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    overflow-x: hidden;
  }
  body{
    font-family: 'Open Sans', sans-serif;
    font-weight: normal;
    color: #151D65 !important;
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
    background: #151d65;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3d4cbf;
    cursor: pointer;
  }

    a {
    transition: color 0.3s ease-in-out;
  }
  .bg-info {
    background-color: #f2f5f7 !important;
  }

    .input-group-text {
    color: #151d65;
    background-color: #F6F6F6!important;
    border-color: #F6F6F6!important;
    border-radius: .5rem 0 0 .5rem !important;
  }
  input {
    color: #151d65;
    background-color: #F6F6F6!important;
    border: none !important;
  }
  .form-control {
    border: 1px solid #f6f6f6;
    border-radius: 0 .5rem .5rem 0 !important;
    background-color: #F6F6F6!important;
  }


#page{
  background-color: #F2F5F7 !important;
  padding-left: 10%;
  }

</style>
