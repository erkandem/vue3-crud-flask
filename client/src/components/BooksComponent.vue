<script setup>
import axios from 'axios'
import { backendSchema } from '@/utils/backendUtils'
import { constants, apiStatuses } from '@/utils/constants'
import { ref, onMounted } from 'vue'
import AddBookModal from '@/components/AddBookModal.vue'
import EditBookModal from '@/components/EditBookModal.vue'

import AlertComponent from '@/components/AlertComponent.vue'

const books = ref([])
const apiStatusMessage = ref('')
const apiStatus = ref(apiStatuses.neutral)

const showAddBookModal = ref(false)
const showEditBookModal = ref(false)
const bookBeingEdited = ref({})

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

const dismissAlertHandler = () => {
  apiStatusMessage.value = ''
  apiStatus.value = apiStatuses.neutral
}

const editBookHandler = (book) => {
  /* connector between the individual book and the EditBookModal Component */
  showEditBookModal.value = true
  bookBeingEdited.value = book
}
const cancelEditBookHandler = () => {
  showEditBookModal.value = false
  bookBeingEdited.value = {}
}
const submitEditBookHandler = (book) => {
  showEditBookModal.value = false
  bookBeingEdited.value = {}
  updateBook(book)
}

const updateBook = (book) => {
  axios
    .put(backendSchema.getBookEditRouteURL(book.id), book)
    .then(() => {
      apiStatusMessage.value = constants.successfulPutApiMessage
      apiStatus.value = apiStatuses.success
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        apiStatusMessage.value = constants.networkFailedPutApiMessage
      } else {
        apiStatusMessage.value = constants.failedPutApiMessage
      }
      apiStatus.value = apiStatuses.error
      console.log(String(error))
    })
    .finally(() => {
      getBooks()
    })
}

const deleteBookHandler = (book) => {
  axios
    .delete(backendSchema.getBookEditRouteURL(book.id))
    .then(() => {
      apiStatus.value = apiStatuses.success
      apiStatusMessage.value = constants.successfulDeleteApiMessage
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        apiStatusMessage.value = constants.networkFailedDeleteApiMessage
      } else {
        apiStatusMessage.value = constants.failedDeleteApiMessage
      }
      apiStatus.value = apiStatuses.error
      console.log(String(error))
    })
    .finally(() => {
      getBooks()
    })
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
        v-on:dismissAlert="dismissAlertHandler"
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
                <button
                  type="button"
                  class="btn btn-warning btn-sm"
                  v-on:click="editBookHandler(book)"
                >
                  Update
                </button>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  v-on:click="deleteBookHandler(book)"
                >
                  Delete
                </button>
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
    <EditBookModal
      v-bind:bookToBeEdited="bookBeingEdited"
      v-if="showEditBookModal"
      v-on:submitEditBook="submitEditBookHandler"
      v-on:cancelEditBook="cancelEditBookHandler"
    >
    </EditBookModal>
  </div>
</template>
