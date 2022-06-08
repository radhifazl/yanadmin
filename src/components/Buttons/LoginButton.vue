<template>
  <button class="login-btn w-100" :type="type">
      Login
  </button>
</template>

<script>
export default {
    name: 'LoginButton',
    props: [
        'type',
    ],
}
</script>

<style>
.login-btn {
    background: #888;
    border: none;
    outline: none;
    padding: 0.3rem 0;
    color: #FFFFFF;
    letter-spacing: 1px;
    font-weight: 600;
    transition: 0.35s ease-in-out;
}
.login-btn:hover {
    background: rgb(99, 99, 99);
}

.login-load {
    width: 100%;
    animation: loading 1s linear infinite;
}

.dot {
    display: inline-block;
    margin: 0 0.1rem;
    animation: loading 1s linear infinite;
}

@keyframes loading {
    0% {
        opacity: 1;
        transform: translateY(0);
    }
    50% {
        opacity: 0.5;
        transform: translateY(-4px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.dot:nth-child(1) {
    animation-delay: 1s;
}
.dot:nth-child(2) {
    animation-delay: 1.2s;
}
.dot:nth-child(3) {
    animation-delay: 1.4s;
}
</style>