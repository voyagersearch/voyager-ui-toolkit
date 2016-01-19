/// <reference path="translator.ts" />
module vs.tools.translate {
  'use strict';

  declare var config;

  angular.module('vs.tools.translate', [])
    /* @ngInject */
    .factory('translator', (config: any, $http: ng.IHttpService, $q: ng.IQService) => new Translator(config, $http, $q))
    .constant('config', config);
}
