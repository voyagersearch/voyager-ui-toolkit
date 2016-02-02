/// <reference path="sugar.ts" />
module vs.tools.util {
  'use strict';

  angular.module('vs.tools.util', [])
    /* @ngInject */
    .factory('sugar', (config, $http) => Sugar.getInstance(config, $http));
}
