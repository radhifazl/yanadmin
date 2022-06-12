<template>
  <div class="history-wrapper">
    <ChangeContent :contentTitle="'Content Changes History'"/>

    <div class="history-box">
        <div class="history d-flex justify-content-between align-items-center w-100 mb-3"
            v-for="(history, i) in histories" :key="'history-'+i"
        >
            <div class="activity">
                {{ history.action }}
            </div>

            <div class="actions">
                <div class="date">
                    {{ history.date }}
                </div>

                <div class="remove-wrapper" @click="removeHistory(history.id)">
                    <i class='bx-fw bx bxs-trash-alt'></i>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import ChangeContent from '@/components/ChangeContent/ChangeContent.vue'
import { collection, orderBy, query, onSnapshot, deleteDoc, doc } from '@firebase/firestore'
import { firestore } from '@/firebase'
import Swal from 'sweetalert2'
export default {
  components: { ChangeContent },
  name: 'HistoryView',
  data () {
      return {
          histories: []
      }
  },
  methods: {
      async getHistory() {
          const colRef = collection(firestore, 'history')
          const q = query(colRef, orderBy('date', 'desc'))
          onSnapshot(q, (snapshot) => {
              this.histories = []
              snapshot.forEach((doc) => {
                  this.histories.push({
                      id: doc.id,
                      ...doc.data()
                  })
              })
          })
      },
      removeHistory(id) {
          Swal.fire({
            title: 'Remove from history?',
            text: "Are you sure you want to remove activity from history?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
          }).then(async result => {
              if(result.isConfirmed) {
                  const docRef = doc(firestore, 'history', id)
                  await deleteDoc(docRef)
                    .then(() => {
                        Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showCloseButton: true,
                            showConfirmButton: false,
                            iconColor: "#D1D1D1",
                            background: "#212121",
                            timerProgressBar: true,
                            timer: 3000,
                            text: 'Activity successfully removed from history'
                        })
                    }).catch(() => {
                        Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showCloseButton: true,
                            showConfirmButton: false,
                            iconColor: "#D1D1D1",
                            background: "#eb3939",
                            timerProgressBar: true,
                            timer: 3000,
                            text: 'Activity successfully removed from history'
                        })
                    })
              }
          })
      }
  },
  mounted() {
        this.getHistory()
  }
}
</script>

<style>
.history {
    color: #D1D1D1;
    border: 1px solid #D1D1D1;
    padding: 0.5rem 1rem;
}

.remove-wrapper {
    cursor: pointer;
}

.remove-wrapper i {
    transition: 0.35s ease-in-out;
}

.remove-wrapper:hover i {
    color: #dd3333;
}
</style>