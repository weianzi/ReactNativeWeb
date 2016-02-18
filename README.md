
# React Native Web

> 借用react-web实现三端（IOS/Android/Web）共用一套逻辑代码（因组件各异，结构要分离），生成原生的IOS/Android应用和Web应用。

## 入口说明

* Web/IOS 入口：index.ios.js
* Android 入口：index.android.js

## 开发系统

* >= MAC10.10.5， >= Xcode7，>= android 6

## 版本要求

* node.js >4.0.0
* npm >3.0.0
* "babel": "^6.5.2"
* "react": "^0.14.7"
* "react-dom": "^0.14.7"
* "react-native": "^0.17.0"
* "react-web": "^0.1.3"


## 安装

```
npm i 
```

## 开启web服务

```
npm run web-dev
```

## 打包web页面js文件

```
npm run web-bundle
```
执行之后会在 web/output 目录下生成静态文件
