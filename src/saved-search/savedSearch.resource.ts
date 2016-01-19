/*global angular, $, querystring, config */
declare var config;

angular.module('vs.tools.savedSearch').
	/* @ngInject */
  factory('savedSearchResource', function ($http: any) {

    'use strict';

    // function _doSave(request: any) {
    //   request.query += '/disp=' + request.config;
    //   request.path = request.query;
    //   // return sugar.postJson(request, 'display', 'ssearch');
    // }

    function _getQueryString() {
      var rows = 150;  // @TODO set to what we really want
      var queryString = config.root + 'solr/ssearch/select?';
      queryString += 'rows=' + rows + '&rand=' + Math.random();
      queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle]';
      queryString += '&wt=json&json.wrf=JSON_CALLBACK';
      return queryString;
    }

    function _execute() {
      return $http.jsonp(_getQueryString()).then(function (data: any) {
        return data.data.response.docs;
      }, function(error: any) {
        // @TODO: handle error
        console.log(error);
        return error;
      });
    }

    return {
      getSavedSearches: function() {
        return _execute();
      },

      // saveSearch: function(savedSearch, params) {
      //   savedSearch.config = configService.getConfigId();
      //   savedSearch.query = converter.toClassicParams(params);
      //   return _doSave(savedSearch);
      // },

      deleteSearch: function(id: string){
        return $http.delete(config.root + 'api/rest/display/ssearch/' + id).then(function(){
              // observers.forEach(function (entry) {
              //   entry(id);
              // });
            });
      },

      order: function(id: any, beforeId: any, afterId: any) {
        var data = '';
        if (beforeId !== null) {
          data += 'before=' + beforeId;
        }
        if (data !== '') {
          data += '&';
        }

        if (afterId !== null) {
          data += 'after=' + afterId;
        }
        // return sugar.postForm('api/rest/display/ssearch/' + id + '/order', data);
      }
    };
  });
