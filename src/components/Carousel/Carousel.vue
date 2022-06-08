<template>
  <div class="carousel">
        <div class="carousel-btn d-flex gap-5 mb-5 w-100">
            <button class="th-btn" @click="clickSection" data-id="0" 
                :class="[visibleSlide === 0 ? 'active' : '', visibleSlide === 0 ? 'moveLine' : '']"
            >
                Basic
            </button>
            <button class="th-btn" @click="clickSection" data-id="1" 
                :class="[visibleSlide === 1 ? 'active' : '', visibleSlide === 1 ? 'moveLineOne' : '']"
            >
                Regular
            </button>
            <button class="th-btn" @click="clickSection" data-id="2" 
                :class="[visibleSlide === 2 ? 'active' : '', visibleSlide === 2 ? 'moveLineTwo' : '']"
            >
                Premium
            </button>
            <div class="line"></div>
        </div>
      <slot/>
  </div>
</template>

<script>
export default {
    name: 'CarouselComp',
    props: [
        'index',
        'visibleSlide'
    ],
    methods: {
        clickSection() {
            const id = event.target.getAttribute('data-id');
            this.$emit('clickSection', id);
        }
    }
}
</script>

<style>
.carousel {
    width: 100%;
    height: 100%;
    position: relative;
    overflow-x: hidden;
}

.carousel::-webkit-scrollbar {
    display: none;
}

.carousel-btn {
    position: relative;
}

.carousel-btn::before {
    content: '';
    position: absolute;
    bottom: -15%;
    left: 0;
    display: block;
    width: 100%;
    height: 4px;
    background: #292929;
    transition: all 0.3s ease;
}

.th-btn {
    position: absolute;
    left: 0;
    width: 100px;
    padding: 0.2rem 0;
    border: none;
    font-weight: 500;
    background: transparent;
    color: #888;
    transition: all 0.35s ease-in-out;
}

.th-btn:nth-child(2) {
    transform: translateX(150px);
}

.th-btn:nth-child(3) {
    transform: translateX(300px);
}

.th-btn.active {
    color: #FFFFFF;
    position: relative;
}

/* create border bottom on after pseudo */
.line {
    content: '';
    position: absolute;
    bottom: -15%;
    left: 0;
    width: 100px;
    height: 4px;
    background: #D1D1D1;
    display: block;
    transition: all 0.35s ease-in-out;
    animation: wide 0.35s ease-in-out;
}

.moveLineOne ~ .line{
    transform: translateX(150px);
}

.moveLineTwo ~ .line {
    transform: translateX(300px);
}

@keyframes wide {
    0% {
        opacity: 0;
        width: 0%;
    }
    100% {
        opacity: 1;
        width: 100%;
    }
}


@media screen and (max-width: 868px) {
    .carousel {
        height: 75vh;
    }
}
</style>