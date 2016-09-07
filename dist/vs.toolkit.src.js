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
                    var _this = this;
                    this.config = config;
                    this.$http = $http;
                    this.$q = $q;
                    this.fields = null;
                    this.removePrefixHash = {};
                    var removePrefixList = ['fs_', 'ft_', 'fh_', 'fi_', 'fl_', 'fd_', 'ff_', 'fu_', 'fp_', 'fy_', 'fm_', 'fb_', 'tag_', 'meta_', 'fss_'];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ01vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ1Jlc291cmNlLnRzIiwiZGlzcGxheS1jb25maWcvRGlzcGxheUNvbmZpZ01vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdSZXNvdXJjZS50cyIsInV0aWwvc3VnYXIudHMiLCJmaWVsZHMvZmllbGRzLnJlc291cmNlLnRzIiwiZmllbGRzL2ZpZWxkcy5tb2R1bGUudHMiLCJmaWx0ZXJzL2ZpbHRlcnMudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInRyYW5zbGF0ZS90cmFuc2xhdG9yLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5tb2R1bGUudHMiLCJ1dGlsL3V0aWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sRUFBRSxDQVlSO0FBWkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBWWQ7SUFaUyxXQUFBLEtBQUssRUFBQyxDQUFDO1FBQ2YsWUFBWSxDQUFDO1FBRWI7WUFDRSxnQkFBZ0I7WUFDaEIsZ0JBQVksWUFBNkI7Z0JBQ3ZDLGFBQWE7Z0JBQ2IsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsOEJBQThCO1lBQ2hDLENBQUM7WUFFSCxhQUFDO1FBQUQsQ0FSQSxBQVFDLElBQUE7UUFSWSxZQUFNLFNBUWxCLENBQUE7SUFDSCxDQUFDLEVBWlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBWWQ7QUFBRCxDQUFDLEVBWk0sRUFBRSxLQUFGLEVBQUUsUUFZUjs7QUNaRCxJQUFPLEVBQUUsQ0FVUjtBQVZELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVVkO0lBVlMsV0FBQSxLQUFLLEVBQUMs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QUFTLEVBQUMsQ0FBQztZQUN6QixZQUFZLENBQUM7WUFJYixPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQztpQkFFckMsT0FBTyxDQUFDLFlBQVksRUFBRSxVQUFDLE1BQVcsRUFBRSxLQUFzQixFQUFFLEVBQWdCLElBQUssT0FBQSxJQUFJLG9CQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBakMsQ0FBaUMsQ0FBQztpQkFDbkgsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDLEVBVGUsU0FBUyxHQUFULGVBQVMsS0FBVCxlQUFTLFFBU3hCO0lBQUQsQ0FBQyxFQVRTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQVNkO0FBQUQsQ0FBQyxFQVRNLEVBQUUsS0FBRixFQUFFLFFBU1I7O0FDVkQsaUNBQWlDO0FBQ2pDLElBQU8sRUFBRSxDQU1SO0FBTkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBTWQ7SUFOUyxXQUFBLEtBQUs7UUFBQyxJQUFBLElBQUksQ0FNbkI7UUFOZSxXQUFBLElBQUksRUFBQyxDQUFDO1lBQ3BCLFlBQVksQ0FBQztZQUViLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztpQkFFaEMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQU0sRUFBRSxLQUFLLElBQUssT0FBQSxVQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQyxDQUFDO1FBQzNFLENBQUMsRUFOZSxJQUFJLEdBQUosVUFBSSxLQUFKLFVBQUksUUFNbkI7SUFBRCxDQUFDLEVBTlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBTWQ7QUFBRCxDQUFDLEVBTk0sRUFBRSxLQUFGLEVBQUUsUUFNUiIsImZpbGUiOiJ2cy50b29sa2l0Lm1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB2cy50b29scyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuICAgIC8qKiBAbmdJbmplY3QgKi9cclxuICAgIGNvbnN0cnVjdG9yKCRsb2dQcm92aWRlcjogbmcuSUxvZ1Byb3ZpZGVyKSB7XHJcbiAgICAgIC8vIGVuYWJsZSBsb2dcclxuICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCh0cnVlKTtcclxuICAgICAgLy8gc2V0IG9wdGlvbnMgdGhpcmQtcGFydHkgbGliXHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUgdnMudG9vbHMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFJ1bkJsb2NrIHtcclxuICAgIC8qKiBAbmdJbmplY3QgKi9cclxuICAgIGNvbnN0cnVjdG9yKCRsb2c6IG5nLklMb2dTZXJ2aWNlKSB7XHJcbiAgICAgICRsb2cuZGVidWcoJ3J1bkJsb2NrIGVuZCcpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXguY29uZmlnLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LnJ1bi50c1wiIC8+XHJcblxyXG5tb2R1bGUgdnMudG9vbHMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMnLCBbXSlcclxuICAgIC5jb25maWcoQ29uZmlnKVxyXG4gICAgLnJ1bihSdW5CbG9jaylcclxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcclxufVxyXG4iLCJtb2R1bGUgdnMudG9vbHMuY2F0YWxvZyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuY2F0YWxvZycsIFtdKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5jYXRhbG9nJykuXHJcblx0LyogQG5nSW5qZWN0ICovXHJcblx0ZmFjdG9yeSgnY2F0YWxvZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnksICRxOiBhbnkpIHtcclxuXHJcblx0XHQndXNlIHN0cmljdCc7XHJcblxyXG5cdFx0dmFyIHVyaSA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2luZGV4L2NvbmZpZy9mZWRlcmF0aW9uLmpzb24nO1xyXG5cdFx0dmFyIGxvY2F0aW9ucyA9ICdhcGkvcmVzdC9pMThuL2ZpZWxkL2xvY2F0aW9uLmpzb24nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9mZXRjaCgpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldCh1cmkpLnRoZW4oZnVuY3Rpb24gKHJlczogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlcy5kYXRhLnNlcnZlcnM7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfbG9hZFJlbW90ZUxvY2F0aW9ucyhwYXJhbXM6IGFueSkge1xyXG5cdFx0XHRyZXR1cm4gX2ZldGNoKCkudGhlbigoY2F0YWxvZ3M6IGFueSkgPT4ge1xyXG5cdFx0XHRcdHZhciBwcm9taXNlcyA9IFtdO1xyXG5cdFx0XHRcdGNhdGFsb2dzLmZvckVhY2goY2F0YWxvZyA9PiB7XHJcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQoY2F0YWxvZy51cmwpKSB7XHJcblx0XHRcdFx0XHRcdHZhciB1cmwgPSBjYXRhbG9nLnVybCArIGxvY2F0aW9ucztcclxuXHRcdFx0XHRcdFx0dmFyIGNhdGFsb2dQcm9taXNlID0gJGh0dHAuZ2V0KHVybCwge3dpdGhDcmVkZW50aWFsczogZmFsc2V9KS50aGVuKChyZXNwb25zZTogYW55KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZXMucHVzaChjYXRhbG9nUHJvbWlzZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdFx0XHRcdHJldHVybiBlcnJvcjsgLy8gZmFpbHVyZSBtZWFucyB0aGUgcmVtb3RlIGNhdGFsb2dzIGFyZSBvZmZsaW5lLCBhbGxvdyB0byBjb250aW51ZSwgdGhlIHNlYXJjaCBzaG91bGQgc2hvdyBhbiBlcnJvclxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRmZXRjaDogX2ZldGNoLFxyXG5cdFx0XHRsb2FkUmVtb3RlTG9jYXRpb25zOiBfbG9hZFJlbW90ZUxvY2F0aW9uc1xyXG5cdFx0fTtcclxuXHR9KTtcclxuIiwibW9kdWxlIHZzLnRvb2xzLmRpc3BsYXlDb25maWcge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnLCBbXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZGlzcGxheUNvbmZpZycpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG5cdGZhY3RvcnkoJ2Rpc3BsYXlDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XHJcblxyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2NvbmZpZy8nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRMaXN0UXVlcnlTdHJpbmcoKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArICdsaXN0JztcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgaWQ7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnTGlzdCgpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX3NhdmVEaXNwbGF5Q29uZmlnKHRlbXBsYXRlOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoY29uZmlnVXJpLCB0ZW1wbGF0ZSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2RlbGV0ZURpc3BsYXlDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24odGVtcGxhdGU6IGFueSl7XHJcblx0XHRcdFx0cmV0dXJuIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7XHJcbiIsIm1vZHVsZSB2cy50b29scy51dGlsIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBTdWdhciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IGFueSwgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlKSB7fVxyXG5cclxuXHRcdHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcodmFsOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCB2YWwgaW5zdGFuY2VvZiBTdHJpbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBnZXRJbnN0YW5jZShjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSkgOiBTdWdhciB7XHJcblx0XHRcdHJldHVybiBuZXcgU3VnYXIoY29uZmlnLCAkaHR0cCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dG9NYXAoa2V5OiBhbnksIGFycmF5OiBhbnkpIHtcclxuXHRcdFx0dmFyIG1hcCA9IHt9O1xyXG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XHJcblx0XHRcdFx0bWFwW3ZhbHVlW2tleV1dID0gdmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbWFwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRvU3RyaW5nTWFwKGFycmF5OiBhbnkpIHtcclxuXHRcdFx0dmFyIG1hcCA9IHt9O1xyXG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XHJcblx0XHRcdFx0bWFwW3ZhbHVlXSA9IHZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG1hcDtcclxuXHRcdH1cclxuXHJcbiAgICBwbHVjayhhcnJheTogYW55LCBuYW1lOiBzdHJpbmcsIGZuPzogRnVuY3Rpb24pIHtcclxuICAgICAgdmFyIGZsID0gW107XHJcbiAgICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsdWU6IGFueSl7XHJcbiAgICAgICAgaWYgKGZuICYmIGZuKHZhbHVlKSkge1xyXG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGZuKSkge1xyXG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGZsO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RGb3JtKHVybDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgICAgdmFyIHNlcnZpY2UgPSB0aGlzLmNvbmZpZy5yb290ICsgdXJsO1xyXG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgdXJsOiBzZXJ2aWNlLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxyXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZVF1ZXJ5U3RyaW5nKHF1ZXJ5U3RyaW5nOiBzdHJpbmcpIHtcclxuICAgICAgdmFyIHBhaXJzID0gcXVlcnlTdHJpbmcuc2xpY2UoMSkuc3BsaXQoJyYnKTtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9LCBzO1xyXG4gICAgICBwYWlycy5mb3JFYWNoKGZ1bmN0aW9uKHBhaXIpIHtcclxuICAgICAgICBzID0gcGFpci5zcGxpdCgnPScpO1xyXG4gICAgICAgIHJlc3VsdFtzWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChzWzFdIHx8ICcnKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RKc29uKHJlcXVlc3QsIGFwaSwgYWN0aW9uKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRodHRwKHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICB1cmw6IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0LycgKyBhcGkgICsgJy8nICsgYWN0aW9uICsgJy5qc29uJyxcclxuICAgICAgICBkYXRhOiByZXF1ZXN0LFxyXG4gICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHR9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdXRpbC9zdWdhci50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xuJ3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpZWxkc1Jlc291cmNlIHtcblx0XHRmZXRjaChmaWVsZHM/OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xuXHRcdGZldGNoSHlkcmF0aW9uU3RhdHMocXVlcnk6IHN0cmluZyk6IG5nLklQcm9taXNlPGFueT47XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgRmllbGRzUmVzb3VyY2UgaW1wbGVtZW50cyBJRmllbGRzUmVzb3VyY2Uge1xuXHRcdHN0YXRpYyByZWZOYW1lID0gJ2ZpZWxkc1Jlc291cmNlJztcblxuXHRcdGZldGNoOiAocHJvcGVydGllcz86IHN0cmluZykgPT4gYW55O1xuXHRcdGZldGNoSHlkcmF0aW9uU3RhdHM6IChxdWVyeTogc3RyaW5nKSA9PiBhbnk7XG5cdFx0ZW5zdXJlVGFnc0ZpZWxkRXhpc3Q6IChmaWVsZHM6IEFycmF5PGFueT4pID0+IGFueTtcblxuXHRcdC8qIEBuZ0luamVjdCAqL1xuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc3VnYXI6IGFueSkge1xuXG4gICAgICB0aGlzLmZldGNoID0gKGZpZWxkcz86IGFueSkgPT4ge1xuICAgICAgICB2YXIgZmwgPSAoZmllbGRzIHx8ICduYW1lLHN0eXBlLGNhdGVnb3J5LGRvY3MsZGlzcF9lbixzb3J0YWJsZSxmaWx0ZXJhYmxlLHRhYmxlYWJsZSxkaXNwbGF5YWJsZSxlZGl0YWJsZScpO1xuICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvZmllbGRzL3NlbGVjdD9yYW5kPScgKyBNYXRoLnJhbmRvbSgpLCB0aGlzLmdldEZpZWxkc1BhcmFtcyhmbCkpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbnN1cmVUYWdzRmllbGRFeGlzdChyZXMuZGF0YS5yZXNwb25zZS5kb2NzKTtcbiAgICAgICAgICByZXR1cm4gcmVzLmRhdGEucmVzcG9uc2UuZG9jcztcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmVuc3VyZVRhZ3NGaWVsZEV4aXN0ID0gKGZpZWxkczogQXJyYXk8YW55PikgPT4ge1xuICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IGZpZWxkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChmaWVsZHNbaV0ubmFtZSA9PT0gJ3RhZ190YWdzJykge1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgIGZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgIGNhdGVnb3J5OiAnVEVYVCcsXG4gICAgICAgICAgICBkaXNwX2VuOiAnVGFncycsXG4gICAgICAgICAgICBkaXNwbGF5YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGRvY3M6IDAsXG4gICAgICAgICAgICBmaWx0ZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgbmFtZTogJ3RhZ190YWdzJyxcbiAgICAgICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHN0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIHRhYmxlYWJsZTogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuXHRcdFx0dGhpcy5mZXRjaEh5ZHJhdGlvblN0YXRzID0gKHF1ZXJ5OiBzdHJpbmcpID0+IHtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaCgpLnRoZW4oKGZpZWxkczogQXJyYXk8YW55PikgPT4ge1xuICAgICAgICAgIHZhciBmbCA9IHN1Z2FyLnBsdWNrKGZpZWxkcywgJ25hbWUnLCBmdW5jdGlvbihmaWVsZCkgeyByZXR1cm4gZmllbGQubmFtZS5pbmRleE9mKCdfJykgIT09IDAgJiYgZmllbGQuZG9jcyA+IDA7IH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdzb2xyL3YwL3NlbGVjdD8nICsgcXVlcnksIHRoaXMuZ2V0U3RhdHNQYXJhbXMoZmwpKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdmFyIHN0YXRzRmllbGRzID0gcmVzLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcztcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IHJlcy5kYXRhLnJlc3BvbnNlLm51bUZvdW5kO1xuICAgICAgICAgICAgdGhpcy5hcHBseUh5ZHJhdGlvbihzdGF0c0ZpZWxkcywgZmllbGRzLCB0b3RhbCk7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuXHRcdFx0fTtcblxuXHRcdH1cblxuICAgIHByaXZhdGUgZ2V0RmllbGRzUGFyYW1zKGZsKSB7XG4gICAgICByZXR1cm4gJ3E9KjoqJmZsPScgKyBmbCArICcmcm93cz0xMDAwMDAmc29ydD1uYW1lJTIwYXNjJnd0PWpzb24mcmFuZD0nICsgTWF0aC5yYW5kb20oKTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgZ2V0U3RhdHNQYXJhbXMoZmwpIHtcbiAgICAgIHJldHVybiAnZmFjZXQ9dHJ1ZSZmYWNldC5saW1pdD0xMDAwMDAmZmFjZXQubWluY291bnQ9MTAwJnJvd3M9MCZ3dD1qc29uJmZhY2V0LmZpZWxkPScgKyBmbC5qb2luKCcmZmFjZXQuZmllbGQ9JykgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcHBseUh5ZHJhdGlvbihzdGF0c0ZpZWxkcywgZmllbGRzLCB0b3RhbCkge1xuICAgICAgdmFyIHN0YXRzRmllbGQsIGNvdW50O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RhdHNGaWVsZCA9IHN0YXRzRmllbGRzW2ZpZWxkc1tpXS5uYW1lXTtcbiAgICAgICAgaWYgKHN0YXRzRmllbGQgJiYgc3RhdHNGaWVsZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGRzW2ldLmlkID0gZmllbGRzW2ldLm5hbWU7XG4gICAgICAgICAgY291bnQgPSB0aGlzLmdldENvdW50KHN0YXRzRmllbGQpO1xuICAgICAgICAgIGZpZWxkc1tpXS5oeWRyYXRpb24gPSBjb3VudCAvIHRvdGFsICogMTAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvdW50KGZpZWxkKSB7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBmaWVsZC5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICBjb3VudCArPSBmaWVsZFtpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZpZWxkcy5yZXNvdXJjZS50c1wiIC8+XHJcblxyXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmllbGRzJywgWyd2cy50b29scy51dGlsJ10pXHJcblx0XHQuc2VydmljZShGaWVsZHNSZXNvdXJjZS5yZWZOYW1lLCBGaWVsZHNSZXNvdXJjZSk7XHJcblxyXG59XHJcbiIsIm1vZHVsZSB2cy50b29scy5maWx0ZXJzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWx0ZXJzJywgW10pXG4gICAgLmZpbHRlcigncmVwbGFjZVN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gaGF5U3RhY2sucmVwbGFjZShuZXcgUmVnRXhwKG9sZE5lZWRsZSwgJ2cnKSwgbmV3TmVlZGxlKTtcbiAgICAgIH07XG4gICAgfSk7XG4gfVxuIiwibW9kdWxlIHZzLnRvb2xzLnNhdmVkU2VhcmNoIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcsIFsndnMudG9vbHMudXRpbCddKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSwgc3VnYXIpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgIGZ1bmN0aW9uIF9kb1NhdmUoc2F2ZWRTZWFyY2g6IGFueSkge1xyXG4gICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RKc29uKHNhdmVkU2VhcmNoLCAnZGlzcGxheScsICdzc2VhcmNoJyk7XHJcbiAgICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9nZXRRdWVyeVN0cmluZyhpZD86IHN0cmluZykge1xyXG4gICAgICB2YXIgcm93cyA9IDE1MDsgIC8vIEBUT0RPIHNldCB0byB3aGF0IHdlIHJlYWxseSB3YW50XHJcbiAgICAgIHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZy5yb290ICsgJ3NvbHIvc3NlYXJjaC9zZWxlY3Q/JztcclxuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZmw9aWQsdGl0bGUsZGVzY3JpcHRpb24sb3duZXIscGF0aCxzaGFyZSxxdWVyeSxjb25maWcsb3JkZXIsc2F2ZWQscHJpdmF0ZSx2aWV3LF92ZXJzaW9uXyxjb25maWdfdGl0bGU6W2NvbmZpZ1RpdGxlXSxwYXJhbSosbGFiZWxzJztcclxuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xyXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaWQpKSB7XHJcbiAgICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmcT1pZDonICsgaWQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKGlkPzogc3RyaW5nKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5qc29ucChfZ2V0UXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5kYXRhLnJlc3BvbnNlLmRvY3M7XHJcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZ2V0U2F2ZWRTZWFyY2hlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIF9leGVjdXRlKCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmZXRjaDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoaWQpLnRoZW4oZnVuY3Rpb24oZG9jcykge1xyXG4gICAgICAgICAgcmV0dXJuIGRvY3NbMF07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzYXZlU2VhcmNoOiBmdW5jdGlvbihzYXZlZFNlYXJjaCwgcGFyYW1zKSB7XHJcbiAgICAgICAvLyAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xyXG4gICAgICAgLy8gIHNhdmVkU2VhcmNoLnF1ZXJ5ID0gY29udmVydGVyLnRvQ2xhc3NpY1BhcmFtcyhwYXJhbXMpO1xyXG4gICAgICAgcmV0dXJuIF9kb1NhdmUoc2F2ZWRTZWFyY2gpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZGVsZXRlU2VhcmNoOiBmdW5jdGlvbihpZDogc3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQpLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAvLyBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcclxuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcclxuICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB3aXBlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC93aXBlJyk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZXN0b3JlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvcmVzdG9yZScsICcnKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZDogYW55LCBiZWZvcmVJZDogYW55LCBhZnRlcklkOiBhbnkpIHtcclxuICAgICAgICB2YXIgZGF0YSA9ICcnO1xyXG4gICAgICAgIGlmIChiZWZvcmVJZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgZGF0YSArPSAnYmVmb3JlPScgKyBiZWZvcmVJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGEgIT09ICcnKSB7XHJcbiAgICAgICAgICBkYXRhICs9ICcmJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhZnRlcklkICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBkYXRhICs9ICdhZnRlcj0nICsgYWZ0ZXJJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmV0Y2hMYWJlbHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB1cmwgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0P3Jvd3M9MCZmYWNldD10cnVlJmZhY2V0LmZpZWxkPWxhYmVscyZ3dD1qc29uJnI9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcclxuICAgICAgICAgIHJldHVybiByZXNwLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcy5sYWJlbHM7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAvLyBlcnJvciBpZiBsYWJlbHMgZmllbGQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pO1xyXG4iLCJtb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBUcmFuc2xhdG9yIHtcblxuICAgIHByaXZhdGUgZmllbGRzOiBhbnkgPSBudWxsO1xuICAgIHByaXZhdGUgcmVtb3ZlUHJlZml4SGFzaCA9IHt9O1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IGFueSwgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCBwcml2YXRlICRxOiBuZy5JUVNlcnZpY2UpIHtcbiAgICAgIHZhciByZW1vdmVQcmVmaXhMaXN0ID0gWydmc18nLCAnZnRfJywgJ2ZoXycsICdmaV8nLCAnZmxfJywgJ2ZkXycsICdmZl8nLCAnZnVfJywgJ2ZwXycsICdmeV8nLCAnZm1fJywgJ2ZiXycsICd0YWdfJywgJ21ldGFfJywgJ2Zzc18nXTtcbiAgICAgIHJlbW92ZVByZWZpeExpc3QuZm9yRWFjaCgoaXRlbTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMucmVtb3ZlUHJlZml4SGFzaFtpdGVtXSA9IHRydWU7XG4gICAgICAgIHZhciBjID0gaXRlbS5zdWJzdHJpbmcoMSwgMik7XG4gICAgICAgIHZhciBrZXkgPSBpdGVtLnJlcGxhY2UoJ18nLCBjICsgJ18nKTtcbiAgICAgICAgdGhpcy5yZW1vdmVQcmVmaXhIYXNoW2tleV0gPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWQoKSB7XG4gICAgICB2YXIgcmVzb3VyY2VVcmwgPSB0aGlzLmNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2kxOG4vZmllbGRzL3N0YW5kYXJkLmpzb24nO1xuXG4gICAgICBpZiAoIXRoaXMuZmllbGRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldChyZXNvdXJjZVVybCkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmZpZWxkcyA9IHJlcy5kYXRhO1xuICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4kcS53aGVuKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHRyYW5zbGF0ZUZpZWxkKGZpZWxkOiBzdHJpbmcpIHtcbiAgICAgIHZhciBpZHggPSBmaWVsZC5pbmRleE9mKCdfJyk7XG4gICAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9IGZpZWxkLnN1YnN0cmluZygwLCBpZHggKyAxKTtcbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlUHJlZml4SGFzaFtwcmVmaXhdKSB7XG4gICAgICAgICAgZmllbGQgPSBmaWVsZC5yZXBsYWNlKHByZWZpeCwgJycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgdHJhbnNsYXRlZCA9IHRoaXMuZmllbGRzLkZJRUxEW2ZpZWxkXTtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0cmFuc2xhdGVkKSkge1xuICAgICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsYXNzaWZ5KHN0cjogc3RyaW5nKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uKHR4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0cmFuc2xhdG9yLnRzXCIgLz5cclxubW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBkZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy50cmFuc2xhdGUnLCBbXSlcclxuICAgIC8qIEBuZ0luamVjdCAqL1xyXG4gICAgLmZhY3RvcnkoJ3RyYW5zbGF0b3InLCAoY29uZmlnOiBhbnksICRodHRwOiBuZy5JSHR0cFNlcnZpY2UsICRxOiBuZy5JUVNlcnZpY2UpID0+IG5ldyBUcmFuc2xhdG9yKGNvbmZpZywgJGh0dHAsICRxKSlcclxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VnYXIudHNcIiAvPlxyXG5tb2R1bGUgdnMudG9vbHMudXRpbCB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMudXRpbCcsIFtdKVxyXG4gICAgLyogQG5nSW5qZWN0ICovXHJcbiAgICAuZmFjdG9yeSgnc3VnYXInLCAoY29uZmlnLCAkaHR0cCkgPT4gU3VnYXIuZ2V0SW5zdGFuY2UoY29uZmlnLCAkaHR0cCkpO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
//# sourceMappingURL=maps/vs.toolkit.src.js.map