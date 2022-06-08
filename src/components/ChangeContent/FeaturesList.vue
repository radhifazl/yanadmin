<template>
  <FeaturesBox :collectionOrder="'first'"/>
  <FeaturesBox :collectionOrder="'second'"/>
  <FeaturesBox :collectionOrder="'third'"/>
  <FeaturesBox :collectionOrder="'fourth'"/>
</template>

<script>
import FeaturesBox from './FeaturesContent/FeaturesBox.vue'
export default {
  components: { FeaturesBox },
    name: 'FeaturesList',
}
</script>

<style>

</style>