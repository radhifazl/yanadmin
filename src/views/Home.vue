<template>
  <PageWrapper>
    <div class="dashboard-content page-container">
      <PageTitle :pageTitle="'Welcome to YAN Admin'"/>
      
      <div class="sub-wrapper mb-5">
        <h5 class="subtitle">
          Refresh page to view changes after create / update or deleting any data! <br> Also all changes are saved to history !:D
        </h5>
        <span>Visit YAN Landing Page -></span> <a href="">YAN Landing Page</a>
      </div>

      <div class="visit-wrapper mb-5">
          <ChangeContent :contentTitle="'Website Visit'"/>
          <div class="filter-wrapper mb-3">
            <label for="filterVisit" class="mb-2" id="visitLabel">Filter Visit by Month</label>
            <select class="form-select form-select-sm " @change="filterByMonth" v-model="filterVisit" id="filterVisit">
              <!-- Create options from month -->
              <option selected disabled value="Filter By Month">Filter By Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          <div class="webvisit-wrapper mb-5">
            <h5>Today: {{ todaysVisitCount }} </h5>
            <h5>This Month: {{ monthlyVisitCount }}</h5>
          </div>
      </div>

      
      
      <History/>
    </div>
  </PageWrapper>
</template>

<script>
import { useStore } from 'vuex'
import PageWrapper from '@/components/Wrapper/PageWrapper.vue'
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import History from './History.vue'
import ChangeContent from '@/components/ChangeContent/ChangeContent.vue'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { firestore } from '@/firebase'
import { getDate } from '@/components/Date'

export default {
    name: 'HomeView',
    components: { PageWrapper, PageTitle, History, ChangeContent }, 
    setup() {
      const store = useStore()

      const logout = () => {
        store.dispatch('logout')
      }
      
      return {
        logout
      }
    },
    data() {
      return {
        filterVisit: '',
        todaysVisit: [],
        todaysVisitCount: 0,
        monthlyVisit: [],
        monthlyVisitCount: 0
      }
    },
    methods: {
      async getWebsiteVisit() {
        const colRef = collection(firestore, 'webvisit')
        const q = query(colRef, where('date', '==', getDate(new Date())))
        await getDocs(q)
          .then(res => {
            res.forEach(doc => {
              this.todaysVisit.push(doc.data().count)
            })
          })

        // sum todaysvisit
        for(let i = 0; i < this.todaysVisit.length; i++) {
          this.todaysVisitCount += this.todaysVisit[i]
        }

        const qMonth = query(colRef, where('month', '==', new Date().getMonth() + 1))
        await getDocs(qMonth)
          .then((res) => {
            res.forEach(doc => {
              this.monthlyVisit.push(doc.data().count)
            })
          })

        // sum monthlyvisit
        for(let i = 0; i < this.monthlyVisit.length; i++) {
          this.monthlyVisitCount += this.monthlyVisit[i]
        }
      },
      async filterByMonth() {
        const colRef = collection(firestore, 'webvisit')
        const q = query(colRef, where('month', '==', parseInt(this.filterVisit) ))
        await getDocs(q)
          .then(res => {
            if(res.empty) {
              this.monthlyVisit = []
              this.monthlyVisitCount = 0
              this.todaysVisit = []
              this.todaysVisitCount = 0
            } else {
                res.forEach(doc => {
                  this.todaysVisit.push(doc.data().count)
                  this.monthlyVisit.push(doc.data().count)
                })

                for(let i = 0; i < this.todaysVisit.length; i++) {
                  this.todaysVisitCount += this.todaysVisit[i]
                }

                for(let i = 0; i < this.monthlyVisit.length; i++) {
                  this.monthlyVisitCount += this.monthlyVisit[i]
                }
            }
          })
      }
    },
    mounted() {
      this.getWebsiteVisit()
    }
}
</script>

<style>
.sub-wrapper, #visitLabel, .webvisit-wrapper {
  color: #D1D1D1;
}

.visit-wrapper {
  border: 2px solid #D1D1D1;
  padding: 1rem;
}
</style>