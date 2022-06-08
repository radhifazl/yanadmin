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
import { collection, orderBy, query, onSnapshot } from '@firebase/firestore'
import { firestore } from '@/firebase'
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
</style>