import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    visibleValue: false,
    uptime:'',
    dataArr: [],
    recordDataArr: [],
    regionalArr: []
  },
  mutations: {
    dataTiopic(state, payload) {
      state.dataArr = payload;
      // console.log(payload);
      let n = [];
      // let o = {};
      payload.forEach(v=>n.push(v.releaseTime));
      // console.log(n);
      // n.sort(v=>(a,b)=>a[v]-b[v])
      // n.sort()
      // payload.forEach(v=>o.add(v))
      // console.log(n);
      // console.log(o);
      // function compare(property){
      //   return function(a,b){
      //     let value1 = a[property];
      //     let value2 = b[property];
      //     return value1 - value2;
      //   }
      // }
      // let nn = payload.sort(compare('releaseTime'))
      // let nn = payload.sort(c=>(a,b)=>a[releaseTime]-b[releaseTime])
      // let nn = payload.sort((a,b)=>parseInt(a.releaseTime.splice(4,1).splice(6,1))-parseInt(b.releaseTime.splice(4,1).splice(6,1)))
      console.log(nn);
    },
    recordDataTiopic(state, payload) {
        state.recordDataArr = payload;
    },
    regionalTiopic(state, payload) {
        state.regionalArr = payload;
    },
    adddateState(state,adsta){//新增
      state.dataArr.push(adsta)//unshift
    },
    updateState(state,payload){//修改表格数据
      for(let i=0;i<state.dataArr.length;i++){//查询当前行在表格数据中的位置
        if(state.dataArr[i]==payload.rowValue){
          state.dataArr.splice(i,1,payload.newdate)
        }
      }
    },
    deleteState(state,payload){//删除
      for(let i=0;i<state.dataArr.length;i++){//查询当前行在表格数据中的位置
        if(state.dataArr[i]==payload.row){
          state.dataArr.splice(i,1)
        }
      }
    },
    uprel(state,payload){//修改上下架信息
      for(let i=0;i<state.dataArr.length;i++){//查询当前行在表格数据中的位置
        if(state.dataArr[i]==payload.row){
          state.dataArr[i].isRelease = !payload.isRelease;
          if(!payload.isRelease){
            this.state.dataArr[i].releaseTime = payload.uptime;
          }else{
            this.state.dataArr[i].offTime = payload.uptime
          }
        }
      }
    },
    batchState(state,payload){//批量修改
      for(let i=0;i<payload.selectindex.length;i++){
        if(payload.n==0){
          state.dataArr[payload.selectindex[i]].todayPrice = payload.selectValue.todayPrice
          state.dataArr[payload.selectindex[i]].priceRate = ((payload.selectValue.todayPrice - payload.selectValue.yesterDayPrice)*0.01).toFixed(2)
          state.dataArr[payload.selectindex[i]].proportion = ((payload.selectValue.todayPrice - payload.selectValue.yesterDayPrice) / (payload.selectValue.yesterDayPrice*10)).toFixed(2)
        }else{
          state.dataArr[payload.selectindex[i]].priceRate = ((state.dataArr[payload.selectindex[i]].todayPrice - payload.selectValue.yesterDayPrice)*0.01).toFixed(2)
          state.dataArr[payload.selectindex[i]].proportion = ((state.dataArr[payload.selectindex[i]].todayPrice - payload.selectValue.yesterDayPrice) / (payload.selectValue.yesterDayPrice)).toFixed(2)
        }
        state.dataArr[payload.selectindex[i]].yesterDayPrice = payload.selectValue.yesterDayPrice
        state.dataArr[payload.selectindex[i]].num = payload.selectValue.num
        
      }
    },
    recordDataState(state,payload){
      state.recordDataArr.push(payload);
    },
    recordupDataState(state,payload){
      if(payload.chname.length>1){
        let r ={
          name:payload.chname[0],
          time:payload.nowtime,
          record:"商品名称从:" + payload.chname[0] + ",改为:" +  payload.chname[1]
        }
        state.recordDataArr.push(r);
      }
      if(payload.chnum.length!=0){
        let r ={
          name:payload.chname[0],
          time:payload.nowtime,
          record:"涨价数量从:" + payload.chnum[0] + ",改为:" +  payload.chnum[1]
        }
        state.recordDataArr.push(r);
      }
      if(payload.chtodayPrice.length!=0){
        let r ={
          name:payload.chname[0],
          time:payload.nowtime,
          record:"今日价格从:" + payload.chtodayPrice[0] + ",改为:" +  payload.chtodayPrice[1]
        }
        state.recordDataArr.push(r);
      }
      if(payload.chyesterDayPrice.length!=0){
        let r ={
          name:payload.chname[0],
          time:payload.nowtime,
          record:"昨日价格从:" + payload.chyesterDayPrice[0] + ",改为:" +  payload.chyesterDayPrice[1]
        }
        state.recordDataArr.push(r);
      }

    }
  },
  actions: {
    aUpdateState(context,payload){
      context.commit('updateState',payload)//调用mutations中的updateState
    },
    aAddState(context,payload){
      context.commit('adddateState',payload)
    },
    aBatchState(context,payload){
      context.commit('batchState',payload)
    }
  },
  modules: {
  },

})
