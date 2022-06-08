<template>
  <PageWrapper>
      <div class="homepage page-container">
          <PageTitle :pageTitle="'YAN About Page'"/>
          <ChangeContent 
            :checkInput="isNotEmpty" 
            :contentTitle="'Change About Title'" 
            @cancel="cancelTitle" @save="changeTitle" :status="saving"
          >
            <template v-slot:secondSlot>
              <input type="text" class="inp-content" @keyup="check" v-model="aboutTitle">
            </template>
          </ChangeContent>

          <ChangeContent 
            :checkInput="isNotEmpty2" 
            :contentTitle="'Change About Description'" :status="saving"
            @cancel="cancelSubtitle" @save="changeSubtitle"
          >
            <template v-slot:secondSlot>
              <input type="text" class="inp-content" @keyup="check2" v-model="aboutSubtitle">
            </template>
          </ChangeContent>
      </div>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/Wrapper/PageWrapper.vue'
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import ChangeContent from '@/components/ChangeContent/ChangeContent.vue'

import { firestore } from "@/firebase";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import Swal from 'sweetalert2'
import { getDate } from "@/components/Date";

export default {
    name: 'AboutPage',
    components: { PageWrapper, PageTitle, ChangeContent },
    data () {
        return {
            isNotEmpty: false,
            isNotEmpty2: false,
            aboutTitle: '',
            aboutSubtitle: '',
            saving: false,
        }
    },
    methods: {
        check () {
            this.aboutTitle.length > 0 ? this.isNotEmpty = true : this.isNotEmpty = false
        },
        check2 () {
            this.aboutSubtitle.length > 0 ? this.isNotEmpty2 = true : this.isNotEmpty2 = false
        },
        cancelTitle () {
            this.isNotEmpty = false
            this.aboutTitle = ''
        },
        cancelSubtitle () {
            this.isNotEmpty2 = false
            this.aboutSubtitle = ''
        },
        async changeTitle () {
            if(!this.aboutTitle) {
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
                        const docRef = doc(firestore, 'about', 'yanpage_about')
                        await updateDoc(docRef, {
                            title: this.aboutTitle
                        }).then(() => {
                            this.saving = false
                        }).catch(err => {
                            console.log(err)
                        }).finally(async () => {
                            Swal.fire({
                                title: 'Title Changed',
                                text: 'The Title has been changed to : ' + this.aboutTitle,
                                type: 'success',
                                showConfirmButton: true,
                            })
                            const historyRef = collection(firestore, 'history')
                            await addDoc(historyRef, {
                                action: 'Changed About Title to : ' + this.aboutTitle,
                                date: getDate(new Date()),
                                month: new Date().getMonth() + 1,
                            })
                        })

                        this.isNotEmpty = false
                        this.aboutTitle = ''
                    }
                })
            }
        },
        async changeSubtitle () {
            if(!this.aboutSubtitle) {
                Swal.fire({
                    title: 'Error',
                    text: 'Please enter a subtitle',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            } else {
                Swal.fire({
                    title: 'Change Subtitle/text?',
                    text: "Are you sure you want to change the subtitle/text?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, change it!',
                }).then(async result => {
                    if(result.isConfirmed) {
                        this.saving = true
                        const docRef = doc(firestore, 'about', 'yanpage_about')
                        await updateDoc(docRef, {
                            desc: this.aboutSubtitle
                        }).then(() => {
                            this.saving = false
                        }).catch(err => {
                            console.log(err)
                        }).finally(async () => {
                            Swal.fire({
                                title: 'Subtitle Changed',
                                text: 'The Subtitle has been changed to : ' + this.aboutSubtitle,
                                type: 'success',
                                showConfirmButton: true,
                            })
                            const historyRef = collection(firestore, 'history')
                            await addDoc(historyRef, {
                                action: 'Changed About Description to : ' + this.aboutSubtitle,
                                date: getDate(new Date()),
                                month: new Date().getMonth() + 1,
                            })
                        })

                        this.isNotEmpty2 = false
                        this.aboutSubtitle = ''
                    }
                })
            }
        },
    }
}
</script>

<style>
</style>