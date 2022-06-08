<template>
  <div class="regular w-100">
      <ChangePrice :priceType="'regular'"/>
      <PriceList :priceType="'regular'"/>
  </div>
</template>

<script>
import ChangePrice from "@/components/ChangeContent/ChangePrice.vue";
import PriceList from '../PriceList.vue';
export default {
    name: 'RegularPrice',
    components: { ChangePrice, PriceList },
}
</script>

<style>

</style>