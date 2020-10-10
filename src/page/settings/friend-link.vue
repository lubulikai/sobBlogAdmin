<template>
  <div>
    <el-row>
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.url" target="_blank">{{
            scope.row.name
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" />
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === '1'">正常</el-tag>
          <el-tag v-if="scope.row.state === '0'" type="danger">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="logo" label="logo">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.logo"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form label-width="100px">
        <el-form-item label="名称" required>
          <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" required>
          <el-input-number v-model="formData.order" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="formData.state" placeholder="状态">
            <el-option label="正常" value="1" />
            <el-option label="不可用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转链接" required>
          <el-input
            v-model="formData.url"
            placeholder="请输入跳转链接"
          ></el-input>
        </el-form-item>
        <el-form-item label="logo图片" required>
          <div @click="changeLinkImage">
            <el-image
              class="uploader-image"
              v-if="formData.logo"
              :src="formData.logo"
              fit="fill"
            />
            <i v-else class="el-icon-plus uploader-icon"></i>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()"> 提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <my-upload
      field="file"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      v-model="uploadShow"
      :width="300"
      :height="150"
      url="api/admin/image/link"
      img-format="png"
    />
  </div>
</template>

<script>
import * as api from "@/api/api";
import myUpload from "vue-image-crop-upload";
export default {
  components: {
    myUpload,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      dialogTitle: "",
      dialogVisible: false,
      dialogType: "add",
      formData: {
        id: "",
        name: "",
        logo: "",
        url: "",
        order: 1,
        state: "1",
      },
      commonLoading: null,
      uploadShow: false,
    };
  },
  methods: {
    //上传成功
    cropUploadSuccess(res, field) {
      if (res.code === api.success_code) {
        this.formData.logo = this.$constant.base_image_url + res.data.id;
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },
    //上传失败
    cropUploadFail(status, field) {
      this.$message.error("友情链接上传失败");
    },
    changeLinkImage() {
      this.uploadShow = true;
    },
    handleAdd() {
      this.dialogTitle = "添加友情链接";
      this.dialogType = "add";
      this.formData.id = "";
      this.formData.name = "";
      this.formData.logo = "";
      this.formData.url = "";
      this.formData.order = 1;
      this.formData.state = "1";
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      api.getFriendLink(row.id).then((res) => {
        if (res.code === api.success_code) {
          let data = res.data;
          this.dialogTitle = "编辑友情链接";
          this.dialogType = "edit";
          this.formData.id = data.id;
          this.formData.name = data.name;
          this.formData.logo = data.logo;
          this.formData.url = data.url;
          this.formData.order = data.order;
          this.formData.state = data.state;
          this.dialogVisible = true;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    submitForm() {
      if (this.formData.name === "") {
        this.$message.error("名称不能为空");
        return;
      }
      if (this.formData.logo === "") {
        this.$message.error("logo不能为空");
        return;
      }
      if (this.formData.url === "") {
        this.$message.error("跳转链接不能为空");
        return;
      }
      if (this.formData.state === "") {
        this.$message.error("状态不能为空");
        return;
      }
      if (this.dialogType === "add") {
        this.doAdd(this.formData);
      } else if (this.dialogType === "edit") {
        this.doUpdate(this.formData.id, this.formData);
      }
    },
    doUpdate(id, data) {
      api.updateFriendLink(id, data).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message);
          this.handleSuccess();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    doAdd(data) {
      api.addFriendLink(data).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message);
          this.handleSuccess();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api.deleteFriendLink(row.id).then((result) => {
          if (result.code === api.success_code) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
        });
      });
    },
    handleSuccess() {
      this.dialogVisible = false;
      this.loadTableData();
    },
    loadTableData() {
      this.loading = true;
      api.listFriendLink().then((result) => {
        if (result.code === api.success_code) {
          this.tableData = result.data;
          this.loading = false;
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
.uploader-image {
  width: 300px;
  height: 150px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>