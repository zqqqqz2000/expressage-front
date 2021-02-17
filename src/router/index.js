import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Inventory from '../components/Inventory.vue'
import Warehouse from '../components/Warehouse.vue'
import Deliveryman from "@/components/Deliveryman";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    children: [
      {
        path: 'warehouse',
        name: 'warehouse',
        component: Warehouse,
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: Inventory,
      },
      {
        path: 'deliveryman',
        name: 'deliveryman',
        component: Deliveryman
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
