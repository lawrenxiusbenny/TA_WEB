<template>
  <v-footer dark padless>
    <v-card flat tile class="indigo lighten-1 white--text text-center flex">
      <v-card-text class="white--text">
              <v-btn v-for="icon in icons" :key="icon" class="mx-4 white--text" icon>
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text pt-0">
    <div> <strong>Let's get in touch on any of these platforms.</strong> 
        </div>
      </v-card-text>

      <v-divider></v-divider>
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        text
        rounded
        class="my-2"
      >
        {{ link }}
      </v-btn>
      <v-card-text class="white--text pt-0">
        {{ new Date().getFullYear() }} — <strong>Asdsaa</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
        links: [
        'Home',
        'About Us',
        'Team',
        'Services',
        'Contact Us',
      ],
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    
  }),
};
</script>