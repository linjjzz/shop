<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialogVisible"
            >添加分类</el-button
          >
        </el-col>

        <!-- 表格 -->
        <tree-table
          class="treeTable"
          :data="catelist"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          :show-row-hover="false"
          show-index
          index-text=""
          border
        >
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i
              class="el-icon-success"
              style="color: lightgreen"
              v-if="scope.row.cat_deleted === false"
            />
            <i class="el-icon-error" style="color: red" v-else />
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag
              size="mini"
              type="success"
              v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt" slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditCateDialogVisible(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeCate(scope.row)"
              >删除</el-button
            >
          </template>
        </tree-table>

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="querInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
          <!-- 级联选择器 -->
          <!-- options 用来指定数据源 -->
          <!-- props用来指定数据对象 -->
          <el-cascader
            :options="parentCatelist"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCate,
  getParentCate,
  addCateInfo,
  selectCate,
  commitCate,
  deleteCate,
} from '../../network/cate'

export default {
  name: 'Cate',
  data() {
    return {
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据列表,默认为空
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'isok',
        },
        {
          label: '排序',
          //将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'order',
        },
        {
          label: '操作',
          //将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'opt',
        },
      ],
      //控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        //将要添加的分类名称
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级,默认添加的是1级分类
        cat_level: 0,
      },
      //添加分类表单的验证对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //父级分类列表
      parentCatelist: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover',
      },
      //选中的父级分类的id数组
      selectedKeys: [],
      //控制添加分类对话框的显示与隐藏
      editCateDialogVisible: false,
      //修改分类表单的验证对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //修改分类的表单数据对象
      editCateForm: {},
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类数据
    getCateList() {
      getCate(this.querInfo).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }

        //把数据列表赋值给catelist
        this.catelist = res.data.result
        //为总数据条数赋值
        this.total = res.data.total
      })
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum改变
    handleCurrentChange(nuePage) {
      this.querInfo.pagenum = nuePage
      this.getCateList()
    },
    //点击按钮,展示添加分类的对话框
    showAddCateDialogVisible() {
      //获取父级分类的数据列表
      this.getParentCateList()
      //展示对话框
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
    getParentCateList() {
      getParentCate().then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取父级分类失败')
        }

        this.parentCatelist = res.data
      })
    },
    //选择项发生变化触发这个函数
    parentCateChange() {
      //如果selectedKeys数组中的length大于0，证明选中了父级分类
      //反之说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        //父级分类的id
        this.addCateForm.cat_pid = 0
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //点击按钮添加新的分类
    addCate() {
      //表单预验证
      this.$refs.addCateFormRef.validate((valid) => {
        if (!valid) return
        //发起请求添加分类
        addCateInfo(this.addCateForm).then((res) => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败！')
          }
          this.$message.success('添加分类成功！')
          //刷新列表
          this.getCateList()
          //隐藏添加分类对话框
          this.addCateDialogVisible = false
        })
      })
    },
    //监听对话框的关闭事件,重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //点击按钮,展示修改分类的对话框
    showEditCateDialogVisible(cateInfo) {
      //根据id查询当前分类
      selectCate(cateInfo).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询分类失败')
        }

        this.editCateForm = res.data
      })
      //展示对话框
      this.editCateDialogVisible = true
    },
    //监听对话框的关闭事件,重置表单数据
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    //点击按钮修改分类
    editCate() {
      //表单预验证
      this.$refs.editCateFormRef.validate((valid) => {
        if (!valid) return
        //发起请求修改分类
        commitCate(this.editCateForm).then((res) => {
          console.log(this.editCateForm)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('修改分类失败！')
          }
          this.$message.success('修改分类成功！')
          //刷新列表
          this.getCateList()
          //隐藏修改分类对话框
          this.editCateDialogVisible = false
        })
      })
    },
    //点击按钮删除分类
    removeCate(cateInfo) {
      //弹框提示角色是否删除
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteCate(cateInfo).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error('删除分类失败！')
            }
            this.$message.success('删除分类成功！')
            //刷新列表
            this.getCateList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>