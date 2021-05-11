/* 配置文件 配置信息 */
//导入 base_url_mode文件
import base_url_mode from "./base_url";

//导出接口根路径地址
//当前是开发模式
export let BASE_URL = base_url_mode['dev'].url;

//导出管理员头像路径
export let BASE_URL_AdminImg = "http://bingjs.com:83/upload/admin/";

//管理员图片上传地址
export let Upload_AdminImg_URL = "http://bingjs.com:83/Admin/UploadImg/";

//导出房间图片上传地址
export let Upload_RoomImg_URL = "http://bingjs.com:83/RoomImg/UploadImg/";

//导出显示房间图片的根路径
export let BASE_URL_RoomImg = "http://bingjs.com:83/upload/room/"