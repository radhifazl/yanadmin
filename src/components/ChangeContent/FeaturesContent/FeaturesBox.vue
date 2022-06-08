<template>
  <div class="features d-flex justify-content-between align-items-center mb-5 gap-3" 
    v-for="(feature, i) in featuresBox" :key="i"
  >
      <ChangeModal 
        :img="previewImg" 
        :imgName="previewName" 
        @selectBtn="getFile" @upload="uploadFile"
        v-show="openModal" :progress="uploadProgress" :uploadStatus="isUploading"
        @close="closeModal"
      />

      <div class="feature-icon d-flex flex-column">
          <div class="image-wrapper mb-3">
            <img :src="feature.url" :alt="feature.title">
          </div>
          <button class="btn btn-secondary" @click="openModalImg(feature.url)">
              Change Image
          </button>
      </div>

      <div class="features-text">
          <ChangeContent
            :contentTitle="'Change Feature Title'" :checkInput="titleIsNotEmpty"
            @cancel="cancelTitle" @save="changeTitle" :status="saving"
          >    
              <template v-slot:secondSlot>
                <input type="text" class="inp-content" @keyup="check" v-model="first_title" :placeholder="feature.title">
              </template>
          </ChangeContent>
          
          <ChangeContent
            :contentTitle="'Change Feature Text'" :checkInput="textIsNotEmpty"
            @cancel="cancelText" @save="changeText" :status="saving"
          >
              <template v-slot:secondSlot>
                <input type="text" class="inp-content" @keyup="check" v-model="first_text" :placeholder="feature.text">
              </template>
          </ChangeContent>
      </div>
  </div>
</template>

<script>
import ChangeContent from "@/components/ChangeContent/ChangeContent.vue";
import { storage, firestore } from "@/firebase";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ChangeModal from '@/components/Modal/ChangeModal.vue';
import Swal from 'sweetalert2'
import { getDate } from '@/components/Date';

export default {
  components: { ChangeContent, ChangeModal },
  data () {
      return {
          files: [],
          uploadProgress: '',
          first_title: '',
          first_text: '',
          saving: false,
          titleIsNotEmpty: false,
          textIsNotEmpty: false,
          featuresBox: [],
          openModal: false,
          previewImg: '',
          previewName: '',
          isUploading: false,
      }
  },
  props: [
      'collectionOrder'
  ],
  mounted() {
      this.getFeatures()
  },
  methods: {
        check () {
            this.first_title.length > 0 ? this.titleIsNotEmpty = true : this.titleIsNotEmpty = false
        },
        check2 () {
            this.first_text.length > 0 ? this.textIsNotEmpty = true : this.textIsNotEmpty = false
        },
        cancelTitle () {
            this.titleIsNotEmpty = false
            this.first_title = ''
        },
        async changeTitle () {
            if(!this.first_title) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Title cannot be empty!',
                })
            } else {
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'You won\'t be able to revert this!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, change it!'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        this.saving = true
                        const docRef = doc(firestore, 'features', 'yanpage_features', `${this.collectionOrder}_feature`, this.collectionOrder);
                        await updateDoc(docRef, {
                            feature_title: this.first_title
                        }).then(() => {
                            this.saving = false
                        }).catch(err => {
                            console.log(err)
                        }).finally(async () => {
                            Swal.fire({
                                title: 'Title Changed',
                                text: 'The Title has been changed to : ' + this.first_title,
                                type: 'success',
                                showConfirmButton: true,
                            })
                            const historyRef = collection(firestore, 'history');
                            await addDoc(historyRef, {
                                action: 'Changes Feature Title to : ' + this.first_title,
                                date: getDate(new Date()),
                                month: new Date().getMonth() + 1,
                            })
                        })

                        this.titleIsNotEmpty= false
                        this.first_title = ''
                    }
                })
            }
        },
        cancelText () {
            this.textIsNotEmpty = false
            this.first_text = ''
        },
        async changeText () {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, change it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.saving = true
                    const docRef = doc(firestore, 'features', 'yanpage_features', `${this.collectionOrder}_feature`, this.collectionOrder);
                    await updateDoc(docRef, {
                        feature_subtitle: this.first_text
                    }).then(() => {
                        this.saving = false
                    }).finally(async () => {
                        const historyRef = collection(firestore, 'history');
                        await addDoc(historyRef, {
                            action: 'Changes Feature Text to : ' + this.first_text,
                            date: getDate(new Date()),
                            month: new Date().getMonth() + 1,
                        })
                    })

                    this.textIsNotEmpty= false
                    this.first_text = ''
                }
            })
        },
        async getFeatures() {
            const colRef = collection(firestore, 'features', 'yanpage_features', `${this.collectionOrder}_feature`);
            await getDocs(colRef)
              .then((docs) => {
                  docs.forEach(doc => {
                      this.featuresBox.push({
                        id: doc.id,
                        title: doc.data().feature_title,
                        text: doc.data().feature_subtitle,
                        url: doc.data().iconUrl,
                      })
                  })
              }).catch(err => {
                  console.log(err)
              })
        },
        openModalImg(url) {
            this.previewImg = url
            this.previewName = `${this.collectionOrder}_icon`
            this.openModal = true
        },
        closeModal() {
            this.openModal = false
        },
        getFile() {
            let input = document.createElement('input')
            input.type = 'file'

            input.click()

            input.onchange = (event) => {
                this.files = event.target.files
                this.previewImg = URL.createObjectURL(this.files[0])
            }
        },
        async uploadFile() {
            const metaData = {
                contentType: this.files[0].type
            }

            const extension = metaData.contentType.split('/')[1]

            const storageRef = sRef(storage, 'features/'+this.previewName+'.'+extension)
            this.isUploading = true

            const uploadTask = uploadBytesResumable(storageRef, this.files[0], metaData)
            uploadTask.on('state_changed', (snapshot) => {
                this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                switch (snapshot.state) {
                    case 'paused': // or 'paused'
                        console.log('Upload is paused')
                        break
                    case 'running': // or 'running'
                        console.log('Upload is running')
                        break
                }
                this.isUploading = false
            }, (error) => {
                console.log(error)
            }, async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    const colRef = doc(firestore, 'features', 'yanpage_features', `${this.collectionOrder}_feature`, this.collectionOrder);
                    await updateDoc(colRef, {
                        iconUrl: url
                    }).finally(async () => {
                        const historyRef = collection(firestore, 'history');
                        await addDoc(historyRef, {
                            action: 'Uploads Feature Icon URL',
                            date: getDate(new Date()),
                            month: new Date().getMonth() + 1,
                        })
                    })
                }).catch(error => {
                    console.log(error)
                }).finally(() => {
                    this.openModal = false
                })
            })
        },
  }
}
</script>

<style>
.feature-icon {
    width: 30%;
    height: 100%;
}

.features-text {
    width: 70%;
}

.image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}

.image-wrapper img {
    object-fit: contain;
}
</style>