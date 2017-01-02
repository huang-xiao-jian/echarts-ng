/**
 * @description - develop helper for showcase
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
(function (angular) {
  'use strict';
  
  angular.module('echarts-showcase', ['echarts-ng'])
    .controller('ShowcaseController', ['$echarts', '$timeout', function ($echarts, $timeout) {
      this.themes = ['vintage', 'dark', 'macarons', 'infographic', 'shine', 'roma'];
      this.theme = 'vintage';
      this.show = true;
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
      this.options = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
  
      this.legends = [
        { description: '邮件营销', selected: true },
        { description: '联盟广告', selected: true },
        { description: '视频广告', selected: true },
        { description: '直接访问', selected: true },
        { description: '搜索引擎', selected: true }
      ];
      
      this.instance = $echarts.create(this.theme, {}, this.mediaOptions);
      
      this.instance
        .showLoading()
        .on('click', (event) => {
          console.log(event);
        })
        .on('legendselectchanged', (event) => {
          console.log(event);
        });
      
      $timeout(() => {
        this.instance.setOption(this.options).hideLoading();
      }, 1200);
      
      this.handleThemeChange = () => {
        this.instance = $echarts.create(this.theme).setOption(this.options);
      };
      
      this.handleLegendChange = (name, selected) => {
        this.instance.dispatchAction({
          type: selected ? 'legendSelect' : 'legendUnSelect',
          name: name
        })
      };
      
      this.toggleSwitchStatus = () => {
        this.show = !this.show;
      };

      this.sync = _.debounce(() => {
        this.instance.resize();
      }, 100);

      window.addEventListener('resize', this.sync);
    }]);
  
  angular.bootstrap(document.body, ['echarts-showcase'], { strictDi: true });
})(angular);
