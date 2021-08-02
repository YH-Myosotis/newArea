<template>
<!--批量编辑-->
    <div id='batch'>
        <el-dialog
        title="批量编辑"
        :visible.sync="dialogVisible"
        @close='closeDialog'
        >
        <h2>时间：{{this.upnowtimed}}</h2>
        <el-form :inline="true" :model="selectValue" :rules="rules">
            <el-form-item label="今日价格">
                <el-input v-model.number="selectValue.todayPrice" :disabled="upseltime"></el-input>
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
export default{
    name:'batch',
    props:{
        'selectindex':Array,
        'upnowtime':String,
        'upnowtimed':String,
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
        return{
            dialogVisible:true,
            selectValue:{
                todayPrice:'',
                yesterDayPrice:'',
                priceRate:'',
                num:'',
            },
            regionalinit:[],
            rules: {
                num: [{validator: validateNum,trigger: 'blur'}],
                yesterDayPrice: [{validator: validateyesterDayPrice,trigger: 'blur'}]      
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
        }
    },
    methods:{
        provincech(e){
            this.regionalinit = this.getProdata.filter((v)=>v.label==e)[0].children
        },
        cancel() {
            this.$emit('batchcelclick');
        },
        determine(){
            let n = this.upnowtime?1:0;//判断今日价格是否可修改
            if(Object.values(this.selectValue).filter((v)=>v=='').length==1+n){//判断是否输入所有输入框
                if(c==0 && cc==0){
                    this.$store.dispatch('aBatchState',{
                    selectindex:this.selectindex,
                    selectValue:this.selectValue,
                    n:n
                    });
                    this.$emit('batchdetclick');
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
            this.$emit('batchcloclick');
            this.dialogVisible = true;
        },
    }

}
</script>