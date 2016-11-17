/*global angular, $, querystring, config */
declare var config;

angular.module('vs.tools.appearance').
/* @ngInject */
factory('appearanceResource', function ($http: any, $q: any) {

  'use strict';

  var uri = config.root + 'api/rest/appearance';
  var actionUri = config.root + 'api/rest/appearance/actions';

  function _fetch(): any {
    return $http.get(uri).then(function (res: any) {
      return res.data;
    }, function(error: any) {
      console.log(error);
      // @TODO: handle error
      return error;
    });
  }

  function _saveActions(actions: Array<any>) {
    return $http.post(actionUri, { docActions: actions }).then(function (data: any) {
      return data;
    }, function(error: any) {
      // @TODO: handle error
      console.log(error);
      return error;
    });
  }

  return {
    fetch: function() {
      return _fetch();
    },
    saveActions: function(actions: Array<any>){
      return _saveActions(actions);
    }
  };
});
