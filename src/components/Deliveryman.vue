<template>
  <div>
    <el-card>
      <div slot="header">
        快递员管理
        <el-button
            type="success"
            icon="el-icon-add-location"
            circle
            size="mini"
            @click="addDeliverymanVisible = true"
        ></el-button>
      </div>
      <el-table class="table" :data="deliverymanData" height="calc(100vh - 200px)">
        <el-table-column prop="id" label="编号" width="50"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                @click="
                api(
                  '/management/remove_deliveryman',
                  { id: scope.row.id },
                  deleteDeliverymanCallback
                )
              "
            >删除
            </el-button>
            <el-button
                type="text"
                size="small"
                @click="showPosition(scope.row)">
              当前位置
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="250">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="300">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            :current-page="deliverymanCurrentPage"
            background
            layout="prev, pager, next"
            :page-count="deliverymanTotalPage"
            class="pagination"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog title="新增快递员" :visible.sync="addDeliverymanVisible">
      <el-form
          :rules="addDeliverymanRules"
          ref="deliverymanAddForm"
          :model="deliverymanAddForm"
      >
        <el-form-item prop="name" label="姓名">
          <el-input
              placeholder="姓名"
              v-model="deliverymanAddForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="username" label="用户名">
          <el-input
              placeholder="用户名"
              v-model="deliverymanAddForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
              placeholder="密码"
              v-model="deliverymanAddForm.password"
              type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              @click="
                submitForm('deliverymanAddForm', (data) => {
                  api('/management/add_deliveryman', data, addDeliverymanCallback);
                })
              "
          >新增快递员
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--显示快递员位置-->
    <el-dialog title="快递员位置" :visible.sync="showPositionVisible">
      <baidu-map :center="{'lng': deliverymanLng, 'lat': deliverymanLat}" :zoom="15" style="width: 100%; height: 300px"
                 :scrollWheelZoom="true">
        <bm-marker :position="{'lng': deliverymanLng, 'lat': deliverymanLat}" :dragging="false"/>
      </baidu-map>
    </el-dialog>
  </div>
</template>

<script>
import {api} from "@/utils";

export default {
  name: "Deliveryman",
  mounted() {
    this.getPagedDeliveryman(0);
  },
  data() {
    return {
      deliverymanData: [],
      deliverymanLng: null,
      deliverymanLat: null,
      deliverymanCurrentPage: 0,
      deliverymanTotalPage: 1,
      deliverymanAddForm: {
        password: "",
        name: "",
        username: "",
      },
      addDeliverymanVisible: false,
      showPositionVisible: false,
      addDeliverymanRules: {
        name: [{required: true, message: "请填写快递员姓名", trigger: "blur"}],
        username: [
          {
            required: true,
            message: "用户名不可为空",
            trigger: "blur",
          },
        ],
        password: [
          {required: true, message: "请填写密码", trigger: "blur"},
        ],
      },
    };
  },
  methods: {
    api,
    showPosition(val) {
      if (val.lng === null) this.$message('快递员 ' + val.name + ' 未上传位置');
      else {
        {
          this.deliverymanLat = val.lat;
          this.deliverymanLng = val.lng;
          this.showPositionVisible = true;
        }
      }
    },
    handleCurrentChange(val) {
      this.deliverymanCurrentPage = val;
      this.getPagedDeliveryman(val);
    },
    closeMap() {
      setTimeout(() => (this.showMapVar = false), 300);
    },
    showMap() {
      this.showMapVar = true;
    },
    getSearchRes(res) {
      let point = res.point;
      this.deliverymanAddForm.lat = point.lat;
      this.deliverymanAddForm.lng = point.lng;
      console.log(this.deliverymanAddForm);
    },
    locationFormValidator(rule, value, callback) {
      setTimeout(() => {
        if (!this.deliverymanAddForm.lng || !this.deliverymanAddForm.lat) {
          callback(new Error("请在地图上选择地址"));
        } else {
          callback();
        }
      }, 500);
    },
    submitForm(formName, successCallback) {
      setTimeout(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            successCallback(this[formName]);
          } else {
            return false;
          }
        });
      }, 500);
    },
    deleteDeliverymanCallback() {
      this.getPagedDeliveryman(this.deliverymanCurrentPage);
    },
    addDeliverymanCallback() {
      this.getPagedDeliveryman(this.deliverymanCurrentPage);
      this.addDeliverymanVisible = false;
      this.deliverymanAddForm = {
        location: "",
        name: "",
        specific_location: "",
        lng: null,
        lat: null,
      };
    },
    getPagedDeliveryman(page) {
      api.bind(this)(
          "/management/get_deliveryman",
          {
            page,
            per_page: 10,
          },
          (response) => {
            this.deliverymanData = response.data.columns;
            this.deliverymanTotalPage = response.data.total_page;
            if (this.deliverymanTotalPage < this.deliverymanCurrentPage) {
              this.deliverymanCurrentPage -= 1;
              this.getPagedDeliveryman(this.deliverymanCurrentPage);
            }
            console.log(this.deliverymanTotalPage);
          }
      );
    },
  },
};
</script>

<style lang="scss">
.pagination {
  text-align: center;
}

.bm-view {
  width: 100%;
  height: 300px;
}

.up-btn {
  width: 100%;
  display: inline-block;
  border: 0;
  background-color: white;
  text-align: right;
  cursor: pointer;
}

.el-table--scrollable-x .el-table__body-wrapper {
  z-index: 2;
}
</style>