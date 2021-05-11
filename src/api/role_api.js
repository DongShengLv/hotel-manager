/* 角色 api层 */

import {get,post} from "../util/request";

//查询角色列表信息
 export async function list(){
     let res  = await get("/Role/List");

     return res;
 }

 //添加角色信息
 export async function add(params){
     let res = await post("/Role/Add",params);

     return res;
 }

 //获取一个角色信息
 export async function getOne(params){
     let res = await get("/Role/GetOne",params);

     return res;
 }

 //修改角色信息
 export async function update(params){
     let res = await post("/Role/Update",params);

     return res;
 }

 //删除角色信息
 export async function del(params){
     let res = await post("/Role/Delete",params);

     return res;
 }