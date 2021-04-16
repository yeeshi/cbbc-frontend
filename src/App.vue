<template>
  <v-app style="background: #FFFFF0;">
    <router-view />
  </v-app>
</template>

<script>
import vHeader from '@/components/Header.vue'
export default {
  name: 'App',
  components: {
    vHeader
  },

  data: () => ({
    
  })
}
</script>
