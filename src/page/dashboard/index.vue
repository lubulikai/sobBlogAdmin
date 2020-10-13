<template>
  <div class="div-index-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="div-count-show">
          <div class="div-count-show-label">访问总量：</div>
          <div class="div-count-show-count">{{ viewTotal }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="div-count-show">
          <div class="div-count-show-label">注册用户：</div>
          <div class="div-count-show-count">{{ registerCount }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="div-count-show">
          <div class="div-count-show-label">文章总数：</div>
          <div class="div-count-show-count">{{ articleCount }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="div-count-show">
          <div class="div-count-show-label">评论总数：</div>
          <div class="div-count-show-count">{{ commentCount }}</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="div-part">
          <div class="div-part-label">
            <span>快捷操作</span>
          </div>
          <el-divider></el-divider>
          <div class="div-part-content div-operation">
            <el-button
              type="primary"
              @click="$router.push('/content/post-article')"
              >写文章</el-button
            >
            <el-button
              type="primary"
              @click="$router.push('/settings/websize-info')"
              >修改网站信息</el-button
            >
            <el-button
              type="primary"
              @click="$router.push('/settings/friend-link')"
              >编辑友情链接</el-button
            >
            <el-button type="primary" @click="$router.push('/operation/loop')"
              >轮播图管理</el-button
            >
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="div-part">
          <div class="div-part-label">
            <span>最新评论</span>
            <el-link
              class="el-link-comment-more"
              type="primary"
              @click="$router.push('/content/manage-comment')"
              >查看更多>>></el-link
            >
          </div>
          <el-divider></el-divider>
          <div class="div-part-content">
            <el-table
              :data="commentTableData"
              stripe
              style="width: 100%"
              v-loading="loading"
            >
              <el-table-column prop="content" label="内容" />
              <el-table-column prop="userName" label="用户帐号" />
              <el-table-column prop="userAvatar" label="用户头像">
                <template slot-scope="scope">
                  <el-image
                    style="width: 50px; height: 50px"
                    :src="scope.row.userAvatar"
                    fit="fill"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="评论时间" />
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as api from "@/api/api";
export default {
  data() {
    return {
      viewTotal: 0,
      registerCount: 0,
      articleCount: 0,
      commentCount: 0,
      commentTableData: [],
      loading: false,
    };
  },
  methods: {
    getWebViewTotal() {
      api.getWebsizeViewCount().then((res) => {
        if (res.code === api.success_code) {
          this.viewTotal = res.data["web_size_view_count"];
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getRegisterCount() {
      api.getRegisterCount().then((res) => {
        if (res.code === api.success_code) {
          this.registerCount = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getArticleCount() {
      api.getArticleCount().then((res) => {
        if (res.code === api.success_code) {
          this.articleCount = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getCommentCount() {
      api.getCommentCount().then((res) => {
        if (res.code === api.success_code) {
          this.commentCount = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    loadCommentData() {
      this.loading = true;
      api.getListComment(1, 10).then((res) => {
        this.loading = false;
        if (res.code === api.success_code) {
          this.commentTableData = res.data.content;
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
  mounted() {
    this.getWebViewTotal();
    this.getRegisterCount();
    this.getArticleCount();
    this.getCommentCount();
    this.loadCommentData();
  },
};
</script>
<style>
.div-index-container {
  padding: 20px;
}
.div-index-container .el-row {
  margin-bottom: 20px;
}
.div-count-show {
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 20px;
  padding-right: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.div-count-show-label {
  font-size: 20px;
}
.div-count-show-count {
  font-size: 40px;
  font-weight: 600;
  text-align: center;
  color: dodgerblue;
}
.div-part {
  padding-top: 20px;
  padding-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding-left: 20px;
  padding-right: 20px;
}
.div-part-label {
  font-size: 20px;
}
.el-link-comment-more {
  float: right;
}
.div-operation .el-button {
  margin-bottom: 20px;
  margin-left: 0;
  display: block;
}
</style>