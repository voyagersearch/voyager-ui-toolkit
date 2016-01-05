/*global angular, $, querystring, config */
declare var config;

angular.module('vs.tools.pageConfig').
	/* @ngInject */
	factory('pageConfigResource', function ($http: any) {

		'use strict';

		var configUri = config.root + 'api/rest/display/config/';

		function _getListQueryString() {
			var queryString = configUri + 'list';
			queryString += '?rand=' + Math.random();
			return queryString;
		}

		function _getConfigQueryString(id: string) {
			var queryString = configUri + id;
			queryString += '?rand=' + Math.random();
			return queryString;
		}

		function _getPageConfigList() {
			return $http.get(_getListQueryString()).then(function (data: any) {
				return data;
			}, function(error: any) {
				// @TODO: handle error
				console.log(error);
				return error;
			});
		}

		function _getPageConfig(id: string) {
			return $http.get(_getConfigQueryString(id)).then(function (data: any) {
				return data;
			}, function(error: any) {
				// @TODO: handle error
				console.log(error);
				return error;
			});
		}

		function _deletePageConfig(id: string) {
			return $http.delete(_getConfigQueryString(id)).then(function (data: any) {
				return data;
			}, function(error: any) {
				// @TODO: handle error
				console.log(error);
				return error;
			});
		}

		function _savePageConfig(template: any) {
			return $http.post(configUri, template).then(function (data: any) {
				return data;
			}, function(error: any) {
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
			},
			deletePageConfig: function(id: string) {
				return _deletePageConfig(id);
			},
			savePageConfig: function(template: any){
				return _savePageConfig(template);
			}
		};
	});
