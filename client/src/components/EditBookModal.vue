<script setup>
import { ref } from 'vue'

const props = defineProps({
  bookToBeEdited: { type: Object, required: true }
})

const emits = defineEmits(['cancelEditBook', 'submitEditBook'])
const editBookForm = ref({
  id: props.bookToBeEdited.id,
  author: props.bookToBeEdited.author,
  title: props.bookToBeEdited.title,
  read: props.bookToBeEdited.read
})

const submitEditBookEmitter = () => {
  emits('submitEditBook', {
    id: editBookForm.value.id,
    author: editBookForm.value.author,
    title: editBookForm.value.title,
    read: editBookForm.value.read
  })
  cleanForm()
}

const cancelEditBookEmitter = () => {
  emits('cancelEditBook')
  cleanForm()
}

const cleanForm = () => {
  // TODO: is this necessary? after all we will render the component using a v-if which will tear it down completely
  editBookForm.value.id = ''
  editBookForm.value.title = ''
  editBookForm.value.author = ''
  editBookForm.value.read = false
}
</script>

<template>
  <div class="not-bootstrap-modal-backdrop" v-on:click="cancelEditBookEmitter">
    <div class="not-bootstrap-modal" v-on:click.stop="">
      <h3>Edit a book</h3>
      <form>
        <div class="form-group">
          <label for="edit-book-form-title-input"> Title: </label>
          <input
            id="edit-book-form-title-input"
            type="text"
            class="form-control"
            v-model="editBookForm.title"
            placeholder="Enter Title"
          />
        </div>
        <div class="form-group">
          <label for="edit-book-form-author-input"> Author: </label>
          <input
            id="edit-book-form-author-input"
            type="text"
            class="form-control"
            v-model="editBookForm.author"
            placeholder="Enter Author"
          />
        </div>

        <div class="form-group form-check">
          <input
            type="checkbox"
            class="form-check-input"
            v-model="editBookForm.read"
            id="edit-book-form-read-input"
          />
          <label class="form-check-label" for="edit-book-form-read-input">Read?</label>
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          v-on:click.prevent="submitEditBookEmitter"
          id="edit-book-modal-submit-button"
        >
          Update
        </button>
        <button
          type="reset"
          class="btn btn-danger"
          v-on:click="cancelEditBookEmitter"
          id="edit-book-modal-cancel-button"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>
