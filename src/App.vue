<template>
  <div class="app-container">
    <h1>전화번호부</h1>
    <router-view />
  </div>
</template>

<script setup>
import { createApp } from 'vue';
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 20px;
  max-width: 1600px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #4CAF50;
  font-size: 2.5em;
  margin-top: 20px;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
