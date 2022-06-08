<template>
  <div class="media-info mb-5" v-for="contact in contacts" :key="contact.name">
    <h5 class="media-name mb-4">
        {{ mediaName }}
    </h5>

    <div class="text-wrapper link-wrapper">
        <span class="label">Link  </span>
        <a :href="contact.link" class="info">
            {{ contact.link }}
        </a>
    </div>

    <ChangeContent :checkInput="isLinkEmpty" :status="saving" @cancel="cancelLink" @save="saveLink">
        <template v-slot:secondSlot>
            <input type="text" class="inp-content" v-model="smLink" @keyup="checkLink">
        </template>
    </ChangeContent>

    <div class="text-wrapper name-wrapper">
        <span class="label">Name  </span>
        <a class="info">
            {{ contact.name }}
        </a>
    </div>
    
    <ChangeContent :checkInput="isNameEmpty" :status="saving" @cancel="cancelName" @save="saveName">
        <template v-slot:secondSlot>
            <input type="text" class="inp-content" v-model="smName" @keyup="checkName">
        </template>
    </ChangeContent>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import ChangeContent from './ChangeContent.vue'
import { addDoc, collection, doc, getDoc, updateDoc } from '@firebase/firestore'
import { firestore } from '@/firebase'
import { getDate } from '../Date'
export default {
    components: { ChangeContent },
    data () {
        return {
                smLink: '',
                smName: '',
                saving: false,
                isLinkEmpty: false,
                isNameEmpty: false,
                contacts: []
        }
    },
    props: [
        'mediaName'
    ],
    mounted() {
        this.getContactInfo()
    },
    methods: {
      async getContactInfo() {
        const docRef = doc(firestore, 'contact', 'yanpage_contact', this.mediaName, `${this.mediaName}_info`)
        await getDoc(docRef)
          .then((doc) => {
              this.contacts.push(doc.data())
          })
      },
      cancelLink () {
          this.smLink = ''
          this.isLinkEmpty = false
      },
      cancelName () {
            this.smName = ''
            this.isNameEmpty = false
      },
      checkLink () {
          this.smLink.length > 0 ? this.isLinkEmpty = true : this.isLinkEmpty = false
      },
      checkName () {
          this.smName.length > 0 ? this.isNameEmpty = true : this.isNameEmpty = false
      },
      saveLink () {
          if(!this.smLink) {
              Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'You have to enter a link',
              })
          } else {
              Swal.fire({
                    title: 'Are you sure?',
                    text: 'You want to save this link?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, save it!'
                }).then(async (result) => {
                    if(result.isConfirmed) {
                        this.saving = true
                        const docRef = doc(firestore, 'contact', 'yanpage_contact', this.mediaName, `${this.mediaName}_info`)
                        await updateDoc(docRef, {
                            link: this.smLink
                        }).then(async () => {
                            Swal.fire({
                                type: 'success',
                                title: 'Success',
                                text: 'Link has been saved',
                            })
                            const historyRef = collection(firestore, 'history')
                            await addDoc(historyRef, {
                                action: `Updated ${this.mediaName} link to ${this.smLink}`,
                                date: getDate(new Date()),
                                month: new Date().getMonth() + 1,
                            })
                        }).catch(err => {
                            Swal.fire({
                                type: 'error',
                                title: 'Oops...',
                                text: err.message,
                            })
                            this.saving = false
                        }).finally(() => {
                            this.saving = false
                        })

                        this.smLink = ''
                        this.isLinkEmpty = false
                    }
                })
          }
      },
      saveName () {
          if(!this.smName) {
              Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'You have to enter your social media username',
              })
          } else {
              Swal.fire({
                    title: 'Are you sure?',
                    text: 'You want to save this name?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, save it!'
                }).then(async (result) => {
                    if(result.isConfirmed) {
                        this.saving = true
                        const docRef = doc(firestore, 'contact', 'yanpage_contact', this.mediaName, `${this.mediaName}_info`)
                        await updateDoc(docRef, {
                            name: this.smName
                        }).then(async () => {
                            Swal.fire({
                                type: 'success',
                                title: 'Success',
                                text: 'Name has been saved',
                            })
                            const historyRef = collection(firestore, 'history')
                            await addDoc(historyRef, {
                                action: `Updated ${this.mediaName} name/username to ${this.smName}`,
                                date: getDate(new Date()),
                                month: new Date().getMonth() + 1,
                            })
                        }).catch(err => {
                            Swal.fire({
                                type: 'error',
                                title: 'Oops...',
                                text: err.message,
                            })
                            this.saving = false
                        }).finally(() => {
                            this.saving = false
                        })

                        this.smName = ''
                        this.isNameEmpty = false
                    }
                })
          }
      }
    },
}
</script>

<style>
.media-info {
    color: #D1D1D1;
}
.media-name {
    text-transform: capitalize;
    border-left: 3px solid #D1D1D1;
    padding-left: 1rem;
}
.text-wrapper {
    display: flex;
    align-items: flex-start;
}

.label {
    width: 10%;
    position: relative;
}

.label::after {
    content: ':';
    position: absolute;
    right: 20%;
    top: 0;
}

.info {
    text-decoration: none;
    color: #D1D1D1;
}
</style>