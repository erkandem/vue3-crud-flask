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
      console.log(response.data['message'])
      console.log('called ping endpoint successfully')
    })
    .catch((error) => {
      console.log('error calling backend' + String(error))
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
  <h3 id="ping-response">{{ pingResponseData }}</h3>
</template>
