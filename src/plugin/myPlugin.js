/* 自己封装插件 */
import {
    get,
    post,
    setToken
} from '../util/request';
export default {
    //插件中必须包含一个 install的方法
    install: function (vue) {
        //混入
        vue.mixin({
            methods: {
                $get(url, params) {
                    return get(url, params);
                },
                $post(url, params) {
                    return post(url, params);
                },
                $setToken() {
                    return setToken();
                },
                //成功消息框
                $msg_s(message, duration = 3000) {
                    this.$message({
                        showClose: true,
                        message,
                        type: 'success',
                        duration
                    })
                },
                //警告消息框
                $msg_w(message, duration = 3000) {
                    this.$message({
                        showClose: true,
                        message,
                        type: 'warning',
                        duration,
                    })
                },
                //错误消息框
                $msg_e(message, duration = 3000) {
                    this.$message({
                        showClose: true,
                        message,
                        type: 'error',
                        duration
                    })
                },
            }
        })
    }
}