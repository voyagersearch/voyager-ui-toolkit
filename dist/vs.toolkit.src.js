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
        angular.module('vs.tools', []).config(tools.Config).run(tools.RunBlock).constant('config', config);
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var util;
        (function (util) {
            var Sugar = (function () {
                function Sugar(config, $http) {
                    this.config = config;
                    this.$http = $http;
                }
                Sugar.isString = function (val) {
                    return (typeof val === 'string' || val instanceof String);
                };
                Sugar.getInstance = function (config, $http) {
                    return new Sugar(config, $http);
                };
                Sugar.prototype.toMap = function (key, array) {
                    var map = {};
                    array.forEach(function (value) {
                        map[value[key]] = value;
                    });
                    return map;
                };
                Sugar.prototype.toStringMap = function (array) {
                    var map = {};
                    array.forEach(function (value) {
                        map[value] = value;
                    });
                    return map;
                };
                Sugar.prototype.pluck = function (array, name, fn) {
                    var fl = [];
                    array.forEach(function (value) {
                        if (fn && fn(value)) {
                            fl.push(value[name]);
                        }
                        else if (angular.isUndefined(fn)) {
                            fl.push(value[name]);
                        }
                    });
                    return fl;
                };
                Sugar.prototype.postForm = function (url, data) {
                    var service = this.config.root + url;
                    return this.$http({
                        method: 'POST',
                        url: service,
                        data: data,
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                };
                Sugar.prototype.postJson = function (request, api, action) {
                    return this.$http({
                        method: 'POST',
                        url: config.root + 'api/rest/' + api + '/' + action + '.json',
                        data: request,
                        headers: { 'Content-Type': 'application/json' }
                    });
                };
                return Sugar;
            })();
            util.Sugar = Sugar;
        })(util = tools.util || (tools.util = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="../util/sugar.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var fields;
        (function (_fields) {
            'use strict';
            var FieldsResource = (function () {
                /* @ngInject */
                function FieldsResource(sugar) {
                    var _this = this;
                    this.sugar = sugar;
                    this.fetch = function (fields) {
                        var fl = (fields || 'name,category,docs,disp_en');
                        return sugar.postForm('solr/fields/select', _this.getFieldsParams(fl)).then(function (res) {
                            return res.data.response.docs;
                        });
                    };
                    this.fetchHydrationStats = function (query) {
                        return _this.fetch().then(function (fields) {
                            var fl = sugar.pluck(fields, 'name', function (field) {
                                return field.name.indexOf('_') !== 0 && field.docs > 0;
                            });
                            return sugar.postForm('solr/v0/select?' + query, _this.getStatsParams(fl)).then(function (res) {
                                var statsFields = res.data.facet_counts.facet_fields;
                                var total = res.data.response.numFound;
                                _this.applyHydration(statsFields, fields, total);
                                return fields;
                            });
                        });
                    };
                }
                FieldsResource.prototype.getFieldsParams = function (fl) {
                    return 'q=*:*&fl=' + fl + '&rows=10000&sort=name%20asc&wt=json';
                };
                FieldsResource.prototype.getStatsParams = function (fl) {
                    return 'facet=true&facet.limit=10000&facet.mincount=100&rows=0&wt=json&facet.field=' + fl.join('&facet.field=');
                };
                FieldsResource.prototype.applyHydration = function (statsFields, fields, total) {
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
                };
                FieldsResource.prototype.getCount = function (field) {
                    var count = 0;
                    for (var i = 1; i < field.length; i += 2) {
                        count += field[i];
                    }
                    return count;
                };
                FieldsResource.refName = 'fieldsResource';
                return FieldsResource;
            })();
            _fields.FieldsResource = FieldsResource;
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
            angular.module('vs.tools.fields', ['vs.tools.util']).service(fields.FieldsResource.refName, fields.FieldsResource);
        })(fields = tools.fields || (tools.fields = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var displayConfig;
        (function (displayConfig) {
            'use strict';
            angular.module('vs.tools.displayConfig', []);
        })(displayConfig = tools.displayConfig || (tools.displayConfig = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.displayConfig').factory('displayConfigResource', function ($http) {
    'use strict';
    var configUri = config.root + 'api/rest/display/display_config/';
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
    function _getDisplayConfigList() {
        return $http.get(_getListQueryString()).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _getDisplayConfig(id) {
        return $http.get(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _deleteDisplayConfig(id) {
        return $http.delete(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _saveDisplayConfig(template) {
        return $http.post(configUri, template).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        getDisplayConfigs: function () {
            return _getDisplayConfigList();
        },
        getDisplayConfig: function (id) {
            return _getDisplayConfig(id);
        },
        deleteDisplayConfig: function (id) {
            return _deleteDisplayConfig(id);
        },
        saveDisplayConfig: function (template) {
            return _saveDisplayConfig(template);
        }
    };
});

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var filters;
        (function (filters) {
            'use strict';
            angular.module('vs.tools.filters', []).filter('replaceString', function () {
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

angular.module('vs.tools.pageConfig').factory('pageConfigResource', function ($http) {
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
            angular.module('vs.tools.savedSearch', ['vs.tools.util']);
        })(savedSearch = tools.savedSearch || (tools.savedSearch = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.savedSearch').factory('savedSearchResource', function ($http, sugar) {
    'use strict';
    function _doSave(savedSearch) {
        savedSearch.query += '/disp=' + savedSearch.config;
        savedSearch.path = savedSearch.query;
        return sugar.postJson(savedSearch, 'display', 'ssearch');
    }
    function _getQueryString(id) {
        var rows = 150; // @TODO set to what we really want
        var queryString = config.root + 'solr/ssearch/select?';
        queryString += 'rows=' + rows + '&rand=' + Math.random();
        queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle]';
        queryString += '&wt=json&json.wrf=JSON_CALLBACK';
        if (angular.isDefined(id)) {
            queryString += '&fq=id:' + id;
        }
        return queryString;
    }
    function _execute(id) {
        return $http.jsonp(_getQueryString(id)).then(function (data) {
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
        fetch: function (id) {
            return _execute(id).then(function (docs) {
                return docs[0];
            });
        },
        saveSearch: function (savedSearch, params) {
            //  savedSearch.config = configService.getConfigId();
            //  savedSearch.query = converter.toClassicParams(params);
            return _doSave(savedSearch);
        },
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

/// <reference path="sugar.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var util;
        (function (util) {
            'use strict';
            angular.module('vs.tools.util', []).factory('sugar', function (config, $http) { return util.Sugar.getInstance(config, $http); });
        })(util = tools.util || (tools.util = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

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
            angular.module('vs.tools.translate', []).factory('translator', function (config, $http, $q) { return new translate.Translator(config, $http, $q); }).constant('config', config);
        })(translate = tools.translate || (tools.translate = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsInV0aWwvc3VnYXIudHMiLCJmaWVsZHMvZmllbGRzLnJlc291cmNlLnRzIiwiZmllbGRzL2ZpZWxkcy5tb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnTW9kdWxlLnRzIiwiZGlzcGxheS1jb25maWcvRGlzcGxheUNvbmZpZ1Jlc291cmNlLnRzIiwiZmlsdGVycy9maWx0ZXJzLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctbW9kdWxlLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctcmVzb3VyY2UudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInV0aWwvdXRpbC5tb2R1bGUudHMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRvci50cyIsInRyYW5zbGF0ZS90cmFuc2xhdGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbInZzIiwidnMudG9vbHMiLCJ2cy50b29scy5Db25maWciLCJ2cy50b29scy5Db25maWcuY29uc3RydWN0b3IiLCJ2cy50b29scy5SdW5CbG9jayIsInZzLnRvb2xzLlJ1bkJsb2NrLmNvbnN0cnVjdG9yIiwidnMudG9vbHMudXRpbCIsInZzLnRvb2xzLnV0aWwuU3VnYXIiLCJ2cy50b29scy51dGlsLlN1Z2FyLmNvbnN0cnVjdG9yIiwidnMudG9vbHMudXRpbC5TdWdhci5pc1N0cmluZyIsInZzLnRvb2xzLnV0aWwuU3VnYXIuZ2V0SW5zdGFuY2UiLCJ2cy50b29scy51dGlsLlN1Z2FyLnRvTWFwIiwidnMudG9vbHMudXRpbC5TdWdhci50b1N0cmluZ01hcCIsInZzLnRvb2xzLnV0aWwuU3VnYXIucGx1Y2siLCJ2cy50b29scy51dGlsLlN1Z2FyLnBvc3RGb3JtIiwidnMudG9vbHMudXRpbC5TdWdhci5wb3N0SnNvbiIsInZzLnRvb2xzLmZpZWxkcyIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZSIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZS5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZS5nZXRGaWVsZHNQYXJhbXMiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuZ2V0U3RhdHNQYXJhbXMiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuYXBwbHlIeWRyYXRpb24iLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuZ2V0Q291bnQiLCJ2cy50b29scy5kaXNwbGF5Q29uZmlnIiwiX2dldExpc3RRdWVyeVN0cmluZyIsIl9nZXRDb25maWdRdWVyeVN0cmluZyIsIl9nZXREaXNwbGF5Q29uZmlnTGlzdCIsIl9nZXREaXNwbGF5Q29uZmlnIiwiX2RlbGV0ZURpc3BsYXlDb25maWciLCJfc2F2ZURpc3BsYXlDb25maWciLCJ2cy50b29scy5maWx0ZXJzIiwidnMudG9vbHMucGFnZUNvbmZpZyIsIl9nZXRQYWdlQ29uZmlnTGlzdCIsIl9nZXRQYWdlQ29uZmlnIiwiX2RlbGV0ZVBhZ2VDb25maWciLCJfc2F2ZVBhZ2VDb25maWciLCJ2cy50b29scy5zYXZlZFNlYXJjaCIsIl9kb1NhdmUiLCJfZ2V0UXVlcnlTdHJpbmciLCJfZXhlY3V0ZSIsInZzLnRvb2xzLnRyYW5zbGF0ZSIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IuY29uc3RydWN0b3IiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5sb2FkIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IudHJhbnNsYXRlRmllbGQiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5jbGFzc2lmeSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxFQUFFLENBWVI7QUFaRCxXQUFPLEVBQUU7SUFBQ0EsSUFBQUEsS0FB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QUFDQSxFQXZDTSxFQUFFLEtBQUYsRUFBRSxRQXVDUjs7QUN2Q0QsQUFDQSxzQ0FEc0M7QUFDdEMsSUFBTyxFQUFFLENBU1I7QUFURCxXQUFPLEVBQUU7SUFBQ0EsSUFBQUEsS0FBS0EsQ0FTZEE7SUFUU0EsV0FBQUEsS0FBS0E7UUFBQ0MsSUFBQUEsU0FBU0EsQ0FTeEJBO1FBVGVBLFdBQUFBLFNBQVNBLEVBQUNBLENBQUNBO1lBQ3pCdUMsWUFBWUEsQ0FBQ0E7WUFJYkEsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUVyQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsRUFBRUEsVUFBQ0EsTUFBV0EsRUFBRUEsS0FBc0JBLEVBQUVBLEVBQWdCQSxJQUFLQSxXQUFJQSxvQkFBVUEsQ0FBQ0EsTUFBTUEsRUFBRUEsS0FBS0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBakNBLENBQWlDQSxDQUFDQSxDQUNuSEEsUUFBUUEsQ0FBQ0EsUUFBUUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDaENBLENBQUNBLEVBVGV2QyxTQUFTQSxHQUFUQSxlQUFTQSxLQUFUQSxlQUFTQSxRQVN4QkE7SUFBREEsQ0FBQ0EsRUFUU0QsS0FBS0EsR0FBTEEsUUFBS0EsS0FBTEEsUUFBS0EsUUFTZEE7QUFBREEsQ0FBQ0EsRUFUTSxFQUFFLEtBQUYsRUFBRSxRQVNSIiwiZmlsZSI6InZzLnRvb2xraXQubWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBDb25maWcge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nUHJvdmlkZXI6IG5nLklMb2dQcm92aWRlcikge1xuICAgICAgLy8gZW5hYmxlIGxvZ1xuICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCh0cnVlKTtcbiAgICAgIC8vIHNldCBvcHRpb25zIHRoaXJkLXBhcnR5IGxpYlxuICAgIH1cblxuICB9XG59XG4iLCJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIFJ1bkJsb2NrIHtcbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJGxvZzogbmcuSUxvZ1NlcnZpY2UpIHtcbiAgICAgICRsb2cuZGVidWcoJ3J1bkJsb2NrIGVuZCcpO1xuICAgIH1cblxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LmNvbmZpZy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXgucnVuLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMnLCBbXSlcbiAgICAuY29uZmlnKENvbmZpZylcbiAgICAucnVuKFJ1bkJsb2NrKVxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcbn1cbiIsIm1vZHVsZSB2cy50b29scy51dGlsIHtcblxuXHRleHBvcnQgY2xhc3MgU3VnYXIge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IGFueSwgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlKSB7fVxuXG5cdFx0cHVibGljIHN0YXRpYyBpc1N0cmluZyh2YWw6IGFueSkge1xuXHRcdFx0cmV0dXJuICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCB2YWwgaW5zdGFuY2VvZiBTdHJpbmcpO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBnZXRJbnN0YW5jZShjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSkgOiBTdWdhciB7XG5cdFx0XHRyZXR1cm4gbmV3IFN1Z2FyKGNvbmZpZywgJGh0dHApO1xuXHRcdH1cblxuXHRcdHRvTWFwKGtleTogYW55LCBhcnJheTogYW55KSB7XG5cdFx0XHR2YXIgbWFwID0ge307XG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG5cdFx0XHRcdG1hcFt2YWx1ZVtrZXldXSA9IHZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbWFwO1xuXHRcdH1cblxuXHRcdHRvU3RyaW5nTWFwKGFycmF5OiBhbnkpIHtcblx0XHRcdHZhciBtYXAgPSB7fTtcblx0XHRcdGFycmF5LmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcblx0XHRcdFx0bWFwW3ZhbHVlXSA9IHZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbWFwO1xuXHRcdH1cblxuICAgIHBsdWNrKGFycmF5OiBhbnksIG5hbWU6IHN0cmluZywgZm4/OiBGdW5jdGlvbikge1xuICAgICAgdmFyIGZsID0gW107XG4gICAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlOiBhbnkpe1xuICAgICAgICBpZiAoZm4gJiYgZm4odmFsdWUpKSB7XG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChmbikpIHtcbiAgICAgICAgICBmbC5wdXNoKHZhbHVlW25hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmw7XG4gICAgfVxuXG4gICAgcG9zdEZvcm0odXJsOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgICAgdmFyIHNlcnZpY2UgPSB0aGlzLmNvbmZpZy5yb290ICsgdXJsO1xuICAgICAgcmV0dXJuIHRoaXMuJGh0dHAoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXJsOiBzZXJ2aWNlLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcG9zdEpzb24ocmVxdWVzdCwgYXBpLCBhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLiRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVybDogY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvJyArIGFwaSAgKyAnLycgKyBhY3Rpb24gKyAnLmpzb24nLFxuICAgICAgICBkYXRhOiByZXF1ZXN0LFxuICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgIH0pO1xuICAgIH1cblx0fVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdXRpbC9zdWdhci50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xuJ3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpZWxkc1Jlc291cmNlIHtcblx0XHRmZXRjaChmaWVsZHM/OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xuXHRcdGZldGNoSHlkcmF0aW9uU3RhdHMocXVlcnk6IHN0cmluZyk6IG5nLklQcm9taXNlPGFueT47XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgRmllbGRzUmVzb3VyY2UgaW1wbGVtZW50cyBJRmllbGRzUmVzb3VyY2Uge1xuXHRcdHN0YXRpYyByZWZOYW1lID0gJ2ZpZWxkc1Jlc291cmNlJztcblxuXHRcdGZldGNoOiAocHJvcGVydGllcz86IHN0cmluZykgPT4gYW55O1xuXHRcdGZldGNoSHlkcmF0aW9uU3RhdHM6IChxdWVyeTogc3RyaW5nKSA9PiBhbnk7XG5cblx0XHQvKiBAbmdJbmplY3QgKi9cblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHN1Z2FyOiBhbnkpIHtcblxuXHRcdFx0dGhpcy5mZXRjaCA9IChmaWVsZHM/OiBhbnkpID0+IHtcblx0XHRcdFx0dmFyIGZsID0gKGZpZWxkcyB8fCAnbmFtZSxjYXRlZ29yeSxkb2NzLGRpc3BfZW4nKTtcblx0XHRcdFx0cmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdzb2xyL2ZpZWxkcy9zZWxlY3QnLCB0aGlzLmdldEZpZWxkc1BhcmFtcyhmbCkpLnRoZW4oKHJlczogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzLmRhdGEucmVzcG9uc2UuZG9jcztcblx0XHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdHRoaXMuZmV0Y2hIeWRyYXRpb25TdGF0cyA9IChxdWVyeTogc3RyaW5nKSA9PiB7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2goKS50aGVuKChmaWVsZHM6IEFycmF5PGFueT4pID0+IHtcbiAgICAgICAgICB2YXIgZmwgPSBzdWdhci5wbHVjayhmaWVsZHMsICduYW1lJywgZnVuY3Rpb24oZmllbGQpIHsgcmV0dXJuIGZpZWxkLm5hbWUuaW5kZXhPZignXycpICE9PSAwICYmIGZpZWxkLmRvY3MgPiAwOyB9KTtcblxuICAgICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci92MC9zZWxlY3Q/JyArIHF1ZXJ5LCB0aGlzLmdldFN0YXRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHZhciBzdGF0c0ZpZWxkcyA9IHJlcy5kYXRhLmZhY2V0X2NvdW50cy5mYWNldF9maWVsZHM7XG4gICAgICAgICAgICB2YXIgdG90YWwgPSByZXMuZGF0YS5yZXNwb25zZS5udW1Gb3VuZDtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblx0XHRcdH07XG5cblx0XHR9XG5cbiAgICBwcml2YXRlIGdldEZpZWxkc1BhcmFtcyhmbCkge1xuICAgICAgcmV0dXJuICdxPSo6KiZmbD0nICsgZmwgKyAnJnJvd3M9MTAwMDAmc29ydD1uYW1lJTIwYXNjJnd0PWpzb24nO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBnZXRTdGF0c1BhcmFtcyhmbCkge1xuICAgICAgcmV0dXJuICdmYWNldD10cnVlJmZhY2V0LmxpbWl0PTEwMDAwJmZhY2V0Lm1pbmNvdW50PTEwMCZyb3dzPTAmd3Q9anNvbiZmYWNldC5maWVsZD0nICsgZmwuam9pbignJmZhY2V0LmZpZWxkPScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpIHtcbiAgICAgIHZhciBzdGF0c0ZpZWxkLCBjb3VudDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0YXRzRmllbGQgPSBzdGF0c0ZpZWxkc1tmaWVsZHNbaV0ubmFtZV07XG4gICAgICAgIGlmIChzdGF0c0ZpZWxkICYmIHN0YXRzRmllbGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkc1tpXS5pZCA9IGZpZWxkc1tpXS5uYW1lO1xuICAgICAgICAgIGNvdW50ID0gdGhpcy5nZXRDb3VudChzdGF0c0ZpZWxkKTtcbiAgICAgICAgICBmaWVsZHNbaV0uaHlkcmF0aW9uID0gY291bnQgLyB0b3RhbCAqIDEwMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb3VudChmaWVsZCkge1xuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZmllbGQubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgY291bnQgKz0gZmllbGRbaV07XG4gICAgICB9XG4gICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuXG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZmllbGRzLnJlc291cmNlLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzLmZpZWxkcyB7XG4ndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmZpZWxkcycsIFsndnMudG9vbHMudXRpbCddKVxuXHRcdC5zZXJ2aWNlKEZpZWxkc1Jlc291cmNlLnJlZk5hbWUsIEZpZWxkc1Jlc291cmNlKTtcblxufVxuIiwibW9kdWxlIHZzLnRvb2xzLmRpc3BsYXlDb25maWcge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnLCBbXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZGlzcGxheUNvbmZpZycpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG5cdGZhY3RvcnkoJ2Rpc3BsYXlDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XHJcblxyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2Rpc3BsYXlfY29uZmlnLyc7XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldExpc3RRdWVyeVN0cmluZygpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgJ2xpc3QnO1xyXG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyBpZDtcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldERpc3BsYXlDb25maWdMaXN0KCkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRMaXN0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldERpc3BsYXlDb25maWcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9kZWxldGVEaXNwbGF5Q29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZShfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfc2F2ZURpc3BsYXlDb25maWcodGVtcGxhdGU6IGFueSkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChjb25maWdVcmksIHRlbXBsYXRlKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnZXREaXNwbGF5Q29uZmlnczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXREaXNwbGF5Q29uZmlnTGlzdCgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXREaXNwbGF5Q29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXREaXNwbGF5Q29uZmlnKGlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGVsZXRlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNhdmVEaXNwbGF5Q29uZmlnOiBmdW5jdGlvbih0ZW1wbGF0ZTogYW55KXtcclxuXHRcdFx0XHRyZXR1cm4gX3NhdmVEaXNwbGF5Q29uZmlnKHRlbXBsYXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTtcclxuIiwibW9kdWxlIHZzLnRvb2xzLmZpbHRlcnMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmZpbHRlcnMnLCBbXSlcclxuICAgIC5maWx0ZXIoJ3JlcGxhY2VTdHJpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBoYXlTdGFjay5yZXBsYWNlKG9sZE5lZWRsZSwgbmV3TmVlZGxlKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gfVxyXG4iLCJtb2R1bGUgdnMudG9vbHMucGFnZUNvbmZpZyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMucGFnZUNvbmZpZycsIFtdKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5wYWdlQ29uZmlnJykuXHJcblx0LyogQG5nSW5qZWN0ICovXHJcblx0ZmFjdG9yeSgncGFnZUNvbmZpZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnkpIHtcclxuXHJcblx0XHQndXNlIHN0cmljdCc7XHJcblxyXG5cdFx0dmFyIGNvbmZpZ1VyaSA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvY29uZmlnLyc7XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldExpc3RRdWVyeVN0cmluZygpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgJ2xpc3QnO1xyXG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyBpZDtcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldFBhZ2VDb25maWdMaXN0KCkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRMaXN0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldFBhZ2VDb25maWcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9kZWxldGVQYWdlQ29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZShfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfc2F2ZVBhZ2VDb25maWcodGVtcGxhdGU6IGFueSkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChjb25maWdVcmksIHRlbXBsYXRlKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnZXRQYWdlQ29uZmlnczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXRQYWdlQ29uZmlnTGlzdCgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRQYWdlQ29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXRQYWdlQ29uZmlnKGlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGVsZXRlUGFnZUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZGVsZXRlUGFnZUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNhdmVQYWdlQ29uZmlnOiBmdW5jdGlvbih0ZW1wbGF0ZTogYW55KXtcclxuXHRcdFx0XHRyZXR1cm4gX3NhdmVQYWdlQ29uZmlnKHRlbXBsYXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTtcclxuIiwibW9kdWxlIHZzLnRvb2xzLnNhdmVkU2VhcmNoIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcsIFsndnMudG9vbHMudXRpbCddKTtcbn1cbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cbmRlY2xhcmUgdmFyIGNvbmZpZztcblxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnNhdmVkU2VhcmNoJykuXG5cdC8qIEBuZ0luamVjdCAqL1xuICBmYWN0b3J5KCdzYXZlZFNlYXJjaFJlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnksIHN1Z2FyKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgZnVuY3Rpb24gX2RvU2F2ZShzYXZlZFNlYXJjaDogYW55KSB7XG4gICAgICAgc2F2ZWRTZWFyY2gucXVlcnkgKz0gJy9kaXNwPScgKyBzYXZlZFNlYXJjaC5jb25maWc7XG4gICAgICAgc2F2ZWRTZWFyY2gucGF0aCA9IHNhdmVkU2VhcmNoLnF1ZXJ5O1xuICAgICAgIHJldHVybiBzdWdhci5wb3N0SnNvbihzYXZlZFNlYXJjaCwgJ2Rpc3BsYXknLCAnc3NlYXJjaCcpO1xuICAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlTdHJpbmcoaWQ/OiBzdHJpbmcpIHtcbiAgICAgIHZhciByb3dzID0gMTUwOyAgLy8gQFRPRE8gc2V0IHRvIHdoYXQgd2UgcmVhbGx5IHdhbnRcbiAgICAgIHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZy5yb290ICsgJ3NvbHIvc3NlYXJjaC9zZWxlY3Q/JztcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICdyb3dzPScgKyByb3dzICsgJyZyYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmbD1pZCx0aXRsZSxkZXNjcmlwdGlvbixvd25lcixwYXRoLHNoYXJlLHF1ZXJ5LGNvbmZpZyxvcmRlcixzYXZlZCxwcml2YXRlLHZpZXcsX3ZlcnNpb25fLGNvbmZpZ190aXRsZTpbY29uZmlnVGl0bGVdJztcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmd3Q9anNvbiZqc29uLndyZj1KU09OX0NBTExCQUNLJztcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChpZCkpIHtcbiAgICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmcT1pZDonICsgaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcXVlcnlTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2V4ZWN1dGUoaWQ/OiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiAkaHR0cC5qc29ucChfZ2V0UXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YS5yZXNwb25zZS5kb2NzO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNhdmVkU2VhcmNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIGZldGNoOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoaWQpLnRoZW4oZnVuY3Rpb24oZG9jcykge1xuICAgICAgICAgIHJldHVybiBkb2NzWzBdO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHNhdmVTZWFyY2g6IGZ1bmN0aW9uKHNhdmVkU2VhcmNoLCBwYXJhbXMpIHtcbiAgICAgICAvLyAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xuICAgICAgIC8vICBzYXZlZFNlYXJjaC5xdWVyeSA9IGNvbnZlcnRlci50b0NsYXNzaWNQYXJhbXMocGFyYW1zKTtcbiAgICAgICByZXR1cm4gX2RvU2F2ZShzYXZlZFNlYXJjaCk7XG4gICAgICB9LFxuXG4gICAgICBkZWxldGVTZWFyY2g6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgLy8gb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgIC8vICAgZW50cnkoaWQpO1xuICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgb3JkZXI6IGZ1bmN0aW9uKGlkOiBhbnksIGJlZm9yZUlkOiBhbnksIGFmdGVySWQ6IGFueSkge1xuICAgICAgICB2YXIgZGF0YSA9ICcnO1xuICAgICAgICBpZiAoYmVmb3JlSWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdiZWZvcmU9JyArIGJlZm9yZUlkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhICE9PSAnJykge1xuICAgICAgICAgIGRhdGEgKz0gJyYnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFmdGVySWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdhZnRlcj0nICsgYWZ0ZXJJZDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQgKyAnL29yZGVyJywgZGF0YSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VnYXIudHNcIiAvPlxubW9kdWxlIHZzLnRvb2xzLnV0aWwge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnV0aWwnLCBbXSlcbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICAuZmFjdG9yeSgnc3VnYXInLCAoY29uZmlnLCAkaHR0cCkgPT4gU3VnYXIuZ2V0SW5zdGFuY2UoY29uZmlnLCAkaHR0cCkpO1xufVxuIiwibW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG5cbiAgZXhwb3J0IGNsYXNzIFRyYW5zbGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBmaWVsZHM6IGFueSA9IG51bGw7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UsIHByaXZhdGUgJHE6IG5nLklRU2VydmljZSkge1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKCkge1xuICAgICAgdmFyIHJlc291cmNlVXJsID0gdGhpcy5jb25maWcucm9vdCArICdhcGkvcmVzdC9pMThuL2ZpZWxkcy9zdGFuZGFyZC5qc29uJztcblxuICAgICAgaWYgKCF0aGlzLmZpZWxkcykge1xuICAgICAgICByZXR1cm4gdGhpcy4kaHR0cC5nZXQocmVzb3VyY2VVcmwpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5maWVsZHMgPSByZXMuZGF0YTtcbiAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJHEud2hlbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0cmFuc2xhdGVGaWVsZChmaWVsZDogc3RyaW5nKSB7XG4gICAgICB2YXIgdHJhbnNsYXRlZCA9IHRoaXMuZmllbGRzLkZJRUxEW2ZpZWxkXTtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0cmFuc2xhdGVkKSkge1xuICAgICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsYXNzaWZ5KHN0cjogc3RyaW5nKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uKHR4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0cmFuc2xhdG9yLnRzXCIgLz5cbm1vZHVsZSB2cy50b29scy50cmFuc2xhdGUge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy50cmFuc2xhdGUnLCBbXSlcbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICAuZmFjdG9yeSgndHJhbnNsYXRvcicsIChjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgJHE6IG5nLklRU2VydmljZSkgPT4gbmV3IFRyYW5zbGF0b3IoY29uZmlnLCAkaHR0cCwgJHEpKVxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
//# sourceMappingURL=maps/vs.toolkit.src.js.map