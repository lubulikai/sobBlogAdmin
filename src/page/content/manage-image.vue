<template>
  <div>
    <el-form :inline="true" class="search-box">
      <el-form-item label="来源">
        <el-select v-model="original" clearable placeholder="请选择状态">
          <el-option label="全部" value="" />
          <el-option label="友情链接" value="link" />
          <el-option label="文章封面" value="cover" />
          <el-option label="头像" value="avatar" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="contentType" label="图片类型" />
      <el-table-column prop="original" label="图片来源">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.original === 'link'">友情链接</el-tag>
          <el-tag v-if="scope.row.original === 'cover'">文章封面</el-tag>
          <el-tag v-if="scope.row.original === 'avatar'">头像</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="图片">
        <template slot-scope="scope">
          <el-image
            style="width: 150px; height: 100px"
            :src="$constant.base_image_url + scope.row.url"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === '1'">正常</el-tag>
          <el-tag v-if="scope.row.state === '0'" type="danger">已删除</el-tag>
        </template>
      </el-table-column>
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
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPageIndex"
      :page-size="currentPageSize"
      background
      layout="total, prev, pager, next"
      :total="totalCount"
    />
  </div>
</template>

<script>
import * as api from "@/api/api";
export default {
  data() {
    return {
      original: "",
      loading: false,
      tableData: [],
      currentPageIndex: 1,
      currentPageSize: 10,
      totalCount: 0,
    };
  },
  methods: {
    //删除
    handleDelete(index, row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api.deleteImage(row.id).then((res) => {
          if (res.code === api.success_code) {
            this.$message.success(res.message);
            this.loadTableData();
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    //查询
    doSearch() {
      this.currentPageIndex = 1;
      this.loadTableData();
    },
    loadTableData() {
      this.loading = true;
      api
        .getListImage(
          this.currentPageIndex,
          this.currentPageSize,
          this.original
        )
        .then((res) => {
          this.loading = false;
          if (res.code === api.success_code) {
            this.tableData = res.data.content;
            this.totalCount = res.data.totalElements;
          } else {
            this.$message.error(res.message);
          }
        });
    },
    handleCurrentChange(currentPage) {
      this.currentPageIndex = currentPage;
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
  margin-left: 20px;
}
</style>