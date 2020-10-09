<template>
    <div id="user">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" @clear="getUserList(queryInfo)" v-model="queryInfo.query" clearable>
                      <el-button slot="append" icon="el-icon-search" @click="getUserList(queryInfo)"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <el-switch
                          @change="switchChange(scope.row)"
                          v-model="scope.row.mg_state">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                         <el-button @click="showEditdialog(scope.row.id)" type="primary" icon="el-icon-edit" size="small"></el-button>
                         <el-button @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete" size="small"></el-button>
                         <!-- 分配角色按钮 -->
                         <el-tooltip  :enterable="false" effect="dark" content="分配角色" placement="top-start">
                            <el-button @click="setRole(scope.row)" type="warning" icon="el-icon-setting" size="small"></el-button>
                         </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
            <!-- 添加用户的对话框 -->
            <el-dialog
              @close="addDialogClosed"  
              title="添加用户"
              :visible.sync="addDialogVisible"
              width="50%">
              <span>
                  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                      <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                      <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                      <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                  </el-form>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 修改用户的对话框 -->
            <el-dialog
              @close="editDialogClosed" 
              title="修改用户"
              :visible.sync="editDialogVisible"
              width="50%">
              <span>
                  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                    <el-form-item label="用户名">
                      <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                      <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                  </el-form>    
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 分配角色 -->
            <el-dialog
              @close="setRolesDialogClosed"
              title="分配角色"
              :visible.sync="setRolesDialogVisible"
              width="50%">
              <span>
                  <div>
                      <p>当前的用户:{{userRoleInfo.username}}</p>
                      <p>当前的角色:{{userRoleInfo.role_name}}</p>
                      <p>
                          分配新角色
                          <el-select v-model="selectRoleId" placeholder="请选择">
                              <el-option
                                v-for="item in RolesList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                              </el-option>
                          </el-select>
                      </p>
                  </div>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
              </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {getUserListRequest,updateUserStatusRequest,
insertUserRequest,slesctUserByIdRequest,
deleteUserById,updateUserRequest,getRolesRequest,assignRolesRequest} from '@/http/request.js';
export default {
    name: 'Users',
    data(){
        return {
            queryInfo: {
                query:  '',
                pagenum: 1,
                pagesize: 2
            },
            userlist: [],//用户列表
            total: 0,//总条数
            addDialogVisible: false,//控制添加用户的对话框显示隐藏
            editDialogVisible: false,//控制修改用户的对话框显示隐藏
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },//添加用户的表单数据
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                ]
            },//添加表单的验证规则
            editForm: {},//修改用户表单数据信息
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                ]
            },//修改用户表单验证
            setRolesDialogVisible: false,//控制分配角色对话框的显示隐藏
            userRoleInfo: {},//分配角色
            RolesList: [],//角色列表
            selectRoleId: '',//选中的下拉菜单值
        }
    },
    created(){
        //请求用户列表数据
        this.getUserList(this.queryInfo);
    },
    methods: {
        //获取用户列表数据
        async getUserList(params){
            const {data:res}=await getUserListRequest(params);
            if(res.meta.status!=200) return this.$message.error('获取用户列表失败');
            this.userlist=res.data.users;
            this.total=res.data.total;
        },
        //监听pagesize改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getUserList(this.queryInfo);
        },
        //页码值改变触发第二个事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage;
            this.getUserList(this.queryInfo);
        },
        //保存改变的用户状态
        async switchChange(userinfo){
            const {data:res}=await updateUserStatusRequest(userinfo);
            if(res.meta.status!=200){
                userinfo.mg_state=!userinfo.mg_state;
                return this.$message.error('修改用户状态失败');
            }  
            this.$message.success('修改用户状态成功');
        },
        //监听添加用户对话框的关闭事件
        addDialogClosed(){
            //重置表单项
            this.$refs.addFormRef.resetFields();
        },
        //添加用户
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return this.$message.info('表单不能为空');
                const {data:res}=await insertUserRequest(this.addForm);
                console.log(res);
                if(res.meta.status!=201) return this.$message.error('添加用户失败');
                this.$message.success('添加用户成功');
                this.addDialogVisible=false;
                //重新获取用户列表数据
                this.getUserList(this.queryInfo);
            })
        },
        //根据id删除对应的用户
        async removeUserById(id){
            const result=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err=>err);
            if(result!="confirm") return this.$message.info('删除操作已取消')
            const {data:res}=await deleteUserById(id);
            if(res.meta.status!=200) return this.$message.error('删除用户失败');
            this.$message.success('删除用户成功');
            //重新获取用户列表
            this.getUserList(this.queryInfo);
        },
        //修改用户 第一步 根据id查询用户回显操作
        async showEditdialog(id){
            const{data:res}=await slesctUserByIdRequest(id);
            if(res.meta.status!=200) return this.$message.info('查询用户信息失败');
            this.editForm=res.data;
            this.editDialogVisible=true;
        },
        //修改用表单重置
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        //修改用户提交
        editUser(){
             this.$refs.editFormRef.validate(async valid=>{
                 if(!valid) return this.$message.info('表单不能为空');
                 const obj={
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                 };
                 const {data:res}=await updateUserRequest(this.editForm.id,obj);
                 if(res.meta.status!=200) return this.$message.info('修改用户失败');
                 this.$message.success('修改用户信息成功');
                 //关闭对话框
                 this.editDialogVisible=false;
                 //重新请求用户列表
                 this.getUserList(this.queryInfo);
             })
        },
        //分配角色
        async setRole(userInfo){
            this.userRoleInfo=userInfo;
            //获取所有的角色列表
            const {data:res}=await getRolesRequest();
            if(res.meta.status!=200) return this.$message.info('获取角色列表失败');
            this.RolesList=res.data;
            this.setRolesDialogVisible=true;
        },
        //点击按钮分配角色
        async saveRoleInfo(){
            if(!this.selectRoleId) return this.$message.error('请选择要分配的角色');
            const {data:res}=await assignRolesRequest(this.userRoleInfo.id,this.selectRoleId);
            if(res.meta.status!=200) return this.$message.info('分配角色失败');
            this.$message.success('分配角色成功');
            this.setRolesDialogVisible=false;
            //重新获取用户列表
            this.getUserList(this.queryInfo);
        },
        //分配角色对话框重置
        setRolesDialogClosed(){
            this.selectRoleId='';
            this.userRoleInfo={};
        }
    }
}
</script>

<style lang="less" scoped>

</style>