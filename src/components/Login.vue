<template>
  <div id="app">
    <b-container>
      <div id="sign-in">
        <v-alert 
          dense
          transition="scale-transition" 
          v-model="snackbar" 
          :type="type"
          dismissible  
        >
          {{ error_message }}
        </v-alert>
        <b-card
          id="color-1"
          class="border-0 shadow-lg p-0 rounded mx-auto"
          img-left
          :img-src="require('../assets/login.png')"
          img-width="50%"
          alt="illustration-signin"
          v-if="desktop"
        >
          <v-row
            class="justify-content-md-center"
            style="padding-top: 20%; margin-bottom:15px"
          >
            <h1 class="text-center"><b style="color:#455E14">LOGIN</b></h1>
          </v-row>

          <v-form class="mx-5" v-model="validSignIn" ref="formSignIn">
            <v-row>
              <v-col class="mx-2">
                <v-text-field
                  :disabled="load"
                  required
                  solo
                  type="email"
                  v-model="email"  
                  :rules="emailRules"
                  label="Email"
                >
                  <template v-slot:prepend-inner>
                    <v-icon style="margin-right:15px; margin-left:15px; color:#455E14;">mdi-account</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="mx-2" style="margin-top:-20px">
                <!-- <subtitle-1>Password</subtitle-1> -->
                <v-text-field 
                  :disabled="load"
                  required
                  solo
                  type="password"
                  min="8"
                  v-model="password"  
                  :rules="passwordRules"
                  label="Password"
                >
                  <template v-slot:prepend-inner>
                    <v-icon style="margin-right:15px; margin-left:15px; color:#455E14;">mdi-lock</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn 
                :loading="load"
                class="py-2 font-weight-bold border-0"
                block
                style="background-color: #455E14; border-radius: 0.5rem; height:50px"
                @click="submit">
                <span style="color:white">Sign In</span>
              </v-btn>
            </v-card-actions>                  
          </v-form>
        </b-card>

        <b-card
          :img-src="require('../assets/login.png')"
          img-top
          class="border-0 shadow-lg p-0 rounded mx-auto"
          style="max-width: 20rem"
          v-else
        >
           <v-row
            class="justify-content-md-center"
            style="padding-top: 20%; margin-bottom:15px"
          >
            <h1 class="text-center"><b style="color:#455E14">LOGIN</b></h1>
          </v-row>

          <v-form class="mx-5" v-model="validSignIn" ref="formSignIn">
            <v-row>
              <v-col class="mx-2">
                <v-text-field
                  :disabled="load"
                  required
                  solo
                  type="email"
                  v-model="email"  
                  :rules="emailRules"
                  label="Email"
                >
                  <template v-slot:prepend-inner>
                    <v-icon style="margin-right:15px; margin-left:15px; color:#455E14;">mdi-account</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="mx-2" style="margin-top:-20px">
                <!-- <subtitle-1>Password</subtitle-1> -->
                <v-text-field 
                  :disabled="load"
                  required
                  solo
                  type="password"
                  min="8"
                  v-model="password"  
                  :rules="passwordRules"
                  label="Password"
                >
                  <template v-slot:prepend-inner>
                    <v-icon style="margin-right:15px; margin-left:15px; color:#455E14;">mdi-lock</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn 
                class="py-2 font-weight-bold border-0"
                block
                style="background-color: #455E14; border-radius: 0.5rem; height:50px"
                @click="submit">
                <span style="color:white">Sign In</span>
              </v-btn>
            </v-card-actions>                  
          </v-form>
        </b-card>
      </div>

      <v-dialog v-model="dialogLogin" persisten max-width="400px">
        <v-card style="background-color:#E5EEDA;">
          <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
            <h4 class="text-h4 font-weight-medium mb-1">Warning!</h4>
          </v-card-title>
          <v-card-text> Anda sudah Login, logout terlebih dahulu untuk Login kembali</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary"  @click="tutupDialog">Tutup</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- <v-overlay :value="load">
        <v-progress-circular
          indeterminate
          :size="80"
          :width="5"
          color="primary"
        >
        </v-progress-circular>
      </v-overlay> -->
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      snackbar: false,
      error_message: "",
      type: "success",
      load: false,
      desktop: true,

      validSignIn: false,
      dialogLogin: false,

      email: '',
      emailRules:[
        (v) => !!v || 'Email tidak boleh kosong',
        (v) => /.+@.+\..+/.test(v) || 'Email invalid'
      ],
      password: '',
      passwordRules:[
        (v)=> !!v || 'Password tidak boleh kosong',
        (v)=> (v && v.length >=6) || 'Password harus minimal 6 karakter'
      ],
    };
  },
  methods: {
    submit() {
      if(this.$refs.formSignIn.validate()){
        this.snackbar = false;
        this.load = true;
        this.$http.post(this.$api + '/login', {
            email_karyawan: this.email,
            password: this.password
        }).then(response=>{
            localStorage.setItem('token', response.data.access_token); //menyimpan auth token
            console.log(response.data.OUT_STAT);
            console.log(response.data.access_token);
            if(response.data.OUT_STAT === "T"){
                this.error_message = response.data.OUT_MESSAGE;
                localStorage.setItem('id_karyawan', response.data.OUT_DATA.id_karyawan); //menyimpan id_karyawan
                localStorage.setItem('id_role',response.data.OUT_DATA.id_role);
                this.loadAlert("success",true)
                this.load = false;
                if(response.data.OUT_DATA.id_role == 1){
                  this.$router.push({
                    name: 'Karyawan'
                  })
                }else if(response.data.OUT_DATA.id_role == 2){
                  this.$router.push({
                    name: 'Customer'
                  })
                }else if(response.data.OUT_DATA.id_role == 3){
                  this.$router.push({
                    name: 'Menu'
                  })
                }
            }else{
              this.error_message = response.data.OUT_MESSAGE;
              this.loadAlert("error",true)
              this.load = false;
              localStorage.removeItem('token')
            }  
        }).catch(error => {        
            console.log(error.response.data.message);
            this.error_message ="Terjadi kesalahan server";
            this.loadAlert("error",true)
            this.load = false
            this.loading = false;
            localStorage.removeItem('token')
        })
      }
    },
    loadAlert(status,bool){
      this.type = status;
      this.snackbar = bool;
    },
    cekIsLogin(){
      var token;
      token = localStorage.getItem('token');
      console.log(token)
      if(token !== null){
        this.dialogLogin = true;
      }
    },
    tutupDialog(){
      this.dialogLogin = false;
      if(localStorage.getItem('id_role') == 1){
        this.$router.push({
          name: 'Karyawan'
        })
      }else if(localStorage.getItem('id_role') == 2){
        this.$router.push({
          name: 'Customer'
        })
      }else if(localStorage.getItem('id_role') == 3){
        this.$router.push({
          name: 'Menu'
        })
      }
    }
  },
  computed: {},
  mounted() {
    this.cekIsLogin();
    if (screen.width <= 780) {
      this.desktop = false;
    } else {
      this.desktop = true;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app{
  background-color: #BDD299;
}

#sign-in {
  padding-top: 7%;
  padding-bottom: 7%;
}
</style>
