<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色按钮 -->
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleslist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightByid(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right" />
              </el-col>
              <!-- 渲染二 三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightByid(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightByid(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserByid(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  addRole,
  editRole,
  commitUsers,
  deleteRoles,
  deleteRight,
  getRights,
  addRights,
} from '../../network/roles'

export default {
  name: 'Roles',
  data() {
    return {
      //所有角色列表数据
      roleslist: [],
      // 控制添加角色对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改角色对话框的显示与隐藏
      editDialogVisible: false,
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      //查询到的用户信息对象
      editForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色表单的验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
      },
      //修改角色表单的验证规则对象
      editFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
      },
      //所有权限的数据
      rightslist: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      //默认选中的节点Id值得数组
      defKeys: [],
      //当前即将分配权限的角色id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    getRolesList() {
      getRoles().then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.roleslist = res.data
      })
    },
    // 监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addRole() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        addRole(this.addForm).then((res) => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败！')
          }
          this.$message.success('添加角色成功！')
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取角色列表数据
          this.getRolesList()
        })
      })
    },
    // 监听修改角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //展示编辑角色的对话框
    showEditDialog(id) {
      editRole(id).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询角色失败！')
        }

        this.editForm = res.data
        this.editDialogVisible = true
      })
    },
    //修改角色信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return this.$message.error('请填写完整的角色信息')
        //发起修改角色信息的数据请求
        commitUsers(this.editForm).then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error('更新角色信息失败！')
          }
          // 隐藏添加角色的对话框
          this.editDialogVisible = false
          // 重新获取角色列表数据
          this.getRolesList()
          //提示成功
          this.$message.success('更新角色信息成功！')
        })
      })
    },
    //根据id删除对应的角色信息
    removeUserByid(id) {
      //弹框提示角色是否删除
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //发起删除用户的数据请求
          deleteRoles(id).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error('删除角色失败！')
            }
            this.$message.success('删除角色成功！')
            // 重新获取角色列表数据
            this.getRolesList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //根据id删除对应的权限
    removeRightByid(role, rightId) {
      //弹框提示用户是否要删除
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //发起删除用户的数据请求
          deleteRight(role.id, rightId).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error('删除权限失败！')
            }

            role.children = res.data
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //展示分配权限对话框
    showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的数据
      getRights().then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限数据失败')
        }
        //把获取到的权限数据保存到data中
        this.rightslist = res.data
      })
      //递归获取三级节点得id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    //通过递归得形式，获取角色下所有三级权限得id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    //监听分配权限对话框得关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    //点击为角色分配权限
    allotRights() {
      const keys = [
        //获取已选中的id数组
        ...this.$refs.treeRef.getCheckedKeys(),
        //获取半选中的id数组
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]

      const idStr = keys.join(',')

      addRights(idStr, this.roleId).then((res) => {
        if(res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
        
        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>