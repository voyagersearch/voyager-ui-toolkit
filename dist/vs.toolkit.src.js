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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdNb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnUmVzb3VyY2UudHMiLCJmaWx0ZXJzL2ZpbHRlcnMudHMiLCJ1dGlsL3N1Z2FyLnRzIiwiZmllbGRzL2ZpZWxkcy5yZXNvdXJjZS50cyIsImZpZWxkcy9maWVsZHMubW9kdWxlLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctbW9kdWxlLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctcmVzb3VyY2UudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInRyYW5zbGF0ZS90cmFuc2xhdG9yLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5tb2R1bGUudHMiLCJ1dGlsL3V0aWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbInZzIiwidnMudG9vbHMiLCJ2cy50b29scy5Db25maWciLCJ2cy50b29scy5Db25maWcuY29uc3RydWN0b3IiLCJ2cy50b29scy5SdW5CbG9jayIsInZzLnRvb2xzLlJ1bkJsb2NrLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZGlzcGxheUNvbmZpZyIsIl9nZXRMaXN0UXVlcnlTdHJpbmciLCJfZ2V0Q29uZmlnUXVlcnlTdHJpbmciLCJfZ2V0RGlzcGxheUNvbmZpZ0xpc3QiLCJfZ2V0RGlzcGxheUNvbmZpZyIsIl9kZWxldGVEaXNwbGF5Q29uZmlnIiwiX3NhdmVEaXNwbGF5Q29uZmlnIiwidnMudG9vbHMuZmlsdGVycyIsInZzLnRvb2xzLnV0aWwiLCJ2cy50b29scy51dGlsLlN1Z2FyIiwidnMudG9vbHMudXRpbC5TdWdhci5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLnV0aWwuU3VnYXIuaXNTdHJpbmciLCJ2cy50b29scy51dGlsLlN1Z2FyLmdldEluc3RhbmNlIiwidnMudG9vbHMudXRpbC5TdWdhci50b01hcCIsInZzLnRvb2xzLnV0aWwuU3VnYXIudG9TdHJpbmdNYXAiLCJ2cy50b29scy51dGlsLlN1Z2FyLnBsdWNrIiwidnMudG9vbHMudXRpbC5TdWdhci5wb3N0Rm9ybSIsInZzLnRvb2xzLnV0aWwuU3VnYXIucGFyc2VRdWVyeVN0cmluZyIsInZzLnRvb2xzLnV0aWwuU3VnYXIucG9zdEpzb24iLCJ2cy50b29scy5maWVsZHMiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuY29uc3RydWN0b3IiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuZ2V0RmllbGRzUGFyYW1zIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmdldFN0YXRzUGFyYW1zIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmFwcGx5SHlkcmF0aW9uIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmdldENvdW50IiwidnMudG9vbHMucGFnZUNvbmZpZyIsIl9nZXRQYWdlQ29uZmlnTGlzdCIsIl9nZXRQYWdlQ29uZmlnIiwiX2RlbGV0ZVBhZ2VDb25maWciLCJfc2F2ZVBhZ2VDb25maWciLCJ2cy50b29scy5zYXZlZFNlYXJjaCIsIl9kb1NhdmUiLCJfZ2V0UXVlcnlTdHJpbmciLCJfZXhlY3V0ZSIsInZzLnRvb2xzLnRyYW5zbGF0ZSIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IuY29uc3RydWN0b3IiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5sb2FkIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IudHJhbnNsYXRlRmllbGQiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5jbGFzc2lmeSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxF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LE1BQU1BLEVBQUVBLEtBQUtBLElBQUtBLE9BQUFBLFVBQUtBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLENBQUNBLEVBQWhDQSxDQUFnQ0EsQ0FBQ0EsQ0FBQ0E7UUFDM0VBLENBQUNBLEVBTmViLElBQUlBLEdBQUpBLFVBQUlBLEtBQUpBLFVBQUlBLFFBTW5CQTtJQUFEQSxDQUFDQSxFQU5TRCxLQUFLQSxHQUFMQSxRQUFLQSxLQUFMQSxRQUFLQSxRQU1kQTtBQUFEQSxDQUFDQSxFQU5NLEVBQUUsS0FBRixFQUFFLFFBTVIiLCJmaWxlIjoidnMudG9vbGtpdC5taW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIENvbmZpZyB7XG4gICAgLyoqIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKCRsb2dQcm92aWRlcjogbmcuSUxvZ1Byb3ZpZGVyKSB7XG4gICAgICAvLyBlbmFibGUgbG9nXG4gICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKHRydWUpO1xuICAgICAgLy8gc2V0IG9wdGlvbnMgdGhpcmQtcGFydHkgbGliXG4gICAgfVxuXG4gIH1cbn1cbiIsIm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgUnVuQmxvY2sge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nOiBuZy5JTG9nU2VydmljZSkge1xuICAgICAgJGxvZy5kZWJ1ZygncnVuQmxvY2sgZW5kJyk7XG4gICAgfVxuXG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXguY29uZmlnLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5ydW4udHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scycsIFtdKVxuICAgIC5jb25maWcoQ29uZmlnKVxuICAgIC5ydW4oUnVuQmxvY2spXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xufVxuIiwibW9kdWxlIHZzLnRvb2xzLmRpc3BsYXlDb25maWcge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnLCBbXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZGlzcGxheUNvbmZpZycpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG5cdGZhY3RvcnkoJ2Rpc3BsYXlDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XHJcblxyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2Rpc3BsYXlfY29uZmlnLyc7XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldExpc3RRdWVyeVN0cmluZygpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgJ2xpc3QnO1xyXG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyBpZDtcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldERpc3BsYXlDb25maWdMaXN0KCkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRMaXN0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldERpc3BsYXlDb25maWcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9kZWxldGVEaXNwbGF5Q29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZShfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfc2F2ZURpc3BsYXlDb25maWcodGVtcGxhdGU6IGFueSkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChjb25maWdVcmksIHRlbXBsYXRlKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnZXREaXNwbGF5Q29uZmlnczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXREaXNwbGF5Q29uZmlnTGlzdCgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXREaXNwbGF5Q29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXREaXNwbGF5Q29uZmlnKGlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGVsZXRlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNhdmVEaXNwbGF5Q29uZmlnOiBmdW5jdGlvbih0ZW1wbGF0ZTogYW55KXtcclxuXHRcdFx0XHRyZXR1cm4gX3NhdmVEaXNwbGF5Q29uZmlnKHRlbXBsYXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTtcclxuIiwibW9kdWxlIHZzLnRvb2xzLmZpbHRlcnMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmZpbHRlcnMnLCBbXSlcclxuICAgIC5maWx0ZXIoJ3JlcGxhY2VTdHJpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBoYXlTdGFjay5yZXBsYWNlKG9sZE5lZWRsZSwgbmV3TmVlZGxlKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gfVxyXG4iLCJtb2R1bGUgdnMudG9vbHMudXRpbCB7XG5cblx0ZXhwb3J0IGNsYXNzIFN1Z2FyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSkge31cblxuXHRcdHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcodmFsOiBhbnkpIHtcblx0XHRcdHJldHVybiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgZ2V0SW5zdGFuY2UoY29uZmlnOiBhbnksICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIDogU3VnYXIge1xuXHRcdFx0cmV0dXJuIG5ldyBTdWdhcihjb25maWcsICRodHRwKTtcblx0XHR9XG5cblx0XHR0b01hcChrZXk6IGFueSwgYXJyYXk6IGFueSkge1xuXHRcdFx0dmFyIG1hcCA9IHt9O1xuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0XHRtYXBbdmFsdWVba2V5XV0gPSB2YWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9XG5cblx0XHR0b1N0cmluZ01hcChhcnJheTogYW55KSB7XG5cdFx0XHR2YXIgbWFwID0ge307XG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG5cdFx0XHRcdG1hcFt2YWx1ZV0gPSB2YWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9XG5cbiAgICBwbHVjayhhcnJheTogYW55LCBuYW1lOiBzdHJpbmcsIGZuPzogRnVuY3Rpb24pIHtcbiAgICAgIHZhciBmbCA9IFtdO1xuICAgICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZTogYW55KXtcbiAgICAgICAgaWYgKGZuICYmIGZuKHZhbHVlKSkge1xuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xuICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZm4pKSB7XG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZsO1xuICAgIH1cblxuICAgIHBvc3RGb3JtKHVybDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICAgIHZhciBzZXJ2aWNlID0gdGhpcy5jb25maWcucm9vdCArIHVybDtcbiAgICAgIHJldHVybiB0aGlzLiRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVybDogc2VydmljZSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBhcnNlUXVlcnlTdHJpbmcocXVlcnlTdHJpbmc6IHN0cmluZykge1xuICAgICAgdmFyIHBhaXJzID0gcXVlcnlTdHJpbmcuc2xpY2UoMSkuc3BsaXQoJyYnKTtcbiAgICAgIHZhciByZXN1bHQgPSB7fSwgcztcbiAgICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24ocGFpcikge1xuICAgICAgICBzID0gcGFpci5zcGxpdCgnPScpO1xuICAgICAgICByZXN1bHRbc1swXV0gPSBkZWNvZGVVUklDb21wb25lbnQoc1sxXSB8fCAnJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgIH1cblxuICAgIHBvc3RKc29uKHJlcXVlc3QsIGFwaSwgYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0LycgKyBhcGkgICsgJy8nICsgYWN0aW9uICsgJy5qc29uJyxcbiAgICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICB9KTtcbiAgICB9XG5cdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3V0aWwvc3VnYXIudHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcbid1c2Ugc3RyaWN0JztcblxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0ZmV0Y2goZmllbGRzPzogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzKHF1ZXJ5OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEZpZWxkc1Jlc291cmNlIGltcGxlbWVudHMgSUZpZWxkc1Jlc291cmNlIHtcblx0XHRzdGF0aWMgcmVmTmFtZSA9ICdmaWVsZHNSZXNvdXJjZSc7XG5cblx0XHRmZXRjaDogKHByb3BlcnRpZXM/OiBzdHJpbmcpID0+IGFueTtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzOiAocXVlcnk6IHN0cmluZykgPT4gYW55O1xuXG5cdFx0LyogQG5nSW5qZWN0ICovXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzdWdhcjogYW55KSB7XG5cblx0XHRcdHRoaXMuZmV0Y2ggPSAoZmllbGRzPzogYW55KSA9PiB7XG5cdFx0XHRcdHZhciBmbCA9IChmaWVsZHMgfHwgJ25hbWUsY2F0ZWdvcnksZG9jcyxkaXNwX2VuJyk7XG5cdFx0XHRcdHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci9maWVsZHMvc2VsZWN0JywgdGhpcy5nZXRGaWVsZHNQYXJhbXMoZmwpKS50aGVuKChyZXM6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5kYXRhLnJlc3BvbnNlLmRvY3M7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmZldGNoSHlkcmF0aW9uU3RhdHMgPSAocXVlcnk6IHN0cmluZykgPT4ge1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoKCkudGhlbigoZmllbGRzOiBBcnJheTxhbnk+KSA9PiB7XG4gICAgICAgICAgdmFyIGZsID0gc3VnYXIucGx1Y2soZmllbGRzLCAnbmFtZScsIGZ1bmN0aW9uKGZpZWxkKSB7IHJldHVybiBmaWVsZC5uYW1lLmluZGV4T2YoJ18nKSAhPT0gMCAmJiBmaWVsZC5kb2NzID4gMDsgfSk7XG5cbiAgICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvdjAvc2VsZWN0PycgKyBxdWVyeSwgdGhpcy5nZXRTdGF0c1BhcmFtcyhmbCkpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICB2YXIgc3RhdHNGaWVsZHMgPSByZXMuZGF0YS5mYWNldF9jb3VudHMuZmFjZXRfZmllbGRzO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gcmVzLmRhdGEucmVzcG9uc2UubnVtRm91bmQ7XG4gICAgICAgICAgICB0aGlzLmFwcGx5SHlkcmF0aW9uKHN0YXRzRmllbGRzLCBmaWVsZHMsIHRvdGFsKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cdFx0XHR9O1xuXG5cdFx0fVxuXG4gICAgcHJpdmF0ZSBnZXRGaWVsZHNQYXJhbXMoZmwpIHtcbiAgICAgIHJldHVybiAncT0qOiomZmw9JyArIGZsICsgJyZyb3dzPTEwMDAwJnNvcnQ9bmFtZSUyMGFzYyZ3dD1qc29uJztcbiAgICB9XG5cblxuICAgIHByaXZhdGUgZ2V0U3RhdHNQYXJhbXMoZmwpIHtcbiAgICAgIHJldHVybiAnZmFjZXQ9dHJ1ZSZmYWNldC5saW1pdD0xMDAwMCZmYWNldC5taW5jb3VudD0xMDAmcm93cz0wJnd0PWpzb24mZmFjZXQuZmllbGQ9JyArIGZsLmpvaW4oJyZmYWNldC5maWVsZD0nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5SHlkcmF0aW9uKHN0YXRzRmllbGRzLCBmaWVsZHMsIHRvdGFsKSB7XG4gICAgICB2YXIgc3RhdHNGaWVsZCwgY291bnQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzdGF0c0ZpZWxkID0gc3RhdHNGaWVsZHNbZmllbGRzW2ldLm5hbWVdO1xuICAgICAgICBpZiAoc3RhdHNGaWVsZCAmJiBzdGF0c0ZpZWxkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZHNbaV0uaWQgPSBmaWVsZHNbaV0ubmFtZTtcbiAgICAgICAgICBjb3VudCA9IHRoaXMuZ2V0Q291bnQoc3RhdHNGaWVsZCk7XG4gICAgICAgICAgZmllbGRzW2ldLmh5ZHJhdGlvbiA9IGNvdW50IC8gdG90YWwgKiAxMDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q291bnQoZmllbGQpIHtcbiAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGZpZWxkLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIGNvdW50ICs9IGZpZWxkW2ldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZpZWxkcy5yZXNvdXJjZS50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xuJ3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWVsZHMnLCBbJ3ZzLnRvb2xzLnV0aWwnXSlcblx0XHQuc2VydmljZShGaWVsZHNSZXNvdXJjZS5yZWZOYW1lLCBGaWVsZHNSZXNvdXJjZSk7XG5cbn1cbiIsIm1vZHVsZSB2cy50b29scy5wYWdlQ29uZmlnIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5wYWdlQ29uZmlnJywgW10pO1xyXG59XHJcbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cclxuZGVjbGFyZSB2YXIgY29uZmlnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnBhZ2VDb25maWcnKS5cclxuXHQvKiBAbmdJbmplY3QgKi9cclxuXHRmYWN0b3J5KCdwYWdlQ29uZmlnUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSkge1xyXG5cclxuXHRcdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0XHR2YXIgY29uZmlnVXJpID0gY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9jb25maWcvJztcclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkge1xyXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyAnbGlzdCc7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRDb25maWdRdWVyeVN0cmluZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArIGlkO1xyXG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0UGFnZUNvbmZpZ0xpc3QoKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldExpc3RRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0UGFnZUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2RlbGV0ZVBhZ2VDb25maWcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9zYXZlUGFnZUNvbmZpZyh0ZW1wbGF0ZTogYW55KSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KGNvbmZpZ1VyaSwgdGVtcGxhdGUpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdldFBhZ2VDb25maWdzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2dldFBhZ2VDb25maWdMaXN0KCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldFBhZ2VDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2dldFBhZ2VDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZWxldGVQYWdlQ29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9kZWxldGVQYWdlQ29uZmlnKGlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2F2ZVBhZ2VDb25maWc6IGZ1bmN0aW9uKHRlbXBsYXRlOiBhbnkpe1xyXG5cdFx0XHRcdHJldHVybiBfc2F2ZVBhZ2VDb25maWcodGVtcGxhdGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pO1xyXG4iLCJtb2R1bGUgdnMudG9vbHMuc2F2ZWRTZWFyY2gge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnNhdmVkU2VhcmNoJywgWyd2cy50b29scy51dGlsJ10pO1xufVxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnKS5cblx0LyogQG5nSW5qZWN0ICovXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSwgc3VnYXIpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgICBmdW5jdGlvbiBfZG9TYXZlKHNhdmVkU2VhcmNoOiBhbnkpIHtcbiAgICAgICBzYXZlZFNlYXJjaC5xdWVyeSArPSAnL2Rpc3A9JyArIHNhdmVkU2VhcmNoLmNvbmZpZztcbiAgICAgICBzYXZlZFNlYXJjaC5wYXRoID0gc2F2ZWRTZWFyY2gucXVlcnk7XG4gICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RKc29uKHNhdmVkU2VhcmNoLCAnZGlzcGxheScsICdzc2VhcmNoJyk7XG4gICAgIH1cblxuICAgIGZ1bmN0aW9uIF9nZXRRdWVyeVN0cmluZyhpZD86IHN0cmluZykge1xuICAgICAgdmFyIHJvd3MgPSAxNTA7ICAvLyBAVE9ETyBzZXQgdG8gd2hhdCB3ZSByZWFsbHkgd2FudFxuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD8nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJmZsPWlkLHRpdGxlLGRlc2NyaXB0aW9uLG93bmVyLHBhdGgsc2hhcmUscXVlcnksY29uZmlnLG9yZGVyLHNhdmVkLHByaXZhdGUsdmlldyxfdmVyc2lvbl8sY29uZmlnX3RpdGxlOltjb25maWdUaXRsZV0scGFyYW0qJztcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmd3Q9anNvbiZqc29uLndyZj1KU09OX0NBTExCQUNLJztcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChpZCkpIHtcbiAgICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmcT1pZDonICsgaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcXVlcnlTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2V4ZWN1dGUoaWQ/OiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiAkaHR0cC5qc29ucChfZ2V0UXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YS5yZXNwb25zZS5kb2NzO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNhdmVkU2VhcmNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIGZldGNoOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoaWQpLnRoZW4oZnVuY3Rpb24oZG9jcykge1xuICAgICAgICAgIHJldHVybiBkb2NzWzBdO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHNhdmVTZWFyY2g6IGZ1bmN0aW9uKHNhdmVkU2VhcmNoLCBwYXJhbXMpIHtcbiAgICAgICAvLyAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xuICAgICAgIC8vICBzYXZlZFNlYXJjaC5xdWVyeSA9IGNvbnZlcnRlci50b0NsYXNzaWNQYXJhbXMocGFyYW1zKTtcbiAgICAgICByZXR1cm4gX2RvU2F2ZShzYXZlZFNlYXJjaCk7XG4gICAgICB9LFxuXG4gICAgICBkZWxldGVTZWFyY2g6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgLy8gb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgIC8vICAgZW50cnkoaWQpO1xuICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgb3JkZXI6IGZ1bmN0aW9uKGlkOiBhbnksIGJlZm9yZUlkOiBhbnksIGFmdGVySWQ6IGFueSkge1xuICAgICAgICB2YXIgZGF0YSA9ICcnO1xuICAgICAgICBpZiAoYmVmb3JlSWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdiZWZvcmU9JyArIGJlZm9yZUlkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhICE9PSAnJykge1xuICAgICAgICAgIGRhdGEgKz0gJyYnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFmdGVySWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdhZnRlcj0nICsgYWZ0ZXJJZDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQgKyAnL29yZGVyJywgZGF0YSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJtb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcblxuICBleHBvcnQgY2xhc3MgVHJhbnNsYXRvciB7XG5cbiAgICBwcml2YXRlIGZpZWxkczogYW55ID0gbnVsbDtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgcHJpdmF0ZSAkcTogbmcuSVFTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWQoKSB7XG4gICAgICB2YXIgcmVzb3VyY2VVcmwgPSB0aGlzLmNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2kxOG4vZmllbGRzL3N0YW5kYXJkLmpzb24nO1xuXG4gICAgICBpZiAoIXRoaXMuZmllbGRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldChyZXNvdXJjZVVybCkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmZpZWxkcyA9IHJlcy5kYXRhO1xuICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4kcS53aGVuKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHRyYW5zbGF0ZUZpZWxkKGZpZWxkOiBzdHJpbmcpIHtcbiAgICAgIHZhciB0cmFuc2xhdGVkID0gdGhpcy5maWVsZHMuRklFTERbZmllbGRdO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRyYW5zbGF0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkoZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xhc3NpZnkoc3RyOiBzdHJpbmcpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyYW5zbGF0b3IudHNcIiAvPlxubW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBkZWNsYXJlIHZhciBjb25maWc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnRyYW5zbGF0ZScsIFtdKVxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIC5mYWN0b3J5KCd0cmFuc2xhdG9yJywgKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlKSA9PiBuZXcgVHJhbnNsYXRvcihjb25maWcsICRodHRwLCAkcSkpXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1Z2FyLnRzXCIgLz5cbm1vZHVsZSB2cy50b29scy51dGlsIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy51dGlsJywgW10pXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgLmZhY3RvcnkoJ3N1Z2FyJywgKGNvbmZpZywgJGh0dHApID0+IFN1Z2FyLmdldEluc3RhbmNlKGNvbmZpZywgJGh0dHApKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
//# sourceMappingURL=maps/vs.toolkit.src.js.map