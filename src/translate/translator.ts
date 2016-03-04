module vs.tools.translate {
  'use strict';

  export class Translator {

    private fields: any = null;

    /* @ngInject */
    constructor(private config: any, private $http: ng.IHttpService, private $q: ng.IQService) {
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
