<template>
  <div class="changeprice-wrapper">
      <ChangeContent 
        :checkInput="isPriceEmpty" :contentTitle="`Change ${priceType} Price`" :status="saving"
        @cancel="cancelPrice" @save="savePrice"
      >
          <template v-slot:secondSlot>
            <div class="text-secondary mb-3">
              {{ rupiahCurrency(changePrice) }}
            </div>
            <input type="number" class="inp-content" @keyup="check" v-model="changePrice">
          </template>
      </ChangeContent>
  </div>
</template>

<script>
import ChangeContent from './ChangeContent.vue'
import { firestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Swal from 'sweetalert2'

export default {
  components: { ChangeContent },
  data () {
    return {
      changePrice: '',
      saving: false,
      isPriceEmpty: false,
    }
  },
  props: [
      'priceType'
  ],
  methods: {
    check () {
      this.changePrice > 0 ? this.isPriceEmpty = true : this.isPriceEmpty = false
    },
    cancelPrice () {
      this.isPriceEmpty = false
      this.changePrice = ''
    },
    async savePrice () {
      if(!this.changePrice) {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Price cannot be empty!',
        })
      } else {
        Swal.fire({
          title: 'Are you sure?',
          text: "The price will changed to " + this.changePrice + "!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, change it!'

        }).then(async result => {
          if(result.isConfirmed) {
            this.saving = true
            const docRef = doc(firestore, 'prices', 'yanpage_prices', `${this.priceType}_price`, 'prices')
            await updateDoc(docRef, {
              price: this.rupiahCurrency(this.changePrice)
            }).then(() => {
              Swal.fire({
                type: 'success',
                title: 'Success!',
                text: 'Price has been changed to ' + this.changePrice,
                icon: 'success'
              })
            }).catch(err => {
              console.log(err.code)
            }).finally(() => {
              this.saving = false
              this.isPriceEmpty = false
              this.changePrice = ''
            })
          }
        })
      }
    },
    rupiahCurrency(num) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(num)
    }
  }
}
</script>

<style>

</style>