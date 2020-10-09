<template>
  <div id="rights">
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
       </el-breadcrumb>
       <el-card>
           <el-table  :data="rightslist" border stripe>
               <el-table-column type="index"></el-table-column>
               <el-table-column prop="authName" label="权限名称"></el-table-column>
               <el-table-column prop="path" label="路径"></el-table-column>
               <el-table-column prop="level" label="权限等级">
                   <template slot-scope="scope">
                       <el-tag v-if="scope.row.level=='0'">一级</el-tag>
                       <el-tag v-else-if="scope.row.level=='1'" type="success">二级</el-tag>
                       <el-tag v-else type="warning">三级</el-tag>
                   </template>
               </el-table-column>
           </el-table>
       </el-card>
  </div>
</template>

<script>
import {selectRightsRequest} from '@/http/request.js';
export default {
    name: 'Rights',
    data(){
        return {
            rightslist: []
        }
    },
    created(){
        this.selectRights('list');
    },
    methods: {
        //请求查询全部权限列表
        async selectRights(type){
            const {data:res}=await selectRightsRequest(type);
            if(res.meta.status!=200) return this.$message.error('获取权限列表失败');
            this.rightslist=res.data;
            this.$message.success('获取权限列表成功');
        }
    }
}
</script>

<style lang="less" scoped>

</style>