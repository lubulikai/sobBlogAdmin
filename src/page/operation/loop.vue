<template>
  <div>
    <el-row>
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="title" label="标题" width="180">
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.targetUrl" target="_blank">{{
            scope.row.title
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="targetUrl" label="跳转链接"> </el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === '1'">正常</el-tag>
          <el-tag v-if="scope.row.state === '0'" type="danger">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="imageUrl" label="图片">
        <template slot-scope="scope">
          <el-image
            style="width: 200px;"
            :src="scope.row.imageUrl"
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
      <el-form label-width="80px">
        <el-form-item label="标题" required>
          <el-input
            v-model="loopFormData.title"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" required>
          <el-input-number
            v-model="loopFormData.order"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="loopFormData.state" placeholder="状态">
            <el-option label="正常" value="1" />
            <el-option label="不可用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转链接" required>
          <el-input
            v-model="loopFormData.targetUrl"
            placeholder="请输入跳转链接"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传图片" required>
          <el-upload
            action="api/admin/image"
            :show-file-list="false"
            :on-success="onUploadImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <el-image
              class="uploader-image"
              v-if="loopFormData.imageUrl"
              :src="loopFormData.imageUrl"
              fit="fill"
            />
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()"> 提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/api";
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      dialogTitle: "",
      dialogVisible: false,
      dialogType: "add",
      loopFormData: {
        title: "",
        order: 1,
        state: "1",
        targetUrl: "",
        imageUrl: "",
      },
      commonLoading: null,
    };
  },
  methods: {
    beforeImageUpload(file) {
      this.commonLoading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
      });
    },
    onUploadImageSuccess(response, file, fileList) {
      this.commonLoading.close();
      if (response.code === api.success_code) {
        this.loopFormData.imageUrl =
          api.base_url + "portal/image/" + response.data.id;
        this.$message.success(response.message);
      } else {
        this.$message.error(response.message);
      }
    },
    handleAdd() {
      this.dialogTitle = "添加轮播图";
      this.dialogType = "add";
      this.loopFormData.title = "";
      this.loopFormData.state = "1";
      this.loopFormData.order = 1;
      this.loopFormData.targetUrl = "";
      this.loopFormData.imageUrl = "";
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      api.getLoop(row.id).then((res) => {
        if (res.code === api.success_code) {
          let data = res.data;
          this.dialogTitle = "编辑轮播图";
          this.dialogType = "edit";
          this.loopFormData.id = data.id;
          this.loopFormData.title = data.title;
          this.loopFormData.state = data.state;
          this.loopFormData.order = data.order;
          this.loopFormData.targetUrl = data.targetUrl;
          this.loopFormData.imageUrl = data.imageUrl;
          this.dialogVisible = true;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    submitForm() {
      if (this.loopFormData.title === "") {
        this.$message.error("标题不能为空");
        return;
      }
      if (this.loopFormData.state === "") {
        this.$message.error("状态不能为空");
        return;
      }
      if (this.loopFormData.targetUrl === "") {
        this.$message.error("跳转链接不能为空");
        return;
      }
      if (this.loopFormData.imageUrl === "") {
        this.$message.error("图片不能为空");
        return;
      }
      if (this.dialogType === "add") {
        this.doAdd(this.loopFormData);
      } else if (this.dialogType === "edit") {
        this.doUpdate(this.loopFormData.id, this.loopFormData);
      }
    },
    doUpdate(id, data) {
      api.updateLoop(id, data).then((result) => {
        if (result.code === api.success_code) {
          this.$message.success(result.message);
          this.handleSuccess();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    doAdd(data) {
      api.addLoop(data).then((result) => {
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
        api.deleteLoop(row.id).then((result) => {
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
      api.listLoop().then((result) => {
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
  width: 178px;
  height: 178px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>