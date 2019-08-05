import axios from 'axios'
import store from '../store/index'
import router from '../router/index'
import util from '../util/index.js'

/*axios 配置*/
axios.defaults.timeout = 15000;
axios.defaults.baseURL = util.ROOT_CONFIG.domain;

/*http request拦截器*/
axios.interceptors.request.use(
    function(config) {
        var token = localStorage.getItem("token");
        if(token && config.headers.Authorization!==''){
            config.headers.Authorization = token;
        }
        return config;
    },function(error) {
        return Promise.reject(error);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        if (error.response) {

            switch (error.response.status) {
                case 403:
                    // 403 清除token信息并跳转到登录页面
                    if(error.response.data && error.response.data.detail == 'Invalid signature.'){
                        store.commit('logout');
                        util.tologin();
                    }
            }
        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error);
    }
);

// const instance = axios.create({headers: {'content-type': 'application/x-www-form-urlencoded'}})
export default axios;