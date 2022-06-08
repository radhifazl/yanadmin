import { createStore } from 'vuex'
import { auth } from '@/firebase'
import {
  signInWithEmailAndPassword, signOut
} from 'firebase/auth'
import router from '@/router';
import Toast from "@/components/Toast";
import Swal from 'sweetalert2';

export default createStore({
  state: {
    user: null
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user;
    },
    CLEAR_USER (state) {
      state.user = null
    }
  },
  actions: {
    async login({ commit }, details) {
      const { email, password } = details;

      try {
        await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          commit('SET_USER', auth.currentUser);
          router.push('/home');
        }).finally(() => {
          Toast.fire({
            icon: 'success',
            title: 'Login Successful'
          })
        })

      } catch(error) {
        switch(error.code) {
          case 'auth/user-not-found':
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'User tidak ditemukan',
              confirmButtonText: 'Oke',
              showCancelButton: false
            })
            break;
          case 'auth/wrong-password':
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Password yang kamu masukkan salah!',
              confirmButtonText: 'Oke',
              showCancelButton: false
            })
            break;
          default:
            Toast.fire({
              icon: 'error',
              title: 'Oops...',
              text: `Terjadi kesalahan, error code : ${error.code}`,
            })
        }
        return
      }
    },
    async logout({commit}) {
      await signOut(auth);

      commit('CLEAR_USER');

      router.push('/');

      Toast.fire({
        icon: 'success',
        title: 'Logout Successful'
      })
    }
  }
})
