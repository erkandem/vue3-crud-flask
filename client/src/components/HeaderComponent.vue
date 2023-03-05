<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div class="row">
      <div class="col-sm-10">
        <h2>Le Header</h2>
        <nav>
          <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/ping">Ping</RouterLink></li>
            <li><RouterLink to="/books">Books</RouterLink></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>
