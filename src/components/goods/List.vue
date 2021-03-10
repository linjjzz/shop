<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜素 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="goods_number"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editById(scope.row.goods_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 修改商品对话框 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 主体内容 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoods,
  deleteGoods,
  getGoodsByid,
  commitGoods,
} from '../../network/list'

export default {
  name: 'List',
  data() {
    return {
      //查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表
      goodslist: [],
      //总数据条数
      total: 0,
      //编辑商品对象
      editForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
      },
      //控制修改对象对话框的显示与隐藏
      editDialogVisible: false,
      //修改对话框的表单验证对象
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入重量', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //根据分页获取对应的商品列表
    getGoodsList() {
      getGoods(this.queryInfo).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.erroe('获取商品列表失败！')
        }

        this.goodslist = res.data.goods
        this.total = res.data.total
      })
    },
    //pagesize改变执行的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //pagenum改变执行的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    //根据id删除商品
    removeById(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteGoods(id).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error('删除商品失败！')
            }

            this.$message.success('删除商品成功！')
            this.getGoodsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //添加商品函数
    goAddpage() {
      this.$router.push('/goods/add')
    },
    //编辑商品函数
    editById(id) {
      getGoodsByid(id).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！')
        }

        this.editForm = res.data
        this.editDialogVisible = true
      })
    },
    //修改商品对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //提交修改商品
    eidtGoods() {
      commitGoods(this.editForm).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('修改商品失败！')
        }

        this.$message.success('修改商品成功！')
        this.getGoodsList()
        this.editDialogVisible = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>