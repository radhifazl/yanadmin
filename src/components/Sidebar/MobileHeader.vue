<template>
  <div class="mobileheader w-100 d-lg-none d-flex">
      <div class="mobile-logo">
          <img src="@/assets/images/logo/admin-logo.svg" alt="YAN Admin">
      </div>

      <div class="menu-toggle" @click="toggleMenu" :class="{ open: isOpen }">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
      </div>
  </div>
</template>

<script>
export default {
    name: 'MobileHeader',
    data () {
        return {
            isOpen: false
        }
    },
    methods: {
        toggleMenu () {
            this.$emit('toggleSidebar')

            if(!this.isOpen) {
                this.isOpen = true;
            } else {
                this.isOpen = false;
            }
        }
    }
}
</script>

<style>
.mobileheader {
    background: #1C1C1C;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    padding-top: 0.5rem;
}

.menu-toggle {
    width: 28px;
    height: 25px;
    cursor: pointer;
    margin-top: 0.5rem;
}

.menu-toggle .bar {
    width: 100%;
    height: 13%;
    background: #FFFFFF;
    display: block;
    margin-bottom: 0.3rem;
    transition: all 0.35s ease-in-out;
}

.open .bar:nth-child(1) {
    transform: rotate(45deg) translateY(0.7rem);
}

.open .bar:nth-child(2) {
    transform: translateX(-3rem);
    opacity: 0;
}

.open .bar:nth-child(3) {
    transform: rotate(-45deg) translateY(-0.7rem);
}
</style>