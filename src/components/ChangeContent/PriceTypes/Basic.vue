<template>
  <div class="basic w-100">
      <ChangePrice :priceType="'basic'"/>
      <PriceList :priceType="'basic'"/>
  </div>
</template>

<script>
import ChangePrice from "@/components/ChangeContent/ChangePrice.vue";
import PriceList from '../PriceList.vue';
export default {
    name: 'BasicPrice',
    components: { ChangePrice, PriceList },
}
</script>

<style>

</style>