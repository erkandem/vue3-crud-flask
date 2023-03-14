<script setup>
import { computed } from 'vue'
import { bootStrapAlertClasses } from '@/utils/constants'

const props = defineProps({
  alertMessage: { type: String, required: true },
  alertStatus: { type: String, required: true }
})

const emits = defineEmits(['dismissAlert'])
const getClassesForAlert = computed(() => {
  if (props.alertStatus === '') {
    return ''
  }
  if (!Object.prototype.hasOwnProperty.call(bootStrapAlertClasses, props.alertStatus)) {
    return ''
  }
  return `alert ${bootStrapAlertClasses[props.alertStatus]}`
})

const dismissAlert = () => {
  emits('dismissAlert')
}
</script>
<template>
  <div class="alert-wrapper">
    <div v-bind:class="getClassesForAlert">
      <strong>
        {{ alertMessage }}
      </strong>
      <button
        v-if="alertMessage"
        v-on:click="dismissAlert"
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>
