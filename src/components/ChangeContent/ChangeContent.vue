<template>
  <div class="changecontent-wrapper mb-4 w-100">
      <div class="content-title mb-3 d-flex justify-content-between align-items-center">
          <h5>
              {{ contentTitle }}
          </h5>

          <slot name="firstSlot"/>
      </div>

     <slot name="secondSlot"/>

     <div class="change-action d-flex gap-3 mt-3">
        <Transition name="fade">
            <div class="actions" v-show="checkInput">
                <button @click="$emit('cancel')" class="action-btn cancel-btn">Cancel</button>
                <button @click="$emit('save')" class="action-btn save-btn">
                    <span v-if="status">
                        Saving...
                    </span>
                    <span v-else>Save</span>
                </button>
            </div>
        </Transition>
        <slot name="deleteSlot"/>
     </div>
  </div>
</template>

<script>
export default {
    name: 'ChangeContent',
    props: [
        'contentTitle',
        'checkInput',
        'status'
    ],
}
</script>

<style>
.content-title {
    color: #D1D1D1;
}

.content-title h5 {
    text-transform: capitalize;
}

.changecontent-wrapper .inp-content {
    background: #292929;
    border: 2px solid transparent;
    border-radius: 3px;
    outline: none;
    width: 100%;
    padding: 0.5rem 0.8rem;
    color: #D1D1D1;
    transition: all 0.25s ease-in-out;
}

.inp-content:focus {
    border: 2px solid #888;
}

.actions {
    display: flex;
    gap: 1rem;
}

.action-btn {
    border: none;
    border-radius: 3px;
    padding: 0.3rem 1rem;
    color: #FFF;
    font-weight: 500;
    transition: background 0.25s ease-in-out;
}

.cancel-btn {
    background: #f02e2e;
}

.cancel-btn:hover {
    background: #d12626;
}

.btn-add {
    background: #6357EB;
    color: #FFFFFF;
    padding: 0.3rem 1rem;
    transition: 0.35s ease-in-out;
}

.btn-add:hover {
    background: #5045cc;
}

.save-btn {
    background: #0fe468;
}

.save-btn:hover {
    background: #00d150;
}

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