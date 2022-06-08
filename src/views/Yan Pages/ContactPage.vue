<template>
  <PageWrapper>
      <div class="contactpage page-container">
          <PageTitle :pageTitle="'YAN Contact Page'"/>

          <SocialMedia :mediaName="'whatsapp'"/>

          <SocialMedia :mediaName="'instagram'"/>

          <SocialMedia :mediaName="'email'"/>

          <SocialMedia :mediaName="'telegram'"/>

          <SocialMedia :mediaName="'line'"/>
      </div>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/Wrapper/PageWrapper.vue'
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import SocialMedia from '@/components/ChangeContent/SocialMedia.vue'
export default {
    name: 'ContactPage',
    components: { PageWrapper, PageTitle, SocialMedia },
}
</script>

<style>

</style>