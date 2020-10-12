<template>
  <div>
    <el-input
      class="title-input"
      placeholder="请输入标题(8-64个字符)"
      v-model="article.title"
      maxlength="64"
      minlength="8"
      show-word-limit
    />
    <div id="editor">
      <mavon-editor
        @change="contentChange"
        v-model="article.content"
        ref="mdEditor"
        @onImageClick="showImageDialog('editor')"
      />
    </div>
    <el-form label-width="100px">
      <el-form-item label="标签" required>
        <el-tag
          class="label-tag"
          :key="tag"
          v-for="tag in tags"
          closable
          :disable-transitions="false"
          @close="handleCloseTag(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputTagVisible"
          v-model="inputTagValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputTagConfirm"
          @blur="handleInputTagConfirm"
        >
        </el-input>
        <el-button
          v-if="!inputTagVisible && !isEnough"
          class="button-new-tag"
          size="small"
          @click="showInputTag"
          >+ 新标签</el-button
        >
      </el-form-item>
      <el-form-item label="文章分类" required>
        <el-select v-model="article.categoryId" placeholder="请选择文章分类">
          <el-option
            :key="category.name"
            v-for="category in categories"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="摘要" required>
        <el-input
          placeholder="请输入摘要......"
          style="width: 500px"
          type="textarea"
          v-model="article.summary"
        ></el-input>
      </el-form-item>
      <el-form-item label="封面" required>
        <div
          @click="showImageDialog('cover')"
          style="display: inline-block; cursor: pointer"
        >
          <el-image
            class="uploader-image"
            v-if="article.cover"
            :src="$constant.base_image_url + article.cover"
            fit="fill"
          />
          <i v-else class="el-icon-plus uploader-icon" />
        </div>
      </el-form-item>
    </el-form>
    <el-row class="article-post-bottom-row">
      <el-button @click="preView">全屏预览</el-button>
      <el-button
        type="info"
        @click="doSaveDraft"
        :disabled="article.state !== $constant.articleState.draft"
        >保存草稿</el-button
      >
      <el-button type="primary" @click="doUpdateOrPublish">{{
        article.state === $constant.articleState.draft ? "发表文章" : "更新文章"
      }}</el-button>
    </el-row>
    <el-dialog
      class="article-upload-dialog"
      :visible.sync="imageDialogVisible"
      width="800px"
    >
      <div>
        <el-upload
          style="padding-bottom: 10px"
          action="api/admin/image/summary"
          :show-file-list="false"
          :on-success="onUploadImageSuccess"
          :before-upload="beforeImageUpload"
        >
          <el-button>上传图片</el-button>
        </el-upload>

        <el-radio-group v-model="selectImageIndex">
          <el-radio-button
            :key="index"
            v-for="(image, index) in listImage"
            :label="index"
            class="radio-button-image"
          >
            <el-image
              style="width: 120px; height: 120px"
              :src="$constant.base_image_url + image.url"
              fit="cover"
            />
          </el-radio-button>
        </el-radio-group>
        <el-pagination
          style="padding-top: 10px"
          @current-change="currentChange"
          :page-size="currentImagePageSize"
          background
          layout="prev, pager, next"
          :current-page.sync="currentImagePageIndex"
          :total="totalCount"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnSubmitSelectImage">
          确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/api";
import "../../../lib/mavon-editor/css/index.css";
import { mavonEditor } from "../../../lib/mavon-editor/mavon-editor.js";
export default {
  components: {
    mavonEditor,
  },
  data() {
    return {
      article: {
        id: "",
        title: "",
        categoryId: "",
        summary: "",
        cover: "",
        label: "",
        content: "",
        state: this.$constant.articleState.draft,
        createTime: null,
        type: "1",
      },
      contentHtml: "",
      tags: [],
      isEnough: false,
      categories: [],
      inputTagVisible: false,
      inputTagValue: "",
      imageDialogVisible: false,
      selectImageIndex: null,
      listImage: [],
      currentImagePageIndex: 1,
      currentImagePageSize: 20,
      totalCount: 10,
      commonLoading: null,
      imageDialogType: "",
      isSave: false,
    };
  },
  methods: {
    doLoading() {
      this.commonLoading = this.$loading({
        lock: true,
        text: "请等待",
        spinner: "el-icon-loading",
      });
    },
    beforeImageUpload(file) {
      this.doLoading();
    },
    onUploadImageSuccess(response, file, fileList) {
      this.commonLoading.close();
      if (response.code === api.success_code) {
        this.$message.success(response.message);
        this.currentImagePageIndex = 1;
        this.loadListImage();
      } else {
        this.$message.error(response.message);
      }
    },
    //获取标签字符串
    getlabel() {
      let tempLabel = "";
      if (this.tags.length > 0) {
        this.tags.forEach((item, index) => {
          tempLabel += item;
          if (index !== this.tags.length - 1) {
            tempLabel += "-";
          }
        });
      }
      return tempLabel;
    },
    //点击保存草稿
    doSaveDraft() {
      if (this.article.title === "") {
        this.$message.error("标题不能为空");
        return;
      }
      this.article.state = this.$constant.articleState.draft;
      this.article.content = this.contentHtml;
      this.article.label = this.getlabel();
      this.doLoading();
      api.addArticle(this.article).then((res) => {
        window.onbeforeunload = null;
        this.isSave = true;
        this.commonLoading.close();
        if (res.code === api.success_code) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //发表或者更新文章
    doUpdateOrPublish() {
      if (this.article.title === "") {
        this.$message.error("标题不能为空");
        return;
      }
      if (this.article.content === "") {
        this.$message.error("文章内容不能为空");
        return;
      }
      if (this.tags.length === 0) {
        this.$message.error("标签不能为空");
        return;
      }
      if (this.article.categoryId === "") {
        this.$message.error("文章分类不能为空");
        return;
      }
      if (this.article.summary === "") {
        this.$message.error("摘要不能为空");
        return;
      }
      this.article.state = this.$constant.articleState.publish;
      this.article.content = this.contentHtml;
      this.article.label = this.getlabel();
      this.doLoading();
      if (this.article.id) {
        //更新
        api.updateArticle(this.article.id, this.article).then((res) => {
          window.onbeforeunload = null;
          this.isSave = true;
          this.commonLoading.close();
          if (res.code === api.success_code) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        //新增
        api.addArticle(this.article).then((res) => {
          window.onbeforeunload = null;
          this.isSave = true;
          this.commonLoading.close();
          if (res.code === api.success_code) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    //全屏预览
    preView() {
      this.$refs.mdEditor.toolbar_right_click("read");
    },
    //编辑器内内容变化
    contentChange(value, render) {
      // console.log(value);
      this.contentHtml = render;
    },
    //弹出图片选择界面
    showImageDialog(type) {
      this.imageDialogType = type;
      this.imageDialogVisible = true;
    },
    //选中图片后确定
    btnSubmitSelectImage() {
      if (this.selectImageIndex == null) {
        this.$message.error("请选择一张图片");
        return;
      }
      let item = this.listImage[this.selectImageIndex];
      if (this.imageDialogType === "editor") {
        this.$refs.mdEditor.toolbar_left_addlink(
          "no-link",
          item.name,
          this.$constant.base_image_url + item.url
        );
      } else if (this.imageDialogType === "cover") {
        this.article.cover = item.url;
      }
      this.imageDialogVisible = false;
    },
    //删除tag
    handleCloseTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      if (this.tags.length < 5) {
        this.inputTagVisible = false;
        this.isEnough = false;
      }
    },
    //展示添加tag的input
    showInputTag() {
      if (this.tags.length < 5) {
        this.inputTagVisible = true;
        this.isEnough = false;
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      } else {
        this.inputTagVisible = false;
        this.isEnough = true;
      }
    },
    //处理tag的提交
    handleInputTagConfirm() {
      let inputTagValue = this.inputTagValue;
      if (inputTagValue === null || inputTagValue === "") {
        this.inputTagVisible = false;
        return;
      }
      if (this.tags.length < 5) {
        this.tags.push(inputTagValue);
        this.inputTagValue = "";
        this.inputTagVisible = false;
      }
      if (this.tags.length >= 5) {
        this.isEnough = true;
        this.inputTagVisible = false;
      }
    },
    //加载文章分类
    loadArticleType() {
      api.listCategories().then((res) => {
        if (res.code === api.success_code) {
          this.categories = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //加载图片列表
    loadListImage() {
      api
        .getListImage(this.currentImagePageIndex, this.currentImagePageSize, "")
        .then((res) => {
          if (res.code === api.success_code) {
            this.listImage = res.data.content;
            this.totalCount = res.data.totalElements;
          } else {
            this.$message.error(res.message);
          }
        });
    },
    //当前页变更
    currentChange(page) {
      this.currentImagePageIndex = page;
      this.loadListImage();
    },
    //获取文章详情后回显
    getArticleDetail() {
      if (this.$route.query.id) {
        this.doLoading();
        //修改文章
        api.getArticle(this.$route.query.id).then((res) => {
          this.commonLoading.close();
          if (res.code === api.success_code) {
            if (res.data) {
              let temp = res.data;
              this.article.id = temp.id;
              this.article.title = temp.title;
              this.article.content = temp.content;
              this.article.categoryId = temp.categoryId;
              this.article.summary = temp.summary;
              this.article.cover = temp.cover;
              this.article.state = temp.state;
              this.article.type = temp.type;
              this.article.label = temp.label;
              this.article.createTime = temp.createTime;
              this.contentHtml = temp.content;
              this.tags = temp.labels;
            }
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
  },
  beforeDestroy() {
    window.onbeforeunload = null;
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isSave) {
      this.$confirm("确定要离开吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
        });
    } else {
      next();
    }
  },
  mounted() {
    window.onbeforeunload = () => {
      return "请注意，系统可能不会保存填写的文章信息哦";
    };
    this.loadArticleType();
    this.getArticleDetail();
    this.loadListImage();
  },
};
</script>
<style>
.article-upload-dialog .el-dialog__header {
  display: none;
}
.label-tag {
  margin-right: 10px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-right: 10px;
  vertical-align: bottom;
}
.title-input input {
  border: none;
  padding-left: 20px;
  font-size: 20px;
}
#editor {
  width: 100%;
  height: 580px;
}
#editor > .markdown-body {
  box-shadow: none !important;
  height: 100%;
}
#editor > .markdown-body > .v-note-op {
  position: sticky;
  top: 0;
}
.uploader-image {
  width: 120px;
  height: 120px;
  border-radius: 3px;
  border: 1px solid #dcdfe6;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
}
.article-post-bottom-row {
  background-color: white;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid #dcdfe6;
}
.radio-button-image > .el-radio-button__inner {
  border: none !important;
  padding: 3px;
  border-radius: 3px !important;
}
</style>