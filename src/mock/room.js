/* 模拟客房管理的请求接口 */

//导入 Mock对象
import Mock from "mockjs";

//定义拦截的接口地址
Mock.mock('http://mockjs.com:83/Room/List?pageIndex=1&roomTypeId=0&roomStateId=0',

    {
        "data|5-10": [{
            "roomId|+1": 1000,
            roomType: {
                roomTypeName: "@ctitle(2,6)",
                "roomTypePrice|100-200": 200,
            },
            roomState: {
                roomStateName: "@ctitle(2,6)"
            },
        }]
    }

)