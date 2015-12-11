/*global angular, $, querystring, config */
declare var config;

angular.module('vs.tools.pageConfig').
	/* @ngInject */
  factory('pageConfigResource', function ($http: any) {

    'use strict';

    function _getQueryString() {
      var queryString = config.root + 'api/rest/display/config/list';
      queryString += '&rand=' + Math.random();
      return queryString;
    }

    function _execute() {
      return $http.get(_getQueryString()).then(function (data: any) {
        return data;
      }, function(error) {
        // @TODO: handle error
        console.log(error);
        return error;
      });
    }

    return {
      getPageConfigs: function() {
        return _execute();
      },
    };
  });
