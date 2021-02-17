<template>
  <div>
    <el-card>
      <div slot="header">
        货品管理
        <el-button
            type="success"
            icon="el-icon-plus"
            circle
            size="mini"
            @click="addInventoryVisible = true"
        ></el-button>
      </div>
      <el-table :data="inventoryData" height="calc(100vh - 200px)">
        <el-table-column prop="id" label="编号" width="50"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                @click="
                api(
                  '/management/remove_inventory',
                  { id: scope.row.id },
                  deleteInventoryCallback
                )
              ">
              删除
            </el-button>
            <el-button
                type="text"
                size="small"
                @click="
                  getInventoryInWarehouse(scope.row.id);
                  currentInventoryId = scope.row.id;
                  changeInventoryVisible = true;
                  inventoryInWarehouse = null;
                "
            >
              更改库存数
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="货品名称" width="250">
        </el-table-column>
        <el-table-column prop="comment" label="备注" width="150"></el-table-column>
        <el-table-column prop="total_number" label="货品总数" width="150"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            :current-page="inventoryCurrentPage"
            background
            layout="prev, pager, next"
            :page-count="inventoryTotalPage"
            class="pagination"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!--新增货品模态框-->
    <el-dialog title="新增货品" :visible.sync="addInventoryVisible">
      <el-form
          :rules="addWarehouseRules"
          ref="inventoryAddForm"
          :model="inventoryAddForm"
      >
        <el-form-item prop="name" label="货品名称">
          <el-input
              placeholder="货品名"
              v-model="inventoryAddForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="comment" label="货品备注">
          <el-input
              type="textarea"
              placeholder="货品备注"
              v-model="inventoryAddForm.comment"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              @click="
                submitForm('inventoryAddForm', (data) => {
                  api('/management/add_inventory', data, addInventoryCallback);
                })
              "
          >新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--改变货品数量模态框-->
    <el-dialog title="更改库存数量" :visible.sync="changeInventoryVisible">
      <div v-if="inventoryInWarehouse !== null">
        <baidu-map :center="{lng: 116.404, lat: 39.915}" :zoom="2" style="width: 100%; height: 300px"
                   :scrollWheelZoom="true">
          <bm-marker :key="warehouse.id" :position="{'lng': warehouse.lng, 'lat': warehouse.lat}" :dragging="false"
                     v-for="warehouse of inventoryInWarehouse"
                     @click="warehouse.showEdit = true;">
            <bm-info-window
                :show="warehouse.showEdit"
                @close="warehouse.showEdit = false"
                @open="warehouse.showEdit = true">
              <el-form>
                <el-form-item>
                  <el-col :span="13">
                    <el-input
                        placeholder="新增数-可为负"
                        size="mini"
                        style="display: inline"
                        type="number"
                        v-model="warehouse.changeNumber"
                    ></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-button
                        type="primary"
                        size="mini"
                        style="display: inline"
                        @click="
                          changeInventoryVisible = false;
                          change_inventory_num(currentInventoryId, warehouse.id, warehouse.changeNumber * 1);
                        ">
                      新增库存
                    </el-button>
                  </el-col>
                </el-form-item>
              </el-form>
            </bm-info-window>
            <bm-label :content="warehouse.name + '<br/>库存数量: ' + warehouse.number"
                      :labelStyle="{color: 'red', fontSize : '0.7em'}"
                      :offset="{width: -35, height: 30}"
            />
          </bm-marker>
        </baidu-map>
      </div>
      <div v-else>
        <div class="el-icon-loading"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {api} from "@/utils";

export default {
  name: "Inventory",
  mounted() {
    this.getPagedInventory(0);
  },
  data() {
    return {
      showMapVar: false,
      inventoryData: [],
      inventoryCurrentPage: 0,
      inventoryTotalPage: 1,
      inventoryAddForm: {
        name: "",
        comment: "",
      },
      inventoryInWarehouse: null,
      addInventoryVisible: false,
      changeInventoryVisible: false,
      currentInventoryId: null,
      addWarehouseRules: {
        name: [{required: true, message: "货品名称不可为空", trigger: "blur"}],
        comment: [{required: true, message: "货品备注不可为空", trigger: "blur"}]
      },
    };
  },
  methods: {
    log: console.log,
    api,
    handleCurrentChange(val) {
      this.inventoryCurrentPage = val;
      this.getPagedInventory(val);
    },
    closeMap() {
      setTimeout(() => (this.showMapVar = false), 300);
    },
    showMap() {
      this.showMapVar = true;
    },
    getSearchRes(res) {
      let point = res.point;
      this.inventoryAddForm.lat = point.lat;
      this.inventoryAddForm.lng = point.lng;
      console.log(this.inventoryAddForm);
    },
    submitForm(formName, successCallback) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          successCallback(this[formName]);
        } else {
          return false;
        }
      });
    },
    deleteInventoryCallback() {
      this.getPagedInventory(this.inventoryCurrentPage);
    },
    addInventoryCallback() {
      this.getPagedInventory(this.inventoryCurrentPage);
      this.addInventoryVisible = false;
      this.inventoryAddForm = {
        name: "",
        comment: "",
      };
    },
    getPagedInventory(page) {
      api.bind(this)(
          "/management/get_inventory",
          {
            page,
            per_page: 10,
          },
          (response) => {
            this.inventoryData = response.data.columns;
            this.inventoryTotalPage = response.data.total_page;
            if (this.inventoryTotalPage < this.inventoryCurrentPage) {
              this.inventoryCurrentPage -= 1;
              this.getPagedInventory(this.inventoryCurrentPage);
            }
            console.log(this.inventoryTotalPage);
          }
      );
    },
    getInventoryInWarehouse(id) {
      api.bind(this)(
          "/management/get_inventory_in_warehouse",
          {
            id
          },
          (response) => {
            this.inventoryInWarehouse = response.data.map((data) => {
              data.showEdit = false;
              data.changeNumber = 0;
              return data;
            });
          }
      )
    },
    change_inventory_num(iid, wid, number) {
      api.bind(this)(
          "/management/change_inventory_num",
          {
            iid,
            wid,
            number
          },
          () => {
            this.getInventoryInWarehouse(this.currentInventoryId);
            this.getPagedInventory(this.inventoryCurrentPage);
          }
      )
    }
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