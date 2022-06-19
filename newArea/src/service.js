import axios from 'axios';

const service = axios.create({
    //baseURL会自动加在接口地址上
    baseURL: '../public/',
    timeout:300,//指定请求超时毫秒数，如果超过这个时间就中断请求
    headers:{
        'Content-type':'application/json;charset=utf-8'
    }
})

//添加请求拦截器
service.interceptors.request.use(function(config){
    //在发送请求前做什么

    return config;
},function(error){
    return Promise.reject(error);
})

//添加响应拦截器
service.interceptors.response.use(function(response){
    //对响应数据做处理
    return response;
},function(error){
    return Promise.reject(error);
})

export default service;