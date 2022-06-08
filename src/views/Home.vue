<template>
  <PageWrapper>
    <div class="dashboard-content page-container">
      <PageTitle :pageTitle="'Welcome to YAN Admin'"/>
      
      <div class="sub-wrapper mb-5">
        <h5 class="subtitle">
          Refresh page to view changes after create / update or deleting any data! <br> Also all changes are saved to history !:D
        </h5>
        <span>Visit YAN Landing Page -></span> <a href="">YAN Landing Page</a>
      </div>
      
      <History/>
    </div>
  </PageWrapper>
</template>

<script>
import { useStore } from 'vuex'
import PageWrapper from '@/components/Wrapper/PageWrapper.vue'
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import History from './History.vue'

export default {
    name: 'HomeView',
    components: { PageWrapper, PageTitle, History }, 
    setup() {
      const store = useStore()

      const logout = () => {
        store.dispatch('logout')
      }
      
      return {
        logout
      }
    }
}
</script>

<style>
.sub-wrapper {
  color: #D1D1D1;
}
</style>