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
                Sugar.prototype.parseQueryString = function (queryString) {
                    var pairs = queryString.slice(1).split('&');
                    var result = {}, s;
                    pairs.forEach(function (pair) {
                        s = pair.split('=');
                        result[s[0]] = decodeURIComponent(s[1] || '');
                    });
                    return JSON.parse(JSON.stringify(result));
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
        queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle],param*';
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
        },
        fetchLabels: function () {
            var url = config.root + 'solr/ssearch/select?rows=0&facet=true&facet.field=labels&wt=json&r=' + new Date().getTime();
            return $http.get(url).then(function (resp) {
                return resp.data.facet_counts.facet_fields.labels;
            }, function () {
                return [];
            });
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
            angular.module('vs.tools.translate', []).factory('translator', function (config, $http, $q) { return new translate.Translator(config, $http, $q); }).constant('config', config);
        })(translate = tools.translate || (tools.translate = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdNb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnUmVzb3VyY2UudHMiLCJ1dGlsL3N1Z2FyLnRzIiwiZmllbGRzL2ZpZWxkcy5yZXNvdXJjZS50cyIsImZpZWxkcy9maWVsZHMubW9kdWxlLnRzIiwiZmlsdGVycy9maWx0ZXJzLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctbW9kdWxlLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctcmVzb3VyY2UudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInRyYW5zbGF0ZS90cmFuc2xhdG9yLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5tb2R1bGUudHMiLCJ1dGlsL3V0aWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbInZzIiwidnMudG9vbHMiLCJ2cy50b29scy5Db25maWciLCJ2cy50b29scy5Db25maWcuY29uc3RydWN0b3IiLCJ2cy50b29scy5SdW5CbG9jayIsInZzLnRvb2xzLlJ1bkJsb2NrLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZGlzcGxheUNvbmZpZyIsIl9nZXRMaXN0UXVlcnlTdHJpbmciLCJfZ2V0Q29uZmlnUXVlcnlTdHJpbmciLCJfZ2V0RGlzcGxheUNvbmZpZ0xpc3QiLCJfZ2V0RGlzcGxheUNvbmZpZyIsIl9kZWxldGVEaXNwbGF5Q29uZmlnIiwiX3NhdmVEaXNwbGF5Q29uZmlnIiwidnMudG9vbHMudXRpbCIsInZzLnRvb2xzLnV0aWwuU3VnYXIiLCJ2cy50b29scy51dGlsLlN1Z2FyLmNvbnN0cnVjdG9yIiwidnMudG9vbHMudXRpbC5TdWdhci5pc1N0cmluZyIsInZzLnRvb2xzLnV0aWwuU3VnYXIuZ2V0SW5zdGFuY2UiLCJ2cy50b29scy51dGlsLlN1Z2FyLnRvTWFwIiwidnMudG9vbHMudXRpbC5TdWdhci50b1N0cmluZ01hcCIsInZzLnRvb2xzLnV0aWwuU3VnYXIucGx1Y2siLCJ2cy50b29scy51dGlsLlN1Z2FyLnBvc3RGb3JtIiwidnMudG9vbHMudXRpbC5TdWdhci5wYXJzZVF1ZXJ5U3RyaW5nIiwidnMudG9vbHMudXRpbC5TdWdhci5wb3N0SnNvbiIsInZzLnRvb2xzLmZpZWxkcyIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZSIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZS5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZS5nZXRGaWVsZHNQYXJhbXMiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuZ2V0U3RhdHNQYXJhbXMiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuYXBwbHlIeWRyYXRpb24iLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuZ2V0Q291bnQiLCJ2cy50b29scy5maWx0ZXJzIiwidnMudG9vbHMucGFnZUNvbmZpZyIsIl9nZXRQYWdlQ29uZmlnTGlzdCIsIl9nZXRQYWdlQ29uZmlnIiwiX2RlbGV0ZVBhZ2VDb25maWciLCJfc2F2ZVBhZ2VDb25maWciLCJ2cy50b29scy5zYXZlZFNlYXJjaCIsIl9kb1NhdmUiLCJfZ2V0UXVlcnlTdHJpbmciLCJfZXhlY3V0ZSIsInZzLnRvb2xzLnRyYW5zbGF0ZSIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IuY29uc3RydWN0b3IiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5sb2FkIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IudHJhbnNsYXRlRmllbGQiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5jbGFzc2lmeSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxF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QUFMQSxRQUFLQSxRQVNkQTtBQUFEQSxDQUFDQSxFQVRNLEVBQUUsS0FBRixFQUFFLFFBU1I7O0FDVkQsQUFDQSxpQ0FEaUM7QUFDakMsSUFBTyxFQUFFLENBTVI7QUFORCxXQUFPLEVBQUU7SUFBQ0EsSUFBQUEsS0FBS0EsQ0FNZEE7SUFOU0EsV0FBQUEsS0FBS0E7UUFBQ0MsSUFBQUEsSUFBSUEsQ0FNbkJBO1FBTmVBLFdBQUFBLElBQUlBLEVBQUNBLENBQUNBO1lBQ3BCWSxZQUFZQSxDQUFDQTtZQUViQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUVoQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsRUFBRUEsVUFBQ0EsTUFBTUEsRUFBRUEsS0FBS0EsSUFBS0EsT0FBQUEsVUFBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsRUFBRUEsS0FBS0EsQ0FBQ0EsRUFBaENBLENBQWdDQSxDQUFDQSxDQUFDQTtRQUMzRUEsQ0FBQ0EsRUFOZVosSUFBSUEsR0FBSkEsVUFBSUEsS0FBSkEsVUFBSUEsUUFNbkJBO0lBQURBLENBQUNBLEVBTlNELEtBQUtBLEdBQUxBLFFBQUtBLEtBQUxBLFFBQUtBLFFBTWRBO0FBQURBLENBQUNBLEVBTk0sRUFBRSxLQUFGLEVBQUUsUUFNUiIsImZpbGUiOiJ2cy50b29sa2l0Lm1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgQ29uZmlnIHtcbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJGxvZ1Byb3ZpZGVyOiBuZy5JTG9nUHJvdmlkZXIpIHtcbiAgICAgIC8vIGVuYWJsZSBsb2dcbiAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQodHJ1ZSk7XG4gICAgICAvLyBzZXQgb3B0aW9ucyB0aGlyZC1wYXJ0eSBsaWJcbiAgICB9XG5cbiAgfVxufVxuIiwibW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBSdW5CbG9jayB7XG4gICAgLyoqIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKCRsb2c6IG5nLklMb2dTZXJ2aWNlKSB7XG4gICAgICAkbG9nLmRlYnVnKCdydW5CbG9jayBlbmQnKTtcbiAgICB9XG5cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5jb25maWcudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LnJ1bi50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBkZWNsYXJlIHZhciBjb25maWc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzJywgW10pXG4gICAgLmNvbmZpZyhDb25maWcpXG4gICAgLnJ1bihSdW5CbG9jaylcbiAgICAuY29uc3RhbnQoJ2NvbmZpZycsIGNvbmZpZyk7XG59XG4iLCJtb2R1bGUgdnMudG9vbHMuZGlzcGxheUNvbmZpZyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZGlzcGxheUNvbmZpZycsIFtdKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5kaXNwbGF5Q29uZmlnJykuXHJcblx0LyogQG5nSW5qZWN0ICovXHJcblx0ZmFjdG9yeSgnZGlzcGxheUNvbmZpZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnkpIHtcclxuXHJcblx0XHQndXNlIHN0cmljdCc7XHJcblxyXG5cdFx0dmFyIGNvbmZpZ1VyaSA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvZGlzcGxheV9jb25maWcvJztcclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkge1xyXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyAnbGlzdCc7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRDb25maWdRdWVyeVN0cmluZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArIGlkO1xyXG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldExpc3RRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0RGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2RlbGV0ZURpc3BsYXlDb25maWcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZTogYW55KSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KGNvbmZpZ1VyaSwgdGVtcGxhdGUpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdldERpc3BsYXlDb25maWdzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWdMaXN0KCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldERpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZWxldGVEaXNwbGF5Q29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9kZWxldGVEaXNwbGF5Q29uZmlnKGlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2F2ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKHRlbXBsYXRlOiBhbnkpe1xyXG5cdFx0XHRcdHJldHVybiBfc2F2ZURpc3BsYXlDb25maWcodGVtcGxhdGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pO1xyXG4iLCJtb2R1bGUgdnMudG9vbHMudXRpbCB7XG5cblx0ZXhwb3J0IGNsYXNzIFN1Z2FyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSkge31cblxuXHRcdHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcodmFsOiBhbnkpIHtcblx0XHRcdHJldHVybiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgZ2V0SW5zdGFuY2UoY29uZmlnOiBhbnksICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIDogU3VnYXIge1xuXHRcdFx0cmV0dXJuIG5ldyBTdWdhcihjb25maWcsICRodHRwKTtcblx0XHR9XG5cblx0XHR0b01hcChrZXk6IGFueSwgYXJyYXk6IGFueSkge1xuXHRcdFx0dmFyIG1hcCA9IHt9O1xuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0XHRtYXBbdmFsdWVba2V5XV0gPSB2YWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9XG5cblx0XHR0b1N0cmluZ01hcChhcnJheTogYW55KSB7XG5cdFx0XHR2YXIgbWFwID0ge307XG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG5cdFx0XHRcdG1hcFt2YWx1ZV0gPSB2YWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9XG5cbiAgICBwbHVjayhhcnJheTogYW55LCBuYW1lOiBzdHJpbmcsIGZuPzogRnVuY3Rpb24pIHtcbiAgICAgIHZhciBmbCA9IFtdO1xuICAgICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZTogYW55KXtcbiAgICAgICAgaWYgKGZuICYmIGZuKHZhbHVlKSkge1xuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xuICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZm4pKSB7XG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZsO1xuICAgIH1cblxuICAgIHBvc3RGb3JtKHVybDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICAgIHZhciBzZXJ2aWNlID0gdGhpcy5jb25maWcucm9vdCArIHVybDtcbiAgICAgIHJldHVybiB0aGlzLiRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVybDogc2VydmljZSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBhcnNlUXVlcnlTdHJpbmcocXVlcnlTdHJpbmc6IHN0cmluZykge1xuICAgICAgdmFyIHBhaXJzID0gcXVlcnlTdHJpbmcuc2xpY2UoMSkuc3BsaXQoJyYnKTtcbiAgICAgIHZhciByZXN1bHQgPSB7fSwgcztcbiAgICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24ocGFpcikge1xuICAgICAgICBzID0gcGFpci5zcGxpdCgnPScpO1xuICAgICAgICByZXN1bHRbc1swXV0gPSBkZWNvZGVVUklDb21wb25lbnQoc1sxXSB8fCAnJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgIH1cblxuICAgIHBvc3RKc29uKHJlcXVlc3QsIGFwaSwgYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0LycgKyBhcGkgICsgJy8nICsgYWN0aW9uICsgJy5qc29uJyxcbiAgICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICB9KTtcbiAgICB9XG5cdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3V0aWwvc3VnYXIudHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcbid1c2Ugc3RyaWN0JztcblxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0ZmV0Y2goZmllbGRzPzogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzKHF1ZXJ5OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEZpZWxkc1Jlc291cmNlIGltcGxlbWVudHMgSUZpZWxkc1Jlc291cmNlIHtcblx0XHRzdGF0aWMgcmVmTmFtZSA9ICdmaWVsZHNSZXNvdXJjZSc7XG5cblx0XHRmZXRjaDogKHByb3BlcnRpZXM/OiBzdHJpbmcpID0+IGFueTtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzOiAocXVlcnk6IHN0cmluZykgPT4gYW55O1xuXG5cdFx0LyogQG5nSW5qZWN0ICovXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzdWdhcjogYW55KSB7XG5cblx0XHRcdHRoaXMuZmV0Y2ggPSAoZmllbGRzPzogYW55KSA9PiB7XG5cdFx0XHRcdHZhciBmbCA9IChmaWVsZHMgfHwgJ25hbWUsY2F0ZWdvcnksZG9jcyxkaXNwX2VuJyk7XG5cdFx0XHRcdHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci9maWVsZHMvc2VsZWN0JywgdGhpcy5nZXRGaWVsZHNQYXJhbXMoZmwpKS50aGVuKChyZXM6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5kYXRhLnJlc3BvbnNlLmRvY3M7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmZldGNoSHlkcmF0aW9uU3RhdHMgPSAocXVlcnk6IHN0cmluZykgPT4ge1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoKCkudGhlbigoZmllbGRzOiBBcnJheTxhbnk+KSA9PiB7XG4gICAgICAgICAgdmFyIGZsID0gc3VnYXIucGx1Y2soZmllbGRzLCAnbmFtZScsIGZ1bmN0aW9uKGZpZWxkKSB7IHJldHVybiBmaWVsZC5uYW1lLmluZGV4T2YoJ18nKSAhPT0gMCAmJiBmaWVsZC5kb2NzID4gMDsgfSk7XG5cbiAgICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvdjAvc2VsZWN0PycgKyBxdWVyeSwgdGhpcy5nZXRTdGF0c1BhcmFtcyhmbCkpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICB2YXIgc3RhdHNGaWVsZHMgPSByZXMuZGF0YS5mYWNldF9jb3VudHMuZmFjZXRfZmllbGRzO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gcmVzLmRhdGEucmVzcG9uc2UubnVtRm91bmQ7XG4gICAgICAgICAgICB0aGlzLmFwcGx5SHlkcmF0aW9uKHN0YXRzRmllbGRzLCBmaWVsZHMsIHRvdGFsKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cdFx0XHR9O1xuXG5cdFx0fVxuXG4gICAgcHJpdmF0ZSBnZXRGaWVsZHNQYXJhbXMoZmwpIHtcbiAgICAgIHJldHVybiAncT0qOiomZmw9JyArIGZsICsgJyZyb3dzPTEwMDAwJnNvcnQ9bmFtZSUyMGFzYyZ3dD1qc29uJztcbiAgICB9XG5cblxuICAgIHByaXZhdGUgZ2V0U3RhdHNQYXJhbXMoZmwpIHtcbiAgICAgIHJldHVybiAnZmFjZXQ9dHJ1ZSZmYWNldC5saW1pdD0xMDAwMCZmYWNldC5taW5jb3VudD0xMDAmcm93cz0wJnd0PWpzb24mZmFjZXQuZmllbGQ9JyArIGZsLmpvaW4oJyZmYWNldC5maWVsZD0nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5SHlkcmF0aW9uKHN0YXRzRmllbGRzLCBmaWVsZHMsIHRvdGFsKSB7XG4gICAgICB2YXIgc3RhdHNGaWVsZCwgY291bnQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzdGF0c0ZpZWxkID0gc3RhdHNGaWVsZHNbZmllbGRzW2ldLm5hbWVdO1xuICAgICAgICBpZiAoc3RhdHNGaWVsZCAmJiBzdGF0c0ZpZWxkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZHNbaV0uaWQgPSBmaWVsZHNbaV0ubmFtZTtcbiAgICAgICAgICBjb3VudCA9IHRoaXMuZ2V0Q291bnQoc3RhdHNGaWVsZCk7XG4gICAgICAgICAgZmllbGRzW2ldLmh5ZHJhdGlvbiA9IGNvdW50IC8gdG90YWwgKiAxMDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q291bnQoZmllbGQpIHtcbiAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGZpZWxkLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIGNvdW50ICs9IGZpZWxkW2ldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZpZWxkcy5yZXNvdXJjZS50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xuJ3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWVsZHMnLCBbJ3ZzLnRvb2xzLnV0aWwnXSlcblx0XHQuc2VydmljZShGaWVsZHNSZXNvdXJjZS5yZWZOYW1lLCBGaWVsZHNSZXNvdXJjZSk7XG5cbn1cbiIsIm1vZHVsZSB2cy50b29scy5maWx0ZXJzIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWx0ZXJzJywgW10pXHJcbiAgICAuZmlsdGVyKCdyZXBsYWNlU3RyaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbihoYXlTdGFjazogc3RyaW5nLCBvbGROZWVkbGU6IHN0cmluZywgbmV3TmVlZGxlOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gaGF5U3RhY2sucmVwbGFjZShvbGROZWVkbGUsIG5ld05lZWRsZSk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuIH1cclxuIiwibW9kdWxlIHZzLnRvb2xzLnBhZ2VDb25maWcge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnBhZ2VDb25maWcnLCBbXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMucGFnZUNvbmZpZycpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG5cdGZhY3RvcnkoJ3BhZ2VDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XHJcblxyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2NvbmZpZy8nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRMaXN0UXVlcnlTdHJpbmcoKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArICdsaXN0JztcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgaWQ7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRQYWdlQ29uZmlnTGlzdCgpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRQYWdlQ29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZGVsZXRlUGFnZUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX3NhdmVQYWdlQ29uZmlnKHRlbXBsYXRlOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoY29uZmlnVXJpLCB0ZW1wbGF0ZSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0UGFnZUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0UGFnZUNvbmZpZ0xpc3QoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0UGFnZUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0UGFnZUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZVBhZ2VDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2RlbGV0ZVBhZ2VDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlUGFnZUNvbmZpZzogZnVuY3Rpb24odGVtcGxhdGU6IGFueSl7XHJcblx0XHRcdFx0cmV0dXJuIF9zYXZlUGFnZUNvbmZpZyh0ZW1wbGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7XHJcbiIsIm1vZHVsZSB2cy50b29scy5zYXZlZFNlYXJjaCB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnLCBbJ3ZzLnRvb2xzLnV0aWwnXSk7XG59XG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXG5kZWNsYXJlIHZhciBjb25maWc7XG5cbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcpLlxuXHQvKiBAbmdJbmplY3QgKi9cbiAgZmFjdG9yeSgnc2F2ZWRTZWFyY2hSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55LCBzdWdhcikge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgIGZ1bmN0aW9uIF9kb1NhdmUoc2F2ZWRTZWFyY2g6IGFueSkge1xuICAgICAgIHNhdmVkU2VhcmNoLnF1ZXJ5ICs9ICcvZGlzcD0nICsgc2F2ZWRTZWFyY2guY29uZmlnO1xuICAgICAgIHNhdmVkU2VhcmNoLnBhdGggPSBzYXZlZFNlYXJjaC5xdWVyeTtcbiAgICAgICByZXR1cm4gc3VnYXIucG9zdEpzb24oc2F2ZWRTZWFyY2gsICdkaXNwbGF5JywgJ3NzZWFyY2gnKTtcbiAgICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5U3RyaW5nKGlkPzogc3RyaW5nKSB7XG4gICAgICB2YXIgcm93cyA9IDE1MDsgIC8vIEBUT0RPIHNldCB0byB3aGF0IHdlIHJlYWxseSB3YW50XG4gICAgICB2YXIgcXVlcnlTdHJpbmcgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0Pyc7XG4gICAgICBxdWVyeVN0cmluZyArPSAncm93cz0nICsgcm93cyArICcmcmFuZD0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZmw9aWQsdGl0bGUsZGVzY3JpcHRpb24sb3duZXIscGF0aCxzaGFyZSxxdWVyeSxjb25maWcsb3JkZXIsc2F2ZWQscHJpdmF0ZSx2aWV3LF92ZXJzaW9uXyxjb25maWdfdGl0bGU6W2NvbmZpZ1RpdGxlXSxwYXJhbSonO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGlkKSkge1xuICAgICAgICBxdWVyeVN0cmluZyArPSAnJmZxPWlkOicgKyBpZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxdWVyeVN0cmluZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZXhlY3V0ZShpZD86IHN0cmluZykge1xuICAgICAgcmV0dXJuICRodHRwLmpzb25wKF9nZXRRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuICAgICAgICByZXR1cm4gZGF0YS5kYXRhLnJlc3BvbnNlLmRvY3M7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG4gICAgICAgIC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2F2ZWRTZWFyY2hlczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfZXhlY3V0ZSgpO1xuICAgICAgfSxcblxuICAgICAgZmV0Y2g6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiBfZXhlY3V0ZShpZCkudGhlbihmdW5jdGlvbihkb2NzKSB7XG4gICAgICAgICAgcmV0dXJuIGRvY3NbMF07XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgc2F2ZVNlYXJjaDogZnVuY3Rpb24oc2F2ZWRTZWFyY2gsIHBhcmFtcykge1xuICAgICAgIC8vICBzYXZlZFNlYXJjaC5jb25maWcgPSBjb25maWdTZXJ2aWNlLmdldENvbmZpZ0lkKCk7XG4gICAgICAgLy8gIHNhdmVkU2VhcmNoLnF1ZXJ5ID0gY29udmVydGVyLnRvQ2xhc3NpY1BhcmFtcyhwYXJhbXMpO1xuICAgICAgIHJldHVybiBfZG9TYXZlKHNhdmVkU2VhcmNoKTtcbiAgICAgIH0sXG5cbiAgICAgIGRlbGV0ZVNlYXJjaDogZnVuY3Rpb24oaWQ6IHN0cmluZyl7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9zc2VhcmNoLycgKyBpZCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAvLyBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgLy8gICBlbnRyeShpZCk7XG4gICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBvcmRlcjogZnVuY3Rpb24oaWQ6IGFueSwgYmVmb3JlSWQ6IGFueSwgYWZ0ZXJJZDogYW55KSB7XG4gICAgICAgIHZhciBkYXRhID0gJyc7XG4gICAgICAgIGlmIChiZWZvcmVJZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGRhdGEgKz0gJ2JlZm9yZT0nICsgYmVmb3JlSWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEgIT09ICcnKSB7XG4gICAgICAgICAgZGF0YSArPSAnJic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWZ0ZXJJZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGRhdGEgKz0gJ2FmdGVyPScgKyBhZnRlcklkO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnYXBpL3Jlc3QvZGlzcGxheS9zc2VhcmNoLycgKyBpZCArICcvb3JkZXInLCBkYXRhKTtcbiAgICAgIH0sXG5cbiAgICAgIGZldGNoTGFiZWxzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHVybCA9IGNvbmZpZy5yb290ICsgJ3NvbHIvc3NlYXJjaC9zZWxlY3Q/cm93cz0wJmZhY2V0PXRydWUmZmFjZXQuZmllbGQ9bGFiZWxzJnd0PWpzb24mcj0nICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgICAgICByZXR1cm4gcmVzcC5kYXRhLmZhY2V0X2NvdW50cy5mYWNldF9maWVsZHMubGFiZWxzO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHsgIC8vIGVycm9yIGlmIGxhYmVscyBmaWVsZCBkb2Vzbid0IGV4aXN0XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsIm1vZHVsZSB2cy50b29scy50cmFuc2xhdGUge1xuXG4gIGV4cG9ydCBjbGFzcyBUcmFuc2xhdG9yIHtcblxuICAgIHByaXZhdGUgZmllbGRzOiBhbnkgPSBudWxsO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IGFueSwgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCBwcml2YXRlICRxOiBuZy5JUVNlcnZpY2UpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZCgpIHtcbiAgICAgIHZhciByZXNvdXJjZVVybCA9IHRoaXMuY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvaTE4bi9maWVsZHMvc3RhbmRhcmQuanNvbic7XG5cbiAgICAgIGlmICghdGhpcy5maWVsZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAuZ2V0KHJlc291cmNlVXJsKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMuZmllbGRzID0gcmVzLmRhdGE7XG4gICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRxLndoZW4oKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdHJhbnNsYXRlRmllbGQoZmllbGQ6IHN0cmluZykge1xuICAgICAgdmFyIHRyYW5zbGF0ZWQgPSB0aGlzLmZpZWxkcy5GSUVMRFtmaWVsZF07XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodHJhbnNsYXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc2lmeShmaWVsZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGFzc2lmeShzdHI6IHN0cmluZykge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL18vZywgJyAnKTtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbih0eHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidHJhbnNsYXRvci50c1wiIC8+XG5tb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMudHJhbnNsYXRlJywgW10pXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgLmZhY3RvcnkoJ3RyYW5zbGF0b3InLCAoY29uZmlnOiBhbnksICRodHRwOiBuZy5JSHR0cFNlcnZpY2UsICRxOiBuZy5JUVNlcnZpY2UpID0+IG5ldyBUcmFuc2xhdG9yKGNvbmZpZywgJGh0dHAsICRxKSlcbiAgICAuY29uc3RhbnQoJ2NvbmZpZycsIGNvbmZpZyk7XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VnYXIudHNcIiAvPlxubW9kdWxlIHZzLnRvb2xzLnV0aWwge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnV0aWwnLCBbXSlcbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICAuZmFjdG9yeSgnc3VnYXInLCAoY29uZmlnLCAkaHR0cCkgPT4gU3VnYXIuZ2V0SW5zdGFuY2UoY29uZmlnLCAkaHR0cCkpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
//# sourceMappingURL=maps/vs.toolkit.src.js.map