<template>
  <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-box p-4" @click.stop>
          <div class="preview-image">
            <img :src="img">
          </div>

          <h5 class="my-3">
              {{ imgName }}
          </h5>

          <slot/>

          <h5 v-if="uploadStatus">Upload Progress : {{ progress }}</h5>

          <div class="modal-actions d-flex justify-content-center align-items-center gap-3">
            <button class="btn btn-secondary" @click="$emit('selectBtn')">
                Select File
            </button>
            <button class="btn btn-primary" @click="$emit('upload')">
                <span v-if="addButton">Add Theme Slide</span>
                <span v-else>Upload File</span>
            </button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'ChangeModal',
    props: [
        'img',
        'imgName',
        'preview',
        'progress',
        'uploadStatus',
        'addButton'
    ]
}
</script>

<style>
.modal-overlay {
    width: 100vw;
    height: 100vh;
    position: fixed;
    inset: 0;
    background: rgba(24, 24, 24, 0.432);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-box {
    width: 60%;
    height: 60%;
    background: #FFF;
    color: #121212;
    text-align: center;
}

.preview-image {
    width: 80%;
    height: 60%;
    margin: 0 auto;
}

.preview-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>