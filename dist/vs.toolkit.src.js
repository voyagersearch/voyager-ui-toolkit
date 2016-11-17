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
        var catalog;
        (function (catalog) {
            'use strict';
            angular.module('vs.tools.catalog', []);
        })(catalog = tools.catalog || (tools.catalog = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.catalog').
    /* @ngInject */
    factory('catalogResource', function ($http, $q) {
    'use strict';
    var uri = config.root + 'api/rest/index/config/federation.json';
    var locations = 'api/rest/i18n/field/location.json';
    function _fetch() {
        return $http.get(uri).then(function (res) {
            return res.data.servers;
        }, function (error) {
            console.log(error);
            return error;
        });
    }
    function _loadRemoteLocations(params) {
        return _fetch().then(function (catalogs) {
            var promises = [];
            catalogs.forEach(function (catalog) {
                if (angular.isDefined(catalog.url)) {
                    var url = catalog.url + locations;
                    var catalogPromise = $http.get(url, { withCredentials: false }).then(function (response) {
                        return response;
                    });
                    promises.push(catalogPromise);
                }
            });
            return $q.all(promises).then(function (res) {
                return res;
            }, function (error) {
                return error; // failure means the remote catalogs are offline, allow to continue, the search should show an error
            });
        });
    }
    return {
        fetch: _fetch,
        loadRemoteLocations: _loadRemoteLocations
    };
});

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
                        return sugar.postForm('solr/fields/select?rand=' + Math.random(), _this.getFieldsParams(fl)).then(function (res) {
                            _this.ensureTagsFieldExist(res.data.response.docs);
                            return res.data.response.docs;
                        });
                    };
                    this.ensureTagsFieldExist = function (fields) {
                        var found = false;
                        for (var i = fields.length - 1; i >= 0; i--) {
                            if (fields[i].name === 'tag_tags') {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            fields.push({
                                category: 'TEXT',
                                disp_en: 'Tags',
                                displayable: true,
                                docs: 0,
                                filterable: true,
                                name: 'tag_tags',
                                sortable: false,
                                stype: 'string',
                                tableable: false
                            });
                        }
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
                    return 'q=*:*&fl=' + fl + '&rows=100000&sort=name%20asc&wt=json&rand=' + Math.random();
                };
                FieldsResource.prototype.getStatsParams = function (fl) {
                    return 'facet=true&facet.limit=100000&facet.mincount=100&rows=0&wt=json&facet.field=' + fl.join('&facet.field=') + '&rand=' + Math.random();
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
        queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle],param*,labels,display_override';
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
                    var _this = this;
                    this.config = config;
                    this.$http = $http;
                    this.$q = $q;
                    this.fields = null;
                    this.removePrefixHash = {};
                    var removePrefixList = ['fs_', 'ft_', 'fh_', 'fi_', 'fl_', 'fd_', 'ff_', 'fu_', 'fp_', 'fy_', 'fm_', 'fb_', 'tag_', 'meta_', 'fss_', 'grp_'];
                    removePrefixList.forEach(function (item) {
                        _this.removePrefixHash[item] = true;
                        var c = item.substring(1, 2);
                        var key = item.replace('_', c + '_');
                        _this.removePrefixHash[key] = true;
                    });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ01vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ1Jlc291cmNlLnRzIiwiZGlzcGxheS1jb25maWcvRGlzcGxheUNvbmZpZ01vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdSZXNvdXJjZS50cyIsInV0aWwvc3VnYXIudHMiLCJmaWVsZHMvZmllbGRzLnJlc291cmNlLnRzIiwiZmllbGRzL2ZpZWxkcy5tb2R1bGUudHMiLCJmaWx0ZXJzL2ZpbHRlcnMudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInRyYW5zbGF0ZS90cmFuc2xhdG9yLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5tb2R1bGUudHMiLCJ1dGlsL3V0aWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sRUFBRSxDQVlSO0FBWkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBWWQ7SUFaUyxXQUFBLEtBQUssRUFBQyxDQUFDO1FBQ2YsWUFBWSxDQUFDO1FBRWI7WUFDRSxnQkFBZ0I7WUFDaEIsZ0JBQVksWUFBNkI7Z0JBQ3ZDLGFBQWE7Z0JBQ2IsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsOEJBQThCO1lBQ2hDLENBQUM7WUFFSCxhQUFDO1FBQUQsQ0FSQSxBQVFDLElBQUE7UUFSWSxZQUFNLFNBUWxCLENBQUE7SUFDSCxDQUFDLEVBWlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBWWQ7QUFBRCxDQUFDLEVBWk0sRUFBRSxLQUFGLEVBQUUsUUFZUjs7QUNaRCxJQUFPLEVBQUUsQ0FVUjtBQVZELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVVkO0lBVlMsV0FBQSxLQUFLLEVBQUMsQ0FBQztRQUNmLFlBQVksQ0FBQztRQUViO1lBQ0UsZ0JBQWdCO1lBQ2hCLGtCQUFZLElBQW9CO2dCQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFSCxlQUFDO1FBQUQsQ0FOQSxBQU1DLElBQUE7UUFOWSxjQUFRLFdBTXBCLENBQUE7SUFDSCxDQUFDLEVBVlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBVWQ7QUFBRCxDQUFDLEVBVk0sRUFBRSxLQUFGLEVBQUUsUUFVUjs7QUNWRCxpREFBaUQ7QUFFakQsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUVyQyxJQUFPLEVBQUUsQ0FTUjtBQVRELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVNkO0lBVFMsV0FBQSxLQUFLLEVBQUMsQ0FBQztRQUNmLFlBQVksQ0FBQztRQUliLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQzthQUMzQixNQUFNLENBQUMsWUFBTSxDQUFDO2FBQ2QsR0FBRyxDQUFDLGNBQVEsQ0FBQzthQUNiLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQyxFQVRTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQVNkO0FBQUQsQ0FBQyxFQVRNLEVBQUUsS0FBRixFQUFFLFFBU1I7O0FDZEQsSUFBTyxFQUFFLENBSVI7QUFKRCxXQUFPLEVBQUU7SUFBQyxJQUFBLEtBQUssQ0FJZDtJQUpTLFdBQUEsS0FBSztRQUFDLElBQUEsT0FBTyxDQUl0QjtRQUplLFdBQUEsT0FBTyxFQUFDLENBQUM7WUFDdkIsWUFBWSxDQUFDO1lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6QyxDQUFDLEVBSmUsT0FBTyxHQUFQLGFBQU8sS0FBUCxhQUFPLFFBSXRCO0lBQUQsQ0FBQyxFQUpTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQUlkO0FBQUQsQ0FBQyxFQUpNLEVBQUUsS0FBRixFQUFFLFFBSVI7O0FDREQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztJQUNqQyxlQUFlO0lBQ2YsT0FBTyxDQUFDLGlCQUFpQixFQUFFLFVBQVUsS0FBVSxFQUFFLEVBQU87SUFFdkQsWUFBWSxDQUFDO0lBRWIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyx1Q0FBdUMsQ0FBQztJQUNoRSxJQUFJLFNBQVMsR0FBRyxtQ0FBbUMsQ0FBQztJQUVwRDtRQUNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQVE7WUFDNUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3pCLENBQUMsRUFBRSxVQUFTLEtBQVU7WUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsOEJBQThCLE1BQVc7UUFDeEMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQWE7WUFDbEMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO2dCQUN2QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO29CQUNsQyxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQWE7d0JBQ2hGLE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBQ2pCLENBQUMsQ0FBQyxDQUFDO29CQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQy9CLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLEdBQUc7Z0JBQ3hDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDWixDQUFDLEVBQUUsVUFBUyxLQUFLO2dCQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsb0dBQW9HO1lBQ25ILENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDO1FBQ04sS0FBSyxFQUFFLE1BQU07UUFDYixtQkFBbUIsRUFBRSxvQkFBb0I7S0FDekMsQ0FBQztBQUNILENBQUMsQ0FBQyxDQUFDOztBQzdDSixJQUFPLEVBQUUsQ0FJUjtBQUpELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQUlkO0lBSlMsV0FBQSxLQUFLO1FBQUMsSUFBQSxhQUFhLENBSTVCO1FBSmUsV0FBQSxhQUFhLEVBQUMsQ0FBQztZQUM3QixZQUFZLENBQUM7WUFFYixPQUFPLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLENBQUMsRUFKZSxhQUFhLEdBQWIsbUJBQWEsS0FBYixtQkFBYSxRQUk1QjtJQUFELENBQUMsRUFKUyxLQUFLLEdBQUwsUUFBSyxLQUFMLFFBQUssUUFJZDtBQUFELENBQUMsRUFKTSxFQUFFLEtBQUYsRUFBRSxRQUlSOztBQ0RELE9BQU8sQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUM7SUFDdkMsZUFBZTtJQUNmLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxVQUFVLEtBQVU7SUFFcEQsWUFBWSxDQUFDO0lBRWIsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRywwQkFBMEIsQ0FBQztJQUV6RDtRQUNDLElBQUksV0FBVyxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDckMsV0FBVyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEMsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUNwQixDQUFDO0lBRUQsK0JBQStCLEVBQVU7UUFDeEMsSUFBSSxXQUFXLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNqQyxXQUFXLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4QyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3BCLENBQUM7SUFFRDtRQUNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFTO1lBQy9ELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDLEVBQUUsVUFBUyxLQUFVO1lBQ3JCLHNCQUFzQjtZQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCwyQkFBMkIsRUFBVTtRQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQVM7WUFDbkUsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNiLENBQUMsRUFBRSxVQUFTLEtBQVU7WUFDckIsc0JBQXNCO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELDhCQUE4QixFQUFVO1FBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBUztZQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQyxFQUFFLFVBQVMsS0FBVTtZQUNyQixzQkFBc0I7WUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsNEJBQTRCLFFBQWE7UUFDeEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQVM7WUFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNiLENBQUMsRUFBRSxVQUFTLEtBQVU7WUFDckIsc0JBQXNCO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sQ0FBQztRQUNOLGlCQUFpQixFQUFFO1lBQ2xCLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ2hDLENBQUM7UUFDRCxnQkFBZ0IsRUFBRSxVQUFTLEVBQVU7WUFDcEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFDRCxtQkFBbUIsRUFBRSxVQUFTLEVBQVU7WUFDdkMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFDRCxpQkFBaUIsRUFBRSxVQUFTLFFBQWE7WUFDeEMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7S0FDRCxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FDN0VKLElBQU8sRUFBRSxDQXlFUjtBQXpFRCxXQUFPLEVBQUU7SUFBQyxJQUFBLEtBQUssQ0F5RWQ7SUF6RVMsV0FBQSxLQUFLO1FBQUMsSUFBQSxJQUFJLENBeUVuQjtRQXpFZSxXQUFBLElBQUksRUFBQyxDQUFDO1lBQ3BCLFlBQVksQ0FBQztZQUVkO2dCQUVHLGVBQW9CLE1BQVcsRUFBVSxLQUFzQjtvQkFBM0MsV0FBTSxHQUFOLE1BQU0sQ0FBSztvQkFBVSxVQUFLLEdBQUwsS0FBSyxDQUFpQjtnQkFBRyxDQUFDO2dCQUV2RCxjQUFRLEdBQXRCLFVBQXVCLEdBQVE7b0JBQzlCLE1BQU0sQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLFlBQVksTUFBTSxDQUFDLENBQUM7Z0JBQzNELENBQUM7Z0JBRU0saUJBQVcsR0FBbEIsVUFBbUIsTUFBVyxFQUFFLEtBQXNCO29CQUNyRCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO2dCQUVELHFCQUFLLEdBQUwsVUFBTSxHQUFRLEVBQUUsS0FBVTtvQkFDekIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO29CQUNiLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFVO3dCQUN4QixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUN6QixDQUFDLENBQUMsQ0FBQztvQkFDSCxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNaLENBQUM7Z0JBRUQsMkJBQVcsR0FBWCxVQUFZLEtBQVU7b0JBQ3JCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDYixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVTt3QkFDeEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFDcEIsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDWixDQUFDO2dCQUVDLHFCQUFLLEdBQUwsVUFBTSxLQUFVLEVBQUUsSUFBWSxFQUFFLEVBQWE7b0JBQzNDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztvQkFDWixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsS0FBVTt3QkFDL0IsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3BCLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3ZCLENBQUM7d0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNuQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixDQUFDO29CQUNILENBQUMsQ0FBQyxDQUFDO29CQUNILE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQ1osQ0FBQztnQkFFRCx3QkFBUSxHQUFSLFVBQVMsR0FBVyxFQUFFLElBQVM7b0JBQzdCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztvQkFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7d0JBQ2hCLE1BQU0sRUFBRSxNQUFNO3dCQUNkLEdBQUcsRUFBRSxPQUFPO3dCQUNaLElBQUksRUFBRSxJQUFJO3dCQUNWLGVBQWUsRUFBRSxJQUFJO3dCQUNyQixPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsbUNBQW1DLEVBQUM7cUJBQ2hFLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUVELGdDQUFnQixHQUFoQixVQUFpQixXQUFtQjtvQkFDbEMsSUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzVDLElBQUksTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ25CLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJO3dCQUN6QixDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDaEQsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUVELHdCQUFRLEdBQVIsVUFBUyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU07b0JBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO3dCQUNoQixNQUFNLEVBQUUsTUFBTTt3QkFDZCxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsR0FBRyxHQUFJLEdBQUcsR0FBRyxNQUFNLEdBQUcsT0FBTzt3QkFDOUQsSUFBSSxFQUFFLE9BQU87d0JBQ2IsT0FBTyxFQUFFLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDO3FCQUM5QyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFDSixZQUFDO1lBQUQsQ0FyRUEsQUFxRUMsSUFBQTtZQXJFWSxVQUFLLFFBcUVqQixDQUFBO1FBQ0YsQ0FBQyxFQXpFZSxJQUFJLEdBQUosVUFBSSxLQUFKLFVBQUksUUF5RW5CO0lBQUQsQ0FBQyxFQXpFUyxLQUFLLEdBQUwsUUFBSyxLQUFMLFFBQUssUUF5RWQ7QUFBRCxDQUFDLEVBekVNLEVBQUUsS0FBRixFQUFFLFFBeUVSOztBQ3pFRCxvREFBb0Q7QUFDcEQseUNBQXlDO0FBRXpDLElBQU8sRUFBRSxDQWtHUjtBQWxHRCxXQUFPLEVBQUU7SUFBQyxJQUFBLEtBQUssQ0FrR2Q7SUFsR1MsV0FBQSxLQUFLO1FBQUMsSUFBQSxNQUFNLENBa0dyQjtRQWxHZSxXQUFBLFFBQU0sRUFBQyxDQUFDO1lBQ3hCLFlBQVksQ0FBQztZQU9aO2dCQU9DLGVBQWU7Z0JBQ2Ysd0JBQW9CLEtBQVU7b0JBUi9CLGlCQXlGRTtvQkFqRm1CLFVBQUssR0FBTCxLQUFLLENBQUs7b0JBRTFCLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBQyxNQUFZO3dCQUN4QixJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sSUFBSSxxRkFBcUYsQ0FBQyxDQUFDO3dCQUMzRyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQVE7NEJBQ3hHLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDbEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDaEMsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQyxDQUFDO29CQUVGLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxVQUFDLE1BQWtCO3dCQUM3QyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ2xCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDNUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dDQUNsQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dDQUNiLEtBQUssQ0FBQzs0QkFDUixDQUFDO3dCQUNILENBQUM7d0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0NBQ1YsUUFBUSxFQUFFLE1BQU07Z0NBQ2hCLE9BQU8sRUFBRSxNQUFNO2dDQUNmLFdBQVcsRUFBRSxJQUFJO2dDQUNqQixJQUFJLEVBQUUsQ0FBQztnQ0FDUCxVQUFVLEVBQUUsSUFBSTtnQ0FDaEIsSUFBSSxFQUFFLFVBQVU7Z0NBQ2hCLFFBQVEsRUFBRSxLQUFLO2dDQUNmLEtBQUssRUFBRSxRQUFRO2dDQUNmLFNBQVMsRUFBRSxLQUFLOzZCQUNqQixDQUFDLENBQUM7d0JBQ0wsQ0FBQztvQkFDSCxDQUFDLENBQUM7b0JBRUwsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFVBQUMsS0FBYTt3QkFFeEMsTUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFrQjs0QkFDdEMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFFbEgsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxFQUFFLEtBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFRO2dDQUN0RixJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUM7Z0NBQ3JELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQ0FDdkMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dDQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDOzRCQUNoQixDQUFDLENBQUMsQ0FBQzt3QkFDTCxDQUFDLENBQUMsQ0FBQztvQkFFUixDQUFDLENBQUM7Z0JBRUgsQ0FBQztnQkFFUyx3Q0FBZSxHQUF2QixVQUF3QixFQUFFO29CQUN4QixNQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyw0Q0FBNEMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3pGLENBQUM7Z0JBR08sdUNBQWMsR0FBdEIsVUFBdUIsRUFBRTtvQkFDdkIsTUFBTSxDQUFDLDhFQUE4RSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDOUksQ0FBQztnQkFFTyx1Q0FBYyxHQUF0QixVQUF1QixXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUs7b0JBQy9DLElBQUksVUFBVSxFQUFFLEtBQUssQ0FBQztvQkFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ3ZDLFVBQVUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN6QyxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7NEJBQzlCLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDOzRCQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO3dCQUM1QyxDQUFDO29CQUNILENBQUM7b0JBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDO2dCQUVPLGlDQUFRLEdBQWhCLFVBQWlCLEtBQUs7b0JBQ3BCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFDZCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO3dCQUN6QyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQixDQUFDO29CQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2YsQ0FBQztnQkF0Rkksc0JBQU8sR0FBRyxnQkFBZ0IsQ0FBQztnQkF3RmxDLHFCQUFDO1lBQUQsQ0F6RkQsQUF5RkUsSUFBQTtZQXpGVyx1QkFBYyxpQkF5RnpCLENBQUE7UUFDSCxDQUFDLEVBbEdlLE1BQU0sR0FBTixZQUFNLEtBQU4sWUFBTSxRQWtHckI7SUFBRCxDQUFDLEVBbEdTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQWtHZDtBQUFELENBQUMsRUFsR00sRUFBRSxLQUFGLEVBQUUsUUFrR1I7O0FDckdELG9EQUFvRDtBQUNwRCw2Q0FBNkM7QUFFN0MsSUFBTyxFQUFFLENBTVI7QUFORCxXQUFPLEVBQUU7SUFBQyxJQUFBLEtBQUssQ0FNZDtJQU5TLFdBQUEsS0FBSztRQUFDLElBQUEsTUFBTSxDQU1yQjtRQU5lLFdBQUEsTUFBTSxFQUFDLENBQUM7WUFDeEIsWUFBWSxDQUFDO1lBRVosT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2lCQUNsRCxPQUFPLENBQUMscUJBQWMsQ0FBQyxPQUFPLEVBQUUscUJBQWMsQ0FBQyxDQUFDO1FBRW5ELENBQUMsRUFOZSxNQUFNLEdBQU4sWUFBTSxLQUFOLFlBQU0sUUFNckI7SUFBRCxDQUFDLEVBTlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBTWQ7QUFBRCxDQUFDLEVBTk0sRUFBRSxLQUFGLEVBQUUsUUFNUjs7QUNURCxJQUFPLEVBQUUsQ0FTUDtBQVRGLFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVNiO0lBVFEsV0FBQSxLQUFLO1FBQUMsSUFBQSxPQUFPLENBU3JCO1FBVGMsV0FBQSxPQUFPLEVBQUMsQ0FBQztZQUN2QixZQUFZLENBQUM7WUFFYixPQUFPLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQztpQkFDbkMsTUFBTSxDQUFDLGVBQWUsRUFBRTtnQkFDdkIsTUFBTSxDQUFDLFVBQVMsUUFBZ0IsRUFBRSxTQUFpQixFQUFFLFNBQWlCO29CQUNwRSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2pFLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxFQVRjLE9BQU8sR0FBUCxhQUFPLEtBQVAsYUFBTyxRQVNyQjtJQUFELENBQUMsRUFUUSxLQUFLLEdBQUwsUUFBSyxLQUFMLFFBQUssUUFTYjtBQUFELENBQUMsRUFUSyxFQUFFLEtBQUYsRUFBRSxRQVNQOztBQ1RGLElBQU8sRUFBRSxDQUlSO0FBSkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBSWQ7SUFKUyxXQUFBLEtBQUs7UUFBQyxJQUFBLFdBQVcsQ0FJMUI7UUFKZSxXQUFBLFdBQVcsRUFBQyxDQUFDO1lBQzNCLFlBQVksQ0FBQztZQUViLE9BQU8sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUMsRUFKZSxXQUFXLEdBQVgsaUJBQVcsS0FBWCxpQkFBVyxRQUkxQjtJQUFELENBQUMsRUFKUyxLQUFLLEdBQUwsUUFBSyxLQUFMLFFBQUssUUFJZDtBQUFELENBQUMsRUFKTSxFQUFFLEtBQUYsRUFBRSxRQUlSOztBQ0RELE9BQU8sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUM7SUFDckMsZUFBZTtJQUNkLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxVQUFVLEtBQVUsRUFBRSxLQUFLO0lBRXhELFlBQVksQ0FBQztJQUVaLGlCQUFpQixXQUFnQjtRQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRix5QkFBeUIsRUFBVztRQUNsQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBRSxtQ0FBbUM7UUFDcEQsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxzQkFBc0IsQ0FBQztRQUN2RCxXQUFXLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3pELFdBQVcsSUFBSSxxSkFBcUosQ0FBQztRQUNySyxXQUFXLElBQUksaUNBQWlDLENBQUM7UUFDakQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsV0FBVyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELGtCQUFrQixFQUFXO1FBQzNCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQVM7WUFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUNqQyxDQUFDLEVBQUUsVUFBUyxLQUFVO1lBQ3BCLHNCQUFzQjtZQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUM7UUFDTCxnQkFBZ0IsRUFBRTtZQUNoQixNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQUVELEtBQUssRUFBRSxVQUFTLEVBQUU7WUFDaEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO2dCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELFVBQVUsRUFBRSxVQUFTLFdBQVcsRUFBRSxNQUFNO1lBQ3ZDLHFEQUFxRDtZQUNyRCwwREFBMEQ7WUFDMUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsWUFBWSxFQUFFLFVBQVMsRUFBVTtZQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLDJCQUEyQixHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDbkUsdUNBQXVDO2dCQUN2QyxlQUFlO2dCQUNmLE1BQU07WUFDUixDQUFDLENBQUMsQ0FBQztRQUNULENBQUM7UUFFRCxJQUFJLEVBQUU7WUFDSixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLCtCQUErQixDQUFDLENBQUM7UUFDckUsQ0FBQztRQUVELE9BQU8sRUFBRTtZQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLDBCQUEwQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFRCxLQUFLLEVBQUUsVUFBUyxFQUFPLEVBQUUsUUFBYSxFQUFFLE9BQVk7WUFDbEQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQy9CLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxJQUFJLEdBQUcsQ0FBQztZQUNkLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDN0IsQ0FBQztZQUNELDRFQUE0RTtRQUM5RSxDQUFDO1FBRUQsV0FBVyxFQUFFO1lBQ1gsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxxRUFBcUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JILE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7Z0JBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3BELENBQUMsRUFBRTtnQkFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDOztBQzVGTCxJQUFPLEVBQUUsQ0F1RFI7QUF2REQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBdURkO0lBdkRTLFdBQUEsS0FBSztRQUFDLElBQUEsU0FBUyxDQXVEeEI7UUF2RGUsV0FBQSxTQUFTLEVBQUMsQ0FBQztZQUN6QixZQUFZLENBQUM7WUFFYjtnQkFLRSxlQUFlO2dCQUNmLG9CQUFvQixNQUFXLEVBQVUsS0FBc0IsRUFBVSxFQUFnQjtvQkFOM0YsaUJBbURDO29CQTdDcUIsV0FBTSxHQUFOLE1BQU0sQ0FBSztvQkFBVSxVQUFLLEdBQUwsS0FBSyxDQUFpQjtvQkFBVSxPQUFFLEdBQUYsRUFBRSxDQUFjO29CQUpqRixXQUFNLEdBQVEsSUFBSSxDQUFDO29CQUNuQixxQkFBZ0IsR0FBRyxFQUFFLENBQUM7b0JBSTVCLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDN0ksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBWTt3QkFDcEMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzt3QkFDbkMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQzt3QkFDckMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDcEMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFFTSx5QkFBSSxHQUFYO29CQUFBLGlCQVdDO29CQVZDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLG9DQUFvQyxDQUFDO29CQUUxRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBUTs0QkFDL0MsS0FBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDOzRCQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQzt3QkFDbEIsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDeEIsQ0FBQztnQkFDSCxDQUFDO2dCQUVNLG1DQUFjLEdBQXJCLFVBQXNCLEtBQWE7b0JBQ2pDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2IsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNsQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQ3BDLENBQUM7b0JBQ0gsQ0FBQztvQkFDRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDMUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLE1BQU0sQ0FBQyxVQUFVLENBQUM7b0JBQ3BCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzlCLENBQUM7Z0JBQ0gsQ0FBQztnQkFFTyw2QkFBUSxHQUFoQixVQUFpQixHQUFXO29CQUMxQixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFTLEdBQVc7d0JBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ25FLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0gsaUJBQUM7WUFBRCxDQW5EQSxBQW1EQyxJQUFBO1lBbkRZLG9CQUFVLGFBbUR0QixDQUFBO1FBQ0gsQ0FBQyxFQXZEZSxTQUFTLEdBQVQsZUFBUyxLQUFULGVBQVMsUUF1RHhCO0lBQUQsQ0FBQyxFQXZEUyxLQUFLLEdBQUwsUUFBSyxLQUFMLFFBQUssUUF1RGQ7QUFBRCxDQUFDLEVBdkRNLEVBQUUsS0FBRixFQUFFLFFBdURSOztBQ3ZERCxzQ0FBc0M7QUFDdEMsSUFBTyxFQUFFLENBU1I7QUFURCxXQUFPLEVBQUU7SUFBQyxJQUFBLEtBQUssQ0FTZDtJQVRTLFdBQUEsS0FBSztRQUFDLElBQUEsU0FBUyxDQVN4QjtRQVRlLFdBQUEsU0FBUyxFQUFDLENBQUM7WUFDekIsWUFBWSxDQUFDO1lBSWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUM7aUJBRXJDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsVUFBQyxNQUFXLEVBQUUsS0FBc0IsRUFBRSxFQUFnQixJQUFLLE9BQUEsSUFBSSxvQkFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQWpDLENBQWlDLENBQUM7aUJBQ25ILFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxFQVRlLFNBQVMsR0FBVCxlQUFTLEtBQVQsZUFBUyxRQVN4QjtJQUFELENBQUMsRUFUUyxLQUFLLEdBQUwsUUFBSyxLQUFMLFFBQUssUUFTZDtBQUFELENBQUMsRUFUTSxFQUFFLEtBQUYsRUFBRSxRQVNSOztBQ1ZELGlDQUFpQztBQUNqQyxJQUFPLEVBQUUsQ0FNUjtBQU5ELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQU1kO0lBTlMsV0FBQSxLQUFLO1FBQUMsSUFBQSxJQUFJLENBTW5CO1FBTmUsV0FBQSxJQUFJLEVBQUMsQ0FBQztZQUNwQixZQUFZLENBQUM7WUFFYixPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUM7aUJBRWhDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUUsS0FBSyxJQUFLLE9BQUEsVUFBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQztRQUMzRSxDQUFDLEVBTmUsSUFBSSxHQUFKLFVBQUksS0FBSixVQUFJLFFBTW5CO0lBQUQsQ0FBQyxFQU5TLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQU1kO0FBQUQsQ0FBQyxFQU5NLEVBQUUsS0FBRixFQUFFLFFBTVIiLCJmaWxlIjoidnMudG9vbGtpdC5taW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgdnMudG9vbHMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcbiAgICAvKiogQG5nSW5qZWN0ICovXHJcbiAgICBjb25zdHJ1Y3RvcigkbG9nUHJvdmlkZXI6IG5nLklMb2dQcm92aWRlcikge1xyXG4gICAgICAvLyBlbmFibGUgbG9nXHJcbiAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQodHJ1ZSk7XHJcbiAgICAgIC8vIHNldCBvcHRpb25zIHRoaXJkLXBhcnR5IGxpYlxyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuIiwibW9kdWxlIHZzLnRvb2xzIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBSdW5CbG9jayB7XHJcbiAgICAvKiogQG5nSW5qZWN0ICovXHJcbiAgICBjb25zdHJ1Y3RvcigkbG9nOiBuZy5JTG9nU2VydmljZSkge1xyXG4gICAgICAkbG9nLmRlYnVnKCdydW5CbG9jayBlbmQnKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LmNvbmZpZy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5ydW4udHNcIiAvPlxyXG5cclxubW9kdWxlIHZzLnRvb2xzIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzJywgW10pXHJcbiAgICAuY29uZmlnKENvbmZpZylcclxuICAgIC5ydW4oUnVuQmxvY2spXHJcbiAgICAuY29uc3RhbnQoJ2NvbmZpZycsIGNvbmZpZyk7XHJcbn1cclxuIiwibW9kdWxlIHZzLnRvb2xzLmNhdGFsb2cge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmNhdGFsb2cnLCBbXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuY2F0YWxvZycpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG5cdGZhY3RvcnkoJ2NhdGFsb2dSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55LCAkcTogYW55KSB7XHJcblxyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHZhciB1cmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9pbmRleC9jb25maWcvZmVkZXJhdGlvbi5qc29uJztcclxuXHRcdHZhciBsb2NhdGlvbnMgPSAnYXBpL3Jlc3QvaTE4bi9maWVsZC9sb2NhdGlvbi5qc29uJztcclxuXHJcblx0XHRmdW5jdGlvbiBfZmV0Y2goKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQodXJpKS50aGVuKGZ1bmN0aW9uIChyZXM6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiByZXMuZGF0YS5zZXJ2ZXJzO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2xvYWRSZW1vdGVMb2NhdGlvbnMocGFyYW1zOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuIF9mZXRjaCgpLnRoZW4oKGNhdGFsb2dzOiBhbnkpID0+IHtcclxuXHRcdFx0XHR2YXIgcHJvbWlzZXMgPSBbXTtcclxuXHRcdFx0XHRjYXRhbG9ncy5mb3JFYWNoKGNhdGFsb2cgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGNhdGFsb2cudXJsKSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgdXJsID0gY2F0YWxvZy51cmwgKyBsb2NhdGlvbnM7XHJcblx0XHRcdFx0XHRcdHZhciBjYXRhbG9nUHJvbWlzZSA9ICRodHRwLmdldCh1cmwsIHt3aXRoQ3JlZGVudGlhbHM6IGZhbHNlfSkudGhlbigocmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdHByb21pc2VzLnB1c2goY2F0YWxvZ1Byb21pc2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZXJyb3I7IC8vIGZhaWx1cmUgbWVhbnMgdGhlIHJlbW90ZSBjYXRhbG9ncyBhcmUgb2ZmbGluZSwgYWxsb3cgdG8gY29udGludWUsIHRoZSBzZWFyY2ggc2hvdWxkIHNob3cgYW4gZXJyb3JcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZmV0Y2g6IF9mZXRjaCxcclxuXHRcdFx0bG9hZFJlbW90ZUxvY2F0aW9uczogX2xvYWRSZW1vdGVMb2NhdGlvbnNcclxuXHRcdH07XHJcblx0fSk7XHJcbiIsIm1vZHVsZSB2cy50b29scy5kaXNwbGF5Q29uZmlnIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5kaXNwbGF5Q29uZmlnJywgW10pO1xyXG59XHJcbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cclxuZGVjbGFyZSB2YXIgY29uZmlnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnKS5cclxuXHQvKiBAbmdJbmplY3QgKi9cclxuXHRmYWN0b3J5KCdkaXNwbGF5Q29uZmlnUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSkge1xyXG5cclxuXHRcdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0XHR2YXIgY29uZmlnVXJpID0gY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9jb25maWcvJztcclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkge1xyXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyAnbGlzdCc7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRDb25maWdRdWVyeVN0cmluZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArIGlkO1xyXG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldExpc3RRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0RGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2RlbGV0ZURpc3BsYXlDb25maWcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZTogYW55KSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KGNvbmZpZ1VyaSwgdGVtcGxhdGUpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdldERpc3BsYXlDb25maWdzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWdMaXN0KCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldERpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZWxldGVEaXNwbGF5Q29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9kZWxldGVEaXNwbGF5Q29uZmlnKGlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2F2ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKHRlbXBsYXRlOiBhbnkpe1xyXG5cdFx0XHRcdHJldHVybiBfc2F2ZURpc3BsYXlDb25maWcodGVtcGxhdGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pO1xyXG4iLCJtb2R1bGUgdnMudG9vbHMudXRpbCB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHRleHBvcnQgY2xhc3MgU3VnYXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSkge31cclxuXHJcblx0XHRwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHZhbDogYW55KSB7XHJcblx0XHRcdHJldHVybiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKTtcclxuXHRcdH1cclxuXHJcblx0XHRzdGF0aWMgZ2V0SW5zdGFuY2UoY29uZmlnOiBhbnksICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIDogU3VnYXIge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFN1Z2FyKGNvbmZpZywgJGh0dHApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRvTWFwKGtleTogYW55LCBhcnJheTogYW55KSB7XHJcblx0XHRcdHZhciBtYXAgPSB7fTtcclxuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xyXG5cdFx0XHRcdG1hcFt2YWx1ZVtrZXldXSA9IHZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG1hcDtcclxuXHRcdH1cclxuXHJcblx0XHR0b1N0cmluZ01hcChhcnJheTogYW55KSB7XHJcblx0XHRcdHZhciBtYXAgPSB7fTtcclxuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xyXG5cdFx0XHRcdG1hcFt2YWx1ZV0gPSB2YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBtYXA7XHJcblx0XHR9XHJcblxyXG4gICAgcGx1Y2soYXJyYXk6IGFueSwgbmFtZTogc3RyaW5nLCBmbj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgIHZhciBmbCA9IFtdO1xyXG4gICAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlOiBhbnkpe1xyXG4gICAgICAgIGlmIChmbiAmJiBmbih2YWx1ZSkpIHtcclxuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChmbikpIHtcclxuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBmbDtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0Rm9ybSh1cmw6IHN0cmluZywgZGF0YTogYW55KSB7XHJcbiAgICAgIHZhciBzZXJ2aWNlID0gdGhpcy5jb25maWcucm9vdCArIHVybDtcclxuICAgICAgcmV0dXJuIHRoaXMuJGh0dHAoe1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIHVybDogc2VydmljZSxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ31cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VRdWVyeVN0cmluZyhxdWVyeVN0cmluZzogc3RyaW5nKSB7XHJcbiAgICAgIHZhciBwYWlycyA9IHF1ZXJ5U3RyaW5nLnNsaWNlKDEpLnNwbGl0KCcmJyk7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7fSwgcztcclxuICAgICAgcGFpcnMuZm9yRWFjaChmdW5jdGlvbihwYWlyKSB7XHJcbiAgICAgICAgcyA9IHBhaXIuc3BsaXQoJz0nKTtcclxuICAgICAgICByZXN1bHRbc1swXV0gPSBkZWNvZGVVUklDb21wb25lbnQoc1sxXSB8fCAnJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0SnNvbihyZXF1ZXN0LCBhcGksIGFjdGlvbikge1xyXG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgdXJsOiBjb25maWcucm9vdCArICdhcGkvcmVzdC8nICsgYXBpICArICcvJyArIGFjdGlvbiArICcuanNvbicsXHJcbiAgICAgICAgZGF0YTogcmVxdWVzdCxcclxuICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblx0fVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3V0aWwvc3VnYXIudHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcbid1c2Ugc3RyaWN0JztcblxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0ZmV0Y2goZmllbGRzPzogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzKHF1ZXJ5OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEZpZWxkc1Jlc291cmNlIGltcGxlbWVudHMgSUZpZWxkc1Jlc291cmNlIHtcblx0XHRzdGF0aWMgcmVmTmFtZSA9ICdmaWVsZHNSZXNvdXJjZSc7XG5cblx0XHRmZXRjaDogKHByb3BlcnRpZXM/OiBzdHJpbmcpID0+IGFueTtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzOiAocXVlcnk6IHN0cmluZykgPT4gYW55O1xuXHRcdGVuc3VyZVRhZ3NGaWVsZEV4aXN0OiAoZmllbGRzOiBBcnJheTxhbnk+KSA9PiBhbnk7XG5cblx0XHQvKiBAbmdJbmplY3QgKi9cblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHN1Z2FyOiBhbnkpIHtcblxuICAgICAgdGhpcy5mZXRjaCA9IChmaWVsZHM/OiBhbnkpID0+IHtcbiAgICAgICAgdmFyIGZsID0gKGZpZWxkcyB8fCAnbmFtZSxzdHlwZSxjYXRlZ29yeSxkb2NzLGRpc3BfZW4sc29ydGFibGUsZmlsdGVyYWJsZSx0YWJsZWFibGUsZGlzcGxheWFibGUsZWRpdGFibGUnKTtcbiAgICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdzb2xyL2ZpZWxkcy9zZWxlY3Q/cmFuZD0nICsgTWF0aC5yYW5kb20oKSwgdGhpcy5nZXRGaWVsZHNQYXJhbXMoZmwpKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMuZW5zdXJlVGFnc0ZpZWxkRXhpc3QocmVzLmRhdGEucmVzcG9uc2UuZG9jcyk7XG4gICAgICAgICAgcmV0dXJuIHJlcy5kYXRhLnJlc3BvbnNlLmRvY3M7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5lbnN1cmVUYWdzRmllbGRFeGlzdCA9IChmaWVsZHM6IEFycmF5PGFueT4pID0+IHtcbiAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSBmaWVsZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAoZmllbGRzW2ldLm5hbWUgPT09ICd0YWdfdGFncycpIHtcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICBmaWVsZHMucHVzaCh7XG4gICAgICAgICAgICBjYXRlZ29yeTogJ1RFWFQnLFxuICAgICAgICAgICAgZGlzcF9lbjogJ1RhZ3MnLFxuICAgICAgICAgICAgZGlzcGxheWFibGU6IHRydWUsXG4gICAgICAgICAgICBkb2NzOiAwLFxuICAgICAgICAgICAgZmlsdGVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIG5hbWU6ICd0YWdfdGFncycsXG4gICAgICAgICAgICBzb3J0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBzdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICB0YWJsZWFibGU6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cblx0XHRcdHRoaXMuZmV0Y2hIeWRyYXRpb25TdGF0cyA9IChxdWVyeTogc3RyaW5nKSA9PiB7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2goKS50aGVuKChmaWVsZHM6IEFycmF5PGFueT4pID0+IHtcbiAgICAgICAgICB2YXIgZmwgPSBzdWdhci5wbHVjayhmaWVsZHMsICduYW1lJywgZnVuY3Rpb24oZmllbGQpIHsgcmV0dXJuIGZpZWxkLm5hbWUuaW5kZXhPZignXycpICE9PSAwICYmIGZpZWxkLmRvY3MgPiAwOyB9KTtcblxuICAgICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci92MC9zZWxlY3Q/JyArIHF1ZXJ5LCB0aGlzLmdldFN0YXRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHZhciBzdGF0c0ZpZWxkcyA9IHJlcy5kYXRhLmZhY2V0X2NvdW50cy5mYWNldF9maWVsZHM7XG4gICAgICAgICAgICB2YXIgdG90YWwgPSByZXMuZGF0YS5yZXNwb25zZS5udW1Gb3VuZDtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblx0XHRcdH07XG5cblx0XHR9XG5cbiAgICBwcml2YXRlIGdldEZpZWxkc1BhcmFtcyhmbCkge1xuICAgICAgcmV0dXJuICdxPSo6KiZmbD0nICsgZmwgKyAnJnJvd3M9MTAwMDAwJnNvcnQ9bmFtZSUyMGFzYyZ3dD1qc29uJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGdldFN0YXRzUGFyYW1zKGZsKSB7XG4gICAgICByZXR1cm4gJ2ZhY2V0PXRydWUmZmFjZXQubGltaXQ9MTAwMDAwJmZhY2V0Lm1pbmNvdW50PTEwMCZyb3dzPTAmd3Q9anNvbiZmYWNldC5maWVsZD0nICsgZmwuam9pbignJmZhY2V0LmZpZWxkPScpICsgJyZyYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpIHtcbiAgICAgIHZhciBzdGF0c0ZpZWxkLCBjb3VudDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0YXRzRmllbGQgPSBzdGF0c0ZpZWxkc1tmaWVsZHNbaV0ubmFtZV07XG4gICAgICAgIGlmIChzdGF0c0ZpZWxkICYmIHN0YXRzRmllbGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkc1tpXS5pZCA9IGZpZWxkc1tpXS5uYW1lO1xuICAgICAgICAgIGNvdW50ID0gdGhpcy5nZXRDb3VudChzdGF0c0ZpZWxkKTtcbiAgICAgICAgICBmaWVsZHNbaV0uaHlkcmF0aW9uID0gY291bnQgLyB0b3RhbCAqIDEwMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb3VudChmaWVsZCkge1xuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZmllbGQubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgY291bnQgKz0gZmllbGRbaV07XG4gICAgICB9XG4gICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuXG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9maWVsZHMucmVzb3VyY2UudHNcIiAvPlxyXG5cclxubW9kdWxlIHZzLnRvb2xzLmZpZWxkcyB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmZpZWxkcycsIFsndnMudG9vbHMudXRpbCddKVxyXG5cdFx0LnNlcnZpY2UoRmllbGRzUmVzb3VyY2UucmVmTmFtZSwgRmllbGRzUmVzb3VyY2UpO1xyXG5cclxufVxyXG4iLCJtb2R1bGUgdnMudG9vbHMuZmlsdGVycyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmlsdGVycycsIFtdKVxuICAgIC5maWx0ZXIoJ3JlcGxhY2VTdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihoYXlTdGFjazogc3RyaW5nLCBvbGROZWVkbGU6IHN0cmluZywgbmV3TmVlZGxlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGhheVN0YWNrLnJlcGxhY2UobmV3IFJlZ0V4cChvbGROZWVkbGUsICdnJyksIG5ld05lZWRsZSk7XG4gICAgICB9O1xuICAgIH0pO1xuIH1cbiIsIm1vZHVsZSB2cy50b29scy5zYXZlZFNlYXJjaCB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnLCBbJ3ZzLnRvb2xzLnV0aWwnXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnKS5cblx0LyogQG5nSW5qZWN0ICovXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSwgc3VnYXIpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgICBmdW5jdGlvbiBfZG9TYXZlKHNhdmVkU2VhcmNoOiBhbnkpIHtcbiAgICAgICByZXR1cm4gc3VnYXIucG9zdEpzb24oc2F2ZWRTZWFyY2gsICdkaXNwbGF5JywgJ3NzZWFyY2gnKTtcbiAgICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5U3RyaW5nKGlkPzogc3RyaW5nKSB7XG4gICAgICB2YXIgcm93cyA9IDE1MDsgIC8vIEBUT0RPIHNldCB0byB3aGF0IHdlIHJlYWxseSB3YW50XG4gICAgICB2YXIgcXVlcnlTdHJpbmcgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0Pyc7XG4gICAgICBxdWVyeVN0cmluZyArPSAncm93cz0nICsgcm93cyArICcmcmFuZD0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZmw9aWQsdGl0bGUsZGVzY3JpcHRpb24sb3duZXIscGF0aCxzaGFyZSxxdWVyeSxjb25maWcsb3JkZXIsc2F2ZWQscHJpdmF0ZSx2aWV3LF92ZXJzaW9uXyxjb25maWdfdGl0bGU6W2NvbmZpZ1RpdGxlXSxwYXJhbSosbGFiZWxzLGRpc3BsYXlfb3ZlcnJpZGUnO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGlkKSkge1xuICAgICAgICBxdWVyeVN0cmluZyArPSAnJmZxPWlkOicgKyBpZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxdWVyeVN0cmluZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZXhlY3V0ZShpZD86IHN0cmluZykge1xuICAgICAgcmV0dXJuICRodHRwLmpzb25wKF9nZXRRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuICAgICAgICByZXR1cm4gZGF0YS5kYXRhLnJlc3BvbnNlLmRvY3M7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG4gICAgICAgIC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2F2ZWRTZWFyY2hlczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfZXhlY3V0ZSgpO1xuICAgICAgfSxcblxuICAgICAgZmV0Y2g6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiBfZXhlY3V0ZShpZCkudGhlbihmdW5jdGlvbihkb2NzKSB7XG4gICAgICAgICAgcmV0dXJuIGRvY3NbMF07XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgc2F2ZVNlYXJjaDogZnVuY3Rpb24oc2F2ZWRTZWFyY2gsIHBhcmFtcykge1xuICAgICAgIC8vICBzYXZlZFNlYXJjaC5jb25maWcgPSBjb25maWdTZXJ2aWNlLmdldENvbmZpZ0lkKCk7XG4gICAgICAgLy8gIHNhdmVkU2VhcmNoLnF1ZXJ5ID0gY29udmVydGVyLnRvQ2xhc3NpY1BhcmFtcyhwYXJhbXMpO1xuICAgICAgIHJldHVybiBfZG9TYXZlKHNhdmVkU2VhcmNoKTtcbiAgICAgIH0sXG5cbiAgICAgIGRlbGV0ZVNlYXJjaDogZnVuY3Rpb24oaWQ6IHN0cmluZyl7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9zc2VhcmNoLycgKyBpZCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAvLyBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgLy8gICBlbnRyeShpZCk7XG4gICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICB3aXBlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvd2lwZScpO1xuICAgICAgfSxcblxuICAgICAgcmVzdG9yZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnYXBpL3Jlc3QvZGlzcGxheS9yZXN0b3JlJywgJycpO1xuICAgICAgfSxcblxuICAgICAgb3JkZXI6IGZ1bmN0aW9uKGlkOiBhbnksIGJlZm9yZUlkOiBhbnksIGFmdGVySWQ6IGFueSkge1xuICAgICAgICB2YXIgZGF0YSA9ICcnO1xuICAgICAgICBpZiAoYmVmb3JlSWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdiZWZvcmU9JyArIGJlZm9yZUlkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhICE9PSAnJykge1xuICAgICAgICAgIGRhdGEgKz0gJyYnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFmdGVySWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdhZnRlcj0nICsgYWZ0ZXJJZDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQgKyAnL29yZGVyJywgZGF0YSk7XG4gICAgICB9LFxuXG4gICAgICBmZXRjaExhYmVsczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB1cmwgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0P3Jvd3M9MCZmYWNldD10cnVlJmZhY2V0LmZpZWxkPWxhYmVscyZ3dD1qc29uJnI9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCkudGhlbihmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3AuZGF0YS5mYWNldF9jb3VudHMuZmFjZXRfZmllbGRzLmxhYmVscztcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAvLyBlcnJvciBpZiBsYWJlbHMgZmllbGQgZG9lc24ndCBleGlzdFxuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJtb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBUcmFuc2xhdG9yIHtcblxuICAgIHByaXZhdGUgZmllbGRzOiBhbnkgPSBudWxsO1xuICAgIHByaXZhdGUgcmVtb3ZlUHJlZml4SGFzaCA9IHt9O1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IGFueSwgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCBwcml2YXRlICRxOiBuZy5JUVNlcnZpY2UpIHtcbiAgICAgIHZhciByZW1vdmVQcmVmaXhMaXN0ID0gWydmc18nLCAnZnRfJywgJ2ZoXycsICdmaV8nLCAnZmxfJywgJ2ZkXycsICdmZl8nLCAnZnVfJywgJ2ZwXycsICdmeV8nLCAnZm1fJywgJ2ZiXycsICd0YWdfJywgJ21ldGFfJywgJ2Zzc18nLCAnZ3JwXyddO1xuICAgICAgcmVtb3ZlUHJlZml4TGlzdC5mb3JFYWNoKChpdGVtOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5yZW1vdmVQcmVmaXhIYXNoW2l0ZW1dID0gdHJ1ZTtcbiAgICAgICAgdmFyIGMgPSBpdGVtLnN1YnN0cmluZygxLCAyKTtcbiAgICAgICAgdmFyIGtleSA9IGl0ZW0ucmVwbGFjZSgnXycsIGMgKyAnXycpO1xuICAgICAgICB0aGlzLnJlbW92ZVByZWZpeEhhc2hba2V5XSA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZCgpIHtcbiAgICAgIHZhciByZXNvdXJjZVVybCA9IHRoaXMuY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvaTE4bi9maWVsZHMvc3RhbmRhcmQuanNvbic7XG5cbiAgICAgIGlmICghdGhpcy5maWVsZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAuZ2V0KHJlc291cmNlVXJsKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMuZmllbGRzID0gcmVzLmRhdGE7XG4gICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRxLndoZW4oKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdHJhbnNsYXRlRmllbGQoZmllbGQ6IHN0cmluZykge1xuICAgICAgdmFyIGlkeCA9IGZpZWxkLmluZGV4T2YoJ18nKTtcbiAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICB2YXIgcHJlZml4ID0gZmllbGQuc3Vic3RyaW5nKDAsIGlkeCArIDEpO1xuICAgICAgICBpZiAodGhpcy5yZW1vdmVQcmVmaXhIYXNoW3ByZWZpeF0pIHtcbiAgICAgICAgICBmaWVsZCA9IGZpZWxkLnJlcGxhY2UocHJlZml4LCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciB0cmFuc2xhdGVkID0gdGhpcy5maWVsZHMuRklFTERbZmllbGRdO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRyYW5zbGF0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkoZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xhc3NpZnkoc3RyOiBzdHJpbmcpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyYW5zbGF0b3IudHNcIiAvPlxyXG5tb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnRyYW5zbGF0ZScsIFtdKVxyXG4gICAgLyogQG5nSW5qZWN0ICovXHJcbiAgICAuZmFjdG9yeSgndHJhbnNsYXRvcicsIChjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgJHE6IG5nLklRU2VydmljZSkgPT4gbmV3IFRyYW5zbGF0b3IoY29uZmlnLCAkaHR0cCwgJHEpKVxyXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdWdhci50c1wiIC8+XHJcbm1vZHVsZSB2cy50b29scy51dGlsIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy51dGlsJywgW10pXHJcbiAgICAvKiBAbmdJbmplY3QgKi9cclxuICAgIC5mYWN0b3J5KCdzdWdhcicsIChjb25maWcsICRodHRwKSA9PiBTdWdhci5nZXRJbnN0YW5jZShjb25maWcsICRodHRwKSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
//# sourceMappingURL=maps/vs.toolkit.src.js.map