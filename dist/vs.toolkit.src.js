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
            .run(tools.RunBlock);
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
    // function _doSave(request) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImZpbHRlcnMvZmlsdGVycy50cyIsInBhZ2UtY29uZmlnL3BhZ2UtY29uZmlnLW1vZHVsZS50cyIsInBhZ2UtY29uZmlnL3BhZ2UtY29uZmlnLXJlc291cmNlLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkLXNlYXJjaC1tb2R1bGUudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWRTZWFyY2gucmVzb3VyY2UudHMiXSwibmFtZXMiOlsidnMiLCJ2cy50b29scyIsInZzLnRvb2xzLkNvbmZpZyIsInZzLnRvb2xzLkNvbmZpZy5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLlJ1bkJsb2NrIiwidnMudG9vbHMuUnVuQmxvY2suY29uc3RydWN0b3IiLCJ2cy50b29scy5maWx0ZXJzIiwidnMudG9vbHMucGFnZUNvbmZpZyIsIl9nZXRMaXN0UXVlcnlTdHJpbmciLCJfZ2V0Q29uZmlnUXVlcnlTdHJpbmciLCJfZ2V0UGFnZUNvbmZpZ0xpc3QiLCJfZ2V0UGFnZUNvbmZpZyIsIl9kZWxldGVQYWdlQ29uZmlnIiwiX3NhdmVQYWdlQ29uZmlnIiwidnMudG9vbHMuc2F2ZWRTZWFyY2giLCJfZ2V0UXVlcnlTdHJpbmciLCJfZXhlY3V0ZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxFQUFFLENBWVI7QUFaRCxXQUFPLEVBQUU7SUFBQ0EsSUFBQUEsS0FBS0EsQ0FZZEE7SUFaU0EsV0FBQUEsS0FBS0EsRUFBQ0EsQ0FBQ0E7UUFDZkMsWUFBWUEsQ0FBQ0E7UUFFYkE7WUFDRUMsZ0JBQWdCQTtZQUNoQkEsZ0JBQVlBLFlBQTZCQTtnQkFDdkNDLGFBQWFBO2dCQUNiQSxZQUFZQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDaENBLDhCQUE4QkE7WUFDaENBLENBQUNBO1lBRUhELGFBQUNBO1FBQURBLENBUkFELEFBUUNDLElBQUFEO1FBUllBLFlBQU1BLFNBUWxCQSxDQUFB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QUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUM3QixDQUFDO1lBQ0QsNEVBQTRFO1FBQzlFLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoidnMudG9vbGtpdC5taW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIENvbmZpZyB7XG4gICAgLyoqIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKCRsb2dQcm92aWRlcjogbmcuSUxvZ1Byb3ZpZGVyKSB7XG4gICAgICAvLyBlbmFibGUgbG9nXG4gICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKHRydWUpO1xuICAgICAgLy8gc2V0IG9wdGlvbnMgdGhpcmQtcGFydHkgbGliXG4gICAgfVxuXG4gIH1cbn1cbiIsIm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgUnVuQmxvY2sge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nOiBuZy5JTG9nU2VydmljZSkge1xuICAgICAgJGxvZy5kZWJ1ZygncnVuQmxvY2sgZW5kJyk7XG4gICAgfVxuXG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXguY29uZmlnLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5ydW4udHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzJywgW10pXG4gICAgLmNvbmZpZyhDb25maWcpXG4gICAgLnJ1bihSdW5CbG9jayk7XG59XG4iLCJtb2R1bGUgdnMudG9vbHMuZmlsdGVycyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmlsdGVycycsIFtdKVxuICAgIC5maWx0ZXIoJ3JlcGxhY2VTdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihoYXlTdGFjazogc3RyaW5nLCBvbGROZWVkbGU6IHN0cmluZywgbmV3TmVlZGxlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGhheVN0YWNrLnJlcGxhY2Uob2xkTmVlZGxlLCBuZXdOZWVkbGUpO1xuICAgICAgfTtcbiAgICB9KTtcbiB9XG4iLCJtb2R1bGUgdnMudG9vbHMucGFnZUNvbmZpZyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMucGFnZUNvbmZpZycsIFtdKTtcbn1cbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cbmRlY2xhcmUgdmFyIGNvbmZpZztcblxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnBhZ2VDb25maWcnKS5cblx0LyogQG5nSW5qZWN0ICovXG5cdGZhY3RvcnkoJ3BhZ2VDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XG5cblx0XHQndXNlIHN0cmljdCc7XG5cblx0XHR2YXIgY29uZmlnVXJpID0gY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9jb25maWcvJztcblxuXHRcdGZ1bmN0aW9uIF9nZXRMaXN0UXVlcnlTdHJpbmcoKSB7XG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyAnbGlzdCc7XG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkOiBzdHJpbmcpIHtcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArIGlkO1xuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9nZXRQYWdlQ29uZmlnTGlzdCgpIHtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldExpc3RRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZ2V0UGFnZUNvbmZpZyhpZDogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9kZWxldGVQYWdlQ29uZmlnKGlkOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX3NhdmVQYWdlQ29uZmlnKHRlbXBsYXRlOiBhbnkpIHtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KGNvbmZpZ1VyaSwgdGVtcGxhdGUpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRnZXRQYWdlQ29uZmlnczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBfZ2V0UGFnZUNvbmZpZ0xpc3QoKTtcblx0XHRcdH0sXG5cdFx0XHRnZXRQYWdlQ29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiBfZ2V0UGFnZUNvbmZpZyhpZCk7XG5cdFx0XHR9LFxuXHRcdFx0ZGVsZXRlUGFnZUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gX2RlbGV0ZVBhZ2VDb25maWcoaWQpO1xuXHRcdFx0fSxcblx0XHRcdHNhdmVQYWdlQ29uZmlnOiBmdW5jdGlvbih0ZW1wbGF0ZTogYW55KXtcblx0XHRcdFx0cmV0dXJuIF9zYXZlUGFnZUNvbmZpZyh0ZW1wbGF0ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG4iLCJtb2R1bGUgdnMudG9vbHMuc2F2ZWRTZWFyY2gge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnNhdmVkU2VhcmNoJywgW10pO1xufVxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnKS5cblx0LyogQG5nSW5qZWN0ICovXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHAgOiBhbnkpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIGZ1bmN0aW9uIF9kb1NhdmUocmVxdWVzdCkge1xuICAgIC8vICAgcmVxdWVzdC5xdWVyeSArPSAnL2Rpc3A9JyArIHJlcXVlc3QuY29uZmlnO1xuICAgIC8vICAgcmVxdWVzdC5wYXRoID0gcmVxdWVzdC5xdWVyeTtcbiAgICAvLyAgIC8vIHJldHVybiBzdWdhci5wb3N0SnNvbihyZXF1ZXN0LCAnZGlzcGxheScsICdzc2VhcmNoJyk7XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5U3RyaW5nKCkge1xuICAgICAgdmFyIHJvd3MgPSAxNTA7ICAvLyBAVE9ETyBzZXQgdG8gd2hhdCB3ZSByZWFsbHkgd2FudFxuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD8nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJmZsPWlkLHRpdGxlLGRlc2NyaXB0aW9uLG93bmVyLHBhdGgsc2hhcmUscXVlcnksY29uZmlnLG9yZGVyLHNhdmVkLHByaXZhdGUsdmlldyxfdmVyc2lvbl8sY29uZmlnX3RpdGxlOltjb25maWdUaXRsZV0nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKCkge1xuICAgICAgcmV0dXJuICRodHRwLmpzb25wKF9nZXRRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YS5yZXNwb25zZS5kb2NzO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNhdmVkU2VhcmNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIHNhdmVTZWFyY2g6IGZ1bmN0aW9uKHNhdmVkU2VhcmNoLCBwYXJhbXMpIHtcbiAgICAgIC8vICAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xuICAgICAgLy8gICBzYXZlZFNlYXJjaC5xdWVyeSA9IGNvbnZlcnRlci50b0NsYXNzaWNQYXJhbXMocGFyYW1zKTtcbiAgICAgIC8vICAgcmV0dXJuIF9kb1NhdmUoc2F2ZWRTZWFyY2gpO1xuICAgICAgLy8gfSxcblxuICAgICAgZGVsZXRlU2VhcmNoOiBmdW5jdGlvbihpZDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIC8vIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcbiAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZDogc3RyaW5nLCBiZWZvcmVJZDogc3RyaW5nLCBhZnRlcklkOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYgKGJlZm9yZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYmVmb3JlPScgKyBiZWZvcmVJZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YSAhPT0gJycpIHtcbiAgICAgICAgICBkYXRhICs9ICcmJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZnRlcklkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYWZ0ZXI9JyArIGFmdGVySWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

//# sourceMappingURL=maps/vs.toolkit.src.js.map
