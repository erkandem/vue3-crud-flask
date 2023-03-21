<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { backendSchema } from '@/utils/backendUtils'

const pingResponseData = ref('')

const getPing = () => {
  axios
    .get(backendSchema.getPingRouteURL())
    .then((response) => {
      pingResponseData.value = response.data['message']
    })
    .catch((error) => {
      console.log('error calling backend ' + String(error))
      if (error.message === 'Network Error') {
        pingResponseData.value = 'Is the backend running at ' + String(error.config.url) + '?'
      } else {
        pingResponseData.value = 'We are sorry. Something went wrong'
      }
    })
}
onMounted(getPing)
</script>
<template>
  <div>
    <h2> Le Ping </h2>
    <button type="button" class="btn btn-primary" id="ping-response">
      {{ pingResponseData }}
    </button>
  </div>
</template>
