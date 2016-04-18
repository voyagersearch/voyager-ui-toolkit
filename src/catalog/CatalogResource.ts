/*global angular, $, querystring, config */
declare var config;

angular.module('vs.tools.catalog').
	/* @ngInject */
	factory('catalogResource', function ($http: any, $q: any) {

		'use strict';

		var uri = config.root + 'api/rest/index/config/federation.json';
		var locations = 'api/rest/i18n/field/location.json';

		function _fetch() {
			return $http.get(uri).then(function (res: any) {
				return res.data.servers;
			}, function(error: any) {
				console.log(error);
				return error;
			});
		}

		function _loadRemoteLocations(params: any) {
			return _fetch().then((catalogs: any) => {
				var promises = [];
				catalogs.forEach(catalog => {
					if (angular.isDefined(catalog.url)) {
						var url = catalog.url + locations;
						var catalogPromise = $http.get(url, {withCredentials: false}).then((response: any) => {
							return response;
						});
						promises.push(catalogPromise);
					}
				});
				return $q.all(promises).then(function(res) {
					return res;
				}, function(error) {
					return error; // failure means the remote catalogs are offline, allow to continue, the search should show an error
				});
			});
		}

		return {
			fetch: _fetch,
			loadRemoteLocations: _loadRemoteLocations
		};
	});
