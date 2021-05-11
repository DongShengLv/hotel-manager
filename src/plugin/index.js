/* 注册 element-ui 组件库 */

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//注册 myPlugin插件

import myPlugin from './myPlugin';
Vue.use(myPlugin);

//注册富文本编辑器 vue-quill-editor 插件
import VueQuillEditor from 'vue-quill-editor';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

Vue.use(VueQuillEditor);