<template>
<!-- 商品详情 -->
    <div id='product-details'>
        
        <el-dialog
        title="详情"
        :visible.sync="dialogVisible"
        @close='closeDialog'
        >
        <div class="pro">
            <p>基本信息</p>
            <div class="pro-item">
                <div class="pro-item-text">
                    <span>国家:</span>
                    <span>中国</span>
                </div>
                <div class="pro-item-text">
                    <span>省:</span>
                    <span>{{this.province[0].label}}</span>
                </div>
                <div class="pro-item-text">
                    <span>市:</span>
                    <span>{{this.datapro.regional}}</span>
                </div>
            </div>
            <div class="pro-item">
                <div class="pro-item-text">
                    <span>商品:</span>
                    <span>{{this.datapro.name}}</span>
                </div>
                <div class="pro-item-text">
                    <span>今日价格:</span>
                    <span>{{this.datapro.todayPrice}}</span>
                </div>
                <div class="pro-item-text">
                    <span>昨日价格:</span>
                    <span>{{this.datapro.yesterDayPrice}}</span>
                </div>
            </div>
            <div class="pro-item">
                <div class="pro-item-text">
                    <span>价格浮动率:</span>
                    <span>{{this.datapro.priceRate}}</span>
                </div>
                <div class="pro-item-text">
                    <span>涨价数量:</span>
                    <span>{{this.datapro.num}}</span>
                </div>
                <div class="pro-item-text">
                    <span>涨价占比:</span>
                    <span>{{this.datapro.proportion}}</span>
                </div>
            </div>
        </div>
        <p>操作记录</p>
        <el-table :data="record" style="width: 100%" :header-cell-style="headerClass">
            <el-table-column prop="name" label="商品" align="center"></el-table-column>
            <el-table-column prop="record" label="操作记录" align="center"></el-table-column>
            <el-table-column prop="time" label="时间" align="center"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="eee">取 消</el-button> -->
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="determine">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default{
    name:'productdetails',
    props:{
        'datapro':Object,
        'record':Array,
        'province':Array
    },
    data(){
        return{
            dialogVisible:true,
            tableData:[],
            name:'',
            Operation:'',
            time:''
        }
    },
    methods:{
        cancel() {
            this.$emit('procelclick');
        },
        determine(){
            this.$emit('prodetclick');
        },
        closeDialog(){
            this.$emit('procloclick');
            this.dialogVisible = true;
        },
        //表头样式
        headerClass() {
            return "background:linear-gradient(to top,	#6495ED,20%, #409EFF);color:#fff";
        },
    }

}
</script>

<style scoped>
.pro{
    border: 1px solid #ddd;
    margin: -20px;
    margin-bottom: 20px;
}
.pro p{
    padding: 0 0 0 20px;
}
.pro-item{
    margin: -20px;
}
.pro-item-text{
    display: inline-block;
    margin: 40px 40px 40px 120px;
    /* text-align: center; */
}
/* .el-table-column th{
    background-color: red;
} */
span{
    padding: 3px;
}
/* .headerClass{
    background-color: red;
} */
</style>