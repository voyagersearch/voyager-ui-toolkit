/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="../util/sugar.ts" />

module vs.tools.fields {
'use strict';

	export interface IFieldsResource {
		fetch(fields?: string): ng.IPromise<any>;
		fetchHydrationStats(query: string): ng.IPromise<any>;
	}

	export class FieldsResource implements IFieldsResource {
		static refName = 'fieldsResource';

		fetch: (properties?: string) => any;
		fetchHydrationStats: (query: string) => any;

		/* @ngInject */
		constructor(private sugar: any) {

			this.fetch = (fields?: any) => {
				var fl = (fields || 'name,category,docs,disp_en');
        fl = fl.split(',');
				return this.sugar.postForm('solr/fields/select', this.getFieldsParams(fl)).then((res: any) => {
						return res.data.response.docs;
					});
			};

			this.fetchHydrationStats = (query: string) => {

				return this.fetch().then((fields: Array<any>) => {
          var fl = this.sugar.pluck(fields, 'name');

          // http://voyagerdemo.com/daily/solr/v0/select?&rows=0&wt=json&facet=true&facet.field=format

          return this.sugar.postForm('solr/v0/select?' + query, this.getStatsParams(fl)).then((res: any) => {
            var statsFields = res.data.facet_counts.facet_fields;
            var total = res.data.response.numFound;
            this.applyHydration(statsFields, fields, total);
            return fields;
          });
        });

			};

		}

    private getFieldsParams(fl) {
      return {
        params: {
          q: '*:*',
          fl: fl,
          rows: 10000,
          sort: 'name%20asc',
          wt: 'json'
        }
      };
    }


    private getStatsParams(fl) {
      return {
        params: {
          facets: true,
          'facet.field': fl,
          'facet.limit': 10000,
          'facet.mincount': 100,  // @TODO adjust this to a reasonable minimum
          rows: 0,
          wt: 'json'
        }
      };
    }

    private applyHydration(statsFields, fields, total) {
      var statsField, count;
      for (var i = 0; i < fields.length; i++) {
        statsField = statsFields[fields[i].name];
        if (statsField && statsField.length > 0) {
          // fields[i].id = statsField;  TODO  why?
          count = this.getCount(statsField);
          fields[i].hydration = count / total * 100;
          // break;
        }
      }
      return i;
    }

    private getCount(field) {
      var count = 0;
      for (var i = 1; i < field; i += 2) {
        count += field[i];
      }
      return count;
    }

  }
}
