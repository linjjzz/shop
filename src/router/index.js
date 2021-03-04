import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('../views/Login')
const Home = () => import('../views/Home')

const Welcome = () => import('../components/Welcome')
const Users = ()=> import('../components/user/Users')

const routes = [
  {
    path:'/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从那个路径跳转而来
  //next是一个函数，表示放行
  //  next() 放行   next('/login')强制跳转
  if(to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token强制跳转到登录页
  if(!tokenStr) return next('/login')
  next()
})

export default router
