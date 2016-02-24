/*global angular, $, querystring, config */
declare var config;

angular.module('vs.tools.displayConfig').
	/* @ngInject */
	factory('displayConfigResource', function ($http: any) {

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

		function _getDisplayConfigList() {
			return $http.get(_getListQueryString()).then(function (data: any) {
				return data;
			}, function(error: any) {
				// @TODO: handle error
				console.log(error);
				return error;
			});
		}

		function _getDisplayConfig(id: string) {
			return $http.get(_getConfigQueryString(id)).then(function (data: any) {
				return data;
			}, function(error: any) {
				// @TODO: handle error
				console.log(error);
				return error;
			});
		}

		function _deleteDisplayConfig(id: string) {
			return $http.delete(_getConfigQueryString(id)).then(function (data: any) {
				return data;
			}, function(error: any) {
				// @TODO: handle error
				console.log(error);
				return error;
			});
		}

		function _saveDisplayConfig(template: any) {
			return $http.post(configUri, template).then(function (data: any) {
				return data;
			}, function(error: any) {
				// @TODO: handle error
				console.log(error);
				return error;
			});
		}

		return {
			getDisplayConfigs: function() {
				return _getDisplayConfigList();
			},
			getDisplayConfig: function(id: string) {
				return _getDisplayConfig(id);
			},
			deleteDisplayConfig: function(id: string) {
				return _deleteDisplayConfig(id);
			},
			saveDisplayConfig: function(template: any){
				return _saveDisplayConfig(template);
			}
		};
	});
