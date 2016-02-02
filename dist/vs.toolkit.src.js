var vs;
(function (vs) {
    var tools;
    (function (tools) {
        'use strict';
        var Config = (function () {
            /** @ngInject */
            function Config($logProvider) {
                // enable log
                $logProvider.debugEnabled(true);
                // set options third-party lib
            }
            return Config;
        })();
        tools.Config = Config;
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        'use strict';
        var RunBlock = (function () {
            /** @ngInject */
            function RunBlock($log) {
                $log.debug('runBlock end');
            }
            return RunBlock;
        })();
        tools.RunBlock = RunBlock;
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../.tmp/typings/tsd.d.ts" />
/// <reference path="index.config.ts" />
/// <reference path="index.run.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        'use strict';
        angular.module('vs.tools', [])
            .config(tools.Config)
            .run(tools.RunBlock)
            .constant('config', config);
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../../.tmp/typings/tsd.d.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var fields;
        (function (fields_1) {
            'use strict';
            var FieldsResource = (function () {
                /* @ngInject */
                function FieldsResource($http) {
                    var _this = this;
                    this.$http = $http;
                    this.fetch = function (properties) {
                        var fl = (properties || 'name,category,docs,disp_en');
                        return _this.$http
                            .jsonp(config.root +
                            'solr/fields/select?q=*:*&fl={FIELDS}&sort=name%20asc&wt=json&rows=10000&json.wrf=JSON_CALLBACK'.replace('{FIELDS}', fl))
                            .then(function (res) {
                            return res.data.response.docs;
                        }.bind(_this));
                    };
                    this.gettingHydrationStats = function (query) {
                        // http://voyagerdemo.com/daily/solr/v0/select?q=id:+[S1520D948770]&wt=json&stats=true&rows=10
                        // q: 'id:+[' + savedSearchId + ']',
                        return _this.fetch()
                            .then(function (fields) {
                            var fl = [];
                            fields.forEach(function (value) {
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
                            return this.$http.post(config.root + 'solr/v0/select?rows=1&' + query, data, {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            })
                                .then(function (res) {
                                for (var key in res.data.stats.stats_fields) {
                                    if (res.data.stats.stats_fields.hasOwnProperty(key)) {
                                        for (var i = 0; i < fields.length; i++) {
                                            if (fields[i].name === key) {
                                                fields[i].id = key;
                                                fields[i].hydration = res.data.stats.stats_fields[key].count / (res.data.stats.stats_fields[key].count + res.data.stats.stats_fields[key].missing) * 100;
                                                break;
                                            }
                                            ;
                                        }
                                    }
                                }
                                return fields;
                            }.bind(this));
                        }.bind(_this));
                    };
                }
                FieldsResource.refName = 'fieldsResource';
                return FieldsResource;
            })();
            fields_1.FieldsResource = FieldsResource;
        })(fields = tools.fields || (tools.fields = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="./fields.resource.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var fields;
        (function (fields) {
            'use strict';
            angular.module('vs.tools.fields', [])
                .service(fields.FieldsResource.refName, fields.FieldsResource);
        })(fields = tools.fields || (tools.fields = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var filters;
        (function (filters) {
            'use strict';
            angular.module('vs.tools.filters', [])
                .filter('replaceString', function () {
                return function (hayStack, oldNeedle, newNeedle) {
                    return hayStack.replace(oldNeedle, newNeedle);
                };
            });
        })(filters = tools.filters || (tools.filters = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var pageConfig;
        (function (pageConfig) {
            'use strict';
            angular.module('vs.tools.pageConfig', []);
        })(pageConfig = tools.pageConfig || (tools.pageConfig = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.pageConfig').
    /* @ngInject */
    factory('pageConfigResource', function ($http) {
    'use strict';
    var configUri = config.root + 'api/rest/display/config/';
    function _getListQueryString() {
        var queryString = configUri + 'list';
        queryString += '?rand=' + Math.random();
        return queryString;
    }
    function _getConfigQueryString(id) {
        var queryString = configUri + id;
        queryString += '?rand=' + Math.random();
        return queryString;
    }
    function _getPageConfigList() {
        return $http.get(_getListQueryString()).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _getPageConfig(id) {
        return $http.get(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _deletePageConfig(id) {
        return $http.delete(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _savePageConfig(template) {
        return $http.post(configUri, template).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        getPageConfigs: function () {
            return _getPageConfigList();
        },
        getPageConfig: function (id) {
            return _getPageConfig(id);
        },
        deletePageConfig: function (id) {
            return _deletePageConfig(id);
        },
        savePageConfig: function (template) {
            return _savePageConfig(template);
        }
    };
});

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var savedSearch;
        (function (savedSearch) {
            'use strict';
            angular.module('vs.tools.savedSearch', []);
        })(savedSearch = tools.savedSearch || (tools.savedSearch = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.savedSearch').
    /* @ngInject */
    factory('savedSearchResource', function ($http) {
    'use strict';
    // function _doSave(request: any) {
    //   request.query += '/disp=' + request.config;
    //   request.path = request.query;
    //   // return sugar.postJson(request, 'display', 'ssearch');
    // }
    function _getQueryString() {
        var rows = 150; // @TODO set to what we really want
        var queryString = config.root + 'solr/ssearch/select?';
        queryString += 'rows=' + rows + '&rand=' + Math.random();
        queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle]';
        queryString += '&wt=json&json.wrf=JSON_CALLBACK';
        return queryString;
    }
    function _execute() {
        return $http.jsonp(_getQueryString()).then(function (data) {
            return data.data.response.docs;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        getSavedSearches: function () {
            return _execute();
        },
        // saveSearch: function(savedSearch, params) {
        //   savedSearch.config = configService.getConfigId();
        //   savedSearch.query = converter.toClassicParams(params);
        //   return _doSave(savedSearch);
        // },
        deleteSearch: function (id) {
            return $http.delete(config.root + 'api/rest/display/ssearch/' + id).then(function () {
                // observers.forEach(function (entry) {
                //   entry(id);
                // });
            });
        },
        order: function (id, beforeId, afterId) {
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
        }
    };
});

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var translate;
        (function (translate) {
            var Translator = (function () {
                /* @ngInject */
                function Translator(config, $http, $q) {
                    this.config = config;
                    this.$http = $http;
                    this.$q = $q;
                    this.fields = null;
                }
                Translator.prototype.load = function () {
                    var _this = this;
                    var resourceUrl = this.config.root + 'api/rest/i18n/fields/standard.json';
                    if (!this.fields) {
                        return this.$http.get(resourceUrl).then(function (res) {
                            _this.fields = res.data;
                            return res.data;
                        });
                    }
                    else {
                        return this.$q.when();
                    }
                };
                Translator.prototype.translateField = function (field) {
                    var translated = this.fields.FIELD[field];
                    if (angular.isDefined(translated)) {
                        return translated;
                    }
                    else {
                        return this.classify(field);
                    }
                };
                Translator.prototype.classify = function (str) {
                    str = str.replace(/_/g, ' ');
                    return str.replace(/\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                };
                return Translator;
            })();
            translate.Translator = Translator;
        })(translate = tools.translate || (tools.translate = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="translator.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var translate;
        (function (translate) {
            'use strict';
            angular.module('vs.tools.translate', [])
                .factory('translator', function (config, $http, $q) { return new translate.Translator(config, $http, $q); })
                .constant('config', config);
        })(translate = tools.translate || (tools.translate = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImZpZWxkcy9maWVsZHMucmVzb3VyY2UudHMiLCJmaWVsZHMvZmllbGRzLm1vZHVsZS50cyIsImZpbHRlcnMvZmlsdGVycy50cyIsInBhZ2UtY29uZmlnL3BhZ2UtY29uZmlnLW1vZHVsZS50cyIsInBhZ2UtY29uZmlnL3BhZ2UtY29uZmlnLXJlc291cmNlLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkLXNlYXJjaC1tb2R1bGUudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWRTZWFyY2gucmVzb3VyY2UudHMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRvci50cyIsInRyYW5zbGF0ZS90cmFuc2xhdGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbInZzIiwidnMudG9vbHMiLCJ2cy50b29scy5Db25maWciLCJ2cy50b29scy5Db25maWcuY29uc3RydWN0b3IiLCJ2cy50b29scy5SdW5CbG9jayIsInZzLnRvb2xzLlJ1bkJsb2NrLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZmllbGRzIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZmlsdGVycyIsInZzLnRvb2xzLnBhZ2VDb25maWciLCJfZ2V0TGlzdFF1ZXJ5U3RyaW5nIiwiX2dldENvbmZpZ1F1ZXJ5U3RyaW5nIiwiX2dldFBhZ2VDb25maWdMaXN0IiwiX2dldFBhZ2VDb25maWciLCJfZGVsZXRlUGFnZUNvbmZpZyIsIl9zYXZlUGFnZUNvbmZpZyIsInZzLnRvb2xzLnNhdmVkU2VhcmNoIiwiX2dldFF1ZXJ5U3RyaW5nIiwiX2V4ZWN1dGUiLCJ2cy50b29scy50cmFuc2xhdGUiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvciIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yLmNvbnN0cnVjdG9yIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IubG9hZCIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yLnRyYW5zbGF0ZUZpZWxkIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IuY2xhc3NpZnkiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sRUFBRSxDQVlSO0FBWkQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLEtBQUtBLENBWWRBO0lBWlNBLFdBQUFBLEtBQUtBLEVBQUNBLENBQUNBO1FBQ2ZDLFlBQVlBLENBQUNBO1FBRWJBO1lBQ0VDLGdCQUFnQkE7WUFDaEJBLGdCQUFZQSxZQUE2QkE7Z0JBQ3ZDQyxhQUFhQTtnQkFDYkEsWUFBWUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hDQSw4QkFBOEJBO1lBQ2hDQSxDQUFDQTtZQUVIRCxhQUFDQTtRQUFEQSxDQVJBRCxBQVFDQyxJQUFBRDtRQVJZQSxZQUFNQSxTQVFsQkEsQ0FBQUE7SUFDSEEsQ0FBQ0EsRUFaU0QsS0FBS0EsR0FBTEEsUUFBS0EsS0FBTEEsUUFBS0EsUUFZZEE7QUFBREEsQ0FBQ0EsRUFaTSxFQUFFLEtBQUYsRUFBRSxRQVlSOztBQ1pELElBQU8sRUFBRSxDQVVSO0FBVkQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLEtBQUtBLENBVWRBO0lBVlNBLFdBQUFBLEtBQUtBLEVBQUNBLENBQUNBO1FBQ2ZDLFlBQVlBLENBQUNBO1FBRWJBO1lBQ0VHLGdCQUFnQkE7WUFDaEJBLGtCQUFZQSxJQUFvQkE7Z0JBQzlCQyxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtZQUM3QkEsQ0FBQ0E7WUFFSEQsZUFBQ0E7UUFBREEsQ0FOQUgsQUFNQ0csSUFBQUg7UUFOWUEsY0FBUUEsV0FNcEJBLENBQUFBO0lBQ0hBLENBQUNBLEVBVlNELEtBQUtBLEdBQUxBLFFBQUtBLEtBQUxBLFFBQUtBLFFBVWRBO0FBQURBLENBQUNBLEVBVk0sRUFBRSxLQUFGLEVBQUUsUUFVUjs7QUNWRCxpREFBaUQ7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S0FBS0E7UUFBQ0MsSUFBQUEsU0FBU0EsQ0FTeEJBO1FBVGVBLFdBQUFBLFNBQVNBLEVBQUNBLENBQUNBO1lBQ3pCbUIsWUFBWUEsQ0FBQ0E7WUFJYkEsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxFQUFFQSxDQUFDQTtpQkFFckNBLE9BQU9BLENBQUNBLFlBQVlBLEVBQUVBLFVBQUNBLE1BQVdBLEVBQUVBLEtBQXNCQSxFQUFFQSxFQUFnQkEsSUFBS0EsT0FBQUEsSUFBSUEsb0JBQVVBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLEVBQUVBLEVBQUVBLENBQUNBLEVBQWpDQSxDQUFpQ0EsQ0FBQ0E7aUJBQ25IQSxRQUFRQSxDQUFDQSxRQUFRQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUNoQ0EsQ0FBQ0EsRUFUZW5CLFNBQVNBLEdBQVRBLGVBQVNBLEtBQVRBLGVBQVNBLFFBU3hCQTtJQUFEQSxDQUFDQSxFQVRTRCxLQUFLQSxHQUFMQSxRQUFLQSxLQUFMQSxRQUFLQSxRQVNkQTtBQUFEQSxDQUFDQSxFQVRNLEVBQUUsS0FBRixFQUFFLFFBU1IiLCJmaWxlIjoidnMudG9vbGtpdC5taW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIENvbmZpZyB7XG4gICAgLyoqIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKCRsb2dQcm92aWRlcjogbmcuSUxvZ1Byb3ZpZGVyKSB7XG4gICAgICAvLyBlbmFibGUgbG9nXG4gICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKHRydWUpO1xuICAgICAgLy8gc2V0IG9wdGlvbnMgdGhpcmQtcGFydHkgbGliXG4gICAgfVxuXG4gIH1cbn1cbiIsIm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgUnVuQmxvY2sge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nOiBuZy5JTG9nU2VydmljZSkge1xuICAgICAgJGxvZy5kZWJ1ZygncnVuQmxvY2sgZW5kJyk7XG4gICAgfVxuXG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXguY29uZmlnLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5ydW4udHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scycsIFtdKVxuICAgIC5jb25maWcoQ29uZmlnKVxuICAgIC5ydW4oUnVuQmxvY2spXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG4vKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXG5kZWNsYXJlIHZhciBjb25maWc7XG5cbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xuJ3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpZWxkc1Jlc291cmNlIHtcblx0XHRmZXRjaChmaWVsZHM/OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xuXHRcdGdldHRpbmdIeWRyYXRpb25TdGF0cyhxdWVyeTogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBGaWVsZHNSZXNvdXJjZSBpbXBsZW1lbnRzIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0c3RhdGljIHJlZk5hbWUgPSAnZmllbGRzUmVzb3VyY2UnO1xuXG5cdFx0ZmV0Y2g6IChwcm9wZXJ0aWVzPzogc3RyaW5nKSA9PiBhbnk7XG5cdFx0Z2V0dGluZ0h5ZHJhdGlvblN0YXRzOiAocXVlcnk6IHN0cmluZykgPT4gbmcuSVByb21pc2U8YW55PjtcblxuXHRcdC8qIEBuZ0luamVjdCAqL1xuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSkge1xuXG5cdFx0XHR0aGlzLmZldGNoID0gKHByb3BlcnRpZXM/OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0dmFyIGZsID0gKHByb3BlcnRpZXMgfHwgJ25hbWUsY2F0ZWdvcnksZG9jcyxkaXNwX2VuJyk7XG5cdFx0XHRcdHJldHVybiB0aGlzLiRodHRwXG5cdFx0XHRcdFx0Lmpzb25wKGNvbmZpZy5yb290ICtcblx0XHRcdFx0XHRcdCdzb2xyL2ZpZWxkcy9zZWxlY3Q/cT0qOiomZmw9e0ZJRUxEU30mc29ydD1uYW1lJTIwYXNjJnd0PWpzb24mcm93cz0xMDAwMCZqc29uLndyZj1KU09OX0NBTExCQUNLJy5yZXBsYWNlKCd7RklFTERTfScsIGZsKSlcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbihyZXM6IGFueSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5kYXRhLnJlc3BvbnNlLmRvY3M7XG5cdFx0XHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdH07XG5cblx0XHRcdHRoaXMuZ2V0dGluZ0h5ZHJhdGlvblN0YXRzID0gKHF1ZXJ5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0Ly8gaHR0cDovL3ZveWFnZXJkZW1vLmNvbS9kYWlseS9zb2xyL3YwL3NlbGVjdD9xPWlkOitbUzE1MjBEOTQ4NzcwXSZ3dD1qc29uJnN0YXRzPXRydWUmcm93cz0xMFxuXHRcdFx0XHQvLyBxOiAnaWQ6K1snICsgc2F2ZWRTZWFyY2hJZCArICddJyxcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaCgpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oZmllbGRzOiBBcnJheTxhbnk+KSB7XG5cdFx0XHRcdFx0XHR2YXIgZmwgPSBbXTtcblx0XHRcdFx0XHRcdGZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlOiBhbnkpe1xuXHRcdFx0XHRcdFx0XHRpZiAodmFsdWUuZG9jcykge1xuXHRcdFx0XHRcdFx0XHRcdGZsLnB1c2godmFsdWUubmFtZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdFx0XHRcdFx0cGFyYW1zOiB7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0J3N0YXRzLmZpZWxkJzogZmwsXG5cdFx0XHRcdFx0XHRcdFx0d3Q6ICdqc29uJ1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy4kaHR0cC5wb3N0KFxuXHRcdFx0XHRcdFx0XHRjb25maWcucm9vdCArICdzb2xyL3YwL3NlbGVjdD9yb3dzPTEmJyArIHF1ZXJ5LFxuXHRcdFx0XHRcdFx0XHRkYXRhLCB7XG5cdFx0XHRcdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnXG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlczogYW55KSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIHJlcy5kYXRhLnN0YXRzLnN0YXRzX2ZpZWxkcykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5kYXRhLnN0YXRzLnN0YXRzX2ZpZWxkcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGZpZWxkc1tpXS5uYW1lID09PSBrZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpZWxkc1tpXS5pZCA9IGtleTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpZWxkc1tpXS5oeWRyYXRpb24gPSByZXMuZGF0YS5zdGF0cy5zdGF0c19maWVsZHNba2V5XS5jb3VudCAvIChyZXMuZGF0YS5zdGF0cy5zdGF0c19maWVsZHNba2V5XS5jb3VudCArIHJlcy5kYXRhLnN0YXRzLnN0YXRzX2ZpZWxkc1trZXldLm1pc3NpbmcpICogMTAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmllbGRzO1xuXHRcdFx0XHRcdFx0XHR9LmJpbmQodGhpcykpO1xuXG5cdFx0XHRcdFx0fS5iaW5kKHRoaXMpKTtcblxuXHRcdFx0fTtcblxuXHRcdH1cblxuXHR9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZpZWxkcy5yZXNvdXJjZS50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xuJ3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWVsZHMnLCBbXSlcblx0XHQuc2VydmljZShGaWVsZHNSZXNvdXJjZS5yZWZOYW1lLCBGaWVsZHNSZXNvdXJjZSk7XG5cbn1cbiIsIm1vZHVsZSB2cy50b29scy5maWx0ZXJzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWx0ZXJzJywgW10pXG4gICAgLmZpbHRlcigncmVwbGFjZVN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gaGF5U3RhY2sucmVwbGFjZShvbGROZWVkbGUsIG5ld05lZWRsZSk7XG4gICAgICB9O1xuICAgIH0pO1xuIH1cbiIsIm1vZHVsZSB2cy50b29scy5wYWdlQ29uZmlnIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5wYWdlQ29uZmlnJywgW10pO1xufVxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMucGFnZUNvbmZpZycpLlxuXHQvKiBAbmdJbmplY3QgKi9cblx0ZmFjdG9yeSgncGFnZUNvbmZpZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnkpIHtcblxuXHRcdCd1c2Ugc3RyaWN0JztcblxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2NvbmZpZy8nO1xuXG5cdFx0ZnVuY3Rpb24gX2dldExpc3RRdWVyeVN0cmluZygpIHtcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArICdsaXN0Jztcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQ6IHN0cmluZykge1xuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgaWQ7XG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX2dldFBhZ2VDb25maWdMaXN0KCkge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9nZXRQYWdlQ29uZmlnKGlkOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX2RlbGV0ZVBhZ2VDb25maWcoaWQ6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZShfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfc2F2ZVBhZ2VDb25maWcodGVtcGxhdGU6IGFueSkge1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoY29uZmlnVXJpLCB0ZW1wbGF0ZSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGdldFBhZ2VDb25maWdzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIF9nZXRQYWdlQ29uZmlnTGlzdCgpO1xuXHRcdFx0fSxcblx0XHRcdGdldFBhZ2VDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuIF9nZXRQYWdlQ29uZmlnKGlkKTtcblx0XHRcdH0sXG5cdFx0XHRkZWxldGVQYWdlQ29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiBfZGVsZXRlUGFnZUNvbmZpZyhpZCk7XG5cdFx0XHR9LFxuXHRcdFx0c2F2ZVBhZ2VDb25maWc6IGZ1bmN0aW9uKHRlbXBsYXRlOiBhbnkpe1xuXHRcdFx0XHRyZXR1cm4gX3NhdmVQYWdlQ29uZmlnKHRlbXBsYXRlKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbiIsIm1vZHVsZSB2cy50b29scy5zYXZlZFNlYXJjaCB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnLCBbXSk7XG59XG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXG5kZWNsYXJlIHZhciBjb25maWc7XG5cbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcpLlxuXHQvKiBAbmdJbmplY3QgKi9cbiAgZmFjdG9yeSgnc2F2ZWRTZWFyY2hSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBmdW5jdGlvbiBfZG9TYXZlKHJlcXVlc3Q6IGFueSkge1xuICAgIC8vICAgcmVxdWVzdC5xdWVyeSArPSAnL2Rpc3A9JyArIHJlcXVlc3QuY29uZmlnO1xuICAgIC8vICAgcmVxdWVzdC5wYXRoID0gcmVxdWVzdC5xdWVyeTtcbiAgICAvLyAgIC8vIHJldHVybiBzdWdhci5wb3N0SnNvbihyZXF1ZXN0LCAnZGlzcGxheScsICdzc2VhcmNoJyk7XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5U3RyaW5nKCkge1xuICAgICAgdmFyIHJvd3MgPSAxNTA7ICAvLyBAVE9ETyBzZXQgdG8gd2hhdCB3ZSByZWFsbHkgd2FudFxuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD8nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJmZsPWlkLHRpdGxlLGRlc2NyaXB0aW9uLG93bmVyLHBhdGgsc2hhcmUscXVlcnksY29uZmlnLG9yZGVyLHNhdmVkLHByaXZhdGUsdmlldyxfdmVyc2lvbl8sY29uZmlnX3RpdGxlOltjb25maWdUaXRsZV0nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKCkge1xuICAgICAgcmV0dXJuICRodHRwLmpzb25wKF9nZXRRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YS5yZXNwb25zZS5kb2NzO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNhdmVkU2VhcmNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIHNhdmVTZWFyY2g6IGZ1bmN0aW9uKHNhdmVkU2VhcmNoLCBwYXJhbXMpIHtcbiAgICAgIC8vICAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xuICAgICAgLy8gICBzYXZlZFNlYXJjaC5xdWVyeSA9IGNvbnZlcnRlci50b0NsYXNzaWNQYXJhbXMocGFyYW1zKTtcbiAgICAgIC8vICAgcmV0dXJuIF9kb1NhdmUoc2F2ZWRTZWFyY2gpO1xuICAgICAgLy8gfSxcblxuICAgICAgZGVsZXRlU2VhcmNoOiBmdW5jdGlvbihpZDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIC8vIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcbiAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZDogYW55LCBiZWZvcmVJZDogYW55LCBhZnRlcklkOiBhbnkpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYgKGJlZm9yZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYmVmb3JlPScgKyBiZWZvcmVJZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YSAhPT0gJycpIHtcbiAgICAgICAgICBkYXRhICs9ICcmJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZnRlcklkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYWZ0ZXI9JyArIGFmdGVySWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwibW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG5cbiAgZXhwb3J0IGNsYXNzIFRyYW5zbGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBmaWVsZHM6IGFueSA9IG51bGw7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UsIHByaXZhdGUgJHE6IG5nLklRU2VydmljZSkge1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKCkge1xuICAgICAgdmFyIHJlc291cmNlVXJsID0gdGhpcy5jb25maWcucm9vdCArICdhcGkvcmVzdC9pMThuL2ZpZWxkcy9zdGFuZGFyZC5qc29uJztcblxuICAgICAgaWYgKCF0aGlzLmZpZWxkcykge1xuICAgICAgICByZXR1cm4gdGhpcy4kaHR0cC5nZXQocmVzb3VyY2VVcmwpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5maWVsZHMgPSByZXMuZGF0YTtcbiAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJHEud2hlbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0cmFuc2xhdGVGaWVsZChmaWVsZDogc3RyaW5nKSB7XG4gICAgICB2YXIgdHJhbnNsYXRlZCA9IHRoaXMuZmllbGRzLkZJRUxEW2ZpZWxkXTtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0cmFuc2xhdGVkKSkge1xuICAgICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsYXNzaWZ5KHN0cjogc3RyaW5nKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uKHR4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0cmFuc2xhdG9yLnRzXCIgLz5cbm1vZHVsZSB2cy50b29scy50cmFuc2xhdGUge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy50cmFuc2xhdGUnLCBbXSlcbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICAuZmFjdG9yeSgndHJhbnNsYXRvcicsIChjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgJHE6IG5nLklRU2VydmljZSkgPT4gbmV3IFRyYW5zbGF0b3IoY29uZmlnLCAkaHR0cCwgJHEpKVxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
//# sourceMappingURL=maps/vs.toolkit.src.js.map