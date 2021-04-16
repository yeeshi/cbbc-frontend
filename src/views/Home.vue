<template>
  <div style="max-width: 1200px; margin: 0 auto; width: 100%;">
    <v-header></v-header>
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import vHeader from '@/components/Header.vue'
export default {
  name: 'Home',
  data: () => ({
    
  }),
  components: {
    vHeader
  },
  mounted () {
  
  },
  methods: {
   
  }
}
</script>
