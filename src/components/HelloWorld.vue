<template>
  <b-container>
      <div id="sign-in">
        <b-card
          class="border-0 shadow-lg p-0 rounded"
          img-left
          img-src="../assets/loginIllustration.png"
          img-width="50%"
          alt="illustration-signin"
        >
          <b-row
            class="justify-content-md-center"
            style="padding-top: 18%"
            align-v="center"
          >
            <h1 class="text-center"><b>SIGN IN</b></h1>
          </b-row>

          <!--          SIGN IN FORM     -->
          <b-form class="px-5 pt-5" ref="form">
            <b-form-row class="mb-3">
              <b-input-group>
                <b-input-group-prepend is-text class="text">
                  <b-icon icon="envelope-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                  type="email"
                  v-model="email"
                  placeholder="Email"
                ></b-form-input>
              </b-input-group>
            </b-form-row>

            <b-form-row class="mb-3">
              <b-input-group>
                <b-input-group-prepend is-text class="text">
                  <b-icon icon="lock-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                  type="password"
                  placeholder="Password"
                  v-model="password"
                ></b-form-input>
              </b-input-group>
            </b-form-row>

            <b-form-row class="pt-5">
              <b-button
                class="py-2 font-weight-bold border-0"
                block
                @click="submit"
                style="background-color: #151d65; border-radius: 0.5rem"
                >Sign In</b-button
              >
            </b-form-row>

            <b-form-row class="py-3">
              <p>
                You don't have an account?
                <b-link to="/signup" style="text-decoration: none"
                  ><b>Sign Up</b></b-link
                >
              </p>
            </b-form-row>
          </b-form>
        </b-card>
      </div>
    </b-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#sign-in {
  padding-top: 7%;
  padding-bottom: 7%;
}
.bg-info {
  background-color: #f2f5f7 !important;
}
.rounded {
  border-radius: 1rem !important;
}
.card-img-left {
  border-top-right-radius: 0 !important;
  border-top-left-radius: 1rem !important;
  border-bottom-right-radius: 0 !important;
  border-bottom-left-radius: 1rem !important;
}
</style>
