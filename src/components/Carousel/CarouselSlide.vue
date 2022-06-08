<template>
  <div class="carousel-slide" v-show="visibleSlide === index">
      <slot/>
  </div>
</template>

<script>
export default {
    name: 'CarouselSlide',
    props: [
        'index',
        'visibleSlide'
    ]
}
</script>

<style scoped>
.carousel-slide {
    width: 100%;
    display: flex;
    align-items: center;
    position: absolute;
}

@media screen and (max-width: 868px) {
    .carousel-slide {
        flex-direction: column;
    }
}
</style>