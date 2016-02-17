/*global angular, $, querystring, config */
declare var config;

angular.module('vs.tools.savedSearch').
	/* @ngInject */
  factory('savedSearchResource', function ($http: any, sugar) {

    'use strict';

     function _doSave(savedSearch: any) {
       savedSearch.query += '/disp=' + savedSearch.config;
       savedSearch.path = savedSearch.query;
       return sugar.postJson(savedSearch, 'display', 'ssearch');
     }

    function _getQueryString(id?: string) {
      var rows = 150;  // @TODO set to what we really want
      var queryString = config.root + 'solr/ssearch/select?';
      queryString += 'rows=' + rows + '&rand=' + Math.random();
      queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle],param*,labels';
      queryString += '&wt=json&json.wrf=JSON_CALLBACK';
      if (angular.isDefined(id)) {
        queryString += '&fq=id:' + id;
      }
      return queryString;
    }

    function _execute(id?: string) {
      return $http.jsonp(_getQueryString(id)).then(function (data: any) {
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

      fetch: function(id) {
        return _execute(id).then(function(docs) {
          return docs[0];
        });
      },

      saveSearch: function(savedSearch, params) {
       //  savedSearch.config = configService.getConfigId();
       //  savedSearch.query = converter.toClassicParams(params);
       return _doSave(savedSearch);
      },

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
      },

      fetchLabels: function() {
        var url = config.root + 'solr/ssearch/select?rows=0&facet=true&facet.field=labels&wt=json&r=' + new Date().getTime();
        return $http.get(url).then(function(resp) {
          return resp.data.facet_counts.facet_fields.labels;
        }, function() {  // error if labels field doesn't exist
          return [];
        });
      }
    };
  });
