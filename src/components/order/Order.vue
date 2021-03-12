<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索区 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressBox"
            ></el-button>
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
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../assets/js/citydata'

import { getOrders } from '../../network/order'

import axios from 'axios'

export default {
  name: 'Order',
  data() {
    return {
      //查询订单对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //总数据条数
      total: 0,
      //点单列表数据
      orderlist: [],
      //控制修改对话框的显示与隐藏
      addressVisible: false,
      //修改地址对话框数据对象
      addressForm: {
        address1: [],
        address1: '',
      },
      //修改地址表单验证对象
      addressFormRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      //地址数据
      cityData,
      //控制物流进度对话框的显示与隐藏
      progressVisible: false,
      //物流订单信息对象
      progressInfo: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获取订单列表
    getOrderList() {
      getOrders(this.queryInfo).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取订单列表失败！')
        }

        this.total = res.data.total
        this.orderlist = res.data.goods
      })
    },
    //pagesize发生变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      //刷新列表
      this.getOrderList()
    },
    //pagenum发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      //刷新
      this.getOrderList()
    },
    //展示修改地址对话框
    showBox() {
      this.addressVisible = true
    },
    //修改地址对话框的关闭事件
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 展示物流进度对话框
    showProgressBox() {
      axios.get('/data/exporder.json').then((res) => {
        this.progressInfo = res.data.data
      })
      this.progressVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>