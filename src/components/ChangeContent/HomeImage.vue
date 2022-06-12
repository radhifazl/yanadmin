<template>
  <div class="home-images-wrapper d-flex justify-content-between align-items-center gap-3">
      <div class="content" v-for="(image, i) in homeImages" :key="i">
          <ChangeModal 
            :img="previewImg" 
            :imgName="previewName" 
            @selectBtn="getFile" @upload="uploadFile"
            v-show="openModal" 
            @close="closeModal"
          />

          <div class="image-wrapper">
              <img :src="image.url">
          </div>

          <div class="name-wrapper">
              <input type="text" v-model="image.name" class="input-imgname mb-3" readonly>
              <button class="btn btn-secondary" @click="changeImg(image.url, image.name)">
                  Change Image
              </button>
          </div>
      </div>
  </div>
</template>

<script>
import { storage, firestore } from "@/firebase";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref as sRef, uploadBytesResumable } from "firebase/storage";
import ChangeModal from '../Modal/ChangeModal.vue';
import { getDate } from "@/components/Date"

export default {
  components: { ChangeModal },
    name: 'HomeImages',
    data() {
        return {
            homeImages: [],
            preview: false,
            previewImg: '',
            previewName: '',
            openModal: false,
            files: [],
        }
    },
    methods: {
        async getImages() {
            const colRef = collection(firestore, 'home', 'yanpage_home', 'images')
            await getDocs(colRef)
              .then((docs) => {
                  docs.forEach(doc => {
                      this.homeImages.push({
                          name: doc.data().name,
                          url: doc.data().url
                      })
                  })
              })
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

            const storageRef = sRef(storage, 'homeslides/'+this.previewName+'.'+extension)

            const uploadTask = uploadBytesResumable(storageRef, this.files[0], metaData)
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log(progress)
                switch (snapshot.state) {
                    case 'paused': // or 'paused'
                        console.log('Upload is paused')
                        break
                    case 'running': // or 'running'
                        console.log('Upload is running')
                        break
                }
            }, (error) => {
                console.log(error)
            }, async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    //split extension from name
                    const name = this.previewName.split('.')

                    const colRef = doc(firestore, 'home', 'yanpage_home', 'images', name[0])
                    await updateDoc(colRef, {
                        name: name[0],
                        url: url
                    }).catch(err => {
                        console.log(err)
                    }).finally(async () => {
                        const historyRef = collection(firestore, 'history')
                        await addDoc(historyRef, {
                            action: 'Updated Home Image with name: '+ name[0],
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
        changeImg(url, name) {
            if(!this.openModal) {
                this.openModal = true
            } else {
                this.openModal = false
            }

            this.previewImg = url,
            this.previewName = name
        },
        closeModal() {
            this.openModal = false
        },
    },
    mounted() {
        this.getImages()
    }
}
</script>

<style>
.image-wrapper {
    width: 300px;
    height: 200px;
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-name, .name-wrapper {
    width: 300px;
    height: 200px;
}

.input-imgname {
    width: 100%;
    background: #292929;
    border: 2px solid transparent;
    border-radius: 3px;
    outline: none;
    width: 100%;
    padding: 0.5rem 0.8rem;
    color: #D1D1D1;
    transition: all 0.25s ease-in-out;
}
</style>