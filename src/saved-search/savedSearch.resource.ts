/*global angular, $, querystring, config */
declare var config;

angular.module('vs.tools.savedSearch').
  factory('savedSearchResource', function (sugar, $http, configService, converter, $q) {
    'use strict';

    function _doSave(request) {

      if (configService.hasChanges()) {
        var deferred = $q.defer();
        sugar.postJson(configService.getUpdatedSettings(), 'display', 'config').then(function(response) {
          request.config = response.data.id;
          /* jshint ignore:start */
          request.query += '/disp=' + request.config;
          request.path = request.query;
          sugar.postJson(request, 'display', 'ssearch').then(function(savedResponse) {
            deferred.resolve();
          }, function(error) {
            deferred.reject(error);
          });
          /* jshint ignore:end */
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      } else {
        request.query += '/disp=' + request.config;
        request.path = request.query;
        return sugar.postJson(request, 'display', 'ssearch');
      }
    }

    function _getQueryString() {
      var rows = 150;  // @TODO set to what we really want
      var queryString = config.root + 'solr/ssearch/select?';
      queryString += 'rows=' + rows + '&rand=' + Math.random();
      queryString += '&wt=json&json.wrf=JSON_CALLBACK';
      return queryString;
    }

    function _execute() {
      return $http.jsonp(_getQueryString()).then(function (data) {
        return data.data.response.docs;
      }, function(error) {
        // @TODO: handle error
        console.log(error);
        return error;
      });
    }

    return {
      getSavedSearches: function() {
        return _execute();
      },

      saveSearch: function(savedSearch, params) {
        savedSearch.config = configService.getConfigId();
        savedSearch.query = converter.toClassicParams(params);
        return _doSave(savedSearch);
      },

      deleteSearch: function(id){
        return $http.delete(config.root + 'api/rest/display/ssearch/' + id).then(function(){
              // observers.forEach(function (entry) {
              //   entry(id);
              // });
            });
      },

      order: function(id, beforeId, afterId) {
        var data = '';
        if(beforeId !== null) {
          data += 'before=' + beforeId;
        }
        if(data !== '') {
          data += '&';
        }

        if(afterId !== null) {
          data += 'after=' + afterId;
        }
        return sugar.postForm('api/rest/display/ssearch/' + id + '/order', data);
      }
    };
  });
