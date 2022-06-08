<template>
  <div class="sidebar-wrapper">
      <MobileHeader @toggleSidebar="openSidebar"/>

      <div class="sidebar-content" :class="{open: isOpen}">
        <SidebarHeader />
        <SidebarNav/>
      </div>
  </div>
</template>

<script>
import MobileHeader from './MobileHeader.vue'
import SidebarHeader from './SidebarHeader.vue'
import SidebarNav from './SidebarNav.vue'
import { ref } from "vue";

export default {
  name: 'SideBar',
  components: { SidebarHeader, SidebarNav, MobileHeader },
  setup () {
    const isOpen = ref(false);

    const openSidebar = () => {
      if(!isOpen.value) {
        isOpen.value = true;
      } else {
        isOpen.value = false;
      }
    }

    return {
      isOpen,
      openSidebar
    }
  }
}
</script>

<style>
.sidebar-wrapper {
  width: 25%;
}

.sidebar-content {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .sidebar-wrapper {
    width: 100%;
  }

  .sidebar-content {
    width: 70%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .sidebar-content {
    width: 100%;
    transform: translateX(-100%);
    transition: 0.35s ease-in-out;
  }

  .sidebar-content.open {
    transform: translateX(0);
  }
}
</style>