<template>
  <div id="roles">
       <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>权限管理</el-breadcrumb-item>
           <el-breadcrumb-item>角色权限</el-breadcrumb-item>
       </el-breadcrumb>

       <el-card>
           <el-row>
               <el-col>
                   <el-button type="primary" @click="addRoles">添加角色</el-button>
               </el-col>
           </el-row>
           <el-table :data="roleslist" border stripe> 
               <!-- 展开列 -->
               <el-table-column type="expand">
                   <template slot-scope="scope">
                       <el-row class="vcenter" :class="['bdbottom',i1===0?'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="i1">
                           <el-col :span="5">
                               <el-tag closable @close="removeRightsById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                               <i class="el-icon-s-promotion"></i>
                           </el-col>
                           <el-col :span="19">
                               <el-row class="vcenter" :class="[i2===0?'':'bdtop']" v-for="(item2,i2) in item1.children" :key="i2">
                                   <el-col :span="6">
                                        <el-tag closable @close="removeRightsById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-s-promotion"></i>
                                   </el-col>
                                   <el-col :span="18">
                                       <el-tag @close="removeRightsById(scope.row,item3.id)" closable type="warning" v-for="(item3,i3) in item2.children" :key="i3">
                                           {{item3.authName}}
                                       </el-tag>
                                   </el-col>
                               </el-row>
                           </el-col>
                       </el-row>
                   </template>
               </el-table-column>
               <el-table-column type="index"></el-table-column>
               <el-table-column label="角色名称" prop="roleName"></el-table-column>
               <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
               <el-table-column label="操作" width="300px">
                   <template slot-scope="scope">
                       <el-button @click="editRolesClick(scope.row.id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                       <el-button @click="deleteRolesClick(scope.row.id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                       <el-button @click="showSetRightDialog(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                   </template>
               </el-table-column>
           </el-table>
           <!-- 分配权限的对话框 -->
           <el-dialog
              @close="setRightDialogClosed"
              title="分配权限"
              :visible.sync="setRightsDialogVisible"
              width="50%">
              <span>
                  <!-- 树形控件 -->
                  <el-tree ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defaultKeys" :data="rightslist" :props="defaultProps"></el-tree>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 添加角色对话框 -->
            <el-dialog
              @close="addRolesDialogClosed"
              title="添加角色"
              :visible.sync="addRolesDialogVisible"
              width="50%">
              <span>
                  <el-form :model="roleForm" :rules="roleRule" ref="roleFormRef" label-width="100px">
                    <el-form-item label="角色名称" prop="roleName">
                      <el-input v-model="roleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                      <el-input v-model="roleForm.roleDesc"></el-input>
                    </el-form-item>
                  </el-form>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="addRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserRole">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 编辑角色对话框 -->
            <el-dialog
              @close="editRolesDialogClosed"
              title="编辑角色"
              :visible.sync="editRolesDialogVisible"
              width="50%">
              <span>
                  <el-form :model="editroleForm" :rules="roleRule" ref="editroleFormRef" label-width="100px">
                    <el-form-item label="角色id">
                      <el-input disabled v-model="editroleForm.roleId"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" prop="roleName">
                      <el-input v-model="editroleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                      <el-input v-model="editroleForm.roleDesc"></el-input>
                    </el-form-item>
                  </el-form>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editURserRoles">确 定</el-button>
              </span>
            </el-dialog>
       </el-card>
  </div>
</template>

<script>
import {getRolesRequest,deleteRightsRequest,
selectRightsRequest,roleAuthorizationRequest,
deleteUserRightsRequest,insertRolesRequest,
selectRoleById,updateUserRoles} from '@/http/request.js';
export default {
    name: 'Roles',
    data(){
        return {
            roleslist: [],//所有角色数据
            setRightsDialogVisible: false,//控制分配权限对话框的显示和隐藏
            rightslist: [],//所有权限数据
            defaultProps: {
                children: 'children',
                label: 'authName'
            },//控制树的展示
            defaultKeys: [],//默认选中的节点
            roleId: '',//当前角色id
            addRolesDialogVisible: false,//添加角色对话框的显示与隐藏
            roleForm: {
                roleName: '',
                roleDesc: ''
            },//添加角色的对象
            roleRule: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                     { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ]
            },//添加校色的表单验证
            editroleForm: {},//编辑角色的信息
            editRolesDialogVisible: false,//控制编辑角色的显示与隐藏
        }
    },
    created(){
        //获取角色列表
        this.getRoles();
    },
    methods: {
        //网络请求获取角色列表
        async getRoles(){
            const {data:res}=await getRolesRequest();
            if(res.meta.status!=200) return this.$message.error('获取角色列表失败');
            this.roleslist=res.data;
        },
        //根据id删除对应的权限
        async removeRightsById(row,rightId){
            const result=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err);
            if(result!=='confirm') return this.$message.info('删除操作已取消');
            const roleId=row.id;
            const {data:res}=await deleteRightsRequest(roleId,rightId);
            if(res.meta.status!=200) return this.$message.error('删除角色权限失败');
            this.$message.success('删除角色权限成功');
            row.children=res.data;
        },
        //分配角色权限
        async showSetRightDialog(row){
            //保存当前角色id
            this.roleId=row.id;
            const {data:res} = await selectRightsRequest('tree');
            if(res.meta.status!=200) return this.$message.error('获取权限列表成功');
            this.rightslist=res.data;
            this.getleafKeys(row,this.defaultKeys);
            this.setRightsDialogVisible=true;
        },
        //通过递归的形式，获取角色下所有的三级权限的id,并保存到defaultKeys数组
        getleafKeys(node,arr) {
            //如果当前node不包含children 则是三级节点
            if(!node.children){
                return arr.push(node.id);
            }
            node.children.forEach(item => {
                this.getleafKeys(item,arr);
            });
        },
        //监听分配权限对话框的关闭事件
        setRightDialogClosed(){
            this.defaultKeys=[];
        },
        //点击给角色分配权限
        async allotRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr=keys.join(',');
            const {data:res}=await roleAuthorizationRequest(this.roleId,idStr);
            console.log(res);
            if(res.meta.status!=200) return this.$message.error('分配角色权限失败');
            this.$message.success('分配角色权限成功');
            //重新获取角色权限列表
            this.getRoles();
            this.setRightsDialogVisible=false;
        },
        //删除角色
        async deleteRolesClick(id){
            const result=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err=>err);
            if(result!=='confirm') return this.$message.info('删除操作已取消');
            const {data:res}=await deleteUserRightsRequest(id);
            if(res.meta.status!=200) return this.$message.error('删除角色失败');
            this.$message.success('删除角色成功');
            //重新请求列表
            this.getRoles();
        },
        //显示添加添加角色对话框
        addRoles(){
            this.addRolesDialogVisible=true; 
        },
        //点击确定添加角色
        addUserRole(){
            this.$refs.roleFormRef.validate(async valid=>{
                if(!valid) return this.$message.info('请填写表单');
                const {data:res}=await insertRolesRequest(this.roleForm);
                console.log(res);
                if(res.meta.status!=201) return this.$message.error('添加角色失败');
                this.$message.success('添加角色成功');
                this.addRolesDialogVisible=false;
                //重新请求列表数据
                this.getRoles();
            });
        },
        //重置添加角色表单数据
        addRolesDialogClosed(){
            this.$refs.roleFormRef.resetFields();
        },
        //编辑角色
        async editRolesClick(id){
            this.editRolesDialogVisible=true;
            const {data:res}=await selectRoleById(id);
            if(res.meta.status!=200) return this.$message.error('查询角色失败');
            this.editroleForm=res.data;
        },
        //编辑角色的表单重置
        editRolesDialogClosed(){
            this.$refs.editroleFormRef.resetFields();
        },
        //点击确定按钮进行编辑角色
        editURserRoles(){
            this.$refs.editroleFormRef.validate(async valid=>{
                if(!valid) return this.$message.info('请填写表单');
                const obj={
                    roleName: this.editroleForm.roleName,
                    roleDesc: this.editroleForm.roleDesc
                }
                const {data:res}=await updateUserRoles(this.editroleForm.roleId,obj);
                if(res.meta.status!=200) return this.$message.error('编辑角色失败');
                this.$message.success('编辑角色成功');
                this.editRolesDialogVisible=false;
                //重新请求列表数据
                this.getRoles();
            });
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #ccc;
}
.bdbottom {
    border-bottom: 1px solid #ccc;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>