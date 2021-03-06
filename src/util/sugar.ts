module vs.tools.util {
  'use strict';

	export class Sugar {

    constructor(private config: any, private $http: ng.IHttpService) {}

		public static isString(val: any) {
			return (typeof val === 'string' || val instanceof String);
		}

		static getInstance(config: any, $http: ng.IHttpService) : Sugar {
			return new Sugar(config, $http);
		}

		toMap(key: any, array: any) {
			var map = {};
			array.forEach((value: any) => {
				map[value[key]] = value;
			});
			return map;
		}

		toStringMap(array: any) {
			var map = {};
			array.forEach((value: any) => {
				map[value] = value;
			});
			return map;
		}

    pluck(array: any, name: string, fn?: Function) {
      var fl = [];
      array.forEach(function(value: any){
        if (fn && fn(value)) {
          fl.push(value[name]);
        } else if (angular.isUndefined(fn)) {
          fl.push(value[name]);
        }
      });
      return fl;
    }

    postForm(url: string, data: any) {
      var service = this.config.root + url;
      return this.$http({
        method: 'POST',
        url: service,
        data: data,
        withCredentials: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
      });
    }

    parseQueryString(queryString: string) {
      var pairs = queryString.slice(1).split('&');
      var result = {}, s;
      pairs.forEach(function(pair) {
        s = pair.split('=');
        result[s[0]] = decodeURIComponent(s[1] || '');
      });
      return JSON.parse(JSON.stringify(result));
    }

    postJson(request, api, action) {
      return this.$http({
        method: 'POST',
        url: config.root + 'api/rest/' + api  + '/' + action + '.json',
        data: request,
        headers: {'Content-Type': 'application/json'}
      });
    }
	}
}
