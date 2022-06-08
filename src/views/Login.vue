<template>
  <div class="login-page page-container">
    <div class="login-box">
      <LoginLogo />

      <form id="login-form" @submit.prevent="login">
        <div class="email-box input-box">
          <label for="email">Email</label>

          <div class="input-wrapper email">
            <input class="input-field" type="email" 
              id="email" 
              name="email" 
              autocomplete="off" 
              autofocus spellcheck="false" v-model="form.email"
            >
          </div>
        </div>

        <div class="password-box input-box">
          <label for="password">Password</label>

          <div class="input-wrapper pass">
            <input class="input-field" type="password" 
              id="password" 
              name="password" 
              autocomplete="off" v-model="form.password"
            >
          </div>
        </div>

        <div class="submit-box input-box">
          <LoginButton :type="'submit'"/>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import LoginLogo from '@/components/Logo/LoginLogo.vue'
import LoginButton from '@/components/Buttons/LoginButton.vue'
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
    components: { LoginLogo, LoginButton },
    name: 'LoginPage',
    setup() {
      const form = ref({})
      const store = useStore()

      const login = () => {
        store.dispatch('login', form.value)
      }

      return { form, login }
    }
}
</script>

<style scoped>
.login-page {
  background-color: var(--bg);
  display: grid;
  place-items: center;
}

.login-box {
  width: 500px;
  height: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.63);
}

#login-form {
  width: 100%;
  margin-top: 2rem;
}

.input-box {
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: auto;
  margin-bottom: 1rem;
}

.input-box label {
  color: #D1D1D1;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  width: 100%;
  height: 2.5rem;
  background: red;
  position: relative;
}

.input-wrapper::before, .input-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
}

.input-wrapper::before {
  background: #888;
}

.email::after {
  background: url('../assets/icons/bxs-envelope.svg') no-repeat center;
}

.pass::after {
  background: url('../assets/icons/bxs-lock.svg') no-repeat center;
}

.input-field {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding-left: 3rem;
  background: #2b2b2b;
  color: #D1D1D1;
  transition: 0.35s ease-in-out;
}

.input-field:focus {
  border: 2px solid #888;
}

@media screen and (max-width: 868px) {
  .login-box {
    width: 90%;
  }
  .input-box {
    width: 100%;
  }
  .input-wrapper::before, .input-wrapper::after {
    width: 15%;
  }
  .input-field {
    padding-left: 3.2rem;
  }
}
</style>