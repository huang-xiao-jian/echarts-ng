/**
 * @description - echarts-ng showcase
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

// external dependencies
import angular from 'angular';

// internal
import './app.css';
import { ECHARTS_NG } from '../src/index';

// route definitions
import ThemeTemplate from './theme/theme.tpl.html';
import { ThemeController } from './theme/theme.controller';

const SHOWCASE_ROUTE = [
  {
    name: 'showcase',
    url: '/showcase',
    template: `<article ui-view="page"></article>`
  },
  {
    name: 'showcase.theme',
    url: '/theme',
    views: {
      page: {
        template: ThemeTemplate,
        controller: ThemeController,
        controllerAs: 'vm'
      }
    }
  }
];

const SHOWCASE_NAME = 'echarts-showcase';

angular.module(SHOWCASE_NAME, ['ui.router', ECHARTS_NG])
  .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    SHOWCASE_ROUTE.forEach((state) => $stateProvider.state(state));

    $urlRouterProvider.otherwise('/showcase/theme');
  }]);

angular.bootstrap(document.body, ['echarts-showcase'], { strictDi: true });
