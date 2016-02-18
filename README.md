# ReactNativeWeb

借用react-web实现三端（IOS/Android/Web）共用一套逻辑代码（因组件各异，结构要分离），生成原生的IOS/Android应用，及Web手机应用（html）。

Web/IOS 入口文件是：index.ios.js

Android 入口文件是：index.android.js

MAC10.10.5系统上测试通过。

版本：
npm 3+以上

"babel": "^6.5.2"

"react": "^0.14.7"

"react-dom": "^0.14.7"

"react-native": "^0.17.0"

"react-web": "^0.1.3"



安装依赖命令
npm i 

开启web服务命令 
npm run web-dev

打包web页面js文件命令
npm run web-bundle

