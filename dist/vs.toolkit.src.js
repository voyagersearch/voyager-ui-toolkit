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
        }());
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
        }());
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
            'use strict';
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
            }());
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
                        var fl = (fields || 'name,stype,category,docs,disp_en,sortable,filterable,tableable,displayable,editable');
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
            }());
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
                    return hayStack.replace(new RegExp(oldNeedle, 'g'), newNeedle);
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
            'use strict';
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
            }());
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdNb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnUmVzb3VyY2UudHMiLCJ1dGlsL3N1Z2FyLnRzIiwiZmllbGRzL2ZpZWxkcy5yZXNvdXJjZS50cyIsImZpZWxkcy9maWVsZHMubW9kdWxlLnRzIiwiZmlsdGVycy9maWx0ZXJzLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkLXNlYXJjaC1tb2R1bGUudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWRTZWFyY2gucmVzb3VyY2UudHMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRvci50cyIsInRyYW5zbGF0ZS90cmFuc2xhdGUubW9kdWxlLnRzIiwidXRpbC91dGlsLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0FZUjtBQVpELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVlkO0lBWlMsV0FBQSxLQUFLLEVBQUMsQ0FBQztRQUNmLFlBQVksQ0FBQztRQUViO1lBQ0UsZ0JBQWdCO1lBQ2hCLGdCQUFZLFlBQTZCO2dCQUN2QyxhQUFhO2dCQUNiLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hDLDhCQUE4QjtZQUNoQyxDQUFDO1lBRUgsYUFBQztRQUFELENBUkEsQUFRQyxJQUFBO1FBUlksWUFBTSxTQVFsQixDQUFBO0lBQ0gsQ0FBQyxFQVpTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQVlkO0FBQUQsQ0FBQyxFQVpNLEVBQUUsS0FBRixFQUFFLFFBWVI7O0FDWkQsSUFBTyxFQUFFLENBVVI7QUFWRCxXQUFPLEVBQUU7SUFBQyxJQUFBLEtBQUssQ0FVZDtJQVZTLFdBQUEsS0FBSyxFQUFDLENBQUM7UUFDZixZQUFZLENBQUM7UUFFYjtZQUNFLGdCQUFnQjtZQUNoQixrQkFBWSxJQUFvQjtn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QUFPLENBQUMsT0FBTyxFQUFFLFVBQUMsTUFBTSxFQUFFLEtBQUssSUFBSyxPQUFBLFVBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxFQU5lLElBQUksR0FBSixVQUFJLEtBQUosVUFBSSxRQU1uQjtJQUFELENBQUMsRUFOUyxLQUFLLEdBQUwsUUFBSyxLQUFMLFFBQUssUUFNZDtBQUFELENBQUMsRUFOTSxFQUFFLEtBQUYsRUFBRSxRQU1SIiwiZmlsZSI6InZzLnRvb2xraXQubWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIHZzLnRvb2xzIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDb25maWcge1xyXG4gICAgLyoqIEBuZ0luamVjdCAqL1xyXG4gICAgY29uc3RydWN0b3IoJGxvZ1Byb3ZpZGVyOiBuZy5JTG9nUHJvdmlkZXIpIHtcclxuICAgICAgLy8gZW5hYmxlIGxvZ1xyXG4gICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKHRydWUpO1xyXG4gICAgICAvLyBzZXQgb3B0aW9ucyB0aGlyZC1wYXJ0eSBsaWJcclxuICAgIH1cclxuXHJcbiAgfVxyXG59XHJcbiIsIm1vZHVsZSB2cy50b29scyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBleHBvcnQgY2xhc3MgUnVuQmxvY2sge1xyXG4gICAgLyoqIEBuZ0luamVjdCAqL1xyXG4gICAgY29uc3RydWN0b3IoJGxvZzogbmcuSUxvZ1NlcnZpY2UpIHtcclxuICAgICAgJGxvZy5kZWJ1ZygncnVuQmxvY2sgZW5kJyk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5jb25maWcudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXgucnVuLnRzXCIgLz5cclxuXHJcbm1vZHVsZSB2cy50b29scyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBkZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scycsIFtdKVxyXG4gICAgLmNvbmZpZyhDb25maWcpXHJcbiAgICAucnVuKFJ1bkJsb2NrKVxyXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xyXG59XHJcbiIsIm1vZHVsZSB2cy50b29scy5kaXNwbGF5Q29uZmlnIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5kaXNwbGF5Q29uZmlnJywgW10pO1xyXG59XHJcbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cclxuZGVjbGFyZSB2YXIgY29uZmlnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnKS5cclxuXHQvKiBAbmdJbmplY3QgKi9cclxuXHRmYWN0b3J5KCdkaXNwbGF5Q29uZmlnUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSkge1xyXG5cclxuXHRcdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0XHR2YXIgY29uZmlnVXJpID0gY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9jb25maWcvJztcclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkge1xyXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyAnbGlzdCc7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRDb25maWdRdWVyeVN0cmluZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArIGlkO1xyXG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldExpc3RRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0RGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2RlbGV0ZURpc3BsYXlDb25maWcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZTogYW55KSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KGNvbmZpZ1VyaSwgdGVtcGxhdGUpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdldERpc3BsYXlDb25maWdzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWdMaXN0KCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldERpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZWxldGVEaXNwbGF5Q29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9kZWxldGVEaXNwbGF5Q29uZmlnKGlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2F2ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKHRlbXBsYXRlOiBhbnkpe1xyXG5cdFx0XHRcdHJldHVybiBfc2F2ZURpc3BsYXlDb25maWcodGVtcGxhdGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pO1xyXG4iLCJtb2R1bGUgdnMudG9vbHMudXRpbCB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHRleHBvcnQgY2xhc3MgU3VnYXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSkge31cclxuXHJcblx0XHRwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHZhbDogYW55KSB7XHJcblx0XHRcdHJldHVybiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZ2V0SW5zdGFuY2UoY29uZmlnOiBhbnksICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIDogU3VnYXIge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFN1Z2FyKGNvbmZpZywgJGh0dHApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRvTWFwKGtleTogYW55LCBhcnJheTogYW55KSB7XHJcblx0XHRcdHZhciBtYXAgPSB7fTtcclxuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xyXG5cdFx0XHRcdG1hcFt2YWx1ZVtrZXldXSA9IHZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG1hcDtcclxuXHRcdH1cclxuXHJcblx0XHR0b1N0cmluZ01hcChhcnJheTogYW55KSB7XHJcblx0XHRcdHZhciBtYXAgPSB7fTtcclxuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xyXG5cdFx0XHRcdG1hcFt2YWx1ZV0gPSB2YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBtYXA7XHJcblx0XHR9XHJcblxyXG4gICAgcGx1Y2soYXJyYXk6IGFueSwgbmFtZTogc3RyaW5nLCBmbj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgIHZhciBmbCA9IFtdO1xyXG4gICAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlOiBhbnkpe1xyXG4gICAgICAgIGlmIChmbiAmJiBmbih2YWx1ZSkpIHtcclxuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChmbikpIHtcclxuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBmbDtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0Rm9ybSh1cmw6IHN0cmluZywgZGF0YTogYW55KSB7XHJcbiAgICAgIHZhciBzZXJ2aWNlID0gdGhpcy5jb25maWcucm9vdCArIHVybDtcclxuICAgICAgcmV0dXJuIHRoaXMuJGh0dHAoe1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIHVybDogc2VydmljZSxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ31cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VRdWVyeVN0cmluZyhxdWVyeVN0cmluZzogc3RyaW5nKSB7XHJcbiAgICAgIHZhciBwYWlycyA9IHF1ZXJ5U3RyaW5nLnNsaWNlKDEpLnNwbGl0KCcmJyk7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7fSwgcztcclxuICAgICAgcGFpcnMuZm9yRWFjaChmdW5jdGlvbihwYWlyKSB7XHJcbiAgICAgICAgcyA9IHBhaXIuc3BsaXQoJz0nKTtcclxuICAgICAgICByZXN1bHRbc1swXV0gPSBkZWNvZGVVUklDb21wb25lbnQoc1sxXSB8fCAnJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0SnNvbihyZXF1ZXN0LCBhcGksIGFjdGlvbikge1xyXG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgdXJsOiBjb25maWcucm9vdCArICdhcGkvcmVzdC8nICsgYXBpICArICcvJyArIGFjdGlvbiArICcuanNvbicsXHJcbiAgICAgICAgZGF0YTogcmVxdWVzdCxcclxuICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblx0fVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdXRpbC9zdWdhci50c1wiIC8+XHJcblxyXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWVsZHNSZXNvdXJjZSB7XHJcblx0XHRmZXRjaChmaWVsZHM/OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xyXG5cdFx0ZmV0Y2hIeWRyYXRpb25TdGF0cyhxdWVyeTogc3RyaW5nKTogbmcuSVByb21pc2U8YW55PjtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBGaWVsZHNSZXNvdXJjZSBpbXBsZW1lbnRzIElGaWVsZHNSZXNvdXJjZSB7XHJcblx0XHRzdGF0aWMgcmVmTmFtZSA9ICdmaWVsZHNSZXNvdXJjZSc7XHJcblxyXG5cdFx0ZmV0Y2g6IChwcm9wZXJ0aWVzPzogc3RyaW5nKSA9PiBhbnk7XHJcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzOiAocXVlcnk6IHN0cmluZykgPT4gYW55O1xyXG5cclxuXHRcdC8qIEBuZ0luamVjdCAqL1xyXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzdWdhcjogYW55KSB7XHJcblxyXG4gICAgICB0aGlzLmZldGNoID0gKGZpZWxkcz86IGFueSkgPT4ge1xyXG4gICAgICAgIHZhciBmbCA9IChmaWVsZHMgfHwgJ25hbWUsc3R5cGUsY2F0ZWdvcnksZG9jcyxkaXNwX2VuLHNvcnRhYmxlLGZpbHRlcmFibGUsdGFibGVhYmxlLGRpc3BsYXlhYmxlLGVkaXRhYmxlJyk7XHJcbiAgICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdzb2xyL2ZpZWxkcy9zZWxlY3QnLCB0aGlzLmdldEZpZWxkc1BhcmFtcyhmbCkpLnRoZW4oKHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gcmVzLmRhdGEucmVzcG9uc2UuZG9jcztcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcblx0XHRcdHRoaXMuZmV0Y2hIeWRyYXRpb25TdGF0cyA9IChxdWVyeTogc3RyaW5nKSA9PiB7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoKCkudGhlbigoZmllbGRzOiBBcnJheTxhbnk+KSA9PiB7XHJcbiAgICAgICAgICB2YXIgZmwgPSBzdWdhci5wbHVjayhmaWVsZHMsICduYW1lJywgZnVuY3Rpb24oZmllbGQpIHsgcmV0dXJuIGZpZWxkLm5hbWUuaW5kZXhPZignXycpICE9PSAwICYmIGZpZWxkLmRvY3MgPiAwOyB9KTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvdjAvc2VsZWN0PycgKyBxdWVyeSwgdGhpcy5nZXRTdGF0c1BhcmFtcyhmbCkpLnRoZW4oKHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBzdGF0c0ZpZWxkcyA9IHJlcy5kYXRhLmZhY2V0X2NvdW50cy5mYWNldF9maWVsZHM7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IHJlcy5kYXRhLnJlc3BvbnNlLm51bUZvdW5kO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5SHlkcmF0aW9uKHN0YXRzRmllbGRzLCBmaWVsZHMsIHRvdGFsKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkcztcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGaWVsZHNQYXJhbXMoZmwpIHtcclxuICAgICAgcmV0dXJuICdxPSo6KiZmbD0nICsgZmwgKyAnJnJvd3M9MTAwMDAmc29ydD1uYW1lJTIwYXNjJnd0PWpzb24nO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGdldFN0YXRzUGFyYW1zKGZsKSB7XHJcbiAgICAgIHJldHVybiAnZmFjZXQ9dHJ1ZSZmYWNldC5saW1pdD0xMDAwMCZmYWNldC5taW5jb3VudD0xMDAmcm93cz0wJnd0PWpzb24mZmFjZXQuZmllbGQ9JyArIGZsLmpvaW4oJyZmYWNldC5maWVsZD0nKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFwcGx5SHlkcmF0aW9uKHN0YXRzRmllbGRzLCBmaWVsZHMsIHRvdGFsKSB7XHJcbiAgICAgIHZhciBzdGF0c0ZpZWxkLCBjb3VudDtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdGF0c0ZpZWxkID0gc3RhdHNGaWVsZHNbZmllbGRzW2ldLm5hbWVdO1xyXG4gICAgICAgIGlmIChzdGF0c0ZpZWxkICYmIHN0YXRzRmllbGQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgZmllbGRzW2ldLmlkID0gZmllbGRzW2ldLm5hbWU7XHJcbiAgICAgICAgICBjb3VudCA9IHRoaXMuZ2V0Q291bnQoc3RhdHNGaWVsZCk7XHJcbiAgICAgICAgICBmaWVsZHNbaV0uaHlkcmF0aW9uID0gY291bnQgLyB0b3RhbCAqIDEwMDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDb3VudChmaWVsZCkge1xyXG4gICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGZpZWxkLmxlbmd0aDsgaSArPSAyKSB7XHJcbiAgICAgICAgY291bnQgKz0gZmllbGRbaV07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZpZWxkcy5yZXNvdXJjZS50c1wiIC8+XHJcblxyXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmllbGRzJywgWyd2cy50b29scy51dGlsJ10pXHJcblx0XHQuc2VydmljZShGaWVsZHNSZXNvdXJjZS5yZWZOYW1lLCBGaWVsZHNSZXNvdXJjZSk7XHJcblxyXG59XHJcbiIsIm1vZHVsZSB2cy50b29scy5maWx0ZXJzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWx0ZXJzJywgW10pXG4gICAgLmZpbHRlcigncmVwbGFjZVN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gaGF5U3RhY2sucmVwbGFjZShuZXcgUmVnRXhwKG9sZE5lZWRsZSwgJ2cnKSwgbmV3TmVlZGxlKTtcbiAgICAgIH07XG4gICAgfSk7XG4gfVxuIiwibW9kdWxlIHZzLnRvb2xzLnNhdmVkU2VhcmNoIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcsIFsndnMudG9vbHMudXRpbCddKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSwgc3VnYXIpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgIGZ1bmN0aW9uIF9kb1NhdmUoc2F2ZWRTZWFyY2g6IGFueSkge1xyXG4gICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RKc29uKHNhdmVkU2VhcmNoLCAnZGlzcGxheScsICdzc2VhcmNoJyk7XHJcbiAgICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9nZXRRdWVyeVN0cmluZyhpZD86IHN0cmluZykge1xyXG4gICAgICB2YXIgcm93cyA9IDE1MDsgIC8vIEBUT0RPIHNldCB0byB3aGF0IHdlIHJlYWxseSB3YW50XHJcbiAgICAgIHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZy5yb290ICsgJ3NvbHIvc3NlYXJjaC9zZWxlY3Q/JztcclxuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZmw9aWQsdGl0bGUsZGVzY3JpcHRpb24sb3duZXIscGF0aCxzaGFyZSxxdWVyeSxjb25maWcsb3JkZXIsc2F2ZWQscHJpdmF0ZSx2aWV3LF92ZXJzaW9uXyxjb25maWdfdGl0bGU6W2NvbmZpZ1RpdGxlXSxwYXJhbSosbGFiZWxzJztcclxuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xyXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaWQpKSB7XHJcbiAgICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmcT1pZDonICsgaWQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKGlkPzogc3RyaW5nKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5qc29ucChfZ2V0UXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5kYXRhLnJlc3BvbnNlLmRvY3M7XHJcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZ2V0U2F2ZWRTZWFyY2hlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIF9leGVjdXRlKCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmZXRjaDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoaWQpLnRoZW4oZnVuY3Rpb24oZG9jcykge1xyXG4gICAgICAgICAgcmV0dXJuIGRvY3NbMF07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzYXZlU2VhcmNoOiBmdW5jdGlvbihzYXZlZFNlYXJjaCwgcGFyYW1zKSB7XHJcbiAgICAgICAvLyAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xyXG4gICAgICAgLy8gIHNhdmVkU2VhcmNoLnF1ZXJ5ID0gY29udmVydGVyLnRvQ2xhc3NpY1BhcmFtcyhwYXJhbXMpO1xyXG4gICAgICAgcmV0dXJuIF9kb1NhdmUoc2F2ZWRTZWFyY2gpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZGVsZXRlU2VhcmNoOiBmdW5jdGlvbihpZDogc3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQpLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAvLyBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcclxuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcclxuICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB3aXBlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC93aXBlJyk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZXN0b3JlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvcmVzdG9yZScsICcnKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZDogYW55LCBiZWZvcmVJZDogYW55LCBhZnRlcklkOiBhbnkpIHtcclxuICAgICAgICB2YXIgZGF0YSA9ICcnO1xyXG4gICAgICAgIGlmIChiZWZvcmVJZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgZGF0YSArPSAnYmVmb3JlPScgKyBiZWZvcmVJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGEgIT09ICcnKSB7XHJcbiAgICAgICAgICBkYXRhICs9ICcmJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhZnRlcklkICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBkYXRhICs9ICdhZnRlcj0nICsgYWZ0ZXJJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmV0Y2hMYWJlbHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB1cmwgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0P3Jvd3M9MCZmYWNldD10cnVlJmZhY2V0LmZpZWxkPWxhYmVscyZ3dD1qc29uJnI9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcclxuICAgICAgICAgIHJldHVybiByZXNwLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcy5sYWJlbHM7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAvLyBlcnJvciBpZiBsYWJlbHMgZmllbGQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pO1xyXG4iLCJtb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBUcmFuc2xhdG9yIHtcclxuXHJcbiAgICBwcml2YXRlIGZpZWxkczogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKiBAbmdJbmplY3QgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgcHJpdmF0ZSAkcTogbmcuSVFTZXJ2aWNlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWQoKSB7XHJcbiAgICAgIHZhciByZXNvdXJjZVVybCA9IHRoaXMuY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvaTE4bi9maWVsZHMvc3RhbmRhcmQuanNvbic7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuZmllbGRzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAuZ2V0KHJlc291cmNlVXJsKS50aGVuKChyZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5maWVsZHMgPSByZXMuZGF0YTtcclxuICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kcS53aGVuKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlRmllbGQoZmllbGQ6IHN0cmluZykge1xyXG4gICAgICB2YXIgdHJhbnNsYXRlZCA9IHRoaXMuZmllbGRzLkZJRUxEW2ZpZWxkXTtcclxuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRyYW5zbGF0ZWQpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkoZmllbGQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGFzc2lmeShzdHI6IHN0cmluZykge1xyXG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXy9nLCAnICcpO1xyXG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0OiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyYW5zbGF0b3IudHNcIiAvPlxyXG5tb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnRyYW5zbGF0ZScsIFtdKVxyXG4gICAgLyogQG5nSW5qZWN0ICovXHJcbiAgICAuZmFjdG9yeSgndHJhbnNsYXRvcicsIChjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgJHE6IG5nLklRU2VydmljZSkgPT4gbmV3IFRyYW5zbGF0b3IoY29uZmlnLCAkaHR0cCwgJHEpKVxyXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdWdhci50c1wiIC8+XHJcbm1vZHVsZSB2cy50b29scy51dGlsIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy51dGlsJywgW10pXHJcbiAgICAvKiBAbmdJbmplY3QgKi9cclxuICAgIC5mYWN0b3J5KCdzdWdhcicsIChjb25maWcsICRodHRwKSA9PiBTdWdhci5nZXRJbnN0YW5jZShjb25maWcsICRodHRwKSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
//# sourceMappingURL=maps/vs.toolkit.src.js.map