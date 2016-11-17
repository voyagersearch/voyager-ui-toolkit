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
        var appearance;
        (function (appearance) {
            'use strict';
            angular.module('vs.tools.appearance', []);
        })(appearance = tools.appearance || (tools.appearance = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.appearance').
    /* @ngInject */
    factory('appearanceResource', function ($http, $q) {
    'use strict';
    var uri = config.root + 'api/rest/appearance';
    var actionUri = config.root + 'api/rest/appearance/actions';
    function _fetch() {
        return $http.get(uri).then(function (res) {
            return res.data;
        }, function (error) {
            console.log(error);
            // @TODO: handle error
            return error;
        });
    }
    function _saveActions(actions) {
        return $http.post(actionUri, { docActions: actions }).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        fetch: function () {
            return _fetch();
        },
        saveActions: function (actions) {
            return _saveActions(actions);
        }
    };
});

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImFwcGVhcmFuY2UvQXBwZWFyYW5jZU1vZHVsZS50cyIsImFwcGVhcmFuY2UvQXBwZWFyYW5jZVJlc291cmNlLnRzIiwiY2F0YWxvZy9DYXRhbG9nTW9kdWxlLnRzIiwiY2F0YWxvZy9DYXRhbG9nUmVzb3VyY2UudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnTW9kdWxlLnRzIiwiZGlzcGxheS1jb25maWcvRGlzcGxheUNvbmZpZ1Jlc291cmNlLnRzIiwidXRpbC9zdWdhci50cyIsImZpZWxkcy9maWVsZHMucmVzb3VyY2UudHMiLCJmaWVsZHMvZmllbGRzLm1vZHVsZS50cyIsImZpbHRlcnMvZmlsdGVycy50cyIsInNhdmVkLXNlYXJjaC9zYXZlZC1zZWFyY2gtbW9kdWxlLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkU2VhcmNoLnJlc291cmNlLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0b3IudHMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRlLm1vZHVsZS50cyIsInV0aWwvdXRpbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxFQUFFLENBWVI7QUFaRCxXQUFPLEVBQUU7SUFBQyxJQUFBLEtBQUssQ0FZZDtJQVpTLFdBQUEsS0FBSyxFQUFDLENBQUM7UUFDZixZQUFZLENBQUM7UUFFYjtZQUNFLGdCQUFnQjtZQUNoQixnQkFBWSxZQUE2QjtnQkFDdkMsYUFBYTtnQkFDYixZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQyw4QkFBOEI7WUFDaEMsQ0FBQztZQUVILGFBQUM7UUFBRCxDQVJBLEFBUUMsSUFBQTtRQVJZLFlBQU0sU0FRbEIsQ0FBQTtJQUNILENBQUMsRUFaUyxLQUFLLEdBQUwsUUFBSyxLQUFMLFFBQUssUUFZZDtBQUFELENBQUMsRUFaTSxFQUFFLEtBQUYsRUFBRSxRQVlSOztBQ1pELElB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UUFOZSxXQUFBLElBQUksRUFBQyxDQUFDO1lBQ3BCLFlBQVksQ0FBQztZQUViLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztpQkFFaEMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQU0sRUFBRSxLQUFLLElBQUssT0FBQSxVQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQyxDQUFDO1FBQzNFLENBQUMsRUFOZSxJQUFJLEdBQUosVUFBSSxLQUFKLFVBQUksUUFNbkI7SUFBRCxDQUFDLEVBTlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBTWQ7QUFBRCxDQUFDLEVBTk0sRUFBRSxLQUFGLEVBQUUsUUFNUiIsImZpbGUiOiJ2cy50b29sa2l0Lm1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB2cy50b29scyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuICAgIC8qKiBAbmdJbmplY3QgKi9cclxuICAgIGNvbnN0cnVjdG9yKCRsb2dQcm92aWRlcjogbmcuSUxvZ1Byb3ZpZGVyKSB7XHJcbiAgICAgIC8vIGVuYWJsZSBsb2dcclxuICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCh0cnVlKTtcclxuICAgICAgLy8gc2V0IG9wdGlvbnMgdGhpcmQtcGFydHkgbGliXHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUgdnMudG9vbHMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFJ1bkJsb2NrIHtcclxuICAgIC8qKiBAbmdJbmplY3QgKi9cclxuICAgIGNvbnN0cnVjdG9yKCRsb2c6IG5nLklMb2dTZXJ2aWNlKSB7XHJcbiAgICAgICRsb2cuZGVidWcoJ3J1bkJsb2NrIGVuZCcpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXguY29uZmlnLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LnJ1bi50c1wiIC8+XHJcblxyXG5tb2R1bGUgdnMudG9vbHMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMnLCBbXSlcclxuICAgIC5jb25maWcoQ29uZmlnKVxyXG4gICAgLnJ1bihSdW5CbG9jaylcclxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcclxufVxyXG4iLCJtb2R1bGUgdnMudG9vbHMuYXBwZWFyYW5jZSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuYXBwZWFyYW5jZScsIFtdKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5hcHBlYXJhbmNlJykuXHJcbi8qIEBuZ0luamVjdCAqL1xyXG5mYWN0b3J5KCdhcHBlYXJhbmNlUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSwgJHE6IGFueSkge1xyXG5cclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIHZhciB1cmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9hcHBlYXJhbmNlJztcclxuICB2YXIgYWN0aW9uVXJpID0gY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvYXBwZWFyYW5jZS9hY3Rpb25zJztcclxuXHJcbiAgZnVuY3Rpb24gX2ZldGNoKCk6IGFueSB7XHJcbiAgICByZXR1cm4gJGh0dHAuZ2V0KHVyaSkudGhlbihmdW5jdGlvbiAocmVzOiBhbnkpIHtcclxuICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgfSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc2F2ZUFjdGlvbnMoYWN0aW9uczogQXJyYXk8YW55Pikge1xyXG4gICAgcmV0dXJuICRodHRwLnBvc3QoYWN0aW9uVXJpLCB7IGRvY0FjdGlvbnM6IGFjdGlvbnMgfSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG4gICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZmV0Y2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gX2ZldGNoKCk7XHJcbiAgICB9LFxyXG4gICAgc2F2ZUFjdGlvbnM6IGZ1bmN0aW9uKGFjdGlvbnM6IEFycmF5PGFueT4pe1xyXG4gICAgICByZXR1cm4gX3NhdmVBY3Rpb25zKGFjdGlvbnMpO1xyXG4gICAgfVxyXG4gIH07XHJcbn0pO1xyXG4iLCJtb2R1bGUgdnMudG9vbHMuY2F0YWxvZyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuY2F0YWxvZycsIFtdKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5jYXRhbG9nJykuXHJcblx0LyogQG5nSW5qZWN0ICovXHJcblx0ZmFjdG9yeSgnY2F0YWxvZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnksICRxOiBhbnkpIHtcclxuXHJcblx0XHQndXNlIHN0cmljdCc7XHJcblxyXG5cdFx0dmFyIHVyaSA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2luZGV4L2NvbmZpZy9mZWRlcmF0aW9uLmpzb24nO1xyXG5cdFx0dmFyIGxvY2F0aW9ucyA9ICdhcGkvcmVzdC9pMThuL2ZpZWxkL2xvY2F0aW9uLmpzb24nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9mZXRjaCgpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldCh1cmkpLnRoZW4oZnVuY3Rpb24gKHJlczogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlcy5kYXRhLnNlcnZlcnM7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfbG9hZFJlbW90ZUxvY2F0aW9ucyhwYXJhbXM6IGFueSkge1xyXG5cdFx0XHRyZXR1cm4gX2ZldGNoKCkudGhlbigoY2F0YWxvZ3M6IGFueSkgPT4ge1xyXG5cdFx0XHRcdHZhciBwcm9taXNlcyA9IFtdO1xyXG5cdFx0XHRcdGNhdGFsb2dzLmZvckVhY2goY2F0YWxvZyA9PiB7XHJcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQoY2F0YWxvZy51cmwpKSB7XHJcblx0XHRcdFx0XHRcdHZhciB1cmwgPSBjYXRhbG9nLnVybCArIGxvY2F0aW9ucztcclxuXHRcdFx0XHRcdFx0dmFyIGNhdGFsb2dQcm9taXNlID0gJGh0dHAuZ2V0KHVybCwge3dpdGhDcmVkZW50aWFsczogZmFsc2V9KS50aGVuKChyZXNwb25zZTogYW55KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZXMucHVzaChjYXRhbG9nUHJvbWlzZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdFx0XHRcdHJldHVybiBlcnJvcjsgLy8gZmFpbHVyZSBtZWFucyB0aGUgcmVtb3RlIGNhdGFsb2dzIGFyZSBvZmZsaW5lLCBhbGxvdyB0byBjb250aW51ZSwgdGhlIHNlYXJjaCBzaG91bGQgc2hvdyBhbiBlcnJvclxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRmZXRjaDogX2ZldGNoLFxyXG5cdFx0XHRsb2FkUmVtb3RlTG9jYXRpb25zOiBfbG9hZFJlbW90ZUxvY2F0aW9uc1xyXG5cdFx0fTtcclxuXHR9KTtcclxuIiwibW9kdWxlIHZzLnRvb2xzLmRpc3BsYXlDb25maWcge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnLCBbXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZGlzcGxheUNvbmZpZycpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG5cdGZhY3RvcnkoJ2Rpc3BsYXlDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XHJcblxyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2NvbmZpZy8nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRMaXN0UXVlcnlTdHJpbmcoKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArICdsaXN0JztcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgaWQ7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnTGlzdCgpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX3NhdmVEaXNwbGF5Q29uZmlnKHRlbXBsYXRlOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoY29uZmlnVXJpLCB0ZW1wbGF0ZSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2RlbGV0ZURpc3BsYXlDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24odGVtcGxhdGU6IGFueSl7XHJcblx0XHRcdFx0cmV0dXJuIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7XHJcbiIsIm1vZHVsZSB2cy50b29scy51dGlsIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBTdWdhciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IGFueSwgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlKSB7fVxyXG5cclxuXHRcdHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcodmFsOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCB2YWwgaW5zdGFuY2VvZiBTdHJpbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBnZXRJbnN0YW5jZShjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSkgOiBTdWdhciB7XHJcblx0XHRcdHJldHVybiBuZXcgU3VnYXIoY29uZmlnLCAkaHR0cCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dG9NYXAoa2V5OiBhbnksIGFycmF5OiBhbnkpIHtcclxuXHRcdFx0dmFyIG1hcCA9IHt9O1xyXG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XHJcblx0XHRcdFx0bWFwW3ZhbHVlW2tleV1dID0gdmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbWFwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRvU3RyaW5nTWFwKGFycmF5OiBhbnkpIHtcclxuXHRcdFx0dmFyIG1hcCA9IHt9O1xyXG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XHJcblx0XHRcdFx0bWFwW3ZhbHVlXSA9IHZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG1hcDtcclxuXHRcdH1cclxuXHJcbiAgICBwbHVjayhhcnJheTogYW55LCBuYW1lOiBzdHJpbmcsIGZuPzogRnVuY3Rpb24pIHtcclxuICAgICAgdmFyIGZsID0gW107XHJcbiAgICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsdWU6IGFueSl7XHJcbiAgICAgICAgaWYgKGZuICYmIGZuKHZhbHVlKSkge1xyXG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGZuKSkge1xyXG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGZsO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RGb3JtKHVybDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgICAgdmFyIHNlcnZpY2UgPSB0aGlzLmNvbmZpZy5yb290ICsgdXJsO1xyXG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgdXJsOiBzZXJ2aWNlLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxyXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZVF1ZXJ5U3RyaW5nKHF1ZXJ5U3RyaW5nOiBzdHJpbmcpIHtcclxuICAgICAgdmFyIHBhaXJzID0gcXVlcnlTdHJpbmcuc2xpY2UoMSkuc3BsaXQoJyYnKTtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9LCBzO1xyXG4gICAgICBwYWlycy5mb3JFYWNoKGZ1bmN0aW9uKHBhaXIpIHtcclxuICAgICAgICBzID0gcGFpci5zcGxpdCgnPScpO1xyXG4gICAgICAgIHJlc3VsdFtzWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChzWzFdIHx8ICcnKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RKc29uKHJlcXVlc3QsIGFwaSwgYWN0aW9uKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRodHRwKHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICB1cmw6IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0LycgKyBhcGkgICsgJy8nICsgYWN0aW9uICsgJy5qc29uJyxcclxuICAgICAgICBkYXRhOiByZXF1ZXN0LFxyXG4gICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHR9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdXRpbC9zdWdhci50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xuJ3VzZSBzdHJpY3QnO1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpZWxkc1Jlc291cmNlIHtcblx0XHRmZXRjaChmaWVsZHM/OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xuXHRcdGZldGNoSHlkcmF0aW9uU3RhdHMocXVlcnk6IHN0cmluZyk6IG5nLklQcm9taXNlPGFueT47XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgRmllbGRzUmVzb3VyY2UgaW1wbGVtZW50cyBJRmllbGRzUmVzb3VyY2Uge1xuXHRcdHN0YXRpYyByZWZOYW1lID0gJ2ZpZWxkc1Jlc291cmNlJztcblxuXHRcdGZldGNoOiAocHJvcGVydGllcz86IHN0cmluZykgPT4gYW55O1xuXHRcdGZldGNoSHlkcmF0aW9uU3RhdHM6IChxdWVyeTogc3RyaW5nKSA9PiBhbnk7XG5cdFx0ZW5zdXJlVGFnc0ZpZWxkRXhpc3Q6IChmaWVsZHM6IEFycmF5PGFueT4pID0+IGFueTtcblxuXHRcdC8qIEBuZ0luamVjdCAqL1xuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc3VnYXI6IGFueSkge1xuXG4gICAgICB0aGlzLmZldGNoID0gKGZpZWxkcz86IGFueSkgPT4ge1xuICAgICAgICB2YXIgZmwgPSAoZmllbGRzIHx8ICduYW1lLHN0eXBlLGNhdGVnb3J5LGRvY3MsZGlzcF9lbixzb3J0YWJsZSxmaWx0ZXJhYmxlLHRhYmxlYWJsZSxkaXNwbGF5YWJsZSxlZGl0YWJsZScpO1xuICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvZmllbGRzL3NlbGVjdD9yYW5kPScgKyBNYXRoLnJhbmRvbSgpLCB0aGlzLmdldEZpZWxkc1BhcmFtcyhmbCkpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbnN1cmVUYWdzRmllbGRFeGlzdChyZXMuZGF0YS5yZXNwb25zZS5kb2NzKTtcbiAgICAgICAgICByZXR1cm4gcmVzLmRhdGEucmVzcG9uc2UuZG9jcztcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmVuc3VyZVRhZ3NGaWVsZEV4aXN0ID0gKGZpZWxkczogQXJyYXk8YW55PikgPT4ge1xuICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IGZpZWxkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChmaWVsZHNbaV0ubmFtZSA9PT0gJ3RhZ190YWdzJykge1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgIGZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgIGNhdGVnb3J5OiAnVEVYVCcsXG4gICAgICAgICAgICBkaXNwX2VuOiAnVGFncycsXG4gICAgICAgICAgICBkaXNwbGF5YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGRvY3M6IDAsXG4gICAgICAgICAgICBmaWx0ZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgbmFtZTogJ3RhZ190YWdzJyxcbiAgICAgICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHN0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIHRhYmxlYWJsZTogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuXHRcdFx0dGhpcy5mZXRjaEh5ZHJhdGlvblN0YXRzID0gKHF1ZXJ5OiBzdHJpbmcpID0+IHtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaCgpLnRoZW4oKGZpZWxkczogQXJyYXk8YW55PikgPT4ge1xuICAgICAgICAgIHZhciBmbCA9IHN1Z2FyLnBsdWNrKGZpZWxkcywgJ25hbWUnLCBmdW5jdGlvbihmaWVsZCkgeyByZXR1cm4gZmllbGQubmFtZS5pbmRleE9mKCdfJykgIT09IDAgJiYgZmllbGQuZG9jcyA+IDA7IH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdzb2xyL3YwL3NlbGVjdD8nICsgcXVlcnksIHRoaXMuZ2V0U3RhdHNQYXJhbXMoZmwpKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdmFyIHN0YXRzRmllbGRzID0gcmVzLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcztcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IHJlcy5kYXRhLnJlc3BvbnNlLm51bUZvdW5kO1xuICAgICAgICAgICAgdGhpcy5hcHBseUh5ZHJhdGlvbihzdGF0c0ZpZWxkcywgZmllbGRzLCB0b3RhbCk7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuXHRcdFx0fTtcblxuXHRcdH1cblxuICAgIHByaXZhdGUgZ2V0RmllbGRzUGFyYW1zKGZsKSB7XG4gICAgICByZXR1cm4gJ3E9KjoqJmZsPScgKyBmbCArICcmcm93cz0xMDAwMDAmc29ydD1uYW1lJTIwYXNjJnd0PWpzb24mcmFuZD0nICsgTWF0aC5yYW5kb20oKTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgZ2V0U3RhdHNQYXJhbXMoZmwpIHtcbiAgICAgIHJldHVybiAnZmFjZXQ9dHJ1ZSZmYWNldC5saW1pdD0xMDAwMDAmZmFjZXQubWluY291bnQ9MTAwJnJvd3M9MCZ3dD1qc29uJmZhY2V0LmZpZWxkPScgKyBmbC5qb2luKCcmZmFjZXQuZmllbGQ9JykgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcHBseUh5ZHJhdGlvbihzdGF0c0ZpZWxkcywgZmllbGRzLCB0b3RhbCkge1xuICAgICAgdmFyIHN0YXRzRmllbGQsIGNvdW50O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RhdHNGaWVsZCA9IHN0YXRzRmllbGRzW2ZpZWxkc1tpXS5uYW1lXTtcbiAgICAgICAgaWYgKHN0YXRzRmllbGQgJiYgc3RhdHNGaWVsZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGRzW2ldLmlkID0gZmllbGRzW2ldLm5hbWU7XG4gICAgICAgICAgY291bnQgPSB0aGlzLmdldENvdW50KHN0YXRzRmllbGQpO1xuICAgICAgICAgIGZpZWxkc1tpXS5oeWRyYXRpb24gPSBjb3VudCAvIHRvdGFsICogMTAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvdW50KGZpZWxkKSB7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBmaWVsZC5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICBjb3VudCArPSBmaWVsZFtpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZpZWxkcy5yZXNvdXJjZS50c1wiIC8+XHJcblxyXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmllbGRzJywgWyd2cy50b29scy51dGlsJ10pXHJcblx0XHQuc2VydmljZShGaWVsZHNSZXNvdXJjZS5yZWZOYW1lLCBGaWVsZHNSZXNvdXJjZSk7XHJcblxyXG59XHJcbiIsIm1vZHVsZSB2cy50b29scy5maWx0ZXJzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWx0ZXJzJywgW10pXG4gICAgLmZpbHRlcigncmVwbGFjZVN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gaGF5U3RhY2sucmVwbGFjZShuZXcgUmVnRXhwKG9sZE5lZWRsZSwgJ2cnKSwgbmV3TmVlZGxlKTtcbiAgICAgIH07XG4gICAgfSk7XG4gfVxuIiwibW9kdWxlIHZzLnRvb2xzLnNhdmVkU2VhcmNoIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcsIFsndnMudG9vbHMudXRpbCddKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXG5kZWNsYXJlIHZhciBjb25maWc7XG5cbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcpLlxuXHQvKiBAbmdJbmplY3QgKi9cbiAgZmFjdG9yeSgnc2F2ZWRTZWFyY2hSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55LCBzdWdhcikge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgIGZ1bmN0aW9uIF9kb1NhdmUoc2F2ZWRTZWFyY2g6IGFueSkge1xuICAgICAgIHJldHVybiBzdWdhci5wb3N0SnNvbihzYXZlZFNlYXJjaCwgJ2Rpc3BsYXknLCAnc3NlYXJjaCcpO1xuICAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlTdHJpbmcoaWQ/OiBzdHJpbmcpIHtcbiAgICAgIHZhciByb3dzID0gMTUwOyAgLy8gQFRPRE8gc2V0IHRvIHdoYXQgd2UgcmVhbGx5IHdhbnRcbiAgICAgIHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZy5yb290ICsgJ3NvbHIvc3NlYXJjaC9zZWxlY3Q/JztcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICdyb3dzPScgKyByb3dzICsgJyZyYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmbD1pZCx0aXRsZSxkZXNjcmlwdGlvbixvd25lcixwYXRoLHNoYXJlLHF1ZXJ5LGNvbmZpZyxvcmRlcixzYXZlZCxwcml2YXRlLHZpZXcsX3ZlcnNpb25fLGNvbmZpZ190aXRsZTpbY29uZmlnVGl0bGVdLHBhcmFtKixsYWJlbHMsZGlzcGxheV9vdmVycmlkZSc7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJnd0PWpzb24manNvbi53cmY9SlNPTl9DQUxMQkFDSyc7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaWQpKSB7XG4gICAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZnE9aWQ6JyArIGlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKGlkPzogc3RyaW5nKSB7XG4gICAgICByZXR1cm4gJGh0dHAuanNvbnAoX2dldFF1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG4gICAgICAgIHJldHVybiBkYXRhLmRhdGEucmVzcG9uc2UuZG9jcztcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcbiAgICAgICAgLy8gQFRPRE86IGhhbmRsZSBlcnJvclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBnZXRTYXZlZFNlYXJjaGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF9leGVjdXRlKCk7XG4gICAgICB9LFxuXG4gICAgICBmZXRjaDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuIF9leGVjdXRlKGlkKS50aGVuKGZ1bmN0aW9uKGRvY3MpIHtcbiAgICAgICAgICByZXR1cm4gZG9jc1swXTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBzYXZlU2VhcmNoOiBmdW5jdGlvbihzYXZlZFNlYXJjaCwgcGFyYW1zKSB7XG4gICAgICAgLy8gIHNhdmVkU2VhcmNoLmNvbmZpZyA9IGNvbmZpZ1NlcnZpY2UuZ2V0Q29uZmlnSWQoKTtcbiAgICAgICAvLyAgc2F2ZWRTZWFyY2gucXVlcnkgPSBjb252ZXJ0ZXIudG9DbGFzc2ljUGFyYW1zKHBhcmFtcyk7XG4gICAgICAgcmV0dXJuIF9kb1NhdmUoc2F2ZWRTZWFyY2gpO1xuICAgICAgfSxcblxuICAgICAgZGVsZXRlU2VhcmNoOiBmdW5jdGlvbihpZDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIC8vIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcbiAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHdpcGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC93aXBlJyk7XG4gICAgICB9LFxuXG4gICAgICByZXN0b3JlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3Jlc3RvcmUnLCAnJyk7XG4gICAgICB9LFxuXG4gICAgICBvcmRlcjogZnVuY3Rpb24oaWQ6IGFueSwgYmVmb3JlSWQ6IGFueSwgYWZ0ZXJJZDogYW55KSB7XG4gICAgICAgIHZhciBkYXRhID0gJyc7XG4gICAgICAgIGlmIChiZWZvcmVJZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGRhdGEgKz0gJ2JlZm9yZT0nICsgYmVmb3JlSWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEgIT09ICcnKSB7XG4gICAgICAgICAgZGF0YSArPSAnJic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWZ0ZXJJZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGRhdGEgKz0gJ2FmdGVyPScgKyBhZnRlcklkO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnYXBpL3Jlc3QvZGlzcGxheS9zc2VhcmNoLycgKyBpZCArICcvb3JkZXInLCBkYXRhKTtcbiAgICAgIH0sXG5cbiAgICAgIGZldGNoTGFiZWxzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHVybCA9IGNvbmZpZy5yb290ICsgJ3NvbHIvc3NlYXJjaC9zZWxlY3Q/cm93cz0wJmZhY2V0PXRydWUmZmFjZXQuZmllbGQ9bGFiZWxzJnd0PWpzb24mcj0nICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgICAgICByZXR1cm4gcmVzcC5kYXRhLmZhY2V0X2NvdW50cy5mYWNldF9maWVsZHMubGFiZWxzO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHsgIC8vIGVycm9yIGlmIGxhYmVscyBmaWVsZCBkb2Vzbid0IGV4aXN0XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsIm1vZHVsZSB2cy50b29scy50cmFuc2xhdGUge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIFRyYW5zbGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBmaWVsZHM6IGFueSA9IG51bGw7XG4gICAgcHJpdmF0ZSByZW1vdmVQcmVmaXhIYXNoID0ge307XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UsIHByaXZhdGUgJHE6IG5nLklRU2VydmljZSkge1xuICAgICAgdmFyIHJlbW92ZVByZWZpeExpc3QgPSBbJ2ZzXycsICdmdF8nLCAnZmhfJywgJ2ZpXycsICdmbF8nLCAnZmRfJywgJ2ZmXycsICdmdV8nLCAnZnBfJywgJ2Z5XycsICdmbV8nLCAnZmJfJywgJ3RhZ18nLCAnbWV0YV8nLCAnZnNzXycsICdncnBfJ107XG4gICAgICByZW1vdmVQcmVmaXhMaXN0LmZvckVhY2goKGl0ZW06IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLnJlbW92ZVByZWZpeEhhc2hbaXRlbV0gPSB0cnVlO1xuICAgICAgICB2YXIgYyA9IGl0ZW0uc3Vic3RyaW5nKDEsIDIpO1xuICAgICAgICB2YXIga2V5ID0gaXRlbS5yZXBsYWNlKCdfJywgYyArICdfJyk7XG4gICAgICAgIHRoaXMucmVtb3ZlUHJlZml4SGFzaFtrZXldID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKCkge1xuICAgICAgdmFyIHJlc291cmNlVXJsID0gdGhpcy5jb25maWcucm9vdCArICdhcGkvcmVzdC9pMThuL2ZpZWxkcy9zdGFuZGFyZC5qc29uJztcblxuICAgICAgaWYgKCF0aGlzLmZpZWxkcykge1xuICAgICAgICByZXR1cm4gdGhpcy4kaHR0cC5nZXQocmVzb3VyY2VVcmwpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5maWVsZHMgPSByZXMuZGF0YTtcbiAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJHEud2hlbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0cmFuc2xhdGVGaWVsZChmaWVsZDogc3RyaW5nKSB7XG4gICAgICB2YXIgaWR4ID0gZmllbGQuaW5kZXhPZignXycpO1xuICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBmaWVsZC5zdWJzdHJpbmcoMCwgaWR4ICsgMSk7XG4gICAgICAgIGlmICh0aGlzLnJlbW92ZVByZWZpeEhhc2hbcHJlZml4XSkge1xuICAgICAgICAgIGZpZWxkID0gZmllbGQucmVwbGFjZShwcmVmaXgsICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHRyYW5zbGF0ZWQgPSB0aGlzLmZpZWxkcy5GSUVMRFtmaWVsZF07XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodHJhbnNsYXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc2lmeShmaWVsZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGFzc2lmeShzdHI6IHN0cmluZykge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL18vZywgJyAnKTtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbih0eHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidHJhbnNsYXRvci50c1wiIC8+XHJcbm1vZHVsZSB2cy50b29scy50cmFuc2xhdGUge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMudHJhbnNsYXRlJywgW10pXHJcbiAgICAvKiBAbmdJbmplY3QgKi9cclxuICAgIC5mYWN0b3J5KCd0cmFuc2xhdG9yJywgKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlKSA9PiBuZXcgVHJhbnNsYXRvcihjb25maWcsICRodHRwLCAkcSkpXHJcbiAgICAuY29uc3RhbnQoJ2NvbmZpZycsIGNvbmZpZyk7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1Z2FyLnRzXCIgLz5cclxubW9kdWxlIHZzLnRvb2xzLnV0aWwge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnV0aWwnLCBbXSlcclxuICAgIC8qIEBuZ0luamVjdCAqL1xyXG4gICAgLmZhY3RvcnkoJ3N1Z2FyJywgKGNvbmZpZywgJGh0dHApID0+IFN1Z2FyLmdldEluc3RhbmNlKGNvbmZpZywgJGh0dHApKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
//# sourceMappingURL=maps/vs.toolkit.src.js.map