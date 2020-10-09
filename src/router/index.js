import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const Login=()=>import('@/view/Login.vue');
const Home=()=>import('@/view/Home.vue');
const Welcome=()=>import('@/view/Welcome.vue');
const Users=()=>import('@/view/userlist/Users.vue');
const Rights=()=>import('@/view/power/Rights.vue');
const Roles=()=>import('@/view/power/Roles.vue');
Vue.use(VueRouter);

const router=new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home,
            meta: {
                title: '首页'
            },
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome,
                    meta: {
                        title: '首页'
                    }
                },
                {
                    path: '/users',
                    component: Users,
                    meta: {
                        title: '用户管理'
                    }
                },
                {
                    path: '/rights',
                    component: Rights,
                    meta: {
                        title: '权限列表'
                    }
                },
                {
                    path: '/roles',
                    component: Roles,
                    meta: {
                        title: '角色权限'
                    }
                }
            ]
        },
        {
            path: '/login',
            component: Login,
            meta: {
                title: '登录'
            }
        }
    ]
})

router.beforeEach((to,from,next)=>{
    document.title=to.meta.title;
    if(to.path==='/login') return next();
    const token=window.sessionStorage.getItem('token');
    if(!token) return next('/login');
    NProgress.start();
    next();
})
router.afterEach(() => {
    NProgress.done();
})
export default router;