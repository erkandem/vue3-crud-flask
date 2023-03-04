<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const pingResponseData = ref('')
import { backendSchema } from '@/utils/backendUtils'

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
    })
}
onMounted(getPing)
</script>

<template>
  <main>
    <h1>Le Content</h1>
    <h3 id="ping-response">{{ pingResponseData }}</h3>
  </main>
</template>
