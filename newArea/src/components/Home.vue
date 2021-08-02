<template>
<div>
  <el-menu
  :default-active="activeIndex1"
  class="el-menu-demo"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item index="2">首页</el-menu-item>
  <el-menu-item index="1">商品</el-menu-item>
    </el-menu>
    <div class="handle-box">
        国家
        <el-select v-model="selectValue.country"  @change="countrych(selectValue.country)" required :rules="rules" placeholder="请选择国家">
          <el-option
            v-for="item in countryinit"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        省
        <el-select v-model="selectValue.province"  @change="provincech(selectValue.province)" placeholder="请选择省">
          <el-option
            v-for="item in provinceinit"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select><!-- selectValue.regional  regionalinit[selectValue.regional]  regionalinit selectValue.province-->
        市
        <el-select v-model="selectValue.regional" placeholder="请选择市">
          <el-option
            v-for="item in regionalinit"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select><!--@change="regionalch(regionalinit[selectValue.regional-selectValue.province-1])" -->
        <el-button type="primary" @click="query(regionalinit[selectValue.regional-selectValue.province-1])" :rules="{required: true, message: '执行时间不能为空', trigger: 'blur'}">查询</el-button>
        <el-button type="primary" @click="Refresh">刷新</el-button>
      </div>
      <div class="handle-box">
        <el-button type="primary" @click="isAddup = true">新增</el-button>
        <el-button type="primary" @click="batchClick">批量</el-button>
      </div>
      <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" 
      style="width: 100%" 
      border
      @selection-change="handleSelectionChange"
      @cell-dblclick="dbtab"
      :header-cell-style="headerClass"
      :default-sort = "{prop: 'releaseTime', order: 'descending'}"
      >
        <el-table-column prop="date" type="selection" align="center" :selectable="selectable">
        </el-table-column>
        <el-table-column prop="index" label="序号" align="center">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="regional" label="地区部" align="center"></el-table-column>
        <el-table-column prop="name" label="商品" align="center"></el-table-column>
        <el-table-column prop="yesterDayPrice" label="昨日价格" align="center"></el-table-column>
        <el-table-column prop="todayPrice" label="今日价格" align="center"></el-table-column>
        <el-table-column prop="priceRate" label="价格浮动率" align="center"></el-table-column>
        <el-table-column prop="num" label="涨价数量" align="center"></el-table-column>
        <el-table-column prop="proportion" label="涨价占比" align="center"></el-table-column>
        <el-table-column prop="releaseTime" label="上架时间" align="center" sortable></el-table-column>
        <el-table-column prop="offTime" label="下架时间" align="center" sortable></el-table-column>
        <el-table-column  label="是否上架" align="center"> 
        <template slot-scope="scope">
          {{scope.row.isRelease | isUP(scope.row.isRelease)}}
        </template>
          </el-table-column>
        <el-table-column width="180px" label="操作" align="center" >
          <template slot-scope="scope">
            <el-button type="text" @click="read(scope.$index,scope.row)">查看</el-button>
            <el-button type="text" @click="upda(scope.$index,scope.row)" :disabled="scope.row.isRelease?false:true">编辑</el-button>
            <el-button type="text" @click="down(scope.row.isRelease,scope.row)" >{{scope.row.isRelease | rel(scope.row.isRelease)}}</el-button><!-- :disabled="scope.row.isRelease?false:true" -->
            <el-button type="text" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>

      <addup v-if="isAddup"
      @addcelclick="addcelclick" 
      @adddetclick="adddetclick" 
      @addcloclick="addcloclick">
      </addup><!--新增页面-->

      <updata v-if="isUpdata" 
      @updatacelclick="updatacelclick" 
      @updatadetclick="updatadetclick" 
      @updatacloclick="updatacloclick"
      :rowValue="rowValue"
      :provinced="pro"
      :updataindex="updataIndex"
      :upnowtime="upnowtime"
      :upnowtimed="upnowtimed"
      :nowtime="nowTime"
      >
      </updata><!--编辑页面-->

      <batch v-if="isBatch" 
      @batchcelclick="batchcelclick" 
      @batchdetclick="batchdetclick" 
      @batchcloclick="batchcloclick"
      :selectindex="selectindex"
      :upnowtime="upnowtime"
      :upnowtimed="upnowtimed"
      >
      </batch><!--批量页面-->

      <product-details v-if="isPro" 
      @procelclick="celclick" 
      @prodetclick="detclick" 
      @procloclick="cloclick" 
      :datapro="datapro" 
      :record="record" 
      :province="pro">
      </product-details><!--详情页面-->
    
</div>
</template>
<script>
import axios from 'axios'
import Addup from './Addup.vue'
import Updata from './Updata.vue'
import Batch from './Batch.vue'
import ProductDetails from './ProductDetails.vue'

export default {
  name: 'app',
  data () {
    return {
      country:'',
      province:'',
      regional:'',
      // rel:'',
      isAddup:false,
      isBatch:false,
      isPro:false,
      isUpdata:false,
      deldia:false,
      delspocerow:[],
      pageSize: 10,
      currentPage: 1,
      activeIndex1:'1',
      updataIndex:'',
      daleteIndex:'',
      uprelIndex:'',
      readIndex:'',
      selIndex:[],
      selectindex:[],
      // regionalname:'',//市名字
      tableData: [],
      selectValue:{
        country:'',
        province:'',
        regional:''
      },
      regionalall:[],
      countryinit:[],
      provinceinit:[],
      regionalinit:[],
      recordData:[],
      nowTime:'',
      uptime:'',
      upnowtime:{},
      upnowtimed:{},
      rules:{
        
      }
    }
  },
  components:{
    Addup,
    Batch,
    ProductDetails,
    Updata
  },
  created(){
    this.getData();
    this.getTime();
  },
  mounted(){
    setTimeout(()=>{//等待挂载数据
      this.getTabdata();
      this.getRegional();
      this.getRecordData();
    },200)
    setInterval(this.getTime,1000);
  },
  filters:{
    isUP(val){
      if(val==false){
       return'否'
      }else{
        return '是'
      }
    },
    rel(val){
      if(val==false){
        return '上架'
      }else{
        return '下架'
      }
    }
  },
  computed:{
    
  },
  methods:{
    //数据初始化
    getData(){//读取数据发送给Vuex
      axios.get("/data.json")
      .then((res) =>{
        this.$store.commit("dataTiopic",res.data);
      })
      axios.get("/regional.json")
      .then((res) =>{
        this.$store.commit("regionalTiopic",res.data);
      })
      axios.get("/recordData.json")
      .then((res) =>{
        this.$store.commit("recordDataTiopic",res.data);
      })
    },
    getTabdata(){//从Vuex获取数据
      this.tableData = this.$store.state.dataArr;//商品数据
    },
    getRegional(){
      this.countryinit = this.$store.state.regionalArr;//国家
    },
    getRecordData(){
      this.recordData = this.$store.state.recordDataArr;//商品详情数据
    },

    getTime(){//获取现在时间
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
      this.nowTime = yy + "年" + mm + "月" + dd + "日 " + hh + ":" + mf + ":" + ss + "  ";
      if(mm<10){
        this.uptime = yy + '-0' + mm + '-' + dd
      }else{
        this.uptime = yy + '-' + mm + '-' + dd
      }
      this.upnowtime = hh.toString() + mf.toString();
      this.upnowtimed = hh.toString() + ':' + mf.toString();
    },

    //国家、省、市 选择框查询
    countrych(e){
      this.provinceinit = this.countryinit[0].children;
    },
    provincech(e){
      this.regionalinit = this.provinceinit.filter((v)=>v.value==e)[0].children
    },

    //查询按钮
    query(e){
      if(e==undefined){
        this.getTabdata();
      }else{
        this.currentPage = 1;
        this.tableData = this.$store.state.dataArr.filter((v)=>e.label.indexOf(v.regional)!=-1);
        this.$message({
          message: "查询成功！",
          type: "success",
          center: true,
        })
      }
    },

    //批量按钮
    batchClick(){
      if(this.selectindex.length!=0){
        this.isBatch = true;
      }else{
        this.$message({
          message: "请选择需要修改的商品",
          type: "warning",
          center: true,
        }) 
      }
    },

    //查看按键
    read(e,row){
      this.datapro = row;//当前行商品信息
      this.record = this.recordData;//传给商品详情操作记录
      let r = row.regional;//当前行市
      if(r.indexOf('市场')!=-1){//判断是否是市场
        this.pro = [{label:'广东'}]
      }else{
        this.pro = this.countryinit[0].children.filter((v)=>v.children.filter((i)=>i.label.indexOf(r)!=-1).length == 1);//传给商品详情省份
      }
      this.isPro = true;//打开商品详情对话框
    },

    //编辑按键
    upda(e,row){
      this.rowValue = row;//当前行商品信息
      let r = row.regional;//当前行市
      if(r.indexOf('市场')!=-1){//判断是否是市场
        this.pro = [{label:'广东'}]
      }else{
        this.pro = this.countryinit[0].children.filter((v)=>v.children.filter((i)=>i.label.indexOf(r)!=-1).length == 1);//传给商品详情省份
      }
      for(let i=0;i<this.tableData.length;i++){
        if(this.tableData[i]==row){
          this.updataIndex = i;
        }
      }//得到当前行在表格中的数据
      this.isUpdata = true;//打开编辑对话框
    },

    //下架按键
    down(e,r){
      this.$store.commit('uprel',{
        isRelease:e,
        // uprelIndex:this.uprelIndex,
        uptime:this.uptime,
        row:r
      });
      if(!e){
        this.$message({
          message: "上架成功！",
          type: "success",
          center: true,
        })
      }else{
        this.$message({
          message: "下架成功！",
          type: "success",
          center: true,
        })
      }
       
    },

    //删除按键 弹出提示框
    del(e){
      this.$confirm("是否删除" + e.regional + "的商品:" + e.name, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{
        this.$store.commit('deleteState',{
          deleteIndex:this.deleteIndex,
          row:e
        })
        this.$message({
          message: "删除成功！",
          type: "success",
          center: true,
        }) 
      })
    },

    //多选框事件
    handleSelectionChange(e){
        for(let i=0;i<this.tableData.length;i++){
            for(let j=0;j<e.length;j++){
              if(this.tableData[i]==e[j]){
                this.selIndex.push(i)
              }
            } 
        }
          this.selectindex = [...new Set(this.selIndex)]     
    },

    //多选框禁用判断
    selectable(row, index){
      if(row.isRelease==false){
        return false
      }else{
        return true
      }
    },

    //刷新按钮
    Refresh(){
      this.getTabdata();
      this.regionalinit = [];
      this.selectValue.regional = '';
      this.provinceinit = [];
      this.selectValue.province = '';
      this.selectValue.country = '';
      this.currentPage = 1;
      // location.reload();//页面重加载

      // console.log(this.nowTime);
    },

    dbtab(row, column, cell, event){

    },


    //商品详情 关闭组件内容
    celclick(){
      this.isPro = false;
    },
    detclick(){
      this.isPro = false;
    },
    cloclick(){
      this.isPro = false;
    },

    //新增 关闭组件内容
    addcloclick(){
      this.isAddup = false;
    },
    adddetclick(e){
      let redata = {
        name:e.name,
        time:this.nowTime,
        record:"新增"
      }
      this.$store.commit('recordDataState',redata)
      this.isAddup = false;
    },
    addcelclick(){
      this.isAddup = false;
    },

    //编辑 关闭组件内容
    updatacloclick(){
      this.isUpdata = false;
    },
    updatadetclick(e){
      this.isUpdata = false;
    },
    updatacelclick(){
      this.isUpdata = false;
    },

    //批量编辑 关闭组件内容
    batchcloclick(){
      this.isBatch = false;
      this.selectindex = []
    },
    batchdetclick(){
      this.isBatch = false;
      this.selectindex = []
    },
    batchcelclick(){
      this.isBatch = false;
      this.selectindex = []
    },

    //分页
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },

    //表头样式
    headerClass() {
      return "background:RGB(238,239,246);";
    },
  },
}
</script>
<style scoped>
  .table {
    width: 100%;
    font-size: 14px;
  }
  .el-link{
    padding: 2px;
  }
  .handle-box {
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .handle-input {
    width: 300px;
    display: inline-block;
  }
</style>