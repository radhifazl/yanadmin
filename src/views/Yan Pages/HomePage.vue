<template>
  <PageWrapper>
      <div class="homepage page-container">
          <PageTitle :pageTitle="'YAN Home Page'"/>
          <ChangeContent 
            :checkInput="isNotEmpty" 
            :contentTitle="'Change Home Title'" 
            @cancel="cancelTitle" @save="changeTitle" :status="saving"
          >
            <template v-slot:secondSlot>
              <input type="text" class="inp-content" @keyup="check" v-model="homeTitle">
            </template>
          </ChangeContent>

          <ChangeContent 
            :checkInput="isNotEmpty2" 
            :contentTitle="'Change Home Subtitle'" 
            @cancel="cancelSubtitle" @save="changeSubtitle"
          >
            <template v-slot:secondSlot>
              <input type="text" class="inp-content" @keyup="check2" v-model="homeSubtitle">
            </template>
          </ChangeContent>

          <div class="change-slides d-flex flex-column align-items-start">
              <div class="content-title mb-4">
                  <h5>Change Home Images</h5>
              </div>

              <HomeImage/>
          </div>
      </div>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/Wrapper/PageWrapper.vue'
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import ChangeContent from '@/components/ChangeContent/ChangeContent.vue'
import HomeImage from "@/components/ChangeContent/HomeImage.vue";

import { firestore } from "@/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import Swal from 'sweetalert2'
import { getDate } from "@/components/Date";

export default {
    name: 'HomePage',
    components: { PageWrapper, PageTitle, ChangeContent, HomeImage },
    data () {
        return {
            isNotEmpty: false,
            isNotEmpty2: false,
            homeTitle: '',
            homeSubtitle: '',
            saving: false,
        }
    },
    methods: {
        check () {
            this.homeTitle.length > 0 ? this.isNotEmpty = true : this.isNotEmpty = false
        },
        check2 () {
            this.homeSubtitle.length > 0 ? this.isNotEmpty2 = true : this.isNotEmpty2 = false
        },
        cancelTitle () {
            this.isNotEmpty = false
            this.homeTitle = ''
        },
        cancelSubtitle () {
            this.isNotEmpty2 = false
            this.homeSubtitle = ''
        },
        async changeTitle () {
            if(!this.homeTitle) {
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
                        const docRef = doc(firestore, 'home', 'yanpage_home')
                        await updateDoc(docRef, {
                            title: this.homeTitle
                        }).then(() => {
                            this.saving = false
                        }).catch(err => {
                            console.log(err)
                        }).finally(async () => {
                            Swal.fire({
                                title: 'Title Changed',
                                text: 'The Title has been changed to : ' + this.homeTitle,
                                type: 'success',
                                showConfirmButton: true,
                            })
                            const historyRef = collection(firestore, 'history')
                            await addDoc(historyRef, {
                                action: 'Changed Home Title to : ' + this.homeTitle,
                                date: getDate(new Date()),
                                month: new Date().getMonth() + 1,
                            })
                        })

                        this.isNotEmpty = false
                        this.homeTitle = ''
                    }
                })
            }
        },
        async changeSubtitle () {
            if(!this.homeSubtitle) {
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
                        const docRef = doc(firestore, 'home', 'yanpage_home')
                        await updateDoc(docRef, {
                            subtitle: this.homeSubtitle
                        }).then(() => {
                            this.saving = false
                        }).catch(err => {
                            console.log(err)
                        }).finally(async () => {
                            Swal.fire({
                                title: 'Subtitle Changed',
                                text: 'The Subtitle has been changed to : ' + this.homeSubtitle,
                                type: 'success',
                                showConfirmButton: true,
                            })
                            const historyRef = collection(firestore, 'history')
                            await addDoc(historyRef, {
                                action: 'Changed Home Subtitle to : ' + this.homeSubtitle,
                                date: getDate(new Date()),
                                month: new Date().getMonth() + 1,
                            })
                        })

                        this.isNotEmpty2 = false
                        this.homeSubtitle = ''
                    }
                })
            }
        },
    }
}
</script>

<style>
</style>