<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="parentContent" label="父评论" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === $constant.commentState.publish"
            >正常</el-tag
          >
          <el-tag
            v-if="scope.row.state === $constant.commentState.top"
            type="success"
            >置顶</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户帐号" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="success"
            @click="doTop(scope.$index, scope.row)"
            >{{
              scope.row.state === $constant.commentState.top
                ? "取消置顶"
                : "置顶"
            }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as api from "@/api/api";
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      currentPageIndex: 1,
      currentPageSize: 10,
      totalCount: 0,
    };
  },
  methods: {
    loadTableData() {
      this.loading = true;
      api.getListComment(this.currentPageIndex,this.currentPageSize).then((res) => {
        if (res.code === api.success_code) {
          this.loading = false;
          this.tableData = res.data.content;
          this.totalCount = res.data.totalCount;
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
  mounted() {
    this.loadTableData();
  },
};
</script>
<style>
</style>