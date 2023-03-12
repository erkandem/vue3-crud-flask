<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submitAddBook', 'cancelAddBook'])

const onReset = () => {
  initForm()
  emit('cancelAddBook')
}
const addBookForm = ref({
  title: '',
  author: '',
  read: false
})
const onSubmit = () => {
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
  <div class="not-bootstrap-modal-backdrop" v-on:click="onReset">
    <div class="not-bootstrap-modal" v-on:click.stop="">
      <form>
        <h3>Add a Book</h3>
        <div class="form-group" id="form-title-group">
          <label for="form-title-input">Title:</label>
          <input
            id="form-title-input"
            type="text"
            class="form-control"
            v-model="addBookForm.title"
            placeholder="Enter Title"
          />
        </div>

        <div class="form-group" id="form-author-group">
          <label for="form-author-input">Author:</label>
          <input
            id="form-author-input"
            type="text"
            class="form-control"
            v-model="addBookForm.author"
            placeholder="Enter Author"
          />
        </div>

        <div class="form-check">
          <input
            id="form-read-input"
            type="checkbox"
            v-model="addBookForm.read"
            class="form-check-input"
          />
          <label class="form-check-label" for="form-read-input">Read?</label>
        </div>
        <div class="form-group" id="form-button-group">
          <button
            id="add-book-modal-submit-button"
            type="submit"
            class="btn btn-primary"
            v-on:click.prevent="onSubmit"
          >
            Submit
          </button>
          <button
            id="add-book-modal-cancel-button"
            type="reset"
            class="btn btn-danger"
            v-on:click="onReset"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
/* thank you Patrick */
.not-bootstrap-modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.not-bootstrap-modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  padding: 1em;
}
</style>
