<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
</script>

<template>
  <div class="container">
    <HeaderComponent />
    <main>
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>

<style>
#app {
  margin-top: 60px;
}
</style>
