<template>
<!--新增界面-->
    <div id='add-up'>
        <el-dialog
        title="新增"
        :visible.sync="dialogVisible"
        @close='closeDialog'
        >
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
                <el-select v-model="selectValue.regional" placeholder="请选择市" @change="regionalch(selectValue.regional)">
                    <el-option
                        v-for="item in regionalinit"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品">
                <el-input v-model="selectValue.name"></el-input>
            </el-form-item>
            <el-form-item label="今日价格" prop="todayPrice">
                <el-input v-model.number="selectValue.todayPrice"></el-input>
            </el-form-item>
            <el-form-item label="昨日价格" prop="yesterDayPrice">
                <el-input v-model.number="selectValue.yesterDayPrice"></el-input>
            </el-form-item>
            <el-form-item label="价格浮动率">
                <el-input v-model="selectValue.priceRate" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="涨价数量" prop="num">
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
    name:'addup',
    props:{
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
        var validateyesterDayPrice = (rule, value, callback) => {
            if (!value) {
                cc = 1;
            return callback(new Error('昨日价格不能为空'));
            } else {
            if (!Number.isInteger(value)) {
                cc = 1;
               return callback(new Error('请输入数字值'));
            }
            cc= 0;
            callback();
            }
        };
        var validatetoDayPrice = (rule, value, callback) => {
            if (!value) {
                ccc = 1;
            return callback(new Error('今日价格不能为空'));
            } else {
            if (!Number.isInteger(value)) {
                ccc = 1;
               return callback(new Error('请输入数字值'));
            }
            ccc= 0;
            callback();
            }
        };
        return{
            dialogVisible:true,
            uptime:'',
            selectValue:{
                province:'',
                regional:'',
                name:'',
                todayPrice:'',
                yesterDayPrice:'',
                priceRate:'',
                num:'',
                proportion:''
            },
            inputValue:{
                
            },
            regionalinit:[],
            rules: {
                num: [{validator: validateNum,trigger: 'blur'}],
                yesterDayPrice: [{validator: validateyesterDayPrice,trigger: 'blur'}],
                todayPrice: [{validator: validatetoDayPrice,trigger: 'blur'}]       
            }
        }
    },
    computed:{
        getProdata(){
            return this.$store.state.regionalArr[0].children;
        },
    },
    methods:{
        provincech(e){
            this.selectValue.regional = '';
            this.regionalinit = this.getProdata.filter((v)=>v.label==e)[0].children
        },
        regionalch(e){
            if(e=='深圳市'){
                this.selectValue.todayPrice = 5.6;
                this.selectValue.priceRate = 0.2;
                this.selectValue.num = 5;
                this.selectValue.proportion = 1.5;
            }else{
                this.selectValue.todayPrice = '';
                this.selectValue.priceRate = '';
                this.selectValue.num = '';
                this.selectValue.proportion = '';
            }
        },
        cancel() {
            this.$emit('addcelclick');
        },
        determine(){
            if(this.selectValue.regional=='深圳市'){
                this.getTime();
                let newdate = {
                    regional: this.selectValue.regional,
                    name: this.selectValue.name,
                    todayPrice: this.selectValue.todayPrice,
                    yesterDayPrice: this.selectValue.yesterDayPrice,
                    priceRate: this.selectValue.priceRate,
                    num:this.selectValue.num,
                    proportion:this.selectValue.proportion,
                    releaseTime: '',
                    isRelease: false,
                    offTime: "",
                    invalid:0
                }
                if(Object.values(this.selectValue).filter((v)=>v=='').length!=0){
                    this.$message({
                      message: "请填写完全部信息！",
                      type: "warning",
                      center: true,
                    }) 
                }else{
                    if(c==0 && cc==0 && ccc==0){
                        this.$store.dispatch('aAddState',newdate);
                        this.$emit('adddetclick',newdate);
                    }
                }
            }else if(Object.values(this.selectValue).filter((v)=>v=='').length==2){//判断是否输入所有输入框
                this.getTime();
                let newdate = {
                    regional: this.selectValue.regional,
                    name: this.selectValue.name,
                    todayPrice: this.selectValue.todayPrice,
                    yesterDayPrice: this.selectValue.yesterDayPrice,
                    priceRate: ((this.selectValue.todayPrice - this.selectValue.yesterDayPrice)*0.01).toFixed(2),
                    num:this.selectValue.num,
                    proportion:((this.selectValue.todayPrice - this.selectValue.yesterDayPrice) / (this.selectValue.yesterDayPrice*10)).toFixed(2),
                    releaseTime: '',
                    isRelease: false,
                    offTime: "",
                    invalid:0
                }
                if(c==0 && cc==0 && ccc==0){
                    this.$store.dispatch('aAddState',newdate);
                    this.$emit('adddetclick',newdate);
                }
            }else{
                this.$message({
                  message: "请填写完全部信息！",
                  type: "warning",
                  center: true,
                }) 
            }
            
        },
        closeDialog(){
            this.$emit('addcloclick');
            this.dialogVisible = true;
        },
        getTime(){//获取现在时间
            let yy = new Date().getFullYear();
            let mm = new Date().getMonth() + 1;
            let dd = new Date().getDate();
            let hh = new Date().getHours();
            let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
            let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
            // this.nowTime = yy + "年" + mm + "月" + dd + "日 " + hh + ":" + mf + ":" + ss + "  ";
            if(mm<10){
                this.uptime = yy + '-0' + mm + '-' + dd
            }else{
                this.uptime = yy + '-' + mm + '-' + dd
            }

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