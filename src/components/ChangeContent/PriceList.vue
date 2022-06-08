<template>

  <div class="price-list-container">
    <button class="btn btn-secondary mb-3" @click="showAddInput">Add Item</button>
    <Transition name="fade">
        <ChangeContent v-show="isAddButtonClicked" :checkInput="isAddEmpty" :status="saving" @cancel="cancelAdd" @save="addItem">
            <template v-slot:secondSlot>
                <input type="text" class="inp-content" 
                v-model="addItemInp" 
                :placeholder="'Type Item Name / New Price Feature Here'"
                @keyup="checkAdd"
                >
            </template>
        </ChangeContent>
    </Transition>

    <div class="price-list-wrapper" v-for="(priceList, i) in priceLists" :key="'priceItem-'+i">
        <ChangeContent :checkInput="isNotEmpty[i]" :status="saving" @cancel="cancelChange(i)">
            <template v-slot:secondSlot>
                <input type="text" class="inp-content" :placeholder="priceList.name" v-model="priceItem[i]" @keyup="check(i), check2(i)">
            </template>

            <template v-slot:deleteSlot>
                <button class="btn btn-danger" v-show="isEmpty" @click="deleteItem(priceList.id, priceList.name)">Delete Item</button>
            </template>
        </ChangeContent>
    </div>
  </div>
</template>

<script>
import { firestore } from '@/firebase'
import { addDoc, collection, deleteDoc, doc, getDocs } from '@firebase/firestore'
import ChangeContent from './ChangeContent.vue'
import Swal from 'sweetalert2'
import { getDate } from '../Date'
export default {
    name: 'PriceList',
    components: { ChangeContent },
    data () {
        return {
            isNotEmpty: {},
            isEmpty: true,
            isAddButtonClicked: false,
            priceItem: {},
            priceLists: [],
            addItemInp: '',
            isAddEmpty: false,
            saving: false,
        }
    },
    props: [
        'priceType'
    ],
    methods: {
        check (index) {
            this.priceItem[index].length > 0 ? this.isNotEmpty[index] = true : this.isNotEmpty[index] = false
        },
        check2 (index) {
            this.priceItem[index].length > 0 ? this.isEmpty = false : this.isEmpty = true
        },
        checkAdd() {
            this.addItemInp.length > 0 ? this.isAddEmpty = true : this.isAddEmpty = false
        },
        cancelChange (index) {
            this.priceItem[index] = ''
            this.isNotEmpty[index] = false
        },
        cancelAdd () {
            this.isAddButtonClicked = false
            this.addItemInp = ''
            this.isAddEmpty = false
        },
        showAddInput() {
            if(!this.isAddButtonClicked) {
                this.isAddButtonClicked = true
            } else {
                this.isAddButtonClicked = false
            }
        },
        async getPriceLists () {
            const colRef = collection(firestore, 'prices', 'yanpage_prices', this.priceType)

            await getDocs(colRef)
              .then(docs => {
                  docs.forEach(doc => {
                      this.priceLists.push({
                          id: doc.id,
                          ...doc.data()
                      })
                  })
              }).catch(err => {
                  console.log(err.code)
              })
        },
        deleteItem(id, name) {
            const docRef = doc(firestore, 'prices', 'yanpage_prices', this.priceType, id)
            Swal.fire({
                title: 'Are you sure you want to delete this?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(async result => {
                if(result.isConfirmed) {
                    await deleteDoc(docRef)
                      .then(async () => {
                          Swal.fire({
                                title: 'Deleted!',
                                text: 'Item has been deleted.',
                                icon: 'success',
                                confirmButtonText: 'Ok'
                          })
                          const historyRef = collection(firestore, 'history')
                          await addDoc(historyRef, {
                              action: `Deleting item named : ${name}`,
                              date: getDate(new Date()),
                              month: new Date().getMonth() + 1,
                          })
                      }).catch(err => {
                          console.log(err.code)
                      })
                }
            })
        },
        async addItem () {
            if(!this.addItemInp) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Please enter a name for the item.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            } else {
                this.saving = true
                const colRef = collection(firestore, 'prices', 'yanpage_prices', this.priceType)
                await addDoc(colRef, {
                    name: this.addItemInp
                }).then(async () => {
                    Swal.fire({
                        title: 'Added!',
                        text: 'Item has been added.',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    })
                    const historyRef = collection(firestore, 'history')
                    await addDoc(historyRef, {
                        action: `New item added named : ${this.addItemInp}`,
                        date: getDate(new Date()),
                        month: new Date().getMonth() + 1,
                    })
                }).catch(err => {
                    console.log(err.code)
                    this.saving = false
                }).finally(() => {
                    this.saving = false
                })

                this.addItemInp = ''
                this.isAddButtonClicked = false
                this.isAddEmpty = false
            }
        }
    },
    mounted () {
        this.getPriceLists()
    }
}
</script>

<style>
.fade-enter-active {
    animation: fadeIn 0.2s ease-in-out;
}

.fade-leave-active {
    animation: fadeOut 0.2s ease-in-out;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>