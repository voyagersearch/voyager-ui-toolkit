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

angular.module('vs.tools.displayConfig').
    /* @ngInject */
    factory('displayConfigResource', function ($http) {
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
        (function (fields_1) {
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
                            var fl = sugar.pluck(fields, 'name', function (field) { return field.name.indexOf('_') !== 0 && field.docs > 0; });
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
            angular.module('vs.tools.fields', ['vs.tools.util'])
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
        var savedSearch;
        (function (savedSearch) {
            'use strict';
            angular.module('vs.tools.savedSearch', ['vs.tools.util']);
        })(savedSearch = tools.savedSearch || (tools.savedSearch = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.savedSearch').
    /* @ngInject */
    factory('savedSearchResource', function ($http, sugar) {
    'use strict';
    function _doSave(savedSearch) {
        return sugar.postJson(savedSearch, 'display', 'ssearch');
    }
    function _getQueryString(id) {
        var rows = 150; // @TODO set to what we really want
        var queryString = config.root + 'solr/ssearch/select?';
        queryString += 'rows=' + rows + '&rand=' + Math.random();
        queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle],param*,labels';
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
            angular.module('vs.tools.translate', [])
                .factory('translator', function (config, $http, $q) { return new translate.Translator(config, $http, $q); })
                .constant('config', config);
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
            angular.module('vs.tools.util', [])
                .factory('sugar', function (config, $http) { return util.Sugar.getInstance(config, $http); });
        })(util = tools.util || (tools.util = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdNb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnUmVzb3VyY2UudHMiLCJ1dGlsL3N1Z2FyLnRzIiwiZmllbGRzL2ZpZWxkcy5yZXNvdXJjZS50cyIsImZpZWxkcy9maWVsZHMubW9kdWxlLnRzIiwiZmlsdGVycy9maWx0ZXJzLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkLXNlYXJjaC1tb2R1bGUudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWRTZWFyY2gucmVzb3VyY2UudHMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRvci50cyIsInRyYW5zbGF0ZS90cmFuc2xhdGUubW9kdWxlLnRzIiwidXRpbC91dGlsLm1vZHVsZS50cyJdLCJuYW1lcyI6WyJ2cyIsInZzLnRvb2xzIiwidnMudG9vbHMuQ29uZmlnIiwidnMudG9vbHMuQ29uZmlnLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuUnVuQmxvY2siLCJ2cy50b29scy5SdW5CbG9jay5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLmRpc3BsYXlDb25maWciLCJfZ2V0TGlzdFF1ZXJ5U3RyaW5nIiwiX2dldENvbmZpZ1F1ZXJ5U3RyaW5nIiwiX2dldERpc3BsYXlDb25maWdMaXN0IiwiX2dldERpc3BsYXlDb25maWciLCJfZGVsZXRlRGlzcGxheUNvbmZpZyIsIl9zYXZlRGlzcGxheUNvbmZpZyIsInZzLnRvb2xzLnV0aWwiLCJ2cy50b29scy51dGlsLlN1Z2FyIiwidnMudG9vbHMudXRpbC5TdWdhci5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLnV0aWwuU3VnYXIuaXNTdHJpbmciLCJ2cy50b29scy51dGlsLlN1Z2FyLmdldEluc3RhbmNlIiwidnMudG9vbHMudXRpbC5TdWdhci50b01hcCIsInZzLnRvb2xzLnV0aWwuU3VnYXIudG9TdHJpbmdNYXAiLCJ2cy50b29scy51dGlsLlN1Z2FyLnBsdWNrIiwidnMudG9vbHMudXRpbC5TdWdhci5wb3N0Rm9ybSIsInZzLnRvb2xzLnV0aWwuU3VnYXIucGFyc2VRdWVyeVN0cmluZyIsInZzLnRvb2xzLnV0aWwuU3VnYXIucG9zdEpzb24iLCJ2cy50b29scy5maWVsZHMiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuY29uc3RydWN0b3IiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuZ2V0RmllbGRzUGFyYW1zIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmdldFN0YXRzUGFyYW1zIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmFwcGx5SHlkcmF0aW9uIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmdldENvdW50IiwidnMudG9vbHMuZmlsdGVycyIsInZzLnRvb2xzLnNhdmVkU2VhcmNoIiwiX2RvU2F2ZSIsIl9nZXRRdWVyeVN0cmluZyIsIl9leGVjdXRlIiwidnMudG9vbHMudHJhbnNsYXRlIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yLmxvYWQiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci50cmFuc2xhdGVGaWVsZCIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yLmNsYXNzaWZ5Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0FZUjtBQVpELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxLQUFLQSxDQVlkQTtJQVpTQSxXQUFBQSxLQUFLQSxFQUFDQSxDQUFDQTtRQUNmQyxZQUFZQSxDQUFDQTtRQUViQTtZQUNFQyxnQkFBZ0JBO1lBQ2hCQSxnQkFBWUEsWUFBNkJBO2dCQUN2Q0MsYUFBYUE7Z0JBQ2JBLFlBQVlBLENBQUNBLFlB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QUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxFQUFFQSxFQUFFQSxDQUFDQTtpQkFFaENBLE9BQU9BLENBQUNBLE9BQU9BLEVBQUVBLFVBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLElBQUtBLE9BQUFBLFVBQUtBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLENBQUNBLEVBQWhDQSxDQUFnQ0EsQ0FBQ0EsQ0FBQ0E7UUFDM0VBLENBQUNBLEVBTmVaLElBQUlBLEdBQUpBLFVBQUlBLEtBQUpBLFVBQUlBLFFBTW5CQTtJQUFEQSxDQUFDQSxFQU5TRCxLQUFLQSxHQUFMQSxRQUFLQSxLQUFMQSxRQUFLQSxRQU1kQTtBQUFEQSxDQUFDQSxFQU5NLEVBQUUsS0FBRixFQUFFLFFBTVIiLCJmaWxlIjoidnMudG9vbGtpdC5taW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIENvbmZpZyB7XG4gICAgLyoqIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKCRsb2dQcm92aWRlcjogbmcuSUxvZ1Byb3ZpZGVyKSB7XG4gICAgICAvLyBlbmFibGUgbG9nXG4gICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKHRydWUpO1xuICAgICAgLy8gc2V0IG9wdGlvbnMgdGhpcmQtcGFydHkgbGliXG4gICAgfVxuXG4gIH1cbn1cbiIsIm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgUnVuQmxvY2sge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nOiBuZy5JTG9nU2VydmljZSkge1xuICAgICAgJGxvZy5kZWJ1ZygncnVuQmxvY2sgZW5kJyk7XG4gICAgfVxuXG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXguY29uZmlnLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5ydW4udHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scycsIFtdKVxuICAgIC5jb25maWcoQ29uZmlnKVxuICAgIC5ydW4oUnVuQmxvY2spXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xufVxuIiwibW9kdWxlIHZzLnRvb2xzLmRpc3BsYXlDb25maWcge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnLCBbXSk7XG59XG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXG5kZWNsYXJlIHZhciBjb25maWc7XG5cbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5kaXNwbGF5Q29uZmlnJykuXG5cdC8qIEBuZ0luamVjdCAqL1xuXHRmYWN0b3J5KCdkaXNwbGF5Q29uZmlnUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSkge1xuXG5cdFx0J3VzZSBzdHJpY3QnO1xuXG5cdFx0dmFyIGNvbmZpZ1VyaSA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvY29uZmlnLyc7XG5cblx0XHRmdW5jdGlvbiBfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkge1xuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgJ2xpc3QnO1xuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9nZXRDb25maWdRdWVyeVN0cmluZyhpZDogc3RyaW5nKSB7XG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyBpZDtcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRMaXN0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX2dldERpc3BsYXlDb25maWcoaWQ6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZTogYW55KSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChjb25maWdVcmksIHRlbXBsYXRlKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWdMaXN0KCk7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWcoaWQpO1xuXHRcdFx0fSxcblx0XHRcdGRlbGV0ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuIF9kZWxldGVEaXNwbGF5Q29uZmlnKGlkKTtcblx0XHRcdH0sXG5cdFx0XHRzYXZlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24odGVtcGxhdGU6IGFueSl7XG5cdFx0XHRcdHJldHVybiBfc2F2ZURpc3BsYXlDb25maWcodGVtcGxhdGUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuIiwibW9kdWxlIHZzLnRvb2xzLnV0aWwge1xuXG5cdGV4cG9ydCBjbGFzcyBTdWdhciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIHt9XG5cblx0XHRwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHZhbDogYW55KSB7XG5cdFx0XHRyZXR1cm4gKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnIHx8IHZhbCBpbnN0YW5jZW9mIFN0cmluZyk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIGdldEluc3RhbmNlKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlKSA6IFN1Z2FyIHtcblx0XHRcdHJldHVybiBuZXcgU3VnYXIoY29uZmlnLCAkaHR0cCk7XG5cdFx0fVxuXG5cdFx0dG9NYXAoa2V5OiBhbnksIGFycmF5OiBhbnkpIHtcblx0XHRcdHZhciBtYXAgPSB7fTtcblx0XHRcdGFycmF5LmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcblx0XHRcdFx0bWFwW3ZhbHVlW2tleV1dID0gdmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fVxuXG5cdFx0dG9TdHJpbmdNYXAoYXJyYXk6IGFueSkge1xuXHRcdFx0dmFyIG1hcCA9IHt9O1xuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0XHRtYXBbdmFsdWVdID0gdmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fVxuXG4gICAgcGx1Y2soYXJyYXk6IGFueSwgbmFtZTogc3RyaW5nLCBmbj86IEZ1bmN0aW9uKSB7XG4gICAgICB2YXIgZmwgPSBbXTtcbiAgICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsdWU6IGFueSl7XG4gICAgICAgIGlmIChmbiAmJiBmbih2YWx1ZSkpIHtcbiAgICAgICAgICBmbC5wdXNoKHZhbHVlW25hbWVdKTtcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGZuKSkge1xuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmbDtcbiAgICB9XG5cbiAgICBwb3N0Rm9ybSh1cmw6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgICB2YXIgc2VydmljZSA9IHRoaXMuY29uZmlnLnJvb3QgKyB1cmw7XG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6IHNlcnZpY2UsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCd9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwYXJzZVF1ZXJ5U3RyaW5nKHF1ZXJ5U3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgIHZhciBwYWlycyA9IHF1ZXJ5U3RyaW5nLnNsaWNlKDEpLnNwbGl0KCcmJyk7XG4gICAgICB2YXIgcmVzdWx0ID0ge30sIHM7XG4gICAgICBwYWlycy5mb3JFYWNoKGZ1bmN0aW9uKHBhaXIpIHtcbiAgICAgICAgcyA9IHBhaXIuc3BsaXQoJz0nKTtcbiAgICAgICAgcmVzdWx0W3NbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHNbMV0gfHwgJycpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICB9XG5cbiAgICBwb3N0SnNvbihyZXF1ZXN0LCBhcGksIGFjdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMuJGh0dHAoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXJsOiBjb25maWcucm9vdCArICdhcGkvcmVzdC8nICsgYXBpICArICcvJyArIGFjdGlvbiArICcuanNvbicsXG4gICAgICAgIGRhdGE6IHJlcXVlc3QsXG4gICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgfSk7XG4gICAgfVxuXHR9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi91dGlsL3N1Z2FyLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzLmZpZWxkcyB7XG4ndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJRmllbGRzUmVzb3VyY2Uge1xuXHRcdGZldGNoKGZpZWxkcz86IHN0cmluZyk6IG5nLklQcm9taXNlPGFueT47XG5cdFx0ZmV0Y2hIeWRyYXRpb25TdGF0cyhxdWVyeTogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBGaWVsZHNSZXNvdXJjZSBpbXBsZW1lbnRzIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0c3RhdGljIHJlZk5hbWUgPSAnZmllbGRzUmVzb3VyY2UnO1xuXG5cdFx0ZmV0Y2g6IChwcm9wZXJ0aWVzPzogc3RyaW5nKSA9PiBhbnk7XG5cdFx0ZmV0Y2hIeWRyYXRpb25TdGF0czogKHF1ZXJ5OiBzdHJpbmcpID0+IGFueTtcblxuXHRcdC8qIEBuZ0luamVjdCAqL1xuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc3VnYXI6IGFueSkge1xuXG5cdFx0XHR0aGlzLmZldGNoID0gKGZpZWxkcz86IGFueSkgPT4ge1xuXHRcdFx0XHR2YXIgZmwgPSAoZmllbGRzIHx8ICduYW1lLGNhdGVnb3J5LGRvY3MsZGlzcF9lbicpO1xuXHRcdFx0XHRyZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvZmllbGRzL3NlbGVjdCcsIHRoaXMuZ2V0RmllbGRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiByZXMuZGF0YS5yZXNwb25zZS5kb2NzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5mZXRjaEh5ZHJhdGlvblN0YXRzID0gKHF1ZXJ5OiBzdHJpbmcpID0+IHtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaCgpLnRoZW4oKGZpZWxkczogQXJyYXk8YW55PikgPT4ge1xuICAgICAgICAgIHZhciBmbCA9IHN1Z2FyLnBsdWNrKGZpZWxkcywgJ25hbWUnLCBmdW5jdGlvbihmaWVsZCkgeyByZXR1cm4gZmllbGQubmFtZS5pbmRleE9mKCdfJykgIT09IDAgJiYgZmllbGQuZG9jcyA+IDA7IH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdzb2xyL3YwL3NlbGVjdD8nICsgcXVlcnksIHRoaXMuZ2V0U3RhdHNQYXJhbXMoZmwpKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdmFyIHN0YXRzRmllbGRzID0gcmVzLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcztcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IHJlcy5kYXRhLnJlc3BvbnNlLm51bUZvdW5kO1xuICAgICAgICAgICAgdGhpcy5hcHBseUh5ZHJhdGlvbihzdGF0c0ZpZWxkcywgZmllbGRzLCB0b3RhbCk7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuXHRcdFx0fTtcblxuXHRcdH1cblxuICAgIHByaXZhdGUgZ2V0RmllbGRzUGFyYW1zKGZsKSB7XG4gICAgICByZXR1cm4gJ3E9KjoqJmZsPScgKyBmbCArICcmcm93cz0xMDAwMCZzb3J0PW5hbWUlMjBhc2Mmd3Q9anNvbic7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGdldFN0YXRzUGFyYW1zKGZsKSB7XG4gICAgICByZXR1cm4gJ2ZhY2V0PXRydWUmZmFjZXQubGltaXQ9MTAwMDAmZmFjZXQubWluY291bnQ9MTAwJnJvd3M9MCZ3dD1qc29uJmZhY2V0LmZpZWxkPScgKyBmbC5qb2luKCcmZmFjZXQuZmllbGQ9Jyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcHBseUh5ZHJhdGlvbihzdGF0c0ZpZWxkcywgZmllbGRzLCB0b3RhbCkge1xuICAgICAgdmFyIHN0YXRzRmllbGQsIGNvdW50O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RhdHNGaWVsZCA9IHN0YXRzRmllbGRzW2ZpZWxkc1tpXS5uYW1lXTtcbiAgICAgICAgaWYgKHN0YXRzRmllbGQgJiYgc3RhdHNGaWVsZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGRzW2ldLmlkID0gZmllbGRzW2ldLm5hbWU7XG4gICAgICAgICAgY291bnQgPSB0aGlzLmdldENvdW50KHN0YXRzRmllbGQpO1xuICAgICAgICAgIGZpZWxkc1tpXS5oeWRyYXRpb24gPSBjb3VudCAvIHRvdGFsICogMTAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvdW50KGZpZWxkKSB7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBmaWVsZC5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICBjb3VudCArPSBmaWVsZFtpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9maWVsZHMucmVzb3VyY2UudHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcbid1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmllbGRzJywgWyd2cy50b29scy51dGlsJ10pXG5cdFx0LnNlcnZpY2UoRmllbGRzUmVzb3VyY2UucmVmTmFtZSwgRmllbGRzUmVzb3VyY2UpO1xuXG59XG4iLCJtb2R1bGUgdnMudG9vbHMuZmlsdGVycyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmlsdGVycycsIFtdKVxuICAgIC5maWx0ZXIoJ3JlcGxhY2VTdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihoYXlTdGFjazogc3RyaW5nLCBvbGROZWVkbGU6IHN0cmluZywgbmV3TmVlZGxlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGhheVN0YWNrLnJlcGxhY2Uob2xkTmVlZGxlLCBuZXdOZWVkbGUpO1xuICAgICAgfTtcbiAgICB9KTtcbiB9XG4iLCJtb2R1bGUgdnMudG9vbHMuc2F2ZWRTZWFyY2gge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnNhdmVkU2VhcmNoJywgWyd2cy50b29scy51dGlsJ10pO1xufVxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnKS5cblx0LyogQG5nSW5qZWN0ICovXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSwgc3VnYXIpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgICBmdW5jdGlvbiBfZG9TYXZlKHNhdmVkU2VhcmNoOiBhbnkpIHtcbiAgICAgICByZXR1cm4gc3VnYXIucG9zdEpzb24oc2F2ZWRTZWFyY2gsICdkaXNwbGF5JywgJ3NzZWFyY2gnKTtcbiAgICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5U3RyaW5nKGlkPzogc3RyaW5nKSB7XG4gICAgICB2YXIgcm93cyA9IDE1MDsgIC8vIEBUT0RPIHNldCB0byB3aGF0IHdlIHJlYWxseSB3YW50XG4gICAgICB2YXIgcXVlcnlTdHJpbmcgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0Pyc7XG4gICAgICBxdWVyeVN0cmluZyArPSAncm93cz0nICsgcm93cyArICcmcmFuZD0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZmw9aWQsdGl0bGUsZGVzY3JpcHRpb24sb3duZXIscGF0aCxzaGFyZSxxdWVyeSxjb25maWcsb3JkZXIsc2F2ZWQscHJpdmF0ZSx2aWV3LF92ZXJzaW9uXyxjb25maWdfdGl0bGU6W2NvbmZpZ1RpdGxlXSxwYXJhbSosbGFiZWxzJztcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmd3Q9anNvbiZqc29uLndyZj1KU09OX0NBTExCQUNLJztcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChpZCkpIHtcbiAgICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmcT1pZDonICsgaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcXVlcnlTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2V4ZWN1dGUoaWQ/OiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiAkaHR0cC5qc29ucChfZ2V0UXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YS5yZXNwb25zZS5kb2NzO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNhdmVkU2VhcmNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIGZldGNoOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoaWQpLnRoZW4oZnVuY3Rpb24oZG9jcykge1xuICAgICAgICAgIHJldHVybiBkb2NzWzBdO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHNhdmVTZWFyY2g6IGZ1bmN0aW9uKHNhdmVkU2VhcmNoLCBwYXJhbXMpIHtcbiAgICAgICAvLyAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xuICAgICAgIC8vICBzYXZlZFNlYXJjaC5xdWVyeSA9IGNvbnZlcnRlci50b0NsYXNzaWNQYXJhbXMocGFyYW1zKTtcbiAgICAgICByZXR1cm4gX2RvU2F2ZShzYXZlZFNlYXJjaCk7XG4gICAgICB9LFxuXG4gICAgICBkZWxldGVTZWFyY2g6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgLy8gb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgIC8vICAgZW50cnkoaWQpO1xuICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgb3JkZXI6IGZ1bmN0aW9uKGlkOiBhbnksIGJlZm9yZUlkOiBhbnksIGFmdGVySWQ6IGFueSkge1xuICAgICAgICB2YXIgZGF0YSA9ICcnO1xuICAgICAgICBpZiAoYmVmb3JlSWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdiZWZvcmU9JyArIGJlZm9yZUlkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhICE9PSAnJykge1xuICAgICAgICAgIGRhdGEgKz0gJyYnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFmdGVySWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdhZnRlcj0nICsgYWZ0ZXJJZDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQgKyAnL29yZGVyJywgZGF0YSk7XG4gICAgICB9LFxuXG4gICAgICBmZXRjaExhYmVsczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB1cmwgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0P3Jvd3M9MCZmYWNldD10cnVlJmZhY2V0LmZpZWxkPWxhYmVscyZ3dD1qc29uJnI9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCkudGhlbihmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3AuZGF0YS5mYWNldF9jb3VudHMuZmFjZXRfZmllbGRzLmxhYmVscztcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAvLyBlcnJvciBpZiBsYWJlbHMgZmllbGQgZG9lc24ndCBleGlzdFxuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJtb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcblxuICBleHBvcnQgY2xhc3MgVHJhbnNsYXRvciB7XG5cbiAgICBwcml2YXRlIGZpZWxkczogYW55ID0gbnVsbDtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgcHJpdmF0ZSAkcTogbmcuSVFTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWQoKSB7XG4gICAgICB2YXIgcmVzb3VyY2VVcmwgPSB0aGlzLmNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2kxOG4vZmllbGRzL3N0YW5kYXJkLmpzb24nO1xuXG4gICAgICBpZiAoIXRoaXMuZmllbGRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldChyZXNvdXJjZVVybCkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmZpZWxkcyA9IHJlcy5kYXRhO1xuICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4kcS53aGVuKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHRyYW5zbGF0ZUZpZWxkKGZpZWxkOiBzdHJpbmcpIHtcbiAgICAgIHZhciB0cmFuc2xhdGVkID0gdGhpcy5maWVsZHMuRklFTERbZmllbGRdO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRyYW5zbGF0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkoZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xhc3NpZnkoc3RyOiBzdHJpbmcpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyYW5zbGF0b3IudHNcIiAvPlxubW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBkZWNsYXJlIHZhciBjb25maWc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnRyYW5zbGF0ZScsIFtdKVxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIC5mYWN0b3J5KCd0cmFuc2xhdG9yJywgKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlKSA9PiBuZXcgVHJhbnNsYXRvcihjb25maWcsICRodHRwLCAkcSkpXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1Z2FyLnRzXCIgLz5cbm1vZHVsZSB2cy50b29scy51dGlsIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy51dGlsJywgW10pXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgLmZhY3RvcnkoJ3N1Z2FyJywgKGNvbmZpZywgJGh0dHApID0+IFN1Z2FyLmdldEluc3RhbmNlKGNvbmZpZywgJGh0dHApKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

//# sourceMappingURL=maps/vs.toolkit.src.js.map
