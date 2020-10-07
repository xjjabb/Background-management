<template>
    <div id="login">
        <div class="login_box">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <el-form-item  prop="username">
                  <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                  <el-button type="primary" @click="login">登录</el-button>
                  <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {loginRequest} from '@/http/request.js';
export default {
    name: 'Login',
    data(){
        return {
            loginForm: {
                username: 'admin',
                password: '123456',
            },
            loginFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        //登录
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return;
                const{data:res}=await loginRequest(this.loginForm);
                if(res.meta.status!=200) return this.$message.error('登录失败');
                this.$message.success('登录成功');
                window.sessionStorage.setItem('token',res.data.token);
                this.$router.push('/home');
            })
        },
        //重置表单
        reset(){
            this.$refs.loginFormRef.resetFields();
        }
    }
}
</script>

<style lang="less" scoped>
#login {
    height: 100%;
    background-color: #2b4b6b;

    .login_box {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -225px;
        margin-top: -150px;
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 5px;

        .login_form {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;

            .btns {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}
</style>