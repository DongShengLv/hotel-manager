import md5 from 'js-md5';

//将字符串进行 md5加密的方法
function strToMd5(str) {
    return md5(md5(str).split('').reverse().join(''));
}



export {
    strToMd5,
}