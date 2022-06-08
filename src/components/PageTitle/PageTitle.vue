<template>
  <h2 class="page-title mb-5">
      {{ pageTitle }}
  </h2>
</template>

<script>
export default {
    name: 'PageTitle',
    props: [
        'pageTitle'
    ]
}
</script>

<style>
.page-title {
    color: #ffffff;
}
</style>