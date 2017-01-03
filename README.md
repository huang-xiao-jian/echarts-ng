## echarts-ng

![Build Status](https://img.shields.io/travis/bornkiller/echarts-ng.svg?style=flat)
![Coverage Report](http://img.shields.io/coveralls/bornkiller/echarts-ng.svg?style=flat)
![Package Dependency](https://david-dm.org/bornkiller/echarts-ng.svg?style=flat)
![Package DevDependency](https://david-dm.org/bornkiller/echarts-ng/dev-status.svg?style=flat)

百度`echarts`为优秀的图表库，使用`angular`封装为指令。https://github.com/bornkiller/echarts-ng

## 版本变更
新版本是完全一新的版本，老版本文档参照对应`tag`, 如`0.3.13`，不建议继续使用。更新表述参见 https://github.com/bornkiller/echarts-ng/issues/8

## 运行环境
+ angularjs - 1.6.0+, 支持单向绑定，`life hook`即可
+ echarts   - 3.0.0+
+ es6-reflect - 实际使用中自行引入对应`babel-polyfill`即可

## FAQ
+ 实例容器高度缺失，会导致`echarts`绘制错误，并不会直接抛出。如果数据正常，绘制异常，务必检查高度问题。
+ 在控制器，可以直接调用实例，因而可以使用`connect`, `group`等操作。
+ 暂时没有全局配置，所以实例之间相似的数据只能重复设定，后续会有解决方案。

## 项目使用
```shell
// 新版本仅支持NPM
npm install echarts-ng;
```

```js
// 默认加载`umd`格式，也支持`amd`, `iife`, `commonjs`, `esm`等方式，加载对应文件即可
import 'echarts-ng';

angular.module('application', ['echarts-ng']);

// 使用`esm`方式
import { DECORATE_NAME } from 'echarts-ng';

angular.module('application', [DECORATE_NAME]);
```

封装由`$echarts`服务与`echarts`属性指令组成，需配合使用。

+ 控制器内声明实例
```javascript
function ShowcaseController ($echarts, $timeout) {
  this.theme = 'vintage';
  this.initOptions = {
    hegith: 400,
    width: 'auto'
  };
  this.mediaOptions = [
    {
      option: {
        legend: {
        orient: 'horizontal',
        left: 'center',
          top: 'top'
        },
        grid: {
          right: '10%'
        }
      }
    },
    {
      query: {
        maxWidth: 850
      },
      option: {
        legend: {
          orient: 'vertical',
          right: 10,
          top: '10%'
        },
        grid: {
          right: '15%'
        }
      }
    }
  ];
  
  this.instance =  $echarts.create(this.theme, this.initOptions, this.mediaOptions).setOption({/ *... */});
```
+  使用指令绘制实例
```html
<div class="echarts-box" style="height: 550px;" echarts="vm.instance"></div>
```
+ 实例分组，事件监听，事件触发等等操作
```javascript
// 实例分组
this.instance.group = 'example';

// 事件监听
this.instance
  .on('click', (event) => {
    console.log(event);
  })
  .on('legendselectchanged', (event) => {
    console.log(event);
  });
  
// 事件触发
this.instance.dispatchAction({
  type: 'legendSelect',
  name: name
});  
```

## license
MIT
