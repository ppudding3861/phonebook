<template>
  <div class="todo-list">
    <h2>ToDo 리스트</h2>
    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        {{ todo }}
        <button @click="removeTodo(index)">Remove</button>
      </li>
    </ul>
    <input v-model="newTodo" placeholder="New ToDo" />
    <button @click="addTodo">Add</button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const todos = reactive([]);
const newTodo = ref('');

const addTodo = () => {
  if (newTodo.value) {
    todos.push(newTodo.value);
    newTodo.value = '';
  }
};

const removeTodo = (index) => {
  todos.splice(index, 1);
};
</script>

<style scoped>
.todo-list {
  max-width: 400px;
  margin: 0 auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

input {
  width: calc(100% - 60px);
  padding: 5px;
}

button {
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
</style>
