<template> 
    <el-container class="home_container">
        <el-header>
            <span class="left">电商后台管理系统</span>
            <el-button class="right logout" type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
          <el-aside :width="isCollapse?'64px':'200px'">
              <!-- 折叠 -->
              <div class="toggle_button" @click="toggleCollapse">|||</div>
              <el-menu
              router
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409fff"
              unique-opened
              :collapse-transition="false"
              :collapse="isCollapse"
              :default-active="link">
              <el-submenu v-for="item in menulist" :key="item.id" :index="item.id+''">
                <template slot="title">
                  <i :class="icolist[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <el-menu-item @click="saveNavState('/'+subitem.path)" v-for="subitem in item.children" :key="subitem.id" :index="'/'+subitem.path">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{subitem.authName}}</span>
                    </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main>
              <router-view></router-view>
          </el-main>
        </el-container>
    </el-container>
</template>

<script>
import {leftMenuRequest} from '@/http/request.js';
export default {
    name: 'Home',
    data(){
        return {
            menulist: [],//左侧菜单数据
            icolist: {
                '125': 'iconfont icon-users',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },//菜单图标
            isCollapse: false,//是否折叠菜单
            link: '',//路由被激活的链接地址高亮
        }
    },
    created(){
        //请求左侧菜单
        this.leftMenu();
        //去出路由高亮的标志位
        this.link=window.sessionStorage.getItem('activePath');
    },
    methods: {
        //退出
        logout(){
            window.sessionStorage.clear();
            this.$message.success('退出成功');
            this.$router.push('/login');
        },
        //请求左侧菜单
        async leftMenu(){
            const {data:res}=await leftMenuRequest();
            if(res.meta.status!=200) return this.$message.error('请求菜单失败');
            this.menulist=res.data;
        },
        //折叠
        toggleCollapse(){
            this.isCollapse=!this.isCollapse;
        },
        //保存菜单高亮的状态
        saveNavState(value){
            window.sessionStorage.setItem('activePath',value);
            this.link=value;
        }
    }
}
</script>

<style lang="less" scoped>
.home_container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    line-height: 60px;

    span {
        font-size: 28px;
    }

    .logout {
        margin-top: 10px;
    }

}
.el-aside {
    background-color: #333744;

    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle_button {
    background-color: #4a5064;
    text-align: center;
    line-height: 24px;
    color: #fff;
    font-size: 12px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>