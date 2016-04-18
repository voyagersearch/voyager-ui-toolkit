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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ01vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ1Jlc291cmNlLnRzIiwidXRpbC9zdWdhci50cyIsImZpZWxkcy9maWVsZHMucmVzb3VyY2UudHMiLCJmaWVsZHMvZmllbGRzLm1vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdNb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnUmVzb3VyY2UudHMiLCJmaWx0ZXJzL2ZpbHRlcnMudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInRyYW5zbGF0ZS90cmFuc2xhdG9yLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5tb2R1bGUudHMiLCJ1dGlsL3V0aWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sRUFBRSxDQVlSO0FBWkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBWWQ7SUFaUyxXQUFBLEtBQUssRUFBQyxDQUFDO1FBQ2YsWUFBWSxDQUFDO1FBRWI7WUFDRSxnQkFBZ0I7WUFDaEIsZ0JBQVksWUFBNkI7Z0JBQ3ZDLGFBQWE7Z0JBQ2IsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsOEJBQThCO1lBQ2hDLENBQUM7WUFFSCxhQUFDO1FBQUQsQ0FSQSxBQVFDLElBQUE7UUFSWSxZQUFNLFNBUWxCLENBQUE7SUFDSCxDQUFDLEVBWlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBWWQ7QUFBRCxDQUFDLEVBWk0sRUFBRSxLQUFGLEVBQUUsUUFZUjs7QUNaRCxJQUFPLEVBQUUsQ0FVUjtBQVZELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVVkO0lBVlMsV0FBQSxLQUFLLEVBQUMsQ0FBQztRQUNmLFlBQVksQ0FBQztRQUViO1lBQ0UsZ0JBQWdCO1lBQ2hCLGtCQUFZLElBQW9CO2dCQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFSCxlQUFDO1FBQUQsQ0FOQSxBQU1DLElBQUE7UUFOWSxjQUFRLFdBTXBCLENBQUE7SUFDSCxDQUFDLEVBVlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBVWQ7QUFBRCxDQUFDLEVBVk0sRUFBRSxLQUFGLEVBQUUsUUFVUjs7QUNWRCxpREFBaUQ7QUFFakQsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUVyQyxJQUFPLEVBQUUsQ0FTUjtBQVRELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVNkO0lBVFMsV0FBQSxLQUFLLEVBQUMsQ0FBQztRQUNmLFlBQVksQ0FBQztRQUliLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQzthQUMzQixNQUFNLENBQUMsWUFBTSxDQUFDO2FBQ2QsR0FBRyxDQUFDLGNBQVEsQ0FBQzthQUNiLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQyxFQVRTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQVNkO0FBQUQsQ0FBQyxFQVRNLEVBQUUsS0FBRixFQUFFLFFBU1I7O0FDZEQsSUFBTyxFQUFFLENBSVI7QUFKRCxXQUFPLEVBQUU7SUFBQyxJQUFBLEtBQUssQ0FJZDtJQUpTLFdBQUEsS0FBSztRQUFDLElBQUEsT0FBTyxDQUl0QjtRQUplLFdBQUEsT0FBTyxFQUFDLENBQUM7WUFDdkIsWUFBWSxDQUFDO1lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6QyxDQUFDLEVBSmUsT0FBTyxHQUFQLGFBQU8sS0FBUCxhQUFPLFFBSXRCO0lBQUQsQ0FBQyxFQUpTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQUlkO0FBQUQsQ0FBQyxFQUpNLEVBQUUsS0FBRixFQUFFLFFBSVI7O0FDREQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztJQUNqQyxlQUFlO0lBQ2YsT0FBTyxDQUFDLGlCQUFpQixFQUFFLFVBQVUsS0FBVSxFQUFFLEVBQU87SUFFdkQsWUFBWSxDQUFDO0lBRWIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyx1Q0FBdUMsQ0FBQztJQUNoRSxJQUFJLFNBQVMsR0FBRyxtQ0FBbUMsQ0FBQztJQUVwRDtRQUNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQVE7WUFDNUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3pCLENBQUMsRUFBRSxVQUFTLEtBQVU7WUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsOEJBQThCLE1BQVc7UUFDeEMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQWE7WUFDbEMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO2dCQUN2QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO29CQUNsQyxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQWE7d0JBQ2hGLE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBQ2pCLENBQUMsQ0FBQyxDQUFDO29CQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQy9CLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLEdBQUc7Z0JBQ3hDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDWixDQUFDLEVBQUUsVUFBUyxLQUFLO2dCQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsb0dBQW9HO1lBQ25ILENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDO1FBQ04sS0FBSyxFQUFFLE1BQU07UUFDYixtQkFBbUIsRUFBRSxvQkFBb0I7S0FDekMsQ0FBQztBQUNILENBQUMsQ0FBQyxDQUFDOztBQzdDSixJQUFPLEVBQUUsQ0F5RVI7QUF6RUQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBeUVkO0lBekVTLFdBQUEsS0FBSztRQUFDLElBQUEsSUFBSSxDQXlFbkI7UUF6RWUsV0FBQSxJQUFJLEVBQUMsQ0FBQztZQUNwQixZQUFZLENBQUM7WUFFZDtnQkFFRyxlQUFvQixNQUFXLEVBQVUsS0FBc0I7b0JBQTNDLFdBQU0sR0FBTixNQUFNLENBQUs7b0JBQVUsVUFBSyxHQUFMLEtBQUssQ0FBaUI7Z0JBQUcsQ0FBQztnQkFFdkQsY0FBUSxHQUF0QixVQUF1QixHQUFRO29CQUM5QixNQUFNLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxZQUFZLE1BQU0sQ0FBQyxDQUFDO2dCQUMzRCxDQUFDO2dCQUVNLGlCQUFXLEdBQWxCLFVBQW1CLE1BQVcsRUFBRSxLQUFzQjtvQkFDckQsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDakMsQ0FBQztnQkFFRCxxQkFBSyxHQUFMLFVBQU0sR0FBUSxFQUFFLEtBQVU7b0JBQ3pCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDYixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBVTt3QkFDeEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFDekIsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDWixDQUFDO2dCQUVELDJCQUFXLEdBQVgsVUFBWSxLQUFVO29CQUNyQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQVU7d0JBQ3hCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7b0JBQ3BCLENBQUMsQ0FBQyxDQUFDO29CQUNILE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ1osQ0FBQztnQkFFQyxxQkFBSyxHQUFMLFVBQU0sS0FBVSxFQUFFLElBQVksRUFBRSxFQUFhO29CQUMzQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7b0JBQ1osS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQVU7d0JBQy9CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNwQixFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztvQkFDSCxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUNaLENBQUM7Z0JBRUQsd0JBQVEsR0FBUixVQUFTLEdBQVcsRUFBRSxJQUFTO29CQUM3QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7b0JBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO3dCQUNoQixNQUFNLEVBQUUsTUFBTTt3QkFDZCxHQUFHLEVBQUUsT0FBTzt3QkFDWixJQUFJLEVBQUUsSUFBSTt3QkFDVixlQUFlLEVBQUUsSUFBSTt3QkFDckIsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLG1DQUFtQyxFQUFDO3FCQUNoRSxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxnQ0FBZ0IsR0FBaEIsVUFBaUIsV0FBbUI7b0JBQ2xDLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLE1BQU0sR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNuQixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTt3QkFDekIsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7b0JBQ2hELENBQUMsQ0FBQyxDQUFDO29CQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztnQkFFRCx3QkFBUSxHQUFSLFVBQVMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNO29CQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzt3QkFDaEIsTUFBTSxFQUFFLE1BQU07d0JBQ2QsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsV0FBVyxHQUFHLEdBQUcsR0FBSSxHQUFHLEdBQUcsTUFBTSxHQUFHLE9BQU87d0JBQzlELElBQUksRUFBRSxPQUFPO3dCQUNiLE9BQU8sRUFBRSxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQztxQkFDOUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0osWUFBQztZQUFELENBckVBLEFBcUVDLElBQUE7WUFyRVksVUFBSyxRQXFFakIsQ0FBQTtRQUNGLENBQUMsRUF6RWUsSUFBSSxHQUFKLFVBQUksS0FBSixVQUFJLFFBeUVuQjtJQUFELENBQUMsRUF6RVMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBeUVkO0FBQUQsQ0FBQyxFQXpFTSxFQUFFLEtBQUYsRUFBRSxRQXlFUjs7QUN6RUQsb0RBQW9EO0FBQ3BELHlDQUF5QztBQUV6QyxJQUFPLEVBQUUsQ0F3RVI7QUF4RUQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBd0VkO0lBeEVTLFdBQUEsS0FBSztRQUFDLElBQUEsTUFBTSxDQXdFckI7UUF4RWUsV0FBQSxRQUFNLEVBQUMsQ0FBQztZQUN4QixZQUFZLENBQUM7WUFPWjtnQkFNQyxlQUFlO2dCQUNmLHdCQUFvQixLQUFVO29CQVAvQixpQkErREU7b0JBeERtQixVQUFLLEdBQUwsS0FBSyxDQUFLO29CQUUxQixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQUMsTUFBWTt3QkFDeEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLElBQUkscUZBQXFGLENBQUMsQ0FBQzt3QkFDM0csTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQVE7NEJBQ2xGLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBQ2hDLENBQUMsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQztvQkFFTCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsVUFBQyxLQUFhO3dCQUV4QyxNQUFNLENBQUMsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQWtCOzRCQUN0QyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBUyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUVsSCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLEVBQUUsS0FBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQVE7Z0NBQ3RGLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztnQ0FDckQsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2dDQUN2QyxLQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0NBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUM7NEJBQ2hCLENBQUMsQ0FBQyxDQUFDO3dCQUNMLENBQUMsQ0FBQyxDQUFDO29CQUVSLENBQUMsQ0FBQztnQkFFSCxDQUFDO2dCQUVTLHdDQUFlLEdBQXZCLFVBQXdCLEVBQUU7b0JBQ3hCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLHFDQUFxQyxDQUFDO2dCQUNsRSxDQUFDO2dCQUdPLHVDQUFjLEdBQXRCLFVBQXVCLEVBQUU7b0JBQ3ZCLE1BQU0sQ0FBQyw2RUFBNkUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUNsSCxDQUFDO2dCQUVPLHVDQUFjLEdBQXRCLFVBQXVCLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSztvQkFDL0MsSUFBSSxVQUFVLEVBQUUsS0FBSyxDQUFDO29CQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDdkMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzs0QkFDOUIsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7NEJBQ2xDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7d0JBQzVDLENBQUM7b0JBQ0gsQ0FBQztvQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNYLENBQUM7Z0JBRU8saUNBQVEsR0FBaEIsVUFBaUIsS0FBSztvQkFDcEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNkLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7d0JBQ3pDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLENBQUM7b0JBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDZixDQUFDO2dCQTVESSxzQkFBTyxHQUFHLGdCQUFnQixDQUFDO2dCQThEbEMscUJBQUM7WUFBRCxDQS9ERCxBQStERSxJQUFBO1lBL0RXLHVCQUFjLGlCQStEekIsQ0FBQTtRQUNILENBQUMsRUF4RWUsTUFBTSxHQUFOLFlBQU0sS0FBTixZQUFNLFFBd0VyQjtJQUFELENBQUMsRUF4RVMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBd0VkO0FBQUQsQ0FBQyxFQXhFTSxFQUFFLEtBQUYsRUFBRSxRQXdFUjs7QUMzRUQsb0RBQW9EO0FBQ3BELDZDQUE2QztBQUU3QyxJQUFPLEVBQUUsQ0FNUjtBQU5ELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQU1kO0lBTlMsV0FBQSxLQUFLO1FBQUMsSUFBQSxNQUFNLENBTXJCO1FBTmUsV0FBQSxNQUFNLEVBQUMsQ0FBQztZQUN4QixZQUFZLENBQUM7WUFFWixPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQ2xELE9BQU8sQ0FBQyxxQkFBYyxDQUFDLE9BQU8sRUFBRSxxQkFBYyxDQUFDLENBQUM7UUFFbkQsQ0FBQyxFQU5lLE1BQU0sR0FBTixZQUFNLEtBQU4sWUFBTSxRQU1yQjtJQUFELENBQUMsRUFOUyxLQUFLLEdBQUwsUUFBSyxLQUFMLFFBQUssUUFNZDtBQUFELENBQUMsRUFOTSxFQUFFLEtBQUYsRUFBRSxRQU1SOztBQ1RELElBQU8sRUFBRSxDQUlSO0FBSkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBSWQ7SUFKUyxXQUFBLEtBQUs7UUFBQyxJQUFBLGFBQWEsQ0FJNUI7UUFKZSxXQUFBLGFBQWEsRUFBQyxDQUFDO1lBQzdCLFlBQVksQ0FBQztZQUViLE9BQU8sQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxFQUplLGFBQWEsR0FBYixtQkFBYSxLQUFiLG1CQUFhLFFBSTVCO0lBQUQsQ0FBQyxFQUpTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQUlkO0FBQUQsQ0FBQyxFQUpNLEVBQUUsS0FBRixFQUFFLFFBSVI7O0FDREQsT0FBTyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztJQUN2QyxlQUFlO0lBQ2YsT0FBTyxDQUFDLHVCQUF1QixFQUFFLFVBQVUsS0FBVTtJQUVwRCxZQUFZLENBQUM7SUFFYixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLDBCQUEwQixDQUFDO0lBRXpEO1FBQ0MsSUFBSSxXQUFXLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUNyQyxXQUFXLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4QyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3BCLENBQUM7SUFFRCwrQkFBK0IsRUFBVTtRQUN4QyxJQUFJLFdBQVcsR0FBRyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2pDLFdBQVcsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDcEIsQ0FBQztJQUVEO1FBQ0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQVM7WUFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNiLENBQUMsRUFBRSxVQUFTLEtBQVU7WUFDckIsc0JBQXNCO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELDJCQUEyQixFQUFVO1FBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBUztZQUNuRSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQyxFQUFFLFVBQVMsS0FBVTtZQUNyQixzQkFBc0I7WUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsOEJBQThCLEVBQVU7UUFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFTO1lBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDLEVBQUUsVUFBUyxLQUFVO1lBQ3JCLHNCQUFzQjtZQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCw0QkFBNEIsUUFBYTtRQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBUztZQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQyxFQUFFLFVBQVMsS0FBVTtZQUNyQixzQkFBc0I7WUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDO1FBQ04saUJBQWlCLEVBQUU7WUFDbEIsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUNELGdCQUFnQixFQUFFLFVBQVMsRUFBVTtZQUNwQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNELG1CQUFtQixFQUFFLFVBQVMsRUFBVTtZQUN2QyxNQUFNLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUNELGlCQUFpQixFQUFFLFVBQVMsUUFBYTtZQUN4QyxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQztLQUNELENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQzs7QUM3RUosSUFBTyxFQUFFLENBU1A7QUFURixXQUFPLEVBQUU7SUFBQyxJQUFBLEtBQUssQ0FTYjtJQVRRLFdBQUEsS0FBSztRQUFDLElBQUEsT0FBTyxDQVNyQjtRQVRjLFdBQUEsT0FBTyxFQUFDLENBQUM7WUFDdkIsWUFBWSxDQUFDO1lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUM7aUJBQ25DLE1BQU0sQ0FBQyxlQUFlLEVBQUU7Z0JBQ3ZCLE1BQU0sQ0FBQyxVQUFTLFFBQWdCLEVBQUUsU0FBaUIsRUFBRSxTQUFpQjtvQkFDcEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsRUFUYyxPQUFPLEdBQVAsYUFBTyxLQUFQLGFBQU8sUUFTckI7SUFBRCxDQUFDLEVBVFEsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBU2I7QUFBRCxDQUFDLEVBVEssRUFBRSxLQUFGLEVBQUUsUUFTUDs7QUNURixJQUFPLEVBQUUsQ0FJUjtBQUpELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQUlkO0lBSlMsV0FBQSxLQUFLO1FBQUMsSUFBQSxXQUFXLENBSTFCO1FBSmUsV0FBQSxXQUFXLEVBQUMsQ0FBQztZQUMzQixZQUFZLENBQUM7WUFFYixPQUFPLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDLEVBSmUsV0FBVyxHQUFYLGlCQUFXLEtBQVgsaUJBQVcsUUFJMUI7SUFBRCxDQUFDLEVBSlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBSWQ7QUFBRCxDQUFDLEVBSk0sRUFBRSxLQUFGLEVBQUUsUUFJUjs7QUNERCxPQUFPLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDO0lBQ3JDLGVBQWU7SUFDZCxPQUFPLENBQUMscUJBQXFCLEVBQUUsVUFBVSxLQUFVLEVBQUUsS0FBSztJQUV4RCxZQUFZLENBQUM7SUFFWixpQkFBaUIsV0FBZ0I7UUFDL0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUYseUJBQXlCLEVBQVc7UUFDbEMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUUsbUNBQW1DO1FBQ3BELElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsc0JBQXNCLENBQUM7UUFDdkQsV0FBVyxJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN6RCxXQUFXLElBQUksb0lBQW9JLENBQUM7UUFDcEosV0FBVyxJQUFJLGlDQUFpQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLFdBQVcsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2hDLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxrQkFBa0IsRUFBVztRQUMzQixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFTO1lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDakMsQ0FBQyxFQUFFLFVBQVMsS0FBVTtZQUNwQixzQkFBc0I7WUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDO1FBQ0wsZ0JBQWdCLEVBQUU7WUFDaEIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFFRCxLQUFLLEVBQUUsVUFBUyxFQUFFO1lBQ2hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtnQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxVQUFVLEVBQUUsVUFBUyxXQUFXLEVBQUUsTUFBTTtZQUN2QyxxREFBcUQ7WUFDckQsMERBQTBEO1lBQzFELE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUVELFlBQVksRUFBRSxVQUFTLEVBQVU7WUFDL0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRywyQkFBMkIsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ25FLHVDQUF1QztnQkFDdkMsZUFBZTtnQkFDZixNQUFNO1lBQ1IsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDO1FBRUQsSUFBSSxFQUFFO1lBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRywrQkFBK0IsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFRCxPQUFPLEVBQUU7WUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBRUQsS0FBSyxFQUFFLFVBQVMsRUFBTyxFQUFFLFFBQWEsRUFBRSxPQUFZO1lBQ2xELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNkLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUMvQixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksSUFBSSxHQUFHLENBQUM7WUFDZCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQzdCLENBQUM7WUFDRCw0RUFBNEU7UUFDOUUsQ0FBQztRQUVELFdBQVcsRUFBRTtZQUNYLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcscUVBQXFFLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNySCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO2dCQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUNwRCxDQUFDLEVBQUU7Z0JBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQzs7QUM1RkwsSUFBTyxFQUFFLENBd0NSO0FBeENELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQXdDZDtJQXhDUyxXQUFBLEtBQUs7UUFBQyxJQUFBLFNBQVMsQ0F3Q3hCO1FBeENlLFdBQUEsU0FBUyxFQUFDLENBQUM7WUFDekIsWUFBWSxDQUFDO1lBRWI7Z0JBSUUsZUFBZTtnQkFDZixvQkFBb0IsTUFBVyxFQUFVLEtBQXNCLEVBQVUsRUFBZ0I7b0JBQXJFLFdBQU0sR0FBTixNQUFNLENBQUs7b0JBQVUsVUFBSyxHQUFMLEtBQUssQ0FBaUI7b0JBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBYztvQkFIakYsV0FBTSxHQUFRLElBQUksQ0FBQztnQkFJM0IsQ0FBQztnQkFFTSx5QkFBSSxHQUFYO29CQUFBLGlCQVdDO29CQVZDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLG9DQUFvQyxDQUFDO29CQUUxRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBUTs0QkFDL0MsS0FBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDOzRCQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQzt3QkFDbEIsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDeEIsQ0FBQztnQkFDSCxDQUFDO2dCQUVNLG1DQUFjLEdBQXJCLFVBQXNCLEtBQWE7b0JBQ2pDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMxQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEMsTUFBTSxDQUFDLFVBQVUsQ0FBQztvQkFDcEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDOUIsQ0FBQztnQkFDSCxDQUFDO2dCQUVPLDZCQUFRLEdBQWhCLFVBQWlCLEdBQVc7b0JBQzFCLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDN0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVMsR0FBVzt3QkFDL0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDbkUsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFDSCxpQkFBQztZQUFELENBcENBLEFBb0NDLElBQUE7WUFwQ1ksb0JBQVUsYUFvQ3RCLENBQUE7UUFDSCxDQUFDLEVBeENlLFNBQVMsR0FBVCxlQUFTLEtBQVQsZUFBUyxRQXdDeEI7SUFBRCxDQUFDLEVBeENTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQXdDZDtBQUFELENBQUMsRUF4Q00sRUFBRSxLQUFGLEVBQUUsUUF3Q1I7O0FDeENELHNDQUFzQztBQUN0QyxJQUFPLEVBQUUsQ0FTUjtBQVRELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVNkO0lBVFMsV0FBQSxLQUFLO1FBQUMsSUFBQSxTQUFTLENBU3hCO1FBVGUsV0FBQSxTQUFTLEVBQUMsQ0FBQztZQUN6QixZQUFZLENBQUM7WUFJYixPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQztpQkFFckMsT0FBTyxDQUFDLFlBQVksRUFBRSxVQUFDLE1BQVcsRUFBRSxLQUFzQixFQUFFLEVBQWdCLElBQUssT0FBQSxJQUFJLG9CQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBakMsQ0FBaUMsQ0FBQztpQkFDbkgsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDLEVBVGUsU0FBUyxHQUFULGVBQVMsS0FBVCxlQUFTLFFBU3hCO0lBQUQsQ0FBQyxFQVRTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQVNkO0FBQUQsQ0FBQyxFQVRNLEVBQUUsS0FBRixFQUFFLFFBU1I7O0FDVkQsaUNBQWlDO0FBQ2pDLElBQU8sRUFBRSxDQU1SO0FBTkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBTWQ7SUFOUyxXQUFBLEtBQUs7UUFBQyxJQUFBLElBQUksQ0FNbkI7UUFOZSxXQUFBLElBQUksRUFBQyxDQUFDO1lBQ3BCLFlBQVksQ0FBQztZQUViLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztpQkFFaEMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQU0sRUFBRSxLQUFLLElBQUssT0FBQSxVQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQyxDQUFDO1FBQzNFLENBQUMsRUFOZSxJQUFJLEdBQUosVUFBSSxLQUFKLFVBQUksUUFNbkI7SUFBRCxDQUFDLEVBTlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBTWQ7QUFBRCxDQUFDLEVBTk0sRUFBRSxLQUFGLEVBQUUsUUFNUiIsImZpbGUiOiJ2cy50b29sa2l0Lm1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgQ29uZmlnIHtcbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJGxvZ1Byb3ZpZGVyOiBuZy5JTG9nUHJvdmlkZXIpIHtcbiAgICAgIC8vIGVuYWJsZSBsb2dcbiAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQodHJ1ZSk7XG4gICAgICAvLyBzZXQgb3B0aW9ucyB0aGlyZC1wYXJ0eSBsaWJcbiAgICB9XG5cbiAgfVxufVxuIiwibW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBSdW5CbG9jayB7XG4gICAgLyoqIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKCRsb2c6IG5nLklMb2dTZXJ2aWNlKSB7XG4gICAgICAkbG9nLmRlYnVnKCdydW5CbG9jayBlbmQnKTtcbiAgICB9XG5cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5jb25maWcudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LnJ1bi50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBkZWNsYXJlIHZhciBjb25maWc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzJywgW10pXG4gICAgLmNvbmZpZyhDb25maWcpXG4gICAgLnJ1bihSdW5CbG9jaylcbiAgICAuY29uc3RhbnQoJ2NvbmZpZycsIGNvbmZpZyk7XG59XG4iLCJtb2R1bGUgdnMudG9vbHMuY2F0YWxvZyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuY2F0YWxvZycsIFtdKTtcbn1cbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cbmRlY2xhcmUgdmFyIGNvbmZpZztcblxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmNhdGFsb2cnKS5cblx0LyogQG5nSW5qZWN0ICovXG5cdGZhY3RvcnkoJ2NhdGFsb2dSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55LCAkcTogYW55KSB7XG5cblx0XHQndXNlIHN0cmljdCc7XG5cblx0XHR2YXIgdXJpID0gY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvaW5kZXgvY29uZmlnL2ZlZGVyYXRpb24uanNvbic7XG5cdFx0dmFyIGxvY2F0aW9ucyA9ICdhcGkvcmVzdC9pMThuL2ZpZWxkL2xvY2F0aW9uLmpzb24nO1xuXG5cdFx0ZnVuY3Rpb24gX2ZldGNoKCkge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCh1cmkpLnRoZW4oZnVuY3Rpb24gKHJlczogYW55KSB7XG5cdFx0XHRcdHJldHVybiByZXMuZGF0YS5zZXJ2ZXJzO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9sb2FkUmVtb3RlTG9jYXRpb25zKHBhcmFtczogYW55KSB7XG5cdFx0XHRyZXR1cm4gX2ZldGNoKCkudGhlbigoY2F0YWxvZ3M6IGFueSkgPT4ge1xuXHRcdFx0XHR2YXIgcHJvbWlzZXMgPSBbXTtcblx0XHRcdFx0Y2F0YWxvZ3MuZm9yRWFjaChjYXRhbG9nID0+IHtcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQoY2F0YWxvZy51cmwpKSB7XG5cdFx0XHRcdFx0XHR2YXIgdXJsID0gY2F0YWxvZy51cmwgKyBsb2NhdGlvbnM7XG5cdFx0XHRcdFx0XHR2YXIgY2F0YWxvZ1Byb21pc2UgPSAkaHR0cC5nZXQodXJsLCB7d2l0aENyZWRlbnRpYWxzOiBmYWxzZX0pLnRoZW4oKHJlc3BvbnNlOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRwcm9taXNlcy5wdXNoKGNhdGFsb2dQcm9taXNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0XHRcdHJldHVybiByZXM7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVycm9yOyAvLyBmYWlsdXJlIG1lYW5zIHRoZSByZW1vdGUgY2F0YWxvZ3MgYXJlIG9mZmxpbmUsIGFsbG93IHRvIGNvbnRpbnVlLCB0aGUgc2VhcmNoIHNob3VsZCBzaG93IGFuIGVycm9yXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZldGNoOiBfZmV0Y2gsXG5cdFx0XHRsb2FkUmVtb3RlTG9jYXRpb25zOiBfbG9hZFJlbW90ZUxvY2F0aW9uc1xuXHRcdH07XG5cdH0pO1xuIiwibW9kdWxlIHZzLnRvb2xzLnV0aWwge1xuICAndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0IGNsYXNzIFN1Z2FyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSkge31cblxuXHRcdHB1YmxpYyBzdGF0aWMgaXNTdHJpbmcodmFsOiBhbnkpIHtcblx0XHRcdHJldHVybiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsIGluc3RhbmNlb2YgU3RyaW5nKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgZ2V0SW5zdGFuY2UoY29uZmlnOiBhbnksICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIDogU3VnYXIge1xuXHRcdFx0cmV0dXJuIG5ldyBTdWdhcihjb25maWcsICRodHRwKTtcblx0XHR9XG5cblx0XHR0b01hcChrZXk6IGFueSwgYXJyYXk6IGFueSkge1xuXHRcdFx0dmFyIG1hcCA9IHt9O1xuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0XHRtYXBbdmFsdWVba2V5XV0gPSB2YWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9XG5cblx0XHR0b1N0cmluZ01hcChhcnJheTogYW55KSB7XG5cdFx0XHR2YXIgbWFwID0ge307XG5cdFx0XHRhcnJheS5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB7XG5cdFx0XHRcdG1hcFt2YWx1ZV0gPSB2YWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9XG5cbiAgICBwbHVjayhhcnJheTogYW55LCBuYW1lOiBzdHJpbmcsIGZuPzogRnVuY3Rpb24pIHtcbiAgICAgIHZhciBmbCA9IFtdO1xuICAgICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZTogYW55KXtcbiAgICAgICAgaWYgKGZuICYmIGZuKHZhbHVlKSkge1xuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xuICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZm4pKSB7XG4gICAgICAgICAgZmwucHVzaCh2YWx1ZVtuYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZsO1xuICAgIH1cblxuICAgIHBvc3RGb3JtKHVybDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICAgIHZhciBzZXJ2aWNlID0gdGhpcy5jb25maWcucm9vdCArIHVybDtcbiAgICAgIHJldHVybiB0aGlzLiRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVybDogc2VydmljZSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBhcnNlUXVlcnlTdHJpbmcocXVlcnlTdHJpbmc6IHN0cmluZykge1xuICAgICAgdmFyIHBhaXJzID0gcXVlcnlTdHJpbmcuc2xpY2UoMSkuc3BsaXQoJyYnKTtcbiAgICAgIHZhciByZXN1bHQgPSB7fSwgcztcbiAgICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24ocGFpcikge1xuICAgICAgICBzID0gcGFpci5zcGxpdCgnPScpO1xuICAgICAgICByZXN1bHRbc1swXV0gPSBkZWNvZGVVUklDb21wb25lbnQoc1sxXSB8fCAnJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgIH1cblxuICAgIHBvc3RKc29uKHJlcXVlc3QsIGFwaSwgYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0LycgKyBhcGkgICsgJy8nICsgYWN0aW9uICsgJy5qc29uJyxcbiAgICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICB9KTtcbiAgICB9XG5cdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3V0aWwvc3VnYXIudHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcbid1c2Ugc3RyaWN0JztcblxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0ZmV0Y2goZmllbGRzPzogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzKHF1ZXJ5OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEZpZWxkc1Jlc291cmNlIGltcGxlbWVudHMgSUZpZWxkc1Jlc291cmNlIHtcblx0XHRzdGF0aWMgcmVmTmFtZSA9ICdmaWVsZHNSZXNvdXJjZSc7XG5cblx0XHRmZXRjaDogKHByb3BlcnRpZXM/OiBzdHJpbmcpID0+IGFueTtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzOiAocXVlcnk6IHN0cmluZykgPT4gYW55O1xuXG5cdFx0LyogQG5nSW5qZWN0ICovXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzdWdhcjogYW55KSB7XG5cbiAgICAgIHRoaXMuZmV0Y2ggPSAoZmllbGRzPzogYW55KSA9PiB7XG4gICAgICAgIHZhciBmbCA9IChmaWVsZHMgfHwgJ25hbWUsc3R5cGUsY2F0ZWdvcnksZG9jcyxkaXNwX2VuLHNvcnRhYmxlLGZpbHRlcmFibGUsdGFibGVhYmxlLGRpc3BsYXlhYmxlLGVkaXRhYmxlJyk7XG4gICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci9maWVsZHMvc2VsZWN0JywgdGhpcy5nZXRGaWVsZHNQYXJhbXMoZmwpKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgIHJldHVybiByZXMuZGF0YS5yZXNwb25zZS5kb2NzO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cblx0XHRcdHRoaXMuZmV0Y2hIeWRyYXRpb25TdGF0cyA9IChxdWVyeTogc3RyaW5nKSA9PiB7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2goKS50aGVuKChmaWVsZHM6IEFycmF5PGFueT4pID0+IHtcbiAgICAgICAgICB2YXIgZmwgPSBzdWdhci5wbHVjayhmaWVsZHMsICduYW1lJywgZnVuY3Rpb24oZmllbGQpIHsgcmV0dXJuIGZpZWxkLm5hbWUuaW5kZXhPZignXycpICE9PSAwICYmIGZpZWxkLmRvY3MgPiAwOyB9KTtcblxuICAgICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci92MC9zZWxlY3Q/JyArIHF1ZXJ5LCB0aGlzLmdldFN0YXRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHZhciBzdGF0c0ZpZWxkcyA9IHJlcy5kYXRhLmZhY2V0X2NvdW50cy5mYWNldF9maWVsZHM7XG4gICAgICAgICAgICB2YXIgdG90YWwgPSByZXMuZGF0YS5yZXNwb25zZS5udW1Gb3VuZDtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpO1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblx0XHRcdH07XG5cblx0XHR9XG5cbiAgICBwcml2YXRlIGdldEZpZWxkc1BhcmFtcyhmbCkge1xuICAgICAgcmV0dXJuICdxPSo6KiZmbD0nICsgZmwgKyAnJnJvd3M9MTAwMDAmc29ydD1uYW1lJTIwYXNjJnd0PWpzb24nO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBnZXRTdGF0c1BhcmFtcyhmbCkge1xuICAgICAgcmV0dXJuICdmYWNldD10cnVlJmZhY2V0LmxpbWl0PTEwMDAwJmZhY2V0Lm1pbmNvdW50PTEwMCZyb3dzPTAmd3Q9anNvbiZmYWNldC5maWVsZD0nICsgZmwuam9pbignJmZhY2V0LmZpZWxkPScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXBwbHlIeWRyYXRpb24oc3RhdHNGaWVsZHMsIGZpZWxkcywgdG90YWwpIHtcbiAgICAgIHZhciBzdGF0c0ZpZWxkLCBjb3VudDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0YXRzRmllbGQgPSBzdGF0c0ZpZWxkc1tmaWVsZHNbaV0ubmFtZV07XG4gICAgICAgIGlmIChzdGF0c0ZpZWxkICYmIHN0YXRzRmllbGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkc1tpXS5pZCA9IGZpZWxkc1tpXS5uYW1lO1xuICAgICAgICAgIGNvdW50ID0gdGhpcy5nZXRDb3VudChzdGF0c0ZpZWxkKTtcbiAgICAgICAgICBmaWVsZHNbaV0uaHlkcmF0aW9uID0gY291bnQgLyB0b3RhbCAqIDEwMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb3VudChmaWVsZCkge1xuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZmllbGQubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgY291bnQgKz0gZmllbGRbaV07XG4gICAgICB9XG4gICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuXG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZmllbGRzLnJlc291cmNlLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzLmZpZWxkcyB7XG4ndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmZpZWxkcycsIFsndnMudG9vbHMudXRpbCddKVxuXHRcdC5zZXJ2aWNlKEZpZWxkc1Jlc291cmNlLnJlZk5hbWUsIEZpZWxkc1Jlc291cmNlKTtcblxufVxuIiwibW9kdWxlIHZzLnRvb2xzLmRpc3BsYXlDb25maWcge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnLCBbXSk7XG59XG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXG5kZWNsYXJlIHZhciBjb25maWc7XG5cbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5kaXNwbGF5Q29uZmlnJykuXG5cdC8qIEBuZ0luamVjdCAqL1xuXHRmYWN0b3J5KCdkaXNwbGF5Q29uZmlnUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSkge1xuXG5cdFx0J3VzZSBzdHJpY3QnO1xuXG5cdFx0dmFyIGNvbmZpZ1VyaSA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvY29uZmlnLyc7XG5cblx0XHRmdW5jdGlvbiBfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkge1xuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgJ2xpc3QnO1xuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9nZXRDb25maWdRdWVyeVN0cmluZyhpZDogc3RyaW5nKSB7XG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyBpZDtcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRMaXN0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX2dldERpc3BsYXlDb25maWcoaWQ6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZTogYW55KSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChjb25maWdVcmksIHRlbXBsYXRlKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWdMaXN0KCk7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWcoaWQpO1xuXHRcdFx0fSxcblx0XHRcdGRlbGV0ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuIF9kZWxldGVEaXNwbGF5Q29uZmlnKGlkKTtcblx0XHRcdH0sXG5cdFx0XHRzYXZlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24odGVtcGxhdGU6IGFueSl7XG5cdFx0XHRcdHJldHVybiBfc2F2ZURpc3BsYXlDb25maWcodGVtcGxhdGUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuIiwibW9kdWxlIHZzLnRvb2xzLmZpbHRlcnMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmZpbHRlcnMnLCBbXSlcbiAgICAuZmlsdGVyKCdyZXBsYWNlU3RyaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oaGF5U3RhY2s6IHN0cmluZywgb2xkTmVlZGxlOiBzdHJpbmcsIG5ld05lZWRsZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBoYXlTdGFjay5yZXBsYWNlKG5ldyBSZWdFeHAob2xkTmVlZGxlLCAnZycpLCBuZXdOZWVkbGUpO1xuICAgICAgfTtcbiAgICB9KTtcbiB9XG4iLCJtb2R1bGUgdnMudG9vbHMuc2F2ZWRTZWFyY2gge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnNhdmVkU2VhcmNoJywgWyd2cy50b29scy51dGlsJ10pO1xufVxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnKS5cblx0LyogQG5nSW5qZWN0ICovXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSwgc3VnYXIpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgICBmdW5jdGlvbiBfZG9TYXZlKHNhdmVkU2VhcmNoOiBhbnkpIHtcbiAgICAgICByZXR1cm4gc3VnYXIucG9zdEpzb24oc2F2ZWRTZWFyY2gsICdkaXNwbGF5JywgJ3NzZWFyY2gnKTtcbiAgICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5U3RyaW5nKGlkPzogc3RyaW5nKSB7XG4gICAgICB2YXIgcm93cyA9IDE1MDsgIC8vIEBUT0RPIHNldCB0byB3aGF0IHdlIHJlYWxseSB3YW50XG4gICAgICB2YXIgcXVlcnlTdHJpbmcgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0Pyc7XG4gICAgICBxdWVyeVN0cmluZyArPSAncm93cz0nICsgcm93cyArICcmcmFuZD0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZmw9aWQsdGl0bGUsZGVzY3JpcHRpb24sb3duZXIscGF0aCxzaGFyZSxxdWVyeSxjb25maWcsb3JkZXIsc2F2ZWQscHJpdmF0ZSx2aWV3LF92ZXJzaW9uXyxjb25maWdfdGl0bGU6W2NvbmZpZ1RpdGxlXSxwYXJhbSosbGFiZWxzJztcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmd3Q9anNvbiZqc29uLndyZj1KU09OX0NBTExCQUNLJztcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChpZCkpIHtcbiAgICAgICAgcXVlcnlTdHJpbmcgKz0gJyZmcT1pZDonICsgaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcXVlcnlTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2V4ZWN1dGUoaWQ/OiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiAkaHR0cC5qc29ucChfZ2V0UXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YS5yZXNwb25zZS5kb2NzO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNhdmVkU2VhcmNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIGZldGNoOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoaWQpLnRoZW4oZnVuY3Rpb24oZG9jcykge1xuICAgICAgICAgIHJldHVybiBkb2NzWzBdO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHNhdmVTZWFyY2g6IGZ1bmN0aW9uKHNhdmVkU2VhcmNoLCBwYXJhbXMpIHtcbiAgICAgICAvLyAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xuICAgICAgIC8vICBzYXZlZFNlYXJjaC5xdWVyeSA9IGNvbnZlcnRlci50b0NsYXNzaWNQYXJhbXMocGFyYW1zKTtcbiAgICAgICByZXR1cm4gX2RvU2F2ZShzYXZlZFNlYXJjaCk7XG4gICAgICB9LFxuXG4gICAgICBkZWxldGVTZWFyY2g6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgLy8gb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgIC8vICAgZW50cnkoaWQpO1xuICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgd2lwZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9zc2VhcmNoL3dpcGUnKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlc3RvcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvcmVzdG9yZScsICcnKTtcbiAgICAgIH0sXG5cbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZDogYW55LCBiZWZvcmVJZDogYW55LCBhZnRlcklkOiBhbnkpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYgKGJlZm9yZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYmVmb3JlPScgKyBiZWZvcmVJZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YSAhPT0gJycpIHtcbiAgICAgICAgICBkYXRhICs9ICcmJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZnRlcklkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYWZ0ZXI9JyArIGFmdGVySWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xuICAgICAgfSxcblxuICAgICAgZmV0Y2hMYWJlbHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdXJsID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD9yb3dzPTAmZmFjZXQ9dHJ1ZSZmYWNldC5maWVsZD1sYWJlbHMmd3Q9anNvbiZyPScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCh1cmwpLnRoZW4oZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICAgIHJldHVybiByZXNwLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcy5sYWJlbHM7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkgeyAgLy8gZXJyb3IgaWYgbGFiZWxzIGZpZWxkIGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwibW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgVHJhbnNsYXRvciB7XG5cbiAgICBwcml2YXRlIGZpZWxkczogYW55ID0gbnVsbDtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgcHJpdmF0ZSAkcTogbmcuSVFTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWQoKSB7XG4gICAgICB2YXIgcmVzb3VyY2VVcmwgPSB0aGlzLmNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2kxOG4vZmllbGRzL3N0YW5kYXJkLmpzb24nO1xuXG4gICAgICBpZiAoIXRoaXMuZmllbGRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldChyZXNvdXJjZVVybCkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmZpZWxkcyA9IHJlcy5kYXRhO1xuICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4kcS53aGVuKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHRyYW5zbGF0ZUZpZWxkKGZpZWxkOiBzdHJpbmcpIHtcbiAgICAgIHZhciB0cmFuc2xhdGVkID0gdGhpcy5maWVsZHMuRklFTERbZmllbGRdO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRyYW5zbGF0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkoZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xhc3NpZnkoc3RyOiBzdHJpbmcpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyYW5zbGF0b3IudHNcIiAvPlxubW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBkZWNsYXJlIHZhciBjb25maWc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnRyYW5zbGF0ZScsIFtdKVxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIC5mYWN0b3J5KCd0cmFuc2xhdG9yJywgKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlKSA9PiBuZXcgVHJhbnNsYXRvcihjb25maWcsICRodHRwLCAkcSkpXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1Z2FyLnRzXCIgLz5cbm1vZHVsZSB2cy50b29scy51dGlsIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy51dGlsJywgW10pXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgLmZhY3RvcnkoJ3N1Z2FyJywgKGNvbmZpZywgJGh0dHApID0+IFN1Z2FyLmdldEluc3RhbmNlKGNvbmZpZywgJGh0dHApKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
//# sourceMappingURL=maps/vs.toolkit.src.js.map