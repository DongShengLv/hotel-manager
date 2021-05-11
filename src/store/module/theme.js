/* 主题颜色 */
export default {
    //设置为私有命名空间
    namespaced: true,
    state: {
        // theme: {
        //     blue: '#101f30',
        //     gary: '#2b333e',
        //     red: '#7c1823',
        //     black: '#000000',
        //     green: '#15231b'
        // }
        theme: [{
                name: '蓝色主题',
                value: '#101f30'
            },
            {
                name: '灰色主题',
                value: '#2b333e'
            },
            {
                name: '红色主题',
                value: '#7c1823'
            },
            {
                name: '黑色主题',
                value: '#000000'
            },
            {
                name: '绿色主题',
                value: '#15231b'
            },
        ]
    },
}