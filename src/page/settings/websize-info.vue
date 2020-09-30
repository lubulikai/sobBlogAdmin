<template>
  <div>
    <el-form class="web-info-el-form" label-width="100px">
      <el-form-item label="网站名称" required>
        <el-input v-model="webTitle.newTitle" placeholder="请输入网站名称" />
      </el-form-item>
      <el-form-item label="网站关键字" required>
        <el-input
          v-model="newSeoInfo.keywords"
          placeholder="请输入网站关键字，按照“,”分隔"
        />
      </el-form-item>
      <el-form-item label="网站描述" required>
        <el-input
          type="textarea"
          v-model="newSeoInfo.description"
          placeholder="请输入网站描述"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doUpdate"> 更新网站信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from "@/api/api";
export default {
  data() {
    return {
      webTitle: {
        oldTitle: "",
        newTitle: "",
      },
      oldSeoInfo: {
        description: "",
        keywords: "",
      },
      newSeoInfo: {
        description: "",
        keywords: "",
      },
    };
  },
  methods: {
    doUpdate() {
      if (!this.webTitle.newTitle) {
        this.$message.error("网站名称不能为空");
        return;
      }
      if (!this.newSeoInfo.keywords) {
        this.$message.error("网站关键字不能为空");
        return;
      }
      if (!this.newSeoInfo.description) {
        this.$message.error("网站描述不能为空");
        return;
      }
      if (this.webTitle.oldTitle !== this.webTitle.newTitle) {
        //更新title
        api.updateWebSizeInfo(this.webTitle.newTitle).then((res) => {
          if (res.code === api.success_code) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      }
      if (
        this.newSeoInfo.keywords !== this.oldSeoInfo.keywords ||
        this.newSeoInfo.description !== this.oldSeoInfo.description
      ) {
        //更新seo信息
        api
          .updateSeoInfo(this.newSeoInfo.keywords, this.newSeoInfo.description)
          .then((res) => {
            if (res.code === api.success_code) {
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
          });
      }
    },
    getWebTitle() {
      api.getWebSizeTitle().then((res) => {
        if (res.code === api.success_code) {
          let data = res.data;
          this.webTitle.oldTitle = data.value;
          this.webTitle.newTitle = data.value;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getSeoInfo() {
      api.getSeoInfo().then((res) => {
        if (res.code === api.success_code) {
          let data = res.data;
          let description = data["web_size_description"];
          let keywords = data["web_size_keywords"];
          this.oldSeoInfo = { description, keywords };
          this.newSeoInfo = { description, keywords };
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
  mounted() {
    this.getWebTitle();
    this.getSeoInfo();
  },
};
</script>
<style>
.web-info-el-form .el-form-item {
  width: 800px;
}
.web-info-el-form > .el-form-item .el-input,
.el-textarea {
  width: 500px;
  margin-right: 10px;
}
</style>