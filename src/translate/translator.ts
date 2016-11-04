module vs.tools.translate {
  'use strict';

  export class Translator {

    private fields: any = null;
    private removePrefixHash = {};

    /* @ngInject */
    constructor(private config: any, private $http: ng.IHttpService, private $q: ng.IQService) {
      var removePrefixList = ['fs_', 'ft_', 'fh_', 'fi_', 'fl_', 'fd_', 'ff_', 'fu_', 'fp_', 'fy_', 'fm_', 'fb_', 'tag_', 'meta_', 'fss_', 'lgrp_'];
      removePrefixList.forEach((item: string) => {
        this.removePrefixHash[item] = true;
        var c = item.substring(1, 2);
        var key = item.replace('_', c + '_');
        this.removePrefixHash[key] = true;
      });
    }

    public load() {
      var resourceUrl = this.config.root + 'api/rest/i18n/fields/standard.json';

      if (!this.fields) {
        return this.$http.get(resourceUrl).then((res: any) => {
          this.fields = res.data;
          return res.data;
        });
      } else {
        return this.$q.when();
      }
    }

    public translateField(field: string) {
      var idx = field.indexOf('_');
      if (idx > -1) {
        var prefix = field.substring(0, idx + 1);
        if (this.removePrefixHash[prefix]) {
          field = field.replace(prefix, '');
        }
      }
      var translated = this.fields.FIELD[field];
      if (angular.isDefined(translated)) {
        return translated;
      } else {
        return this.classify(field);
      }
    }

    private classify(str: string) {
      str = str.replace(/_/g, ' ');
      return str.replace(/\w\S*/g, function(txt: string) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  }
}
