<template>
  <div class="phonebook-container">
    <div class="sidebar">
      <router-link to="/view-contacts">
        <button>등록정보확인</button>
      </router-link>
      <router-link to="/add-contact">
        <button>등록하기</button>
      </router-link>
      <router-link to="/todo-list">
        <button>ToDo 리스트</button>
      </router-link>
      <router-link to="/near-search">
        <button>주변 검색</button>
      </router-link>
    </div>
    <div class="main-content">
      <router-view :contacts="contacts" :add-contact="addContact"/>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const contacts = reactive([
  { id: 1, name: 'John Doe', phone: '123-456-7890', group: 'Friends', email: 'john@example.com', address: '123 Main St' },
  { id: 2, name: 'Jane Smith', phone: '987-654-3210', group: 'Family', email: 'jane@example.com', address: '456 Elm St' }
]);

const addContact = (newContact) => {
  contacts.push({ id: Date.now(), ...newContact });
};
</script>

<style scoped>
.phonebook-container {
  display: flex;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #fff;
}

.sidebar {
  width: 250px;
  padding: 20px;
  background-color: #f9f9f9;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.sidebar button {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: left;
  width: 100%;
}

.sidebar button:hover {
  background-color: #45a049;
}

.main-content {
  flex: 1;
  padding: 20px;
  min-width: 0;
  overflow: auto;
}
</style>
