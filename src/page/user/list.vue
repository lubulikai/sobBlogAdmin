<template>
  <div>
    <el-form :inline="true" class="search-box">
      <el-form-item label="邮箱">
        <el-input
          v-model="searchParams.email"
          placeholder="请输入邮箱"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input
          v-model="searchParams.userName"
          placeholder="请输入用户名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="roles" label="角色" />
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.avatar"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="sign" label="签名" />
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === '1'">正常</el-tag>
          <el-tag v-if="scope.row.state === '0'" type="danger">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="showResetPasswordDialog(scope.$index, scope.row)"
            >重置密码</el-button
          >
          <el-button
            :disabled="scope.row.status === '0'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageData.currentPage"
      :page-sizes="[1,10]"
      :page-size="pageData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageData.pageTotal"
    >
    </el-pagination>
    <el-dialog title="重置密码" :visible.sync="dialogVisible" width="400px">
      <el-form label-width="80px">
        <el-form-item>
          <div>重置“{{ resetPasswordData.currentUserName }}”的密码</div>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input
            show-password
            clearable
            v-model="resetPasswordData.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doResetPassword"> 提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import { hex_md5 } from "@/utils/md5";
import * as api from "@/api/api";
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      pageData: {
        pageSize: 10,
        currentPage: 1,
        pageTotal: 1,
      },
      searchParams: {
        email: "",
        userName: "",
      },
      dialogVisible: false,
      resetPasswordData: {
        currentUserName: "",
        userId: "",
        password: "",
      },
    };
  },
  methods: {
    showResetPasswordDialog(index, row) {
      this.resetPasswordData.currentUserName = row.userName;
      this.resetPasswordData.userId = row.id;
      this.password = "";
      this.dialogVisible = true;
    },
    doResetPassword() {
      if (this.resetPasswordData.password === "") {
        this.$message.error("密码不能为空");
        return;
      }
      api
        .resetUserPassword(
          this.resetPasswordData.userId,
          this.resetPasswordData.password
        )
        .then((res) => {
          if (res.code === api.success_code) {
            this.$message.success(res.message);
            this.dialogVisible = false;
            this.loadTableData();
          } else {
            this.$message.error(res.message);
          }
        });
    },
    handleDelete(index, row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api.deleteUser(row.id).then((result) => {
          if (result.code === api.success_code) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
        });
      });
    },
    doSearch() {
      this.pageData.currentPage = 1;
      this.loadTableData();
    },
    loadTableData() {
      this.loading = true;
      api
        .listUser(
          this.pageData.currentPage,
          this.pageData.pageSize,
          this.searchParams.email,
          this.searchParams.userName
        )
        .then((result) => {
          if (result.code === api.success_code) {
            this.tableData = result.data.content;
            this.pageData.pageTotal = result.data.totalElements;
            this.loading = false;
          }
        });
    },
    handleCurrentChange(currentPage) {
      this.pageData.currentPage = currentPage;
      this.loadTableData();
    },
    handleSizeChange(pageSize) {
      this.pageData.pageSize = pageSize;
      this.loadTableData();
    },
  },
  mounted() {
    this.loadTableData();
  },
};
</script>
<style>
.search-box {
  padding-top: 10px;
  padding-left: 10px;
}
</style>