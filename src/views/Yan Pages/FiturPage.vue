<template>
  <PageWrapper>
      <div class="fiturpage page-container">
          <PageTitle :pageTitle="'YAN Feature Page'"/>
          <ChangeContent 
            :checkInput="isNotEmpty" 
            :contentTitle="'Change Feature Page Title'" 
            @cancel="cancelTitle" @save="changeTitle" :status="saving"
            >
              <template v-slot:secondSlot>
                <input type="text" class="inp-content" @keyup="check" v-model="featPageTitle">
              </template>
          </ChangeContent>

          <ChangeContent 
            :checkInput="isNotEmpty2" 
            :contentTitle="'Change Feature Page Description'" 
            @cancel="cancelSubtitle" @save="changeSubtitle"
            >
              <template v-slot:secondSlot>
                <input type="text" class="inp-content" @keyup="check2" v-model="featPageSubtitle">
              </template>
          </ChangeContent>

          <ChangeContent :contentTitle="'Change Features'">
              <template v-slot:secondSlot>
                <FeaturesList/>
              </template>
          </ChangeContent>
      </div>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/Wrapper/PageWrapper.vue'
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import ChangeContent from '@/components/ChangeContent/ChangeContent.vue'
import FeaturesList from "@/components/ChangeContent/FeaturesList.vue";

import { firestore } from "@/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import Swal from 'sweetalert2'
import { getDate } from '@/components/Date';

export default {
    name: 'AboutPage',
    components: { PageWrapper, PageTitle, ChangeContent, FeaturesList },
    data () {
        return {
            isNotEmpty: false,
            isNotEmpty2: false,
            featPageTitle: '',
            featPageSubtitle: '',
            saving: false,
        }
    },
    methods: {
        check () {
            this.featPageTitle.length > 0 ? this.isNotEmpty = true : this.isNotEmpty = false
        },
        check2 () {
            this.featPageSubtitle.length > 0 ? this.isNotEmpty2 = true : this.isNotEmpty2 = false
        },
        cancelTitle () {
            this.isNotEmpty = false
            this.featPageTitle = ''
        },
        cancelSubtitle () {
            this.isNotEmpty2 = false
            this.featPageSubtitle = ''
        },
        async changeTitle () {
            if(!this.featPageTitle) {
                Swal.fire({
                    title: 'Error',
                    text: 'Please enter a title',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
                return
            } else {
                Swal.fire({
                    title: 'Change Title?',
                    text: "Are you sure you want to change the title?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, change it!',
                }).then(async result => {
                    if(result.isConfirmed) {
                        this.saving = true
                        const docRef = doc(firestore, 'feature', 'yanpage_feature')
                        await updateDoc(docRef, {
                            title: this.featPageTitle
                        }).then(() => {
                            this.saving = false
                        }).catch(err => {
                            console.log(err)
                        }).finally(async () => {
                            Swal.fire({
                                title: 'Title Changed',
                                text: 'The Title has been changed to : ' + this.featPageTitle,
                                type: 'success',
                                showConfirmButton: true,
                            })
                            const historyRef = collection(firestore, 'history')
                            await addDoc(historyRef, {
                                action: 'Change Feature Page Title to : ' + this.featPageTitle,
                                date: getDate(new Date()),
                            })
                        })

                        this.isNotEmpty = false
                        this.featPageTitle = ''
                    }
                })
            }
        },
        async changeSubtitle () {
            if(!this.featPageSubtitle) {
                Swal.fire({
                    title: 'Error',
                    text: 'Please enter a description',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            } else {
                Swal.fire({
                    title: 'Change Description?',
                    text: "Are you sure you want to change the description?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, change it!',
                }).then(async result => {
                    if(result.isConfirmed) {
                        this.saving = true
                        const docRef = doc(firestore, 'feature', 'yanpage_feature')
                        await updateDoc(docRef, {
                            desc: this.featPageSubtitle
                        }).then(() => {
                            this.saving = false
                        }).catch(err => {
                            console.log(err)
                        }).finally(async () => {
                            Swal.fire({
                                title: 'Description Changed',
                                text: 'The Description has been changed to : ' + this.featPageSubtitle,
                                type: 'success',
                                showConfirmButton: true,
                            })
                            const historyRef = collection(firestore, 'history')
                            await addDoc(historyRef, {
                                action: 'Change Feature Page Description to : ' + this.featPageSubtitle,
                                date: getDate(new Date()),
                            })
                        })

                        this.isNotEmpty2 = false
                        this.featPageSubtitle = ''
                    }
                })
            }
        },
    }
}
</script>

<style>
</style>