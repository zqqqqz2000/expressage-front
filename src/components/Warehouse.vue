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
      <el-table class="table">
        <el-table-column :data="warehouseData">
          <template slot-scope="scope">
            <el-button @click="scope">查看</el-button>
            <el-button @click="scope">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000"
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
        <el-form-item prop="address" label="详细地址">
          <el-input
            @focus="showMap"
            @blur="closeMap"
            placeholder="仓库详细地址"
            type="textarea"
            v-model="warehouseAddForm.address"
            @change="
              warehouseAddForm.lng = null;
              warehouseAddForm.lat = null;
            "
          ></el-input>
          <div v-if="showMapVar">
            <button class="up-btn" @click="closeMap">
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
                :keyword="warehouseAddForm.address"
                :auto-viewport="true"
                location="中国"
              ></bm-local-search>
            </baidu-map>
          </div>
        </el-form-item>
        <el-form-item v-if="!showMapVar">
          <el-button type="primary">创建仓库</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Warehouse",
  data() {
    return {
      showMapVar: false,
      warehouseData: {},
      warehouseAddForm: {
        address: "",
        name: "",
        lng: null,
        lat: null,
      },
      addWarehouseVisible: false,
      addWarehouseRules: {
        name: [{ required: true, message: "仓库名不可为空", trigger: "blur" }],
        address: [
          { required: true, message: "仓库名不可为空", trigger: "blur" },
          { validator: this.addressFormValidator, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
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
    addressFormValidator(rule, value, callback) {
      setTimeout(() => {
        if (!this.warehouseAddForm.lng || !this.warehouseAddForm.lat) {
          callback(new Error("请在地图上选择地址"));
          return;
        }
      }, 500);
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