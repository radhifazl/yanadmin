<template>
  <div class="page">
      <Sidebar/>

      <slot/>
  </div>
</template>

<script>
import Sidebar from '../Sidebar/Sidebar.vue'
export default {
  components: { Sidebar },
  name: 'PageWrapper',

}
</script>

<style>

</style>