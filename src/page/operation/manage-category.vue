<template>
  <div>
    <el-row>
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="name" label="名称" width="180"> </el-table-column>
      <el-table-column prop="pinyin" label="拼音" width="180">
      </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      <el-table-column prop="order" label="排序"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'">正常</el-tag>
          <el-tag v-if="scope.row.status === '0'" type="danger">已删除</el-tag>
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
            :disabled="scope.row.status === '0'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="400">
      <el-form label-width="60px">
        <el-form-item label="名称" required>
          <el-input
            v-model="categoryData.name"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="拼音" required>
          <el-input
            v-model="categoryData.pinyin"
            placeholder="请输入拼音"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" required>
          <el-input-number
            v-model="categoryData.order"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="categoryData.status" placeholder="状态">
            <el-option label="正常" value="1" />
            <el-option label="删除" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" required>
          <el-input
            v-model="categoryData.description"
            type="textarea"
            :rows="2"
            placeholder="请输入描述"
          ></el-input>
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
      categoryData: {
        id: "",
        name: "",
        pinyin: "",
        order: 1,
        description: "",
        status: "1",
      },
    };
  },
  methods: {
    handleAdd() {
      this.dialogTitle = "添加分类";
      this.dialogType = "add";
      this.categoryData.name = "";
      this.categoryData.pinyin = "";
      this.categoryData.order = 1;
      this.categoryData.status = "1";
      this.categoryData.description = "";
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      api.getCategory(row.id).then((res) => {
        if (res.code === api.success_code) {
          let data = res.data;
          this.dialogTitle = "编辑分类";
          this.dialogType = "edit";
          this.categoryData.id = data.id;
          this.categoryData.name = data.name;
          this.categoryData.pinyin = data.pinyin;
          this.categoryData.order = data.order;
          this.categoryData.status = data.status;
          this.categoryData.description = data.description;
          this.dialogVisible = true;
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
        api.deleteCategory(row.id).then((result) => {
          if (result.code === api.success_code) {
            this.$message({
              message: result.message,
              type: "success",
            });
          } else {
            this.$message.error(result.message);
          }
        });
      });
    },
    submitForm() {
      if (this.categoryData.name === "") {
        this.$message.error("名称不能为空");
        return;
      }
      if (this.categoryData.pinyin === "") {
        this.$message.error("拼音不能为空");
        return;
      }
      if (this.categoryData.status === "") {
        this.$message.error("状态不能为空");
        return;
      }
      if (this.categoryData.description === "") {
        this.$message.error("描述不能为空");
        return;
      }
      if (this.dialogType === "add") {
        this.doAdd(this.categoryData);
      } else if (this.dialogType === "edit") {
        this.doUpdate(this.categoryData.id, this.categoryData);
      }
    },
    doUpdate(id, data) {
      api.updateCategory(id, data).then((result) => {
        if (result.code === api.success_code) {
          this.$message({
            message: result.message,
            type: "success",
          });
          this.handleSuccess();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    doAdd(data) {
      api.addCategory(data).then((result) => {
        if (result.code === api.success_code) {
          this.$message({
            message: result.message,
            type: "success",
          });
          this.handleSuccess();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    handleSuccess() {
      this.dialogVisible = false;
      this.loadTableData();
    },
    loadTableData() {
      this.loading = true;
      api.listCategories().then((result) => {
        if (result.code === api.success_code) {
          this.tableData = result.data;
          this.loading = false;
        }
      });
    },
  },
  created() {
    this.loadTableData();
  },
};
</script>
<style>
</style>