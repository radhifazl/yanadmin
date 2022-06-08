<template>
  <PageWrapper>
      <div class="hargapage page-container">
          <PageTitle :pageTitle="'YAN Price Page'"/>
          <Carousel :loaded="true" @clickSection="changeSection" :visibleSlide="visibleSlide">
              <CarouselSlide :index="0" :visibleSlide="visibleSlide">
                  <Basic />
              </CarouselSlide>

              <CarouselSlide :index="1" :visibleSlide="visibleSlide">
                  <Regular />
              </CarouselSlide>
              
              <CarouselSlide :index="2" :visibleSlide="visibleSlide">
                  <Premium />
              </CarouselSlide>
          </Carousel>
      </div>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/Wrapper/PageWrapper.vue'
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import Basic from "@/components/ChangeContent/PriceTypes/Basic.vue";
import Carousel from '@/components/Carousel/Carousel.vue';
import CarouselSlide from '@/components/Carousel/CarouselSlide.vue';
import Regular from '@/components/ChangeContent/PriceTypes/Regular.vue';
import Premium from '@/components/ChangeContent/PriceTypes/Premium.vue';

export default {
    name: 'HargaPage',
    components: { PageWrapper, PageTitle, Basic, Carousel, CarouselSlide, Regular, Premium},
    data () {
        return {
            visibleSlide: 0,
        }
    },
    methods: {
        changeSection (index) {
            this.visibleSlide = parseInt(index)
        }
    },
}
</script>
        

<style>

</style>