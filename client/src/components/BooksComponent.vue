<script setup>
import axios from 'axios'
import { backendSchema } from '@/utils/backendUtils'
import { constants, apiStatuses } from '@/utils/constants'
import { ref, onMounted } from 'vue'
import AddBookModal from '@/components/AddBookModal.vue'
import AlertComponent from '@/components/AlertComponent.vue'

const books = ref([])
const apiStatusMessage = ref('')
const apiStatus = ref(apiStatuses.neutral)

const showAddBookModal = ref(false)

const getBooks = () => {
  axios
    .get(backendSchema.getBooksRouteURL())
    .then((response) => {
      if (response.data.status === 'success') {
        books.value = response.data.books
      }
      // that is correct we do not set a success message here
      // results of Post, Put and Delete have priority
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        apiStatusMessage.value = constants.networkFailedGetAPIMessage
      } else {
        apiStatusMessage.value = constants.failedGetAPIMessage
      }
      apiStatus.value = apiStatuses.error
      console.log(String(error))
    })
}
const addBook = (payload) => {
  axios
    .post(backendSchema.getBooksRouteURL(), payload)
    .then(() => {
      apiStatusMessage.value = constants.successfulPostApiMessage
      apiStatus.value = apiStatuses.success
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        apiStatusMessage.value = constants.networkFailedPostApiMessage
      } else {
        apiStatusMessage.value = constants.failedPostApiMessage
      }
      apiStatus.value = apiStatuses.error
      console.log(String(error))
    })
    .finally(() => {
      getBooks()
    })
}
const cancelAddBook = () => {
  showAddBookModal.value = false
}
const submitAddBook = (data) => {
  showAddBookModal.value = false
  addBook(data)
}

const dismissAlert = () => {
  apiStatusMessage.value = ''
  apiStatus.value = apiStatuses.neutral
}
onMounted(getBooks)
</script>

<template>
  <div class="row">
    <div class="col-sm-10">
      <h1>Books</h1>
      <hr />
      <br />
      <br />
      <button
        id="add-book-button"
        type="button"
        class="btn btn-success btn-sm"
        v-on:click="showAddBookModal = true"
      >
        Add Book
      </button>
      <br />
      <br />
      <AlertComponent
        v-bind:alertMessage="apiStatusMessage"
        v-bind:alertStatus="apiStatus"
        v-on:dismissAlert="dismissAlert"
      />
      <br />
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Author</th>
            <th scope="col">Read?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in books" v-bind:key="index">
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td v-if="book.read">{{ constants.yesString }}</td>
            <td v-else>{{ constants.noString }}</td>
            <td>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-warning btn-sm">Update</button>
                <button type="button" class="btn btn-danger btn-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AddBookModal
      v-if="showAddBookModal"
      v-on:submitAddBook="submitAddBook"
      v-on:cancelAddBook="cancelAddBook"
    ></AddBookModal>
  </div>
</template>
