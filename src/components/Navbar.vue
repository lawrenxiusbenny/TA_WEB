<template>
  <header>
    <b-navbar
      class="navbar navbar-light navbar-expand-md justify-content-md-center justify-content-start"
    >
    <b-navbar-nav class="navbar-collapse">
        b-
        <b-nav-item href="#">Home</b-nav-item>
        <b-nav-item href="#">Playlist</b-nav-item>
        
      <!-- <a class="nav-link" href="#_"><i class="fa fa-search mr-1"></i></a> -->
      <div
        class="navbar-collapse collapse dual-collapse2 justify-content-between align-items-center w-100"
        id="collapsingNavbar2"
      >
        <ul class="navbar-nav mx-auto text-md-center text-left">
          <li class="nav-item">
            <v-btn text router to="/home">Home</v-btn>
          </li>
          <li class="nav-item">
            <v-btn text router to="/about-us">About Us</v-btn>
          </li>
          <li class="nav-item my-auto">
            <v-btn text router to="/man">Man</v-btn>
          </li>
          <li class="nav-item">
            <v-btn text router to="/woman">Woman</v-btn>
          </li>
          <li class="nav-item">
            <v-btn text router to="/acc">Accessories</v-btn>
          </li>
        </ul>
        <div class="sembunyi" v-show="!isHidden">
          <v-divider></v-divider>
          <ul class="navbar-nav mx-auto text-md-center text-left">
            <div v-if="isLoggedIn">
              <li class="nav-item">
                <v-btn text router to="/cart">Cart</v-btn>
              </li>
              <li class="nav-item">
                <v-btn text router to="/profile">Edit Profile</v-btn>
              </li>
              <li class="nav-item my-auto">
                <v-btn text @click="logout">Sign Out</v-btn>
              </li>
            </div>
            <div v-else>
              <li class="nav-item">
                <v-btn text router to="/signIn">Sign In</v-btn>
              </li>
              <li class="nav-item">
                <v-btn text router to="/signUp">Sign Up</v-btn>
              </li>
            </div>
          </ul>
        </div>
      </div>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>