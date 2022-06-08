<template>
  <div class="premium w-100">
      <ChangePrice :priceType="'premium'"/>
      <PriceList :priceType="'premium'"/>
  </div>
</template>

<script>
import ChangePrice from "@/components/ChangeContent/ChangePrice.vue";
import PriceList from '../PriceList.vue';
export default {
    name: 'PremiumPrice',
    components: { ChangePrice, PriceList },
}
</script>

<style>

</style>