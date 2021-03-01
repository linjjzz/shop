import axios from 'axios'

//终极方案
export function request(config){
    //1.创建axios的实例
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:8888/api/private/v1/',
      timeout: 5000
    })

    //2.axios的拦截器
    //2.1.请求拦截
    instance.interceptors.request.use(config => {
      //请求成功

      return config
    }, err =>{
      //请求失败

    })

    //2.2.响应拦截
    instance.interceptors.response.use(res => {
      //响应成功
      
      return res.data
    }, err => {
      //响应失败
      
    })

    //3.发送真正的网络请求
    return instance(config)
}