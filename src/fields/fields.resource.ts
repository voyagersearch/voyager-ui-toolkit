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
		ensureTagsFieldExist: (fields: Array<any>) => any;

		/* @ngInject */
		constructor(private sugar: any) {

      this.fetch = (fields?: any) => {
        var fl = (fields || 'name,stype,category,docs,disp_en,sortable,filterable,tableable,displayable,editable');
        return sugar.postForm('solr/fields/select', this.getFieldsParams(fl)).then((res: any) => {
          this.ensureTagsFieldExist(res.data.response.docs);
          return res.data.response.docs;
        });
      };

      this.ensureTagsFieldExist = (fields: Array<any>) => {
        var found = false;
        for (var i = fields.length - 1; i >= 0; i--) {
          if (fields[i].name === 'tag_tags') {
            found = true;
            break;
          }
        }

        if (!found) {
          fields.push({
            category: 'TEXT',
            disp_en: 'Tags',
            displayable: true,
            docs: 0,
            filterable: true,
            name: 'tag_tags',
            sortable: false,
            stype: 'string',
            tableable: false
          });
        }
      };

			this.fetchHydrationStats = (query: string) => {

				return this.fetch().then((fields: Array<any>) => {
          var fl = sugar.pluck(fields, 'name', function(field) { return field.name.indexOf('_') !== 0 && field.docs > 0; });

          return sugar.postForm('solr/v0/select?' + query, this.getStatsParams(fl)).then((res: any) => {
            var statsFields = res.data.facet_counts.facet_fields;
            var total = res.data.response.numFound;
            this.applyHydration(statsFields, fields, total);
            return fields;
          });
        });

			};

		}

    private getFieldsParams(fl) {
      return 'q=*:*&fl=' + fl + '&rows=10000&sort=name%20asc&wt=json&rand=' + Math.random();
    }


    private getStatsParams(fl) {
      return 'facet=true&facet.limit=10000&facet.mincount=100&rows=0&wt=json&facet.field=' + fl.join('&facet.field=') + '&rand=' + Math.random();
    }

    private applyHydration(statsFields, fields, total) {
      var statsField, count;
      for (var i = 0; i < fields.length; i++) {
        statsField = statsFields[fields[i].name];
        if (statsField && statsField.length > 0) {
          fields[i].id = fields[i].name;
          count = this.getCount(statsField);
          fields[i].hydration = count / total * 100;
        }
      }
      return i;
    }

    private getCount(field) {
      var count = 0;
      for (var i = 1; i < field.length; i += 2) {
        count += field[i];
      }
      return count;
    }

  }
}
