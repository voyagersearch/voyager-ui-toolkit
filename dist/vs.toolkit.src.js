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

/// <reference path="../../.tmp/typings/tsd.d.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var fields;
        (function (fields_1) {
            'use strict';
            var FieldsResource = (function () {
                /* @ngInject */
                function FieldsResource($http) {
                    var _this = this;
                    this.$http = $http;
                    this.fetch = function (properties) {
                        var fl = (properties || 'name,category,docs,disp_en');
                        return _this.$http
                            .jsonp(config.root +
                            'solr/fields/select?q=*:*&fl={FIELDS}&sort=name%20asc&wt=json&rows=10000&json.wrf=JSON_CALLBACK'.replace('{FIELDS}', fl))
                            .then(function (res) {
                            return res.data.response.docs;
                        }.bind(_this));
                    };
                    this.gettingHydrationStats = function (query) {
                        // http://voyagerdemo.com/daily/solr/v0/select?q=id:+[S1520D948770]&wt=json&stats=true&rows=10
                        // q: 'id:+[' + savedSearchId + ']',
                        return _this.fetch()
                            .then(function (fields) {
                            var fl = [];
                            fields.forEach(function (value) {
                                if (value.docs) {
                                    fl.push(value.name);
                                }
                            });
                            var data = {
                                params: {
                                    stats: true,
                                    'stats.field': fl,
                                    wt: 'json'
                                }
                            };
                            return this.$http.post(config.root + 'solr/v0/select?rows=1&' + query, data, {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            })
                                .then(function (res) {
                                for (var key in res.data.stats.stats_fields) {
                                    if (res.data.stats.stats_fields.hasOwnProperty(key)) {
                                        for (var i = 0; i < fields.length; i++) {
                                            if (fields[i].name === key) {
                                                fields[i].id = key;
                                                fields[i].hydration = res.data.stats.stats_fields[key].count / (res.data.stats.stats_fields[key].count + res.data.stats.stats_fields[key].missing) * 100;
                                                break;
                                            }
                                            ;
                                        }
                                    }
                                }
                                return fields;
                            }.bind(this));
                        }.bind(_this));
                    };
                }
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
            angular.module('vs.tools.fields', [])
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
        var pageConfig;
        (function (pageConfig) {
            'use strict';
            angular.module('vs.tools.pageConfig', []);
        })(pageConfig = tools.pageConfig || (tools.pageConfig = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.pageConfig').
    /* @ngInject */
    factory('pageConfigResource', function ($http) {
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

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var savedSearch;
        (function (savedSearch) {
            'use strict';
            angular.module('vs.tools.savedSearch', []);
        })(savedSearch = tools.savedSearch || (tools.savedSearch = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.savedSearch').
    /* @ngInject */
    factory('savedSearchResource', function ($http) {
    'use strict';
    // function _doSave(request: any) {
    //   request.query += '/disp=' + request.config;
    //   request.path = request.query;
    //   // return sugar.postJson(request, 'display', 'ssearch');
    // }
    function _getQueryString() {
        var rows = 150; // @TODO set to what we really want
        var queryString = config.root + 'solr/ssearch/select?';
        queryString += 'rows=' + rows + '&rand=' + Math.random();
        queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle]';
        queryString += '&wt=json&json.wrf=JSON_CALLBACK';
        return queryString;
    }
    function _execute() {
        return $http.jsonp(_getQueryString()).then(function (data) {
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
        // saveSearch: function(savedSearch, params) {
        //   savedSearch.config = configService.getConfigId();
        //   savedSearch.query = converter.toClassicParams(params);
        //   return _doSave(savedSearch);
        // },
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImZpZWxkcy9maWVsZHMucmVzb3VyY2UudHMiLCJmaWVsZHMvZmllbGRzLm1vZHVsZS50cyIsImZpbHRlcnMvZmlsdGVycy50cyIsInBhZ2UtY29uZmlnL3BhZ2UtY29uZmlnLW1vZHVsZS50cyIsInBhZ2UtY29uZmlnL3BhZ2UtY29uZmlnLXJlc291cmNlLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0b3IudHMiLCJ0cmFuc2xhdGUvdHJhbnNsYXRlLm1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZC1zZWFyY2gtbW9kdWxlLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkU2VhcmNoLnJlc291cmNlLnRzIl0sIm5hbWVzIjpbInZzIiwidnMudG9vbHMiLCJ2cy50b29scy5Db25maWciLCJ2cy50b29scy5Db25maWcuY29uc3RydWN0b3IiLCJ2cy50b29scy5SdW5CbG9jayIsInZzLnRvb2xzLlJ1bkJsb2NrLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZmllbGRzIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZmlsdGVycyIsInZzLnRvb2xzLnBhZ2VDb25maWciLCJfZ2V0TGlzdFF1ZXJ5U3RyaW5nIiwiX2dldENvbmZpZ1F1ZXJ5U3RyaW5nIiwiX2dldFBhZ2VDb25maWdMaXN0IiwiX2dldFBhZ2VDb25maWciLCJfZGVsZXRlUGFnZUNvbmZpZyIsIl9zYXZlUGFnZUNvbmZpZyIsInZzLnRvb2xzLnRyYW5zbGF0ZSIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IuY29uc3RydWN0b3IiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5sb2FkIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IudHJhbnNsYXRlRmllbGQiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5jbGFzc2lmeSIsInZzLnRvb2xzLnNhdmVkU2VhcmNoIiwiX2dldFF1ZXJ5U3RyaW5nIiwiX2V4ZWN1dGUiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sRUFBRSxDQVlSO0FBWkQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLEtBQUtBLENBWWRBO0lBWlNBLFdBQUFBLEtBQUtBLEVBQUNBLENBQUNBO1FBQ2ZDLFlBQVlBLENBQUNBO1FBRWJBO1lBQ0VDLGdCQUFnQkE7WUFDaEJBLGdCQUFZQSxZQUE2QkE7Z0JBQ3ZDQyxhQUFhQTtnQkFDYkEsWUFBWUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hDQSw4QkFBOEJBO1lBQ2hDQSxDQUFDQTtZQUVIRCxhQUFDQTtRQUFEQSxDQVJBRCxBQVFDQyxJQUFBRDtRQVJZQSxZQUFNQSxTQVFsQkEsQ0FBQUE7SUFDSEEsQ0FBQ0EsRUFaU0QsS0FBS0EsR0FBTEEsUUFBS0EsS0FBTEEsUUFBS0EsUUFZZEE7QUFBREEsQ0FBQ0EsRUFaTSxFQUFFLEtBQUYsRUFBRSxRQVlSOztBQ1pELElBQU8sRUFBRSxDQVVSO0FBVkQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLEtBQUtBLENBVWRBO0lBVlNBLFdBQUFBLEtBQUtBLEVBQUNBLENBQUNBO1FBQ2ZDLFlBQVlBLENBQUNBO1FBRWJBO1lBQ0VHLGdCQUFnQkE7WUFDaEJBLGtCQUFZQSxJQUFvQkE7Z0JBQzlCQyxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtZQUM3QkEsQ0FBQ0E7WUFFSEQsZUFBQ0E7UUFBREEsQ0FOQUgsQUFNQ0csSUFBQUg7UUFOWUEsY0FBUUEsV0FNcEJBLENBQUFBO0lBQ0hBLENBQUNBLEVBVlNELEtBQUtBLEdBQUxBLFFBQUtBLEtBQUxBLFFBQUtBLFFBVWRBO0FBQURBLENBQUNBLEVBVk0sRUFBRSxLQUFGLEVBQUUsUUFVUjs7QUNWRCxpREFBaUQ7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LElBQUksQ0FBQztnQkFDbkUsdUNBQXVDO2dCQUN2QyxlQUFlO2dCQUNmLE1BQU07WUFDUixDQUFDLENBQUMsQ0FBQztRQUNULENBQUM7UUFFRCxLQUFLLEVBQUUsVUFBUyxFQUFPLEVBQUUsUUFBYSxFQUFFLE9BQVk7WUFDbEQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQy9CLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxJQUFJLEdBQUcsQ0FBQztZQUNkLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDN0IsQ0FBQztZQUNELDRFQUE0RTtRQUM5RSxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InZzLnRvb2xraXQubWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBDb25maWcge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nUHJvdmlkZXI6IG5nLklMb2dQcm92aWRlcikge1xuICAgICAgLy8gZW5hYmxlIGxvZ1xuICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCh0cnVlKTtcbiAgICAgIC8vIHNldCBvcHRpb25zIHRoaXJkLXBhcnR5IGxpYlxuICAgIH1cblxuICB9XG59XG4iLCJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIFJ1bkJsb2NrIHtcbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJGxvZzogbmcuSUxvZ1NlcnZpY2UpIHtcbiAgICAgICRsb2cuZGVidWcoJ3J1bkJsb2NrIGVuZCcpO1xuICAgIH1cblxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LmNvbmZpZy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXgucnVuLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMnLCBbXSlcbiAgICAuY29uZmlnKENvbmZpZylcbiAgICAucnVuKFJ1bkJsb2NrKVxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcbid1c2Ugc3RyaWN0JztcblxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0ZmV0Y2goZmllbGRzPzogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0XHRnZXR0aW5nSHlkcmF0aW9uU3RhdHMocXVlcnk6IHN0cmluZyk6IG5nLklQcm9taXNlPGFueT47XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgRmllbGRzUmVzb3VyY2UgaW1wbGVtZW50cyBJRmllbGRzUmVzb3VyY2Uge1xuXHRcdHN0YXRpYyByZWZOYW1lID0gJ2ZpZWxkc1Jlc291cmNlJztcblxuXHRcdGZldGNoOiAocHJvcGVydGllcz86IHN0cmluZykgPT4gYW55O1xuXHRcdGdldHRpbmdIeWRyYXRpb25TdGF0czogKHF1ZXJ5OiBzdHJpbmcpID0+IG5nLklQcm9taXNlPGFueT47XG5cblx0XHQvKiBAbmdJbmplY3QgKi9cblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIHtcblxuXHRcdFx0dGhpcy5mZXRjaCA9IChwcm9wZXJ0aWVzPzogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdHZhciBmbCA9IChwcm9wZXJ0aWVzIHx8ICduYW1lLGNhdGVnb3J5LGRvY3MsZGlzcF9lbicpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4kaHR0cFxuXHRcdFx0XHRcdC5qc29ucChjb25maWcucm9vdCArXG5cdFx0XHRcdFx0XHQnc29sci9maWVsZHMvc2VsZWN0P3E9KjoqJmZsPXtGSUVMRFN9JnNvcnQ9bmFtZSUyMGFzYyZ3dD1qc29uJnJvd3M9MTAwMDAmanNvbi53cmY9SlNPTl9DQUxMQkFDSycucmVwbGFjZSgne0ZJRUxEU30nLCBmbCkpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24ocmVzOiBhbnkpIHtcblx0XHRcdFx0XHRcdHJldHVybiByZXMuZGF0YS5yZXNwb25zZS5kb2NzO1xuXHRcdFx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmdldHRpbmdIeWRyYXRpb25TdGF0cyA9IChxdWVyeTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdC8vIGh0dHA6Ly92b3lhZ2VyZGVtby5jb20vZGFpbHkvc29sci92MC9zZWxlY3Q/cT1pZDorW1MxNTIwRDk0ODc3MF0md3Q9anNvbiZzdGF0cz10cnVlJnJvd3M9MTBcblx0XHRcdFx0Ly8gcTogJ2lkOitbJyArIHNhdmVkU2VhcmNoSWQgKyAnXScsXG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuZmV0Y2goKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKGZpZWxkczogQXJyYXk8YW55Pikge1xuXHRcdFx0XHRcdFx0dmFyIGZsID0gW107XG5cdFx0XHRcdFx0XHRmaWVsZHMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZTogYW55KXtcblx0XHRcdFx0XHRcdFx0aWYgKHZhbHVlLmRvY3MpIHtcblx0XHRcdFx0XHRcdFx0XHRmbC5wdXNoKHZhbHVlLm5hbWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdFx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRcdFx0XHRcdHN0YXRzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdCdzdGF0cy5maWVsZCc6IGZsLFxuXHRcdFx0XHRcdFx0XHRcdHd0OiAnanNvbidcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuJGh0dHAucG9zdChcblx0XHRcdFx0XHRcdFx0Y29uZmlnLnJvb3QgKyAnc29sci92MC9zZWxlY3Q/cm93cz0xJicgKyBxdWVyeSxcblx0XHRcdFx0XHRcdFx0ZGF0YSwge1xuXHRcdFx0XHRcdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04J1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHQudGhlbihmdW5jdGlvbihyZXM6IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiByZXMuZGF0YS5zdGF0cy5zdGF0c19maWVsZHMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZXMuZGF0YS5zdGF0cy5zdGF0c19maWVsZHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChmaWVsZHNbaV0ubmFtZSA9PT0ga2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWVsZHNbaV0uaWQgPSBrZXk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWVsZHNbaV0uaHlkcmF0aW9uID0gcmVzLmRhdGEuc3RhdHMuc3RhdHNfZmllbGRzW2tleV0uY291bnQgLyAocmVzLmRhdGEuc3RhdHMuc3RhdHNfZmllbGRzW2tleV0uY291bnQgKyByZXMuZGF0YS5zdGF0cy5zdGF0c19maWVsZHNba2V5XS5taXNzaW5nKSAqIDEwMDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZpZWxkcztcblx0XHRcdFx0XHRcdFx0fS5iaW5kKHRoaXMpKTtcblxuXHRcdFx0XHRcdH0uYmluZCh0aGlzKSk7XG5cblx0XHRcdH07XG5cblx0XHR9XG5cblx0fVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9maWVsZHMucmVzb3VyY2UudHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcbid1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmllbGRzJywgW10pXG5cdFx0LnNlcnZpY2UoRmllbGRzUmVzb3VyY2UucmVmTmFtZSwgRmllbGRzUmVzb3VyY2UpO1xuXG59XG4iLCJtb2R1bGUgdnMudG9vbHMuZmlsdGVycyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmlsdGVycycsIFtdKVxuICAgIC5maWx0ZXIoJ3JlcGxhY2VTdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihoYXlTdGFjazogc3RyaW5nLCBvbGROZWVkbGU6IHN0cmluZywgbmV3TmVlZGxlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGhheVN0YWNrLnJlcGxhY2Uob2xkTmVlZGxlLCBuZXdOZWVkbGUpO1xuICAgICAgfTtcbiAgICB9KTtcbiB9XG4iLCJtb2R1bGUgdnMudG9vbHMucGFnZUNvbmZpZyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMucGFnZUNvbmZpZycsIFtdKTtcbn1cbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cbmRlY2xhcmUgdmFyIGNvbmZpZztcblxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnBhZ2VDb25maWcnKS5cblx0LyogQG5nSW5qZWN0ICovXG5cdGZhY3RvcnkoJ3BhZ2VDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XG5cblx0XHQndXNlIHN0cmljdCc7XG5cblx0XHR2YXIgY29uZmlnVXJpID0gY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9jb25maWcvJztcblxuXHRcdGZ1bmN0aW9uIF9nZXRMaXN0UXVlcnlTdHJpbmcoKSB7XG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyAnbGlzdCc7XG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkOiBzdHJpbmcpIHtcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArIGlkO1xuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9nZXRQYWdlQ29uZmlnTGlzdCgpIHtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldExpc3RRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZ2V0UGFnZUNvbmZpZyhpZDogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9kZWxldGVQYWdlQ29uZmlnKGlkOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX3NhdmVQYWdlQ29uZmlnKHRlbXBsYXRlOiBhbnkpIHtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KGNvbmZpZ1VyaSwgdGVtcGxhdGUpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRnZXRQYWdlQ29uZmlnczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBfZ2V0UGFnZUNvbmZpZ0xpc3QoKTtcblx0XHRcdH0sXG5cdFx0XHRnZXRQYWdlQ29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiBfZ2V0UGFnZUNvbmZpZyhpZCk7XG5cdFx0XHR9LFxuXHRcdFx0ZGVsZXRlUGFnZUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gX2RlbGV0ZVBhZ2VDb25maWcoaWQpO1xuXHRcdFx0fSxcblx0XHRcdHNhdmVQYWdlQ29uZmlnOiBmdW5jdGlvbih0ZW1wbGF0ZTogYW55KXtcblx0XHRcdFx0cmV0dXJuIF9zYXZlUGFnZUNvbmZpZyh0ZW1wbGF0ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG4iLCJtb2R1bGUgdnMudG9vbHMudHJhbnNsYXRlIHtcblxuICBleHBvcnQgY2xhc3MgVHJhbnNsYXRvciB7XG5cbiAgICBwcml2YXRlIGZpZWxkczogYW55ID0gbnVsbDtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgcHJpdmF0ZSAkcTogbmcuSVFTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWQoKSB7XG4gICAgICB2YXIgcmVzb3VyY2VVcmwgPSB0aGlzLmNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2kxOG4vZmllbGRzL3N0YW5kYXJkLmpzb24nO1xuXG4gICAgICBpZiAoIXRoaXMuZmllbGRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldChyZXNvdXJjZVVybCkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmZpZWxkcyA9IHJlcy5kYXRhO1xuICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4kcS53aGVuKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHRyYW5zbGF0ZUZpZWxkKGZpZWxkOiBzdHJpbmcpIHtcbiAgICAgIHZhciB0cmFuc2xhdGVkID0gdGhpcy5maWVsZHMuRklFTERbZmllbGRdO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRyYW5zbGF0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkoZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xhc3NpZnkoc3RyOiBzdHJpbmcpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyYW5zbGF0b3IudHNcIiAvPlxubW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBkZWNsYXJlIHZhciBjb25maWc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnRyYW5zbGF0ZScsIFtdKVxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIC5mYWN0b3J5KCd0cmFuc2xhdG9yJywgKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlKSA9PiBuZXcgVHJhbnNsYXRvcihjb25maWcsICRodHRwLCAkcSkpXG4gICAgLmNvbnN0YW50KCdjb25maWcnLCBjb25maWcpO1xufVxuIiwibW9kdWxlIHZzLnRvb2xzLnNhdmVkU2VhcmNoIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcsIFtdKTtcbn1cbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cbmRlY2xhcmUgdmFyIGNvbmZpZztcblxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnNhdmVkU2VhcmNoJykuXG5cdC8qIEBuZ0luamVjdCAqL1xuICBmYWN0b3J5KCdzYXZlZFNlYXJjaFJlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnkpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIGZ1bmN0aW9uIF9kb1NhdmUocmVxdWVzdDogYW55KSB7XG4gICAgLy8gICByZXF1ZXN0LnF1ZXJ5ICs9ICcvZGlzcD0nICsgcmVxdWVzdC5jb25maWc7XG4gICAgLy8gICByZXF1ZXN0LnBhdGggPSByZXF1ZXN0LnF1ZXJ5O1xuICAgIC8vICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RKc29uKHJlcXVlc3QsICdkaXNwbGF5JywgJ3NzZWFyY2gnKTtcbiAgICAvLyB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlTdHJpbmcoKSB7XG4gICAgICB2YXIgcm93cyA9IDE1MDsgIC8vIEBUT0RPIHNldCB0byB3aGF0IHdlIHJlYWxseSB3YW50XG4gICAgICB2YXIgcXVlcnlTdHJpbmcgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0Pyc7XG4gICAgICBxdWVyeVN0cmluZyArPSAncm93cz0nICsgcm93cyArICcmcmFuZD0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZmw9aWQsdGl0bGUsZGVzY3JpcHRpb24sb3duZXIscGF0aCxzaGFyZSxxdWVyeSxjb25maWcsb3JkZXIsc2F2ZWQscHJpdmF0ZSx2aWV3LF92ZXJzaW9uXyxjb25maWdfdGl0bGU6W2NvbmZpZ1RpdGxlXSc7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJnd0PWpzb24manNvbi53cmY9SlNPTl9DQUxMQkFDSyc7XG4gICAgICByZXR1cm4gcXVlcnlTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2V4ZWN1dGUoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuanNvbnAoX2dldFF1ZXJ5U3RyaW5nKCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuICAgICAgICByZXR1cm4gZGF0YS5kYXRhLnJlc3BvbnNlLmRvY3M7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG4gICAgICAgIC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2F2ZWRTZWFyY2hlczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfZXhlY3V0ZSgpO1xuICAgICAgfSxcblxuICAgICAgLy8gc2F2ZVNlYXJjaDogZnVuY3Rpb24oc2F2ZWRTZWFyY2gsIHBhcmFtcykge1xuICAgICAgLy8gICBzYXZlZFNlYXJjaC5jb25maWcgPSBjb25maWdTZXJ2aWNlLmdldENvbmZpZ0lkKCk7XG4gICAgICAvLyAgIHNhdmVkU2VhcmNoLnF1ZXJ5ID0gY29udmVydGVyLnRvQ2xhc3NpY1BhcmFtcyhwYXJhbXMpO1xuICAgICAgLy8gICByZXR1cm4gX2RvU2F2ZShzYXZlZFNlYXJjaCk7XG4gICAgICAvLyB9LFxuXG4gICAgICBkZWxldGVTZWFyY2g6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgLy8gb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgIC8vICAgZW50cnkoaWQpO1xuICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgb3JkZXI6IGZ1bmN0aW9uKGlkOiBhbnksIGJlZm9yZUlkOiBhbnksIGFmdGVySWQ6IGFueSkge1xuICAgICAgICB2YXIgZGF0YSA9ICcnO1xuICAgICAgICBpZiAoYmVmb3JlSWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdiZWZvcmU9JyArIGJlZm9yZUlkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhICE9PSAnJykge1xuICAgICAgICAgIGRhdGEgKz0gJyYnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFmdGVySWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdhZnRlcj0nICsgYWZ0ZXJJZDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ2FwaS9yZXN0L2Rpc3BsYXkvc3NlYXJjaC8nICsgaWQgKyAnL29yZGVyJywgZGF0YSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
//# sourceMappingURL=maps/vs.toolkit.src.js.map