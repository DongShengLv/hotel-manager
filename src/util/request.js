/* 封装请求相关的方法 */

//导入 nprogress 加载进度条的库
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

//导入接口配置文件
import '../config/index';

import axios from 'axios';
import {BASE_URL} from '../config/index';

//初始化一个 axios对象
const instance = axios.create({
    //接口地址根路径
    baseURL: BASE_URL,
    //超时时间
    timeout: 3000,
});


//请求拦截器
instance.interceptors.request.use((config) => {
    //加载滚动条
    NProgress.start();
    return config;
}), (error) => {
    //关闭滚动条
    NProgress.done();
    return Promise.reject(error);
}

//响应拦截器
instance.interceptors.response.use((response) => {
    NProgress.done();
    return response;
}), (error) => {
    NProgress.done();
    return Promise.reject(error);
}


//创建一个 get请求方法    
let get = async (url, params) => {
    let { data } = await instance.get(url, {
        params
    });

    return data;

}

//创建一个 post请求方法
let post = async (url, params) => {
    let { data } = await instance.post(url, params)

    return data;
}


//设置 token信息保存到请求头的方法
let setToken = function () {
    instance.defaults.headers.common['token'] = sessionStorage.getItem('token');
}


//导出方法
export {
    get,
    post,
    setToken
}