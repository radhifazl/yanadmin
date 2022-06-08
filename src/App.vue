<template>
   <router-view/>
</template>

<script>
</script>


<style>
:root {
  --sidebar-bg: #1C1C1C;
  --bg: #121212;
}

.page-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 1rem;
  padding-top: 2rem;
  padding-right: 2rem;
  overflow-y: auto;
}

.page-container h1 {
  color: #FFFFFF;
}

.page {
  width: 100%;
  background: var(--bg);
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  gap: 1rem;
}

@media screen and (max-width: 768px) {
  .page {
    display: block;
  }
}
</style>
