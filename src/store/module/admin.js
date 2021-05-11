/* 当前登录账户信息模块 */
export default {
    //私有命名空间
    namespaced:true,
    state: {
        admin: {
            role:{},
        },
    },
    mutations: {
        //该方法用于对 admin对象赋值
        setAdmin(state, val) {
            state.admin = val;
        }
    }
}