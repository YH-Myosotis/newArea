<template>
<!--编辑界面-->
    <div id='updata'>
        <el-dialog
        title="编辑"
        :visible.sync="dialogVisible"
        @close='closeDialog'
        >
        <h2>时间：{{this.upnowtimed}}</h2>
        <el-form :inline="true" :model="selectValue" :rules="rules">
            <el-form-item label="国家">
                <el-input value="中国" :disabled="true" placeholder="中国"></el-input>
            </el-form-item>
            <el-form-item label="省">
                <el-select v-model="selectValue.province" placeholder="请选择省" @change="provincech(selectValue.province)">
                    <el-option
                        v-for="item in getProdata"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="市">
                <el-select v-model="selectValue.regional" placeholder="请选择市" 
                @click="rech(selectValue.regional)"
                >
                    <el-option
                        v-for="item in regionalinit"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品" prop="name">
                <el-input v-model="selectValue.name"></el-input>
            </el-form-item>
            <el-form-item label="今日价格" prop="todayPrice">
                <el-input v-model.number="selectValue.todayPrice" :disabled="upseltime"></el-input>
            </el-form-item>
            <el-form-item label="昨日价格">
                <el-input v-model="selectValue.yesterDayPrice" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="价格浮动率">
                <el-input v-model="selectValue.priceRate" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="涨价数量" prop="num" >
                <el-input v-model.number="selectValue.num"></el-input>
            </el-form-item>
            <el-form-item label="涨价占比">
                <el-input v-model="selectValue.proportion" :disabled="true"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="determine">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
var c = 0;
var cc = 0;
var ccc = 0;
export default{
    name:'updata',
    props:{
        'rowValue':Object,
        'provinced':Array,
        'updataindex':Number,
        'upnowtime':String,
        'upnowtimed':String,
        'nowtime':String
    },
    data(){
        var validateNum = (rule, value, callback) => {
            if (!value) {
                c = 1;
            return callback(new Error('涨价数量不能为空'));
            } else {
            if (!Number.isInteger(value)) {
                c = 1;
               return callback(new Error('请输入数字值'));
            }
            c= 0;
            callback();
            }
        };
        var validatetodayPrice = (rule, value, callback) => {
            if (!value) {
                cc = 1;
            return callback(new Error('今日价格不能为空'));
            } else {
            if (!Number.isInteger(value)) {
                cc = 1;
               return callback(new Error('请输入数字值'));
            }
            cc= 0;
            callback();
            }
        };
        var validateName = (rule, value, callback) => {
            if (value=='') {
                ccc = 1;
            return callback(new Error('商品名称不能为空'));
            } else {
            ccc= 0;
            callback();
            }
        };
        return{
            dialogVisible:true,
            uptime:'',
            selectValue:{
                province:this.provinced[0].label,
                regional:this.rowValue.regional,
                name:this.rowValue.name,
                todayPrice:this.rowValue.todayPrice,
                yesterDayPrice:this.rowValue.yesterDayPrice,
                priceRate:this.rowValue.priceRate,
                num:this.rowValue.num,
                proportion:this.rowValue.proportion
            },
            chname:[],
            chyesterDayPrice:[],
            chtodayPrice:[],
            chnum:[],
            // regionalinit:[],
            rules: {
                num: [{validator: validateNum,trigger: 'blur'}],
                todayPrice: [{validator: validatetodayPrice,trigger: 'blur'}],
                name:[{validator: validateName,trigger: 'blur'}]
            }
        }
    },
    computed:{
        getProdata(){
            return this.$store.state.regionalArr[0].children;
        },
        upseltime(){//判断5-7  17-19：30可修改今日价格
            if((parseInt(this.upnowtime)>=500 && parseInt(this.upnowtime)<= 700)||(parseInt(this.upnowtime)>=1700 && parseInt(this.upnowtime)<= 1930)){
                return false
            }else{
                return true
            }
        },
        regionalinit(){
            return this.getProdata.filter((v)=>v.label==this.selectValue.province)[0].children;
        }
    },
    methods:{
        provincech(e){
            this.selectValue.regional = '';
        },
        cancel() {
            this.$emit('updatacelclick');
        },
        determine(){
            if(c==0 && cc==0 && ccc==0){
                let n = this.upnowtime?1:0;//判断今日价格是否可修改
                let newdate ={
                regional: this.selectValue.regional,
                name: this.selectValue.name,
                todayPrice: this.selectValue.todayPrice,
                yesterDayPrice: this.selectValue.yesterDayPrice,
                priceRate: ((this.selectValue.todayPrice - this.selectValue.yesterDayPrice)*0.01).toFixed(2),
                num:this.selectValue.num,
                proportion:((this.selectValue.todayPrice - this.selectValue.yesterDayPrice) / this.selectValue.yesterDayPrice).toFixed(2),
                releaseTime: this.rowValue.releaseTime,
                isRelease: this.rowValue.isRelease,
                offTime: this.rowValue.offTime,
                invalid:0
                }

                //修改操作记录
                if(this.selectValue.name!=this.rowValue.name){
                    this.chname.push(this.rowValue.name);
                    this.chname.push(this.selectValue.name);
                }else{
                    this.chname.push(this.rowValue.name);
                }
                if(this.selectValue.yesterDayPrice!=this.rowValue.yesterDayPrice){
                    this.chyesterDayPrice.push(this.rowValue.yesterDayPrice);
                    this.chyesterDayPrice.push(this.selectValue.yesterDayPrice);
                }
                if(this.selectValue.todayPrice!=this.rowValue.todayPrice){
                    this.chtodayPrice.push(this.rowValue.todayPrice);
                    this.chtodayPrice.push(this.selectValue.todayPrice);
                }
                if(this.selectValue.num!=this.rowValue.num){
                    this.chnum.push(this.rowValue.num);
                    this.chnum.push(this.selectValue.num);
                }
                let chdate = {
                    chname:this.chname,
                    chyesterDayPrice:this.chyesterDayPrice,
                    chtodayPrice:this.chtodayPrice,
                    chnum:this.chnum,
                    nowtime:this.nowtime
                }
                if(Object.values(this.selectValue).filter((v)=>v=='').length!=0){//判断是否有输入框未输入
                    this.$message({
                      message: "请填写完全部信息！",
                      type: "warning",
                      center: true,
                    }) 
                }else{
                    this.$store.dispatch('aUpdateState',{
                        newdate:newdate,
                        updataindex:this.updataindex,
                        rowValue:this.rowValue
                    });//actions异步调用mutations修改信息
                    this.$emit('updatadetclick',chdate);//传给父组件关闭对话框
                    this.$store.commit('recordupDataState',chdate);//将数据传给Vuex修改操作记录

                    this.$message({
                      message: "修改成功！",
                      type: "success",
                      center: true,
                    }) 
                }
                
            }
        },
        closeDialog(){
            this.$emit('updatacloclick');
            this.dialogVisible = true;
        },
    }
}
</script>
<style scoped>
.add-item-text{
    display: inline-block;
    padding: 20px;
}
</style>