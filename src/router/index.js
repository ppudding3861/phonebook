import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AddContact from '../components/AddContact.vue';
import ViewContacts from '../components/ViewContacts.vue';
import TodoList from '../components/TodoList.vue';

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        redirect: 'view-contacts', // 기본 경로를 view-contacts로 리디렉션
      },
      {
        path: 'view-contacts',
        name: 'ViewContacts',
        component: ViewContacts,
      },
      {
        path: 'add-contact',
        name: 'AddContact',
        component: AddContact,
      },
      {
        path: 'todo-list',
        name: 'TodoList',
        component: TodoList,
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
