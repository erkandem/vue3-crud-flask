<script setup>
import axios from 'axios'
import { backendSchema } from '@/utils/backendUtils'
import { constants } from '@/utils/constants'
import { ref, onMounted } from 'vue'
import AddBookModal from '@/components/AddBookModal.vue'

const books = ref([])
const apiStatusMessage = ref('')
const showAddBookModal = ref(false)

const getBooks = () => {
  axios
    .get(backendSchema.getBooksRouteURL())
    .then((response) => {
      if (response.data.status === 'success') {
        books.value = response.data.books
      }
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        apiStatusMessage.value = constants.networkFailedGetAPIMessage
      } else {
        apiStatusMessage.value = constants.failedGetAPIMessage
      }
      console.log(String(error))
    })
}
const addBook = (payload) => {
  axios
    .post(backendSchema.getBooksRouteURL(), payload)
    .then(() => {
      apiStatusMessage.value = constants.successfulPostApiMessage
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        apiStatusMessage.value = constants.networkFailedPostApiMessage
      } else {
        apiStatusMessage.value = constants.failedPostApiMessage
      }
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
      <span id="books-api-response-status"> {{ apiStatusMessage }}</span>
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
