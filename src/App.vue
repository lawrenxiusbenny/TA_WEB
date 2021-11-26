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
</style>
