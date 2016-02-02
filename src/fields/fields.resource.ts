/// <reference path="../../.tmp/typings/tsd.d.ts" />
/*global angular, $, querystring, config */
declare var config;

module vs.tools.fields {
'use strict';

	export interface IFieldsResource {
		fetch(fields?: string): ng.IPromise<any>;
		gettingHydrationStats(query: string): ng.IPromise<any>;
	}

	export class FieldsResource implements IFieldsResource {
		static refName = 'fieldsResource';

		fetch: (properties?: string) => any;
		gettingHydrationStats: (query: string) => ng.IPromise<any>;

		/* @ngInject */
		constructor(private $http: ng.IHttpService) {

			this.fetch = (properties?: string) => {
				var fl = (properties || 'name,category,docs,disp_en');
				return this.$http
					.jsonp(config.root +
						'solr/fields/select?q=*:*&fl={FIELDS}&sort=name%20asc&wt=json&rows=10000&json.wrf=JSON_CALLBACK'.replace('{FIELDS}', fl))
					.then(function(res: any) {
						return res.data.response.docs;
					}.bind(this));
			};

			this.gettingHydrationStats = (query: string) => {
				// http://voyagerdemo.com/daily/solr/v0/select?q=id:+[S1520D948770]&wt=json&stats=true&rows=10
				// q: 'id:+[' + savedSearchId + ']',

				return this.fetch()
					.then(function(fields: Array<any>) {
						var fl = [];
						fields.forEach(function(value: any){
							if (value.docs) {
								fl.push(value.name);
							}
						});

						var data = {
							params: {
								stats: true,
								'stats.field': fl,
								wt: 'json'
							}
						};

						return this.$http.post(
							config.root + 'solr/v0/select?rows=1&' + query,
							data, {
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							})
							.then(function(res: any) {
								for (var key in res.data.stats.stats_fields) {
									if (res.data.stats.stats_fields.hasOwnProperty(key)) {
										for (var i = 0; i < fields.length; i++) {
											if (fields[i].name === key) {
												fields[i].id = key;
												fields[i].hydration = res.data.stats.stats_fields[key].count / (res.data.stats.stats_fields[key].count + res.data.stats.stats_fields[key].missing) * 100;
												break;
											};
										}
									}
								}
								return fields;
							}.bind(this));

					}.bind(this));

			};

		}

	}
}
