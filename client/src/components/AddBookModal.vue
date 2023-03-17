<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submitAddBook', 'cancelAddBook'])

const onResetEmitter = () => {
  emit('cancelAddBook')
  initForm()
}
const addBookForm = ref({
  title: '',
  author: '',
  read: false
})
const onSubmitEmitter = () => {
  emit('submitAddBook', {
    title: addBookForm.value.title,
    author: addBookForm.value.author,
    read: addBookForm.value.read
  })
  initForm()
}
const initForm = () => {
  addBookForm.value.title = ''
  addBookForm.value.author = ''
  addBookForm.value.read = false
}
</script>
<template>
  <div class="not-bootstrap-modal-backdrop" v-on:click="onResetEmitter">
    <div class="not-bootstrap-modal" v-on:click.stop="">
      <form>
        <h3>Add a Book</h3>
        <div class="form-group" id="form-title-group">
          <label for="add-book-form-title-input">Title:</label>
          <input
            id="add-book-form-title-input"
            type="text"
            class="form-control"
            v-model="addBookForm.title"
            placeholder="Enter Title"
          />
        </div>

        <div class="form-group" id="form-author-group">
          <label for="form-author-input">Author:</label>
          <input
            id="add-book-form-author-input"
            type="text"
            class="form-control"
            v-model="addBookForm.author"
            placeholder="Enter Author"
          />
        </div>

        <div class="form-check" id="form-read-group">
          <input
            id="add-book-form-read-input"
            type="checkbox"
            v-model="addBookForm.read"
            class="form-check-input"
          />
          <label class="form-check-label" for="add-book-form-read-input">Read?</label>
        </div>
        <div class="form-group" id="add-book-form-button-group">
          <button
            id="add-book-modal-submit-button"
            type="submit"
            class="btn btn-primary"
            v-on:click.prevent="onSubmitEmitter"
          >
            Submit
          </button>
          <button
            id="add-book-modal-cancel-button"
            type="reset"
            class="btn btn-danger"
            v-on:click="onResetEmitter"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
