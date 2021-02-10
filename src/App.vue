<template>
  <Svgs/>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Svgs from '@/components/utils/Svgs.vue'
export default defineComponent({
  name: 'App',
  components: {
    Svgs
  }
})
</script>

<style>
body, html {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>