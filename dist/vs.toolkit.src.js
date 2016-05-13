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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ01vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ1Jlc291cmNlLnRzIiwidXRpbC9zdWdhci50cyIsImZpZWxkcy9maWVsZHMucmVzb3VyY2UudHMiLCJmaWVsZHMvZmllbGRzLm1vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdNb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnUmVzb3VyY2UudHMiLCJmaWx0ZXJzL2ZpbHRlcnMudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInV0aWwvdXRpbC5tb2R1bGUudHMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRvci50cyIsInRyYW5zbGF0ZS90cmFuc2xhdGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sRUFBRSxDQVlSO0FBWkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBWWQ7SUFaUyxXQUFBLEtBQUssRUFBQyxDQUFDO1FBQ2YsWUFBWSxDQUFDO1FBRWI7WUFDRSxnQkFBZ0I7WUFDaEIsZ0JBQVksWUFBNkI7Z0JBQ3ZDLGFBQWE7Z0JBQ2IsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsOEJBQThCO1lBQ2hDLENBQUM7WUFFSCxhQUFDO1FBQUQsQ0FSQSxBQVFDLElBQUE7UUFSWSxZQUFNLFNBUWxCLENBQUE7SUFDSCxDQUFDLEVBWlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBWWQ7QUFBRCxDQUFDLEVBWk0sRUFBRSxLQUFGLEVBQUUsUUFZUjs7QUNaRCxJQUFPLEVBQUUsQ0FVUjtBQVZELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVVkO0lBVlMsV0FBQSxLQUFLLEVBQUMs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QyxFQVRNLEVBQUUsS0FBRixFQUFFLFFBU1IiLCJmaWxlIjoidnMudG9vbGtpdC5taW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgdnMudG9vbHMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcbiAgICAvKiogQG5nSW5qZWN0ICovXHJcbiAgICBjb25zdHJ1Y3RvcigkbG9nUHJvdmlkZXI6IG5nLklMb2dQcm92aWRlcikge1xyXG4gICAgICAvLyBlbmFibGUgbG9nXHJcbiAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQodHJ1ZSk7XHJcbiAgICAgIC8vIHNldCBvcHRpb25zIHRoaXJkLXBhcnR5IGxpYlxyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuIiwibW9kdWxlIHZzLnRvb2xzIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBSdW5CbG9jayB7XHJcbiAgICAvKiogQG5nSW5qZWN0ICovXHJcbiAgICBjb25zdHJ1Y3RvcigkbG9nOiBuZy5JTG9nU2VydmljZSkge1xyXG4gICAgICAkbG9nLmRlYnVnKCdydW5CbG9jayBlbmQnKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LmNvbmZpZy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5ydW4udHNcIiAvPlxyXG5cclxubW9kdWxlIHZzLnRvb2xzIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzJywgW10pXHJcbiAgICAuY29uZmlnKENvbmZpZylcclxuICAgIC5ydW4oUnVuQmxvY2spXHJcbiAgICAuY29uc3RhbnQoJ2NvbmZpZycsIGNvbmZpZyk7XHJcbn1cclxuIiwibW9kdWxlIHZzLnRvb2xzLmNhdGFsb2cge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmNhdGFsb2cnLCBbXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuY2F0YWxvZycpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG5cdGZhY3RvcnkoJ2NhdGFsb2dSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55LCAkcTogYW55KSB7XHJcblxyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHZhciB1cmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9pbmRleC9jb25maWcvZmVkZXJhdGlvbi5qc29uJztcclxuXHRcdHZhciBsb2NhdGlvbnMgPSAnYXBpL3Jlc3QvaTE4bi9maWVsZC9sb2NhdGlvbi5qc29uJztcclxuXHJcblx0XHRmdW5jdGlvbiBfZmV0Y2goKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5nZXQodXJpKS50aGVuKGZ1bmN0aW9uIChyZXM6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiByZXMuZGF0YS5zZXJ2ZXJzO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2xvYWRSZW1vdGVMb2NhdGlvbnMocGFyYW1zOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuIF9mZXRjaCgpLnRoZW4oKGNhdGFsb2dzOiBhbnkpID0+IHtcclxuXHRcdFx0XHR2YXIgcHJvbWlzZXMgPSBbXTtcclxuXHRcdFx0XHRjYXRhbG9ncy5mb3JFYWNoKGNhdGFsb2cgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGNhdGFsb2cudXJsKSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgdXJsID0gY2F0YWxvZy51cmwgKyBsb2NhdGlvbnM7XHJcblx0XHRcdFx0XHRcdHZhciBjYXRhbG9nUHJvbWlzZSA9ICRodHRwLmdldCh1cmwsIHt3aXRoQ3JlZGVudGlhbHM6IGZhbHNlfSkudGhlbigocmVzcG9uc2U6IGFueSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdHByb21pc2VzLnB1c2goY2F0YWxvZ1Byb21pc2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZXJyb3I7IC8vIGZhaWx1cmUgbWVhbnMgdGhlIHJlbW90ZSBjYXRhbG9ncyBhcmUgb2ZmbGluZSwgYWxsb3cgdG8gY29udGludWUsIHRoZSBzZWFyY2ggc2hvdWxkIHNob3cgYW4gZXJyb3JcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZmV0Y2g6IF9mZXRjaCxcclxuXHRcdFx0bG9hZFJlbW90ZUxvY2F0aW9uczogX2xvYWRSZW1vdGVMb2NhdGlvbnNcclxuXHRcdH07XHJcblx0fSk7XHJcbiIsIm1vZHVsZSB2cy50b29scy51dGlsIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBTdWdhciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IGFueSwgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlKSB7fVxyXG5cclxuXHRcdHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcodmFsOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCB2YWwgaW5zdGFuY2VvZiBTdHJpbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0YXRpYyBnZXRJbnN0YW5jZShjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSkgOiBTdWdhciB7XHJcblx0XHRcdHJldHVybiBuZXcgU3VnYXIoY29uZmlnLCAkaHR0cCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dG9NYXAoa2V5OiBhbnksIGFycmF5OiBhbnkpIHtcclxuXHRcdFx0dmFyIG1hcCA9IHt9O1xyXG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XHJcblx0XHRcdFx0bWFwW3ZhbHVlW2tleV1dID0gdmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbWFwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRvU3RyaW5nTWFwKGFycmF5OiBhbnkpIHtcclxuXHRcdFx0dmFyIG1hcCA9IHt9O1xyXG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XHJcblx0XHRcdFx0bWFwW3ZhbHVlXSA9IHZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG1hcDtcclxuXHRcdH1cclxuXHJcbiAgICBwbHVjayhhcnJheTogYW55LCBuYW1lOiBzdHJpbmcsIGZuPzogRnVuY3Rpb24pIHtcclxuICAgICAgdmFyIGZsID0gW107XHJcbiAgICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsdWU6IGFueSl7XHJcbiAgICAgICAgaWYgKGZuICYmIGZuKHZhbHVlKSkge1xyXG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGZuKSkge1xyXG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGZsO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RGb3JtKHVybDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgICAgdmFyIHNlcnZpY2UgPSB0aGlzLmNvbmZpZy5yb290ICsgdXJsO1xyXG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgdXJsOiBzZXJ2aWNlLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxyXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZVF1ZXJ5U3RyaW5nKHF1ZXJ5U3RyaW5nOiBzdHJpbmcpIHtcclxuICAgICAgdmFyIHBhaXJzID0gcXVlcnlTdHJpbmcuc2xpY2UoMSkuc3BsaXQoJyYnKTtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9LCBzO1xyXG4gICAgICBwYWlycy5mb3JFYWNoKGZ1bmN0aW9uKHBhaXIpIHtcclxuICAgICAgICBzID0gcGFpci5zcGxpdCgnPScpO1xyXG4gICAgICAgIHJlc3VsdFtzWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChzWzFdIHx8ICcnKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RKc29uKHJlcXVlc3QsIGFwaSwgYWN0aW9uKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRodHRwKHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICB1cmw6IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0LycgKyBhcGkgICsgJy8nICsgYWN0aW9uICsgJy5qc29uJyxcclxuICAgICAgICBkYXRhOiByZXF1ZXN0LFxyXG4gICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHR9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi91dGlsL3N1Z2FyLnRzXCIgLz5cclxuXHJcbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZpZWxkc1Jlc291cmNlIHtcclxuXHRcdGZldGNoKGZpZWxkcz86IHN0cmluZyk6IG5nLklQcm9taXNlPGFueT47XHJcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzKHF1ZXJ5OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGNsYXNzIEZpZWxkc1Jlc291cmNlIGltcGxlbWVudHMgSUZpZWxkc1Jlc291cmNlIHtcclxuXHRcdHN0YXRpYyByZWZOYW1lID0gJ2ZpZWxkc1Jlc291cmNlJztcclxuXHJcblx0XHRmZXRjaDogKHByb3BlcnRpZXM/OiBzdHJpbmcpID0+IGFueTtcclxuXHRcdGZldGNoSHlkcmF0aW9uU3RhdHM6IChxdWVyeTogc3RyaW5nKSA9PiBhbnk7XHJcblxyXG5cdFx0LyogQG5nSW5qZWN0ICovXHJcblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHN1Z2FyOiBhbnkpIHtcclxuXHJcbiAgICAgIHRoaXMuZmV0Y2ggPSAoZmllbGRzPzogYW55KSA9PiB7XHJcbiAgICAgICAgdmFyIGZsID0gKGZpZWxkcyB8fCAnbmFtZSxzdHlwZSxjYXRlZ29yeSxkb2NzLGRpc3BfZW4sc29ydGFibGUsZmlsdGVyYWJsZSx0YWJsZWFibGUsZGlzcGxheWFibGUsZWRpdGFibGUnKTtcclxuICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvZmllbGRzL3NlbGVjdCcsIHRoaXMuZ2V0RmllbGRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcclxuICAgICAgICAgIHJldHVybiByZXMuZGF0YS5yZXNwb25zZS5kb2NzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuXHRcdFx0dGhpcy5mZXRjaEh5ZHJhdGlvblN0YXRzID0gKHF1ZXJ5OiBzdHJpbmcpID0+IHtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2goKS50aGVuKChmaWVsZHM6IEFycmF5PGFueT4pID0+IHtcclxuICAgICAgICAgIHZhciBmbCA9IHN1Z2FyLnBsdWNrKGZpZWxkcywgJ25hbWUnLCBmdW5jdGlvbihmaWVsZCkgeyByZXR1cm4gZmllbGQubmFtZS5pbmRleE9mKCdfJykgIT09IDAgJiYgZmllbGQuZG9jcyA+IDA7IH0pO1xyXG5cclxuICAgICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci92MC9zZWxlY3Q/JyArIHF1ZXJ5LCB0aGlzLmdldFN0YXRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdmFyIHN0YXRzRmllbGRzID0gcmVzLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcztcclxuICAgICAgICAgICAgdmFyIHRvdGFsID0gcmVzLmRhdGEucmVzcG9uc2UubnVtRm91bmQ7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZpZWxkc1BhcmFtcyhmbCkge1xyXG4gICAgICByZXR1cm4gJ3E9KjoqJmZsPScgKyBmbCArICcmcm93cz0xMDAwMCZzb3J0PW5hbWUlMjBhc2Mmd3Q9anNvbic7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgZ2V0U3RhdHNQYXJhbXMoZmwpIHtcclxuICAgICAgcmV0dXJuICdmYWNldD10cnVlJmZhY2V0LmxpbWl0PTEwMDAwJmZhY2V0Lm1pbmNvdW50PTEwMCZyb3dzPTAmd3Q9anNvbiZmYWNldC5maWVsZD0nICsgZmwuam9pbignJmZhY2V0LmZpZWxkPScpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpIHtcclxuICAgICAgdmFyIHN0YXRzRmllbGQsIGNvdW50O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN0YXRzRmllbGQgPSBzdGF0c0ZpZWxkc1tmaWVsZHNbaV0ubmFtZV07XHJcbiAgICAgICAgaWYgKHN0YXRzRmllbGQgJiYgc3RhdHNGaWVsZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBmaWVsZHNbaV0uaWQgPSBmaWVsZHNbaV0ubmFtZTtcclxuICAgICAgICAgIGNvdW50ID0gdGhpcy5nZXRDb3VudChzdGF0c0ZpZWxkKTtcclxuICAgICAgICAgIGZpZWxkc1tpXS5oeWRyYXRpb24gPSBjb3VudCAvIHRvdGFsICogMTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gaTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldENvdW50KGZpZWxkKSB7XHJcbiAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZmllbGQubGVuZ3RoOyBpICs9IDIpIHtcclxuICAgICAgICBjb3VudCArPSBmaWVsZFtpXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY291bnQ7XHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZmllbGRzLnJlc291cmNlLnRzXCIgLz5cclxuXHJcbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWVsZHMnLCBbJ3ZzLnRvb2xzLnV0aWwnXSlcclxuXHRcdC5zZXJ2aWNlKEZpZWxkc1Jlc291cmNlLnJlZk5hbWUsIEZpZWxkc1Jlc291cmNlKTtcclxuXHJcbn1cclxuIiwibW9kdWxlIHZzLnRvb2xzLmRpc3BsYXlDb25maWcge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnLCBbXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZGlzcGxheUNvbmZpZycpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG5cdGZhY3RvcnkoJ2Rpc3BsYXlDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XHJcblxyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2NvbmZpZy8nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRMaXN0UXVlcnlTdHJpbmcoKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArICdsaXN0JztcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgaWQ7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnTGlzdCgpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX3NhdmVEaXNwbGF5Q29uZmlnKHRlbXBsYXRlOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoY29uZmlnVXJpLCB0ZW1wbGF0ZSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2RlbGV0ZURpc3BsYXlDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24odGVtcGxhdGU6IGFueSl7XHJcblx0XHRcdFx0cmV0dXJuIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7XHJcbiIsIm1vZHVsZSB2cy50b29scy5maWx0ZXJzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWx0ZXJzJywgW10pXG4gICAgLmZpbHRlcigncmVwbGFjZVN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gaGF5U3RhY2sucmVwbGFjZShuZXcgUmVnRXhwKG9sZE5lZWRsZSwgJ2cnKSwgbmV3TmVlZGxlKTtcbiAgICAgIH07XG4gICAgfSk7XG4gfVxuIiwibW9kdWxlIHZzLnRvb2xzLnNhdmVkU2VhcmNoIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcsIFsndnMudG9vbHMudXRpbCddKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSwgc3VnYXIpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgIGZ1bmN0aW9uIF9kb1NhdmUoc2F2ZWRTZWFyY2g6IGFueSkge1xyXG4gICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RKc29uKHNhdmVkU2VhcmNoLCAnZGlzcGxheScsICdzc2VhcmNoJyk7XHJcbiAgICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9nZXRRdWVyeVN0cmluZyhpZD86IHN0cmluZykge1xyXG4gICAgICB2YXIgcm93cyA9IDE1MDsgIC8vIEBUT0RPIHNldCB0byB3aGF0IHdlIHJlYWxseSB3YW50XHJcbiAgICAgIHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZy5yb290ICsgJ3NvbHIvc3NlYXJjaC9zZWxlY3Q/JztcclxuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZmw9aWQsdGl0bGUsZGVzY3JpcHRpb24sb3duZXIscGF0aCxzaGFyZSxxdWVyeSxjb25maWcsb3JkZXIsc2F2ZWQscHJpdmF0ZSx2aWV3LF92ZXJzaW9uXyxjb25maWdfdGl0bGU6W2NvbmZpZ1RpdGxlXSxwYXJhbSosbGFiZWxzJztcclxuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xyXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaWQpKSB7XHJcbiAgICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmcT1pZDonICsgaWQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKGlkPzogc3RyaW5nKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5qc29ucChfZ2V0UXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5kYXRhLnJlc3BvbnNlLmRvY3M7XHJcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZ2V0U2F2ZWRTZWFyY2hlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIF9leGVjdXRlKCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmZXRjaDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoaWQpLnRoZW4oZnVuY3Rpb24oZG9jcykge1xyXG4gICAgICAgICAgcmV0dXJuIGRvY3NbMF07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzYXZlU2VhcmNoOiBmdW5jdGlvbihzYXZlZFNlYXJjaCwgcGFyYW1zKSB7XHJcbiAgICAgICAvLyAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xyXG4gICAgICAgLy8gIHNhdmVkU2VhcmNoLnF1ZXJ5ID0gY29udmVydGVyLnRvQ2xhc3NpY1BhcmFtcyhwYXJhbXMpO1xyXG4gICAgICAgcmV0dXJuIF9kb1NhdmUoc2F2ZWRTZWFyY2gpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZGVsZXRlU2VhcmNoOiBmdW5jdGlvbihpZDogc3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQpLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAvLyBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcclxuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcclxuICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB3aXBlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC93aXBlJyk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZXN0b3JlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvcmVzdG9yZScsICcnKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZDogYW55LCBiZWZvcmVJZDogYW55LCBhZnRlcklkOiBhbnkpIHtcclxuICAgICAgICB2YXIgZGF0YSA9ICcnO1xyXG4gICAgICAgIGlmIChiZWZvcmVJZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgZGF0YSArPSAnYmVmb3JlPScgKyBiZWZvcmVJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGEgIT09ICcnKSB7XHJcbiAgICAgICAgICBkYXRhICs9ICcmJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhZnRlcklkICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBkYXRhICs9ICdhZnRlcj0nICsgYWZ0ZXJJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmV0Y2hMYWJlbHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB1cmwgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0P3Jvd3M9MCZmYWNldD10cnVlJmZhY2V0LmZpZWxkPWxhYmVscyZ3dD1qc29uJnI9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcclxuICAgICAgICAgIHJldHVybiByZXNwLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcy5sYWJlbHM7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAvLyBlcnJvciBpZiBsYWJlbHMgZmllbGQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VnYXIudHNcIiAvPlxyXG5tb2R1bGUgdnMudG9vbHMudXRpbCB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMudXRpbCcsIFtdKVxyXG4gICAgLyogQG5nSW5qZWN0ICovXHJcbiAgICAuZmFjdG9yeSgnc3VnYXInLCAoY29uZmlnLCAkaHR0cCkgPT4gU3VnYXIuZ2V0SW5zdGFuY2UoY29uZmlnLCAkaHR0cCkpO1xyXG59XHJcbiIsIm1vZHVsZSB2cy50b29scy50cmFuc2xhdGUge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIFRyYW5zbGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBmaWVsZHM6IGFueSA9IG51bGw7XG4gICAgcHJpdmF0ZSByZW1vdmVQcmVmaXhIYXNoID0ge307XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UsIHByaXZhdGUgJHE6IG5nLklRU2VydmljZSkge1xuICAgICAgdmFyIHJlbW92ZVByZWZpeExpc3QgPSBbJ2ZzXycsICdmdF8nLCAnZmhfJywgJ2ZpXycsICdmbF8nLCAnZmRfJywgJ2ZmXycsICdmdV8nLCAnZnBfJywgJ2Z5XycsICdmbV8nLCAnZmJfJywgJ3RhZ18nLCAnbWV0YV8nLCAnZnNzXyddO1xuICAgICAgcmVtb3ZlUHJlZml4TGlzdC5mb3JFYWNoKChpdGVtOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5yZW1vdmVQcmVmaXhIYXNoW2l0ZW1dID0gdHJ1ZTtcbiAgICAgICAgdmFyIGMgPSBpdGVtLnN1YnN0cmluZygxLCAyKTtcbiAgICAgICAgdmFyIGtleSA9IGl0ZW0ucmVwbGFjZSgnXycsIGMgKyAnXycpO1xuICAgICAgICB0aGlzLnJlbW92ZVByZWZpeEhhc2hba2V5XSA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZCgpIHtcbiAgICAgIHZhciByZXNvdXJjZVVybCA9IHRoaXMuY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvaTE4bi9maWVsZHMvc3RhbmRhcmQuanNvbic7XG5cbiAgICAgIGlmICghdGhpcy5maWVsZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAuZ2V0KHJlc291cmNlVXJsKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMuZmllbGRzID0gcmVzLmRhdGE7XG4gICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRxLndoZW4oKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdHJhbnNsYXRlRmllbGQoZmllbGQ6IHN0cmluZykge1xuICAgICAgdmFyIGlkeCA9IGZpZWxkLmluZGV4T2YoJ18nKTtcbiAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICB2YXIgcHJlZml4ID0gZmllbGQuc3Vic3RyaW5nKDAsIGlkeCArIDEpO1xuICAgICAgICBpZiAodGhpcy5yZW1vdmVQcmVmaXhIYXNoW3ByZWZpeF0pIHtcbiAgICAgICAgICBmaWVsZCA9IGZpZWxkLnJlcGxhY2UocHJlZml4LCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciB0cmFuc2xhdGVkID0gdGhpcy5maWVsZHMuRklFTERbZmllbGRdO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRyYW5zbGF0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkoZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xhc3NpZnkoc3RyOiBzdHJpbmcpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyYW5zbGF0b3IudHNcIiAvPlxyXG5tb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnRyYW5zbGF0ZScsIFtdKVxyXG4gICAgLyogQG5nSW5qZWN0ICovXHJcbiAgICAuZmFjdG9yeSgndHJhbnNsYXRvcicsIChjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgJHE6IG5nLklRU2VydmljZSkgPT4gbmV3IFRyYW5zbGF0b3IoY29uZmlnLCAkaHR0cCwgJHEpKVxyXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
//# sourceMappingURL=maps/vs.toolkit.src.js.map