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
                        var fl = (fields || 'name,category,docs,disp_en,sortable,filterable');
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
        wipe: function () {
            return $http.delete(config.root + 'api/rest/display/ssearch/wipe');
        },
        restore: function () {
            return sugar.postForm('api/rest/display/restore', '');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdNb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnUmVzb3VyY2UudHMiLCJmaWx0ZXJzL2ZpbHRlcnMudHMiLCJ1dGlsL3N1Z2FyLnRzIiwiZmllbGRzL2ZpZWxkcy5yZXNvdXJjZS50cyIsImZpZWxkcy9maWVsZHMubW9kdWxlLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkLXNlYXJjaC1tb2R1bGUudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWRTZWFyY2gucmVzb3VyY2UudHMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRvci50cyIsInRyYW5zbGF0ZS90cmFuc2xhdGUubW9kdWxlLnRzIiwidXRpbC91dGlsLm1vZHVsZS50cyJdLCJuYW1lcyI6WyJ2cyIsInZzLnRvb2xzIiwidnMudG9vbHMuQ29uZmlnIiwidnMudG9vbHMuQ29uZmlnLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuUnVuQmxvY2siLCJ2cy50b29scy5SdW5CbG9jay5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLmRpc3BsYXlDb25maWciLCJfZ2V0TGlzdFF1ZXJ5U3RyaW5nIiwiX2dldENvbmZpZ1F1ZXJ5U3RyaW5nIiwiX2dldERpc3BsYXlDb25maWdMaXN0IiwiX2dldERpc3BsYXlDb25maWciLCJfZGVsZXRlRGlzcGxheUNvbmZpZyIsIl9zYXZlRGlzcGxheUNvbmZpZyIsInZzLnRvb2xzLmZpbHRlcnMiLCJ2cy50b29scy51dGlsIiwidnMudG9vbHMudXRpbC5TdWdhciIsInZzLnRvb2xzLnV0aWwuU3VnYXIuY29uc3RydWN0b3IiLCJ2cy50b29scy51dGlsLlN1Z2FyLmlzU3RyaW5nIiwidnMudG9vbHMudXRpbC5TdWdhci5nZXRJbnN0YW5jZSIsInZzLnRvb2xzLnV0aWwuU3VnYXIudG9NYXAiLCJ2cy50b29scy51dGlsLlN1Z2FyLnRvU3RyaW5nTWFwIiwidnMudG9vbHMudXRpbC5TdWdhci5wbHVjayIsInZzLnRvb2xzLnV0aWwuU3VnYXIucG9zdEZvcm0iLCJ2cy50b29scy51dGlsLlN1Z2FyLnBhcnNlUXVlcnlTdHJpbmciLCJ2cy50b29scy51dGlsLlN1Z2FyLnBvc3RKc29uIiwidnMudG9vbHMuZmllbGRzIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmdldEZpZWxkc1BhcmFtcyIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZS5nZXRTdGF0c1BhcmFtcyIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZS5hcHBseUh5ZHJhdGlvbiIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZS5nZXRDb3VudCIsInZzLnRvb2xzLnNhdmVkU2VhcmNoIiwiX2RvU2F2ZSIsIl9nZXRRdWVyeVN0cmluZyIsIl9leGVjdXRlIiwidnMudG9vbHMudHJhbnNsYXRlIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yLmxvYWQiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci50cmFuc2xhdGVGaWVsZCIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yLmNsYXNzaWZ5Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0FZUjtBQVpELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxLQUFLQSxDQVlkQTtJQVpTQSxXQUFBQSxLQUFLQSxFQUFDQSxDQUFDQTtRQUNmQyxZQUFZQSxDQUFDQTtRQUViQSxJQUFhQSxNQUFNQTtZQUNqQkMsZ0JBQWdCQTtZQUNoQkEsU0FGV0EsTUFBTUEsQ0FFTEEsWUFBNkJBO2dCQUN2Q0MsQUFD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QSxNQUFNQSxFQUFFQSxLQUFLQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFqQ0EsQ0FBaUNBLENBQUNBLENBQ25IQSxRQUFRQSxDQUFDQSxRQUFRQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUNoQ0EsQ0FBQ0EsRUFUZW5DLFNBQVNBLEdBQVRBLGVBQVNBLEtBQVRBLGVBQVNBLFFBU3hCQTtJQUFEQSxDQUFDQSxFQVRTRCxLQUFLQSxHQUFMQSxRQUFLQSxLQUFMQSxRQUFLQSxRQVNkQTtBQUFEQSxDQUFDQSxFQVRNLEVBQUUsS0FBRixFQUFFLFFBU1I7O0FDVkQsQUFDQSxpQ0FEaUM7QUFDakMsSUFBTyxFQUFFLENBTVI7QUFORCxXQUFPLEVBQUU7SUFBQ0EsSUFBQUEsS0FBS0EsQ0FNZEE7SUFOU0EsV0FBQUEsS0FBS0E7UUFBQ0MsSUFBQUEsSUFBSUEsQ0FNbkJBO1FBTmVBLFdBQUFBLElBQUlBLEVBQUNBLENBQUNBO1lBQ3BCYSxZQUFZQSxDQUFDQTtZQUViQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUVoQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsRUFBRUEsVUFBQ0EsTUFBTUEsRUFBRUEsS0FBS0EsSUFBS0EsT0FBQUEsVUFBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsRUFBRUEsS0FBS0EsQ0FBQ0EsRUFBaENBLENBQWdDQSxDQUFDQSxDQUFDQTtRQUMzRUEsQ0FBQ0EsRUFOZWIsSUFBSUEsR0FBSkEsVUFBSUEsS0FBSkEsVUFBSUEsUUFNbkJBO0lBQURBLENBQUNBLEVBTlNELEtBQUtBLEdBQUxBLFFBQUtBLEtBQUxBLFFBQUtBLFFBTWRBO0FBQURBLENBQUNBLEVBTk0sRUFBRSxLQUFGLEVBQUUsUUFNUiIsImZpbGUiOiJ2cy50b29sa2l0Lm1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgQ29uZmlnIHtcbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJGxvZ1Byb3ZpZGVyOiBuZy5JTG9nUHJvdmlkZXIpIHtcbiAgICAgIC8vIGVuYWJsZSBsb2dcbiAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQodHJ1ZSk7XG4gICAgICAvLyBzZXQgb3B0aW9ucyB0aGlyZC1wYXJ0eSBsaWJcbiAgICB9XG5cbiAgfVxufVxuIiwibW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBSdW5CbG9jayB7XG4gICAgLyoqIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKCRsb2c6IG5nLklMb2dTZXJ2aWNlKSB7XG4gICAgICAkbG9nLmRlYnVnKCdydW5CbG9jayBlbmQnKTtcbiAgICB9XG5cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5jb25maWcudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LnJ1bi50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBkZWNsYXJlIHZhciBjb25maWc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzJywgW10pXG4gICAgLmNvbmZpZyhDb25maWcpXG4gICAgLnJ1bihSdW5CbG9jaylcbiAgICAuY29uc3RhbnQoJ2NvbmZpZycsIGNvbmZpZyk7XG59XG4iLCJtb2R1bGUgdnMudG9vbHMuZGlzcGxheUNvbmZpZyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZGlzcGxheUNvbmZpZycsIFtdKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5kaXNwbGF5Q29uZmlnJykuXHJcblx0LyogQG5nSW5qZWN0ICovXHJcblx0ZmFjdG9yeSgnZGlzcGxheUNvbmZpZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnkpIHtcclxuXHJcblx0XHQndXNlIHN0cmljdCc7XHJcblxyXG5cdFx0dmFyIGNvbmZpZ1VyaSA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvY29uZmlnLyc7XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldExpc3RRdWVyeVN0cmluZygpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgJ2xpc3QnO1xyXG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyBpZDtcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldERpc3BsYXlDb25maWdMaXN0KCkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRMaXN0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldERpc3BsYXlDb25maWcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9kZWxldGVEaXNwbGF5Q29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZShfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfc2F2ZURpc3BsYXlDb25maWcodGVtcGxhdGU6IGFueSkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChjb25maWdVcmksIHRlbXBsYXRlKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnZXREaXNwbGF5Q29uZmlnczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXREaXNwbGF5Q29uZmlnTGlzdCgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXREaXNwbGF5Q29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXREaXNwbGF5Q29uZmlnKGlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGVsZXRlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNhdmVEaXNwbGF5Q29uZmlnOiBmdW5jdGlvbih0ZW1wbGF0ZTogYW55KXtcclxuXHRcdFx0XHRyZXR1cm4gX3NhdmVEaXNwbGF5Q29uZmlnKHRlbXBsYXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTtcclxuIiwibW9kdWxlIHZzLnRvb2xzLmZpbHRlcnMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmZpbHRlcnMnLCBbXSlcclxuICAgIC5maWx0ZXIoJ3JlcGxhY2VTdHJpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBoYXlTdGFjay5yZXBsYWNlKG9sZE5lZWRsZSwgbmV3TmVlZGxlKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gfVxyXG4iLCJtb2R1bGUgdnMudG9vbHMudXRpbCB7XG5cblx0ZXhwb3J0IGNsYXNzIFN1Z2FyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSkge31cblxuXHRcdHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcodmFsOiBhbnkpIHtcblx0XHRcdHJldHVybiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgZ2V0SW5zdGFuY2UoY29uZmlnOiBhbnksICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIDogU3VnYXIge1xuXHRcdFx0cmV0dXJuIG5ldyBTdWdhcihjb25maWcsICRodHRwKTtcblx0XHR9XG5cblx0XHR0b01hcChrZXk6IGFueSwgYXJyYXk6IGFueSkge1xuXHRcdFx0dmFyIG1hcCA9IHt9O1xuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0XHRtYXBbdmFsdWVba2V5XV0gPSB2YWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9XG5cblx0XHR0b1N0cmluZ01hcChhcnJheTogYW55KSB7XG5cdFx0XHR2YXIgbWFwID0ge307XG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG5cdFx0XHRcdG1hcFt2YWx1ZV0gPSB2YWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9XG5cbiAgICBwbHVjayhhcnJheTogYW55LCBuYW1lOiBzdHJpbmcsIGZuPzogRnVuY3Rpb24pIHtcbiAgICAgIHZhciBmbCA9IFtdO1xuICAgICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZTogYW55KXtcbiAgICAgICAgaWYgKGZuICYmIGZuKHZhbHVlKSkge1xuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xuICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZm4pKSB7XG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZsO1xuICAgIH1cblxuICAgIHBvc3RGb3JtKHVybDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICAgIHZhciBzZXJ2aWNlID0gdGhpcy5jb25maWcucm9vdCArIHVybDtcbiAgICAgIHJldHVybiB0aGlzLiRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVybDogc2VydmljZSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBhcnNlUXVlcnlTdHJpbmcocXVlcnlTdHJpbmc6IHN0cmluZykge1xuICAgICAgdmFyIHBhaXJzID0gcXVlcnlTdHJpbmcuc2xpY2UoMSkuc3BsaXQoJyYnKTtcbiAgICAgIHZhciByZXN1bHQgPSB7fSwgcztcbiAgICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24ocGFpcikge1xuICAgICAgICBzID0gcGFpci5zcGxpdCgnPScpO1xuICAgICAgICByZXN1bHRbc1swXV0gPSBkZWNvZGVVUklDb21wb25lbnQoc1sxXSB8fCAnJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgIH1cblxuICAgIHBvc3RKc29uKHJlcXVlc3QsIGFwaSwgYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0LycgKyBhcGkgICsgJy8nICsgYWN0aW9uICsgJy5qc29uJyxcbiAgICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICB9KTtcbiAgICB9XG5cdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdXRpbC9zdWdhci50c1wiIC8+XHJcblxyXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWVsZHNSZXNvdXJjZSB7XHJcblx0XHRmZXRjaChmaWVsZHM/OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xyXG5cdFx0ZmV0Y2hIeWRyYXRpb25TdGF0cyhxdWVyeTogc3RyaW5nKTogbmcuSVByb21pc2U8YW55PjtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBGaWVsZHNSZXNvdXJjZSBpbXBsZW1lbnRzIElGaWVsZHNSZXNvdXJjZSB7XHJcblx0XHRzdGF0aWMgcmVmTmFtZSA9ICdmaWVsZHNSZXNvdXJjZSc7XHJcblxyXG5cdFx0ZmV0Y2g6IChwcm9wZXJ0aWVzPzogc3RyaW5nKSA9PiBhbnk7XHJcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzOiAocXVlcnk6IHN0cmluZykgPT4gYW55O1xyXG5cclxuXHRcdC8qIEBuZ0luamVjdCAqL1xyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzdWdhcjogYW55KSB7XHJcblxyXG5cdFx0XHR0aGlzLmZldGNoID0gKGZpZWxkcz86IGFueSkgPT4ge1xyXG5cdFx0XHRcdHZhciBmbCA9IChmaWVsZHMgfHwgJ25hbWUsY2F0ZWdvcnksZG9jcyxkaXNwX2VuLHNvcnRhYmxlLGZpbHRlcmFibGUnKTtcclxuXHRcdFx0XHRyZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvZmllbGRzL3NlbGVjdCcsIHRoaXMuZ2V0RmllbGRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcclxuXHRcdFx0XHRcdHJldHVybiByZXMuZGF0YS5yZXNwb25zZS5kb2NzO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dGhpcy5mZXRjaEh5ZHJhdGlvblN0YXRzID0gKHF1ZXJ5OiBzdHJpbmcpID0+IHtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2goKS50aGVuKChmaWVsZHM6IEFycmF5PGFueT4pID0+IHtcclxuICAgICAgICAgIHZhciBmbCA9IHN1Z2FyLnBsdWNrKGZpZWxkcywgJ25hbWUnLCBmdW5jdGlvbihmaWVsZCkgeyByZXR1cm4gZmllbGQubmFtZS5pbmRleE9mKCdfJykgIT09IDAgJiYgZmllbGQuZG9jcyA+IDA7IH0pO1xyXG5cclxuICAgICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci92MC9zZWxlY3Q/JyArIHF1ZXJ5LCB0aGlzLmdldFN0YXRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdmFyIHN0YXRzRmllbGRzID0gcmVzLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcztcclxuICAgICAgICAgICAgdmFyIHRvdGFsID0gcmVzLmRhdGEucmVzcG9uc2UubnVtRm91bmQ7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZpZWxkc1BhcmFtcyhmbCkge1xyXG4gICAgICByZXR1cm4gJ3E9KjoqJmZsPScgKyBmbCArICcmcm93cz0xMDAwMCZzb3J0PW5hbWUlMjBhc2Mmd3Q9anNvbic7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgZ2V0U3RhdHNQYXJhbXMoZmwpIHtcclxuICAgICAgcmV0dXJuICdmYWNldD10cnVlJmZhY2V0LmxpbWl0PTEwMDAwJmZhY2V0Lm1pbmNvdW50PTEwMCZyb3dzPTAmd3Q9anNvbiZmYWNldC5maWVsZD0nICsgZmwuam9pbignJmZhY2V0LmZpZWxkPScpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpIHtcclxuICAgICAgdmFyIHN0YXRzRmllbGQsIGNvdW50O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN0YXRzRmllbGQgPSBzdGF0c0ZpZWxkc1tmaWVsZHNbaV0ubmFtZV07XHJcbiAgICAgICAgaWYgKHN0YXRzRmllbGQgJiYgc3RhdHNGaWVsZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBmaWVsZHNbaV0uaWQgPSBmaWVsZHNbaV0ubmFtZTtcclxuICAgICAgICAgIGNvdW50ID0gdGhpcy5nZXRDb3VudChzdGF0c0ZpZWxkKTtcclxuICAgICAgICAgIGZpZWxkc1tpXS5oeWRyYXRpb24gPSBjb3VudCAvIHRvdGFsICogMTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gaTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldENvdW50KGZpZWxkKSB7XHJcbiAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZmllbGQubGVuZ3RoOyBpICs9IDIpIHtcclxuICAgICAgICBjb3VudCArPSBmaWVsZFtpXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY291bnQ7XHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZpZWxkcy5yZXNvdXJjZS50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xuJ3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWVsZHMnLCBbJ3ZzLnRvb2xzLnV0aWwnXSlcblx0XHQuc2VydmljZShGaWVsZHNSZXNvdXJjZS5yZWZOYW1lLCBGaWVsZHNSZXNvdXJjZSk7XG5cbn1cbiIsIm1vZHVsZSB2cy50b29scy5zYXZlZFNlYXJjaCB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnLCBbJ3ZzLnRvb2xzLnV0aWwnXSk7XG59XG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXG5kZWNsYXJlIHZhciBjb25maWc7XG5cbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcpLlxuXHQvKiBAbmdJbmplY3QgKi9cbiAgZmFjdG9yeSgnc2F2ZWRTZWFyY2hSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55LCBzdWdhcikge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgIGZ1bmN0aW9uIF9kb1NhdmUoc2F2ZWRTZWFyY2g6IGFueSkge1xuICAgICAgIHJldHVybiBzdWdhci5wb3N0SnNvbihzYXZlZFNlYXJjaCwgJ2Rpc3BsYXknLCAnc3NlYXJjaCcpO1xuICAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlTdHJpbmcoaWQ/OiBzdHJpbmcpIHtcbiAgICAgIHZhciByb3dzID0gMTUwOyAgLy8gQFRPRE8gc2V0IHRvIHdoYXQgd2UgcmVhbGx5IHdhbnRcbiAgICAgIHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZy5yb290ICsgJ3NvbHIvc3NlYXJjaC9zZWxlY3Q/JztcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICdyb3dzPScgKyByb3dzICsgJyZyYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmbD1pZCx0aXRsZSxkZXNjcmlwdGlvbixvd25lcixwYXRoLHNoYXJlLHF1ZXJ5LGNvbmZpZyxvcmRlcixzYXZlZCxwcml2YXRlLHZpZXcsX3ZlcnNpb25fLGNvbmZpZ190aXRsZTpbY29uZmlnVGl0bGVdLHBhcmFtKixsYWJlbHMnO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGlkKSkge1xuICAgICAgICBxdWVyeVN0cmluZyArPSAnJmZxPWlkOicgKyBpZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxdWVyeVN0cmluZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZXhlY3V0ZShpZD86IHN0cmluZykge1xuICAgICAgcmV0dXJuICRodHRwLmpzb25wKF9nZXRRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuICAgICAgICByZXR1cm4gZGF0YS5kYXRhLnJlc3BvbnNlLmRvY3M7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG4gICAgICAgIC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2F2ZWRTZWFyY2hlczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfZXhlY3V0ZSgpO1xuICAgICAgfSxcblxuICAgICAgZmV0Y2g6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiBfZXhlY3V0ZShpZCkudGhlbihmdW5jdGlvbihkb2NzKSB7XG4gICAgICAgICAgcmV0dXJuIGRvY3NbMF07XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgc2F2ZVNlYXJjaDogZnVuY3Rpb24oc2F2ZWRTZWFyY2gsIHBhcmFtcykge1xuICAgICAgIC8vICBzYXZlZFNlYXJjaC5jb25maWcgPSBjb25maWdTZXJ2aWNlLmdldENvbmZpZ0lkKCk7XG4gICAgICAgLy8gIHNhdmVkU2VhcmNoLnF1ZXJ5ID0gY29udmVydGVyLnRvQ2xhc3NpY1BhcmFtcyhwYXJhbXMpO1xuICAgICAgIHJldHVybiBfZG9TYXZlKHNhdmVkU2VhcmNoKTtcbiAgICAgIH0sXG5cbiAgICAgIGRlbGV0ZVNlYXJjaDogZnVuY3Rpb24oaWQ6IHN0cmluZyl7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9zc2VhcmNoLycgKyBpZCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAvLyBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgLy8gICBlbnRyeShpZCk7XG4gICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICB3aXBlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvd2lwZScpO1xuICAgICAgfSxcblxuICAgICAgcmVzdG9yZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnYXBpL3Jlc3QvZGlzcGxheS9yZXN0b3JlJywgJycpO1xuICAgICAgfSxcblxuICAgICAgb3JkZXI6IGZ1bmN0aW9uKGlkOiBhbnksIGJlZm9yZUlkOiBhbnksIGFmdGVySWQ6IGFueSkge1xuICAgICAgICB2YXIgZGF0YSA9ICcnO1xuICAgICAgICBpZiAoYmVmb3JlSWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdiZWZvcmU9JyArIGJlZm9yZUlkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhICE9PSAnJykge1xuICAgICAgICAgIGRhdGEgKz0gJyYnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFmdGVySWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdhZnRlcj0nICsgYWZ0ZXJJZDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQgKyAnL29yZGVyJywgZGF0YSk7XG4gICAgICB9LFxuXG4gICAgICBmZXRjaExhYmVsczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB1cmwgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0P3Jvd3M9MCZmYWNldD10cnVlJmZhY2V0LmZpZWxkPWxhYmVscyZ3dD1qc29uJnI9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCkudGhlbihmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3AuZGF0YS5mYWNldF9jb3VudHMuZmFjZXRfZmllbGRzLmxhYmVscztcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAvLyBlcnJvciBpZiBsYWJlbHMgZmllbGQgZG9lc24ndCBleGlzdFxuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJtb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcblxuICBleHBvcnQgY2xhc3MgVHJhbnNsYXRvciB7XG5cbiAgICBwcml2YXRlIGZpZWxkczogYW55ID0gbnVsbDtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgcHJpdmF0ZSAkcTogbmcuSVFTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWQoKSB7XG4gICAgICB2YXIgcmVzb3VyY2VVcmwgPSB0aGlzLmNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2kxOG4vZmllbGRzL3N0YW5kYXJkLmpzb24nO1xuXG4gICAgICBpZiAoIXRoaXMuZmllbGRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldChyZXNvdXJjZVVybCkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmZpZWxkcyA9IHJlcy5kYXRhO1xuICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4kcS53aGVuKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHRyYW5zbGF0ZUZpZWxkKGZpZWxkOiBzdHJpbmcpIHtcbiAgICAgIHZhciB0cmFuc2xhdGVkID0gdGhpcy5maWVsZHMuRklFTERbZmllbGRdO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRyYW5zbGF0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkoZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xhc3NpZnkoc3RyOiBzdHJpbmcpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyYW5zbGF0b3IudHNcIiAvPlxubW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBkZWNsYXJlIHZhciBjb25maWc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnRyYW5zbGF0ZScsIFtdKVxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIC5mYWN0b3J5KCd0cmFuc2xhdG9yJywgKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlKSA9PiBuZXcgVHJhbnNsYXRvcihjb25maWcsICRodHRwLCAkcSkpXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1Z2FyLnRzXCIgLz5cbm1vZHVsZSB2cy50b29scy51dGlsIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy51dGlsJywgW10pXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgLmZhY3RvcnkoJ3N1Z2FyJywgKGNvbmZpZywgJGh0dHApID0+IFN1Z2FyLmdldEluc3RhbmNlKGNvbmZpZywgJGh0dHApKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
//# sourceMappingURL=maps/vs.toolkit.src.js.map