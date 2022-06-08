<template>
  <PageWrapper>
      <div class="temapage page-container">
          <PageTitle :pageTitle="'Yan Theme Page'"/>
          <ChangeContent :checkInput="isTitleEmpty" 
            :contentTitle="'Change Theme Page Title'"
            @cancel="cancelTitle" @save="changeTitle" :status="saving"
          >
            <template v-slot:secondSlot>
                <input type="text" class="inp-content" @keyup="check" v-model="themePageTitle">
            </template>
          </ChangeContent>

          <ChangeContent :contentTitle="'Change / Add Theme Slides'">
            <template v-slot:firstSlot>
                <ChangeModal :progress="uploadProgress" :uploadStatus="isUploading" :img="previewImg"
                 :imgName="previewName" @close="openModals = false" @selectBtn="getFileTheme" @upload="uploadImg"
                 v-show="openModals" :addButton="true"
                >
                    <input type="text" class="form-control my-3" placeholder="Insert Theme Name" v-model="themeSlideName">
                </ChangeModal>
                <button class="btn-add" @click="openModals = true">Add New Theme Slide</button>
            </template>

            <template v-slot:secondSlot>
                <div class="change-slides mb-5" v-for="(theme, i) in themeSlides" :key="theme.name+'-'+i">
                    <ChangeModal
                        :img="previewImg" :imgName="previewName"
                        :progress="uploadProgress" :uploadStatus="isUploading"
                        @selectBtn="getFile" @upload="uploadFile(theme.id, theme.no)" @close="closeModal"
                        v-show="openModal"
                    />

                    <div class="img-wrapper">
                        <img :src="theme.slideUrl" :alt="theme.name">
                    </div>

                    <div class="change-action">
                        <ChangeContent 
                        :contentTitle="'Change Theme Name'" 
                        :checkInput="isNameEmpty[theme.id]"
                        @cancel="cancelName(theme.id)" @save="changeName(theme.id)" :status="saving"
                        >
                            <template v-slot:secondSlot>
                                <input type="text" class="inp-content" 
                                :placeholder="theme.name"  @keyup="checkName(theme.id)"
                                v-model="themeName[theme.id]"
                                >
                            </template>
                        </ChangeContent>
                        <div class="actions-wrapper d-flex gap-3">
                            <button class="btn btn-secondary" @click="changeImageModal(theme.slideUrl, theme.no)">
                                Change Image
                            </button>
                            <button class="btn btn-danger" @click="deleteSlide(theme.id, theme.name)">
                                Delete Slide
                            </button>
                        </div>
                    </div>
                </div>
            </template>
          </ChangeContent>
      </div>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/Wrapper/PageWrapper.vue'
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import ChangeContent from '@/components/ChangeContent/ChangeContent.vue'
import Swal from 'sweetalert2'
import { storage, firestore } from "@/firebase";
import { doc, updateDoc, getDocs, collection, deleteDoc, addDoc } from "firebase/firestore";
import { ref as sRef, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import ChangeModal from '@/components/Modal/ChangeModal.vue'
import { getDate } from '@/components/Date'

export default {
    name: 'TemaPage',
    components: { PageWrapper, PageTitle, ChangeContent, ChangeModal },
    data () {
        return {
            files: [],
            themePageTitle: '',
            saving: false,
            isTitleEmpty: false,
            isNameEmpty: {},
            themeSlides: [],
            themeName: {},
            previewImg: '',
            previewName: '',
            uploadProgress: '',
            isUploading: false,
            openModal: false,
            openModals: false,
            isAddSlide: true,
            themeSlideName: '',
        }
    },
    methods: {
        check () {
            this.themePageTitle.length > 0 ? this.isTitleEmpty = true : this.isTitleEmpty = false
        },
        checkName(model) {
            this.themeName[model].length > 0 ? this.isNameEmpty[model] = true : this.isNameEmpty[model] = false
        },
        cancelTitle () {
            this.isTitleEmpty = false
            this.themePageTitle = ''
        },
        cancelName(model) {
            this.isNameEmpty[model] = false
            this.themeName[model] = ''
        },
        changeName(model) {
            if(!this.themeName[model]) {
                Swal.fire({
                    title: 'Error',
                    text: 'Name is empty',
                    type: 'error',
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
                        const docRef = doc(firestore, 'themes', 'yanpage_themes', 'slides', model)
                        await updateDoc(docRef, {
                            name: this.themeName[model]
                        }).then(async () => {
                            this.saving = false
                            Swal.fire({
                                title: 'Theme Name Changed',
                                text: 'Theme name has been successfully changed to '+ this.themeName[model],
                                type: 'success',
                                confirmButtonText: 'Ok'
                            })
                            const historyRef = collection(firestore, 'history')
                            await addDoc(historyRef, {
                                action: 'Theme Name Changed to : '+ this.themeName[model],
                                date: getDate(new Date()),
                                month: new Date().getMonth() + 1,
                            })
                        }).catch(() => {
                            this.saving = false
                            Swal.fire({
                                title: 'Error',
                                text: 'Something went wrong',
                                type: 'error',
                                confirmButtonText: 'Ok'
                            })
                        }).finally(() => {
                            this.getSlides()
                        })

                        this.themeName[model] = ''
                        this.isNameEmpty[model] = false
                    }
                })
            }
        },
        changeImageModal(url, no) {
            this.openModal = true
            this.previewImg = url
            this.previewName = no
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
        async uploadFile(id) {
            const metaData = {
                contentType: this.files[0].type
            }

            const extension = metaData.contentType.split('/')[1]

            const storageRef = sRef(storage, 'themes/'+this.previewName+'.'+extension)
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
                    const colRef = doc(firestore, 'themes', 'yanpage_themes', 'slides', id);
                    await updateDoc(colRef, {
                        slideUrl: url
                    }).then(async () => {
                        Swal.fire({
                            title: 'Theme Image Changed',
                            text: 'Theme image has been successfully changed',
                            type: 'success',
                            confirmButtonText: 'Ok'
                        })
                        const historyRef = collection(firestore, 'history')
                        await addDoc(historyRef, {
                            action: 'Theme Image Changed',
                            date: getDate(new Date()),
                            month: new Date().getMonth() + 1,
                        })
                    }).catch(() => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Something went wrong',
                            type: 'error',
                            confirmButtonText: 'Ok'
                        })
                    })
                }).catch(error => {
                    console.log(error)
                })
            })
        },
        getFileTheme() {
            let input = document.createElement('input')
            input.type = 'file'

            input.click()

            input.onchange = (event) => {
                this.files = event.target.files
                this.previewImg = URL.createObjectURL(this.files[0])
                this.previewName = this.files[0].name
            }
        },
        async uploadImg() {
            if(!this.themeSlideName || this.files.length === 0) {
                Swal.fire({
                    title: 'Error',
                    text: 'Name or image is empty',
                    type: 'error',
                    confirmButtonText: 'Ok'
                })
                return
            } else {
                Swal.fire({
                    title: 'Upload Image?',
                    text: "Are you sure you want to upload the image?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, upload it!',
                }).then(async result => {
                    if(result.isConfirmed) {
                        this.saving = true
                        const metaData = {
                            contentType: this.files[0].type
                        }
                        const extension = metaData.contentType.split('/')[1]
                        const storageRef = sRef(storage, 'themes/'+this.themeSlideName+'.'+extension)
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
                                const colRef = collection(firestore, 'themes', 'yanpage_themes', 'slides');
                                await addDoc(colRef, {
                                    name: this.themeSlideName,
                                    slideUrl: url
                                }).then(() => {
                                    Swal.fire({
                                        title: 'Theme Image Uploaded',
                                        text: 'Theme image has been successfully uploaded',
                                        icon: 'success',
                                        confirmButtonText: 'Ok'
                                    })
                                    const historyRef = collection(firestore, 'history')
                                    addDoc(historyRef, {
                                        action: 'Uploaded Theme Image with name : '+ this.themeSlideName,
                                        date: getDate(new Date()),
                                        month: new Date().getMonth() + 1,
                                    })
                                }).catch(() => {
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'Something went wrong',
                                        icon: 'error',
                                        confirmButtonText: 'Ok'
                                    })
                                })
                            }).catch(error => {
                                console.log(error)
                            })
                        })
                    }
                })
            }
        },
        async changeTitle () {
            if(!this.themePageTitle) {
                Swal.fire({
                    title: 'Error',
                    text: 'Title cannot be empty',
                    type: 'error',
                    confirmButtonText: 'OK'
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
                        const docRef = doc(firestore, 'themes', 'yanpage_themes')
                        await updateDoc(docRef, {
                            title: this.themePageTitle
                        }).then(() => {
                            this.saving = false
                        }).catch(err => {
                            console.log(err)
                        }).finally(async () => {
                            Swal.fire({
                                title: 'Title Changed',
                                text: 'The Title has been changed to : ' + this.themePageTitle,
                                type: 'success',
                                showConfirmButton: true,
                            })
                            const historyRef = collection(firestore, 'history')
                            addDoc(historyRef, {
                                action: 'Changed title to : '+ this.themePageTitle,
                                date: getDate(new Date()),
                                month: new Date().getMonth() + 1,
                            })
                        })

                        this.isTitleEmpty = false
                        this.themePageTitle = ''
                    }
                })
            }
        },
        async deleteSlide(id, name) {
          Swal.fire({
            title: 'Delete Slide?',
            text: "Are you sure you want to delete this slide?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
          }).then(async result => {
            if(result.isConfirmed) {
                this.saving = true
                const docRef = doc(firestore, 'themes', 'yanpage_themes', 'slides', id);
                await deleteDoc(docRef)
                 .then(async () => {
                    this.saving = false
                    Swal.fire({
                        title: 'Slide Deleted',
                        text: 'Slide has been successfully deleted',
                        type: 'success',
                        confirmButtonText: 'Ok'
                    })
                    const historyRef = collection(firestore, 'history')
                    await addDoc(historyRef, {
                        action: 'Deleted Slide with name : '+ name + 'and ID : ' + id,
                        date: getDate(new Date()),
                        month: new Date().getMonth() + 1,
                    })
                 }).catch(() => {
                    this.saving = false
                    Swal.fire({
                        title: 'Error',
                        text: 'Something went wrong',
                        type: 'error',
                        confirmButtonText: 'Ok'
                    })
                 }).finally(() => {
                    this.getSlides()
                 })
            }
          })
        },
        closeModal () {
            this.openModal = false
        },
        async getSlides () {
            const colRef = collection(firestore, 'themes', 'yanpage_themes', 'slides')
            await getDocs(colRef)
              .then(docs => {
                  docs.forEach(doc => {
                      this.themeSlides.push({
                          id: doc.id,
                          ...doc.data()
                      })
                  })
              })
        },
    },
    mounted() {
        this.getSlides()
    }
}
</script>

<style>
.change-slides {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.img-wrapper {
    width: 30%;
}

.img-wrapper img {
    width: 90%;
    object-fit: contain;
}

.change-action {
    width: 70%;
}
</style>