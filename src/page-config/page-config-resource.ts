/*global angular, $, querystring, config */
declare var config;

angular.module('vs.tools.pageConfig').
	/* @ngInject */
  factory('pageConfigResource', function ($http: any) {

    'use strict';

    function _getListQueryString() {
      var queryString = config.root + 'api/rest/display/config/list';
      queryString += '?rand=' + Math.random();
      return queryString;
    }

    function _getConfigQueryString(id: string) {
      var queryString = config.root + 'api/rest/display/config/' + id;
      // queryString += '?rand=' + Math.random();
      return queryString;
    }

    function _getPageConfigList() {
      return $http.get(_getListQueryString()).then(function (data: any) {
        return data;
      }, function(error) {
        // @TODO: handle error
        console.log(error);
        return error;
      });
    }

    function _getPageConfig(id: string) {
      return $http.get(_getConfigQueryString(id)).then(function (data: any) {
        return data;
      }, function(error) {
        // @TODO: handle error
        console.log(error);
        return error;
      });
    }

    return {
      getPageConfigs: function() {
        return _getPageConfigList();
      },
      getPageConfig: function(id: string) {
        return _getPageConfig(id);
      }
    };
  });
