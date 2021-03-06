<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传的后台API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.good_introduce" />
            <!-- 添加商品得按钮 -->
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="preImg" />
    </el-dialog>
  </div>
</template>

<script>
import { getCate, getManyAttr, getOnlyAttr, addCate } from '../../network/add'

import _ from 'lodash'

export default {
  name: 'Add',
  data() {
    return {
      //步骤条和tab栏的索引数值
      activeIndex: '0',
      //添加商品的数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        //图片的数组
        pics: [],
        //商品得详情描述
        good_introduce: '',
        //包含动态参数和静态属性的数组
        attrs: [],
      },
      //添加商品表单的验证对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'change' },
        ],
      },
      //商品分类列表
      catelist: [],
      //级联选择器的配置对象
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      //动态参数列表数据
      manyTableData: [],
      //静态属性列表数据
      onlyTableData: [],
      //上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //预览图片得URL
      previewPath: '',
      //控制预览对话框得显示与隐藏
      previewVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取所有商品分类数据
    getCateList() {
      getCate().then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error('获取商品列表失败！')
        }

        this.catelist = res.data
      })
    },
    //级联选择器选中项变化会触发的函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    //切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换.
    beforeTabLeave(activeName, oldActiceName) {
      if (oldActiceName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    //tab 被选中时触发
    tabClicked() {
      //证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        getManyAttr(this.cateId).then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error('获取动态参数列表失败！')
          }

          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.split.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTableData = res.data
        })
      } else if (this.activeIndex === '2') {
        getOnlyAttr(this.cateId).then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error('获取静态属性列表失败！')
          }

          this.onlyTableData = res.data
        })
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //处理移出图片的操作
    handleRemove(file) {
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到图片对应得索引值
      const i = this.addForm.pics.findIndex((x) => x.pics === filePath)
      // 3.调用数组得splice方法，把图片信息对象从pics数组中移出
      this.addForm.pics.splice(i, 1)
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      //1.拼接得到一个图片信息对象
      const picInfo = response.data.tmp_path
      //2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    //添加商品
    add() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写必要得表单项！')
        }
        //执行添加得业务逻辑
        //lodash cloneDeep(obj)
        //将addForm深拷贝为form
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.log(form)

        // 发起请求添加商品
        //商品的名称必须是唯一的
        addCate(form).then((res) => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品失败！')
          }
          this.$message.success('添加商品成功！')
          //跳转到商品列表页面
          this.$router.push('/goods')
        })
      })
    },
  },
  computed: {
    //获取三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.preImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>