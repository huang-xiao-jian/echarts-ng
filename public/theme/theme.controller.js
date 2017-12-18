/**
 * @description - echarts-ng switch theme dynamic
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
'use strict';

import echarts from 'echarts';

export class ThemeController {
  /* @ngInject */
  constructor($scope, $echarts) {
    this.$scope = $scope;
    this.$echarts = $echarts;
    this.themes = ['vintage', 'dark', 'macarons', 'infographic', 'shine', 'roma'];
    this.theme = 'vintage';
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
    this.instance = $echarts.create(this.theme, {}, []).setOption(this.options);
    this.siblingInstance = $echarts.create(this.theme, {}, []).setOption(this.options);

    this.instance.group = 'example';
    this.siblingInstance.group = 'example';

    this.ngOnInit();
  }

  ngOnInit() {
    echarts.connect([this.instance, this.siblingInstance]);

    this.instance
      .on('click', (event) => {
        console.log(event);
      })
      .on('legendselectchanged', (event) => {
        this.$scope.$apply(() => {
          this.legends.forEach((legend) => {
            legend.description === event.name && (legend.selected = !legend.selected);
          });
        });
      });
  }

  /**
   * @description - 切换主题
   */
  handleThemeChange() {
    this.instance = this.$echarts.create(this.theme).setOption(this.options);
  }

  /**
   * @description - 同步legend状态
   *
   * @param {string} name
   * @param {boolean} selected
   */
  handleLegendChange(name, selected) {
    this.instance.dispatchAction({
      type: selected ? 'legendSelect' : 'legendUnSelect',
      name: name
    });
  }
}
