<template>
  <div>
    <el-card>
      <div slot="header">
        仓库管理
        <el-button
          type="success"
          icon="el-icon-add-location"
          circle
          size="mini"
          @click="addWarehouseVisible = true"
        ></el-button>
      </div>
      <el-table class="table" :data="warehouseData">
        <el-table-column fixed prop="id" label="编号" width="50">
        </el-table-column>
        <el-table-column fixed prop="name" label="仓库名称" width="250">
        </el-table-column>
        <el-table-column fixed prop="lng" label="经度" width="150">
        </el-table-column>
        <el-table-column fixed prop="lat" label="维度" width="150">
        </el-table-column>
        <el-table-column fixed prop="location" label="定位地址" width="300">
        </el-table-column>
        <el-table-column
          fixed
          prop="specific_location"
          label="详细地址"
          width="350"
        ></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small">删除{{ scope.id }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model="warehouseCurrentPage"
          background
          layout="prev, pager, next"
          :total="warehouseTotalPage"
          class="pagination"
        />
      </div>
    </el-card>
    <el-dialog title="新增仓库" :visible.sync="addWarehouseVisible">
      <el-form
        :rules="addWarehouseRules"
        ref="warehouseAddForm"
        :model="warehouseAddForm"
      >
        <el-form-item prop="name" label="仓库名称">
          <el-input
            placeholder="仓库名"
            v-model="warehouseAddForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="location" label="定位地址">
          <el-input
            @focus="showMap"
            @blur="closeMap"
            placeholder="仓库详细地址"
            type="textarea"
            v-model="warehouseAddForm.location"
            @change="
              warehouseAddForm.lng = null;
              warehouseAddForm.lat = null;
            "
          ></el-input>
          <div v-if="showMapVar">
            <button class="up-btn" @click="closeMap" type="button">
              <div class="el-icon-arrow-up"></div>
            </button>
            <baidu-map
              class="bm-view"
              center="北京"
              :zoom="3"
              :scrollWheelZoom="true"
            >
              <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
              <bm-local-search
                @infohtmlset="getSearchRes"
                ref="map"
                :keyword="warehouseAddForm.location"
                :auto-viewport="true"
                location="中国"
              ></bm-local-search>
            </baidu-map>
          </div>
        </el-form-item>
        <div v-show="!showMapVar">
          <el-form-item prop="specific_location" label="详细地址">
            <el-input
              placeholder="详细地址"
              v-model="warehouseAddForm.specific_location"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="
                submitForm('warehouseAddForm', (data) => {
                  api('/management/add_warehouse', data, addWarehouseCallback);
                })
              "
              >创建仓库</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { api } from "../utils";

export default {
  name: "Warehouse",
  mounted() {
    this.getPagedWarehouse(0);
  },
  data() {
    return {
      showMapVar: false,
      warehouseData: [],
      warehouseCurrentPage: 0,
      warehouseTotalPage: 1,
      warehouseAddForm: {
        location: "",
        name: "",
        specific_location: "",
        lng: null,
        lat: null,
      },
      addWarehouseVisible: false,
      addWarehouseRules: {
        name: [{ required: true, message: "仓库名不可为空", trigger: "blur" }],
        location: [
          {
            required: true,
            message: "请填写定位地址并在地图下拉框中勾选地址",
            trigger: "blur",
          },
          { validator: this.locationFormValidator, trigger: "blur" },
        ],
        specific_location: [
          { required: true, message: "详细地址不可为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    api,
    closeMap() {
      setTimeout(() => (this.showMapVar = false), 300);
    },
    showMap() {
      this.showMapVar = true;
    },
    getSearchRes(res) {
      let point = res.point;
      this.warehouseAddForm.lat = point.lat;
      this.warehouseAddForm.lng = point.lng;
      console.log(this.warehouseAddForm);
    },
    locationFormValidator(rule, value, callback) {
      setTimeout(() => {
        if (!this.warehouseAddForm.lng || !this.warehouseAddForm.lat) {
          callback(new Error("请在地图上选择地址"));
          return;
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
    addWarehouseCallback() {
      this.getPagedWarehouse(this.warehouseCurrentPage);
    },
    getPagedWarehouse(page) {
      api.bind(this)(
        "/management/get_warehouses",
        {
          page,
          per_page: 200,
        },
        (response) => {
          this.warehouseData = response.data.columns;
          this.warehouseTotalPage = response.data.total_page;
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

.table {
  height: calc(100vh - 200px);
}
</style>