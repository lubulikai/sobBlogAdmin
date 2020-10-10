<template>
  <div>
    <el-form :inline="true" class="search-box">
      <el-form-item label="关键字">
        <el-input
          v-model="keyword"
          placeholder="请输入关键字"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="state" clearable placeholder="请选择状态">
          <el-option label="全部" value="" />
          <el-option label="已删除" value="0" />
          <el-option label="已发布" value="1" />
          <el-option label="草稿" value="2" />
          <el-option label="置顶" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="categoryId" clearable placeholder="请选择分类">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="summary" label="摘要" />
      <el-table-column prop="labels" label="标签" />
      <el-table-column prop="viewCount" label="浏览量" />
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === '0'" type="danger">已删除</el-tag>
          <el-tag v-if="scope.row.state === '1'">已发布</el-tag>
          <el-tag v-if="scope.row.state === '2'" type="info">草稿</el-tag>
          <el-tag v-if="scope.row.state === '3'" type="success">置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '0'">富文本</el-tag>
          <el-tag v-if="scope.row.type === '1'" type="success">MarkDown</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="showDetail(scope.$index, scope.row)"
            >详情</el-button
          >
          <el-button
            :disabled="scope.row.status === '0'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="success"
            @click="doTop(scope.$index, scope.row)"
            >{{ scope.row.state === "3" ? "取消置顶" : "置顶" }}</el-button
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
      keyword: "",
      categoryId: "",
      state: "",
      currentPageIndex: 1,
      currentPageSize: 10,
      totalCount: 0,
      categories: [],
      commonLoading: null,
    };
  },
  methods: {
    showLoading() {
      this.commonLoading = this.$loading({
        lock: true,
        text: "请等待",
        spinner: "el-icon-loading",
      });
    },
    showDetail(index, row) {},
    handleDelete(index, row) {},
    doTop(index, row) {
      api.topArticle(row.id).then((res) => {
        if (res.code === api.success_code) {
          this.$message.success(res.message);
          this.loadArticleList();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //查询
    doSearch() {
      this.currentPageIndex = 1;
      this.loadArticleList();
    },
    //加载文章列表
    loadArticleList() {
      api
        .getListArticle(
          this.currentPageIndex,
          this.currentPageSize,
          this.keyword,
          this.categoryId,
          this.state
        )
        .then((res) => {
          if (res.code === api.success_code) {
            this.tableData = res.data.contents;
            this.totalCount = res.data.totalCount;
          } else {
            this.$message.error(res.message);
          }
        });
    },
    //加载文章分类
    loadCategories() {
      this.loading = true;
      api.listCategories().then((res) => {
        this.loading = false;
        if (res.code === api.success_code) {
          this.categories = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
  mounted() {
    this.loadArticleList();
    this.loadCategories();
  },
};
</script>
<style>
.search-box {
  margin-left: 20px;
}
</style>