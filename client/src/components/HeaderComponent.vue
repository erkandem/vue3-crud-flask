<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <h2>Le Header</h2>
    <nav>
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/ping">Ping</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>
