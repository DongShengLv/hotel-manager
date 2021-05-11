/* 接口地址的根路径 */
export default {
    mock:{
        name:'虚拟环境接口',
        url:'http://mockjs.com:83'
    },      
    //开发环境
    dev: {
        name: '开发接口',
        url: "http://bingjs.com:83"
    },
    //生产环境
    pro: {
        name: '生产接口',
        url: "http://bingjs.com:83"
    },
    //测试环境
    test: {
        name: '测试接口',
        url: "http://bingjs.com:83"
    },
}