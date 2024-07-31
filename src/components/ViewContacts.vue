<template>
  <div class="view-contacts">
    <h2>등록된 연락처</h2>
    <div class="search-container">
      <input v-model="searchQuery" placeholder="Search contacts" />
      <button @click="filterContacts">Search</button>
    </div>
    <ul>
      <li v-for="(contact, index) in filteredContacts" :key="contact.id">
        <div @click="toggleDetails(index)">
          {{ contact.name }}
        </div>
        <div v-if="selectedIndex === index" class="contact-details">
          <p><strong>Phone:</strong> {{ contact.phone }}</p>
          <p><strong>Group:</strong> {{ contact.group }}</p>
          <p><strong>Email:</strong> {{ contact.email }}</p>
          <p><strong>Address:</strong> {{ contact.address }}</p>
          <button @click="editContact(contact)">수정</button>
          <button @click="deleteContact(index)">삭제</button>
        </div>
        <div v-if="editingContact && editingContact.id === contact.id" class="edit-contact">
          <h3>연락처 수정</h3>
          <input v-model="editingContact.name" placeholder="Name" />
          <input v-model="editingContact.phone" placeholder="Phone" />
          <input v-model="editingContact.group" placeholder="Group" />
          <input v-model="editingContact.email" placeholder="Email" />
          <input v-model="editingContact.address" placeholder="Address" />
          <button @click="saveContact">저장</button>
          <button @click="cancelEdit">취소</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  contacts: {
    type: Array,
    required: true,
    default: () => []
  }
});

const selectedIndex = ref(null);
const editingContact = ref(null);
const searchQuery = ref('');

const filteredContacts = computed(() => {
  return props.contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contact.phone.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contact.group.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contact.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const toggleDetails = (index) => {
  selectedIndex.value = selectedIndex.value === index ? null : index;
};

const editContact = (contact) => {
  editingContact.value = { ...contact };
};

const deleteContact = (index) => {
  props.contacts.splice(index, 1);
  if (selectedIndex.value === index) {
    selectedIndex.value = null;
  }
};

const saveContact = () => {
  const index = props.contacts.findIndex(contact => contact.id === editingContact.value.id);
  props.contacts[index] = { ...editingContact.value };
  editingContact.value = null;
  selectedIndex.value = null;
};

const cancelEdit = () => {
  editingContact.value = null;
};
</script>

<style scoped>
.view-contacts {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.search-container {
  display: flex;
  margin-bottom: 15px;
}

.search-container input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
  box-sizing: border-box;
}

.search-container button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: 1px solid #4CAF50;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.search-container button:hover {
  background-color: #45a049;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #f0f0f0;
}

.contact-details,
.edit-contact {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin: 5px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

input {
  display: block;
  margin: 5px 0;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}
</style>

