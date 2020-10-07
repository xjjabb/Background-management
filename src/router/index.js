import Vue from 'vue';
import VueRouter from 'vue-router';

const Login=()=>import('@/view/Login.vue');
const Home=()=>import('@/view/Home.vue');

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
            }
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
    next();
})
export default router;