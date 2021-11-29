<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="secondary">
    <b-navbar-brand href="#" size="lg"><span class="logo-text">Logo</span></b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="http://localhost:8081/"><span class="nav-item-text-left">Home</span></b-nav-item>
        <b-nav-item href="#"><span class="nav-item-text-left">About Us</span></b-nav-item>
        <b-nav-item href="#"><span class="nav-item-text-left">Telegram</span></b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="http://localhost:8081/login"><span class="nav-item-text-right">Login</span></b-nav-item>
        <b-nav-item href="http://localhost:8081/register"><span class="nav-item-text-right">Register</span></b-nav-item>
      </b-navbar-nav>

      <!-- <b-navbar-nav class="ml-auto">
        <b-nav-item><span class="nav-item-text-right">My Plan</span></b-nav-item>
        <b-nav-item-dropdown class="dd" right>
            <template #button-content>
                <em>User</em>
            </template>
            <b-dropdown-item href="#">profile</b-dropdown-item>
            <b-dropdown-item href="#">logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav> -->
    </b-collapse>
  </b-navbar>
</div>
</template>

<style scoped>
.navbar-brand {
    position: relative;
    width: 120px;
    left: 15px;
    background-size: contain;
}

.navbar-brand span{
    font-size: 30px;
}

.nav-item .nav-item-text-left{
    font-size: 18px;
    margin-left: 15px;
}
.nav-item .nav-item-text-right{
    font-size: 18px;
    margin-right: 15px;
}

.dd{
    margin-right: 15px;
}

</style>