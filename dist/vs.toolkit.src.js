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
    function _getListQueryString() {
        var queryString = config.root + 'api/rest/display/config/list';
        queryString += '?rand=' + Math.random();
        return queryString;
    }
    function _getConfigQueryString(id) {
        var queryString = config.root + 'api/rest/display/config/' + id;
        // queryString += '?rand=' + Math.random();
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
    return {
        getPageConfigs: function () {
            return _getPageConfigList();
        },
        getPageConfig: function (id) {
            return _getPageConfig(id);
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
    function _doSave(request) {
        request.query += '/disp=' + request.config;
        request.path = request.query;
        // return sugar.postJson(request, 'display', 'ssearch');
    }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImZpbHRlcnMvZmlsdGVycy50cyIsInBhZ2UtY29uZmlnL3BhZ2UtY29uZmlnLW1vZHVsZS50cyIsInBhZ2UtY29uZmlnL3BhZ2UtY29uZmlnLXJlc291cmNlLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkLXNlYXJjaC1tb2R1bGUudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWRTZWFyY2gucmVzb3VyY2UudHMiXSwibmFtZXMiOlsidnMiLCJ2cy50b29scyIsInZzLnRvb2xzLkNvbmZpZyIsInZzLnRvb2xzLkNvbmZpZy5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLlJ1bkJsb2NrIiwidnMudG9vbHMuUnVuQmxvY2suY29uc3RydWN0b3IiLCJ2cy50b29scy5maWx0ZXJzIiwidnMudG9vbHMucGFnZUNvbmZpZyIsIl9nZXRMaXN0UXVlcnlTdHJpbmciLCJfZ2V0Q29uZmlnUXVlcnlTdHJpbmciLCJfZ2V0UGFnZUNvbmZpZ0xpc3QiLCJfZ2V0UGFnZUNvbmZpZyIsInZzLnRvb2xzLnNhdmVkU2VhcmNoIiwiX2RvU2F2ZSIsIl9nZXRRdWVyeVN0cmluZyIsIl9leGVjdXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0FZUjtBQVpELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxLQUFLQSxDQVlkQTtJQVpTQSxXQUFBQSxLQUFLQSxFQUFDQSxDQUFDQTtRQUNmQyxZQUFZQSxDQUFDQTtRQUViQTtZQUNFQyxnQkFBZ0JBO1lBQ2hCQSxnQkFBWUEsWUFBNkJBO2dCQUN2Q0MsYUFBYUE7Z0JBQ2JBLFlBQVlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNoQ0EsOEJBQThCQTtZQUNoQ0EsQ0FBQ0E7WUFFSEQsYUFBQ0E7UUFBREEsQ0FSQUQsQUFRQ0MsSUFBQUQ7UUFSWUEsWUFBTUEsU0FRbEJBLENBQUFBO0lBQ0hBLENBQUNBLEVBWlNELEtBQUtBLEdB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QUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQy9CLENBQUM7WUFDRCxFQUFFLENBQUEsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLElBQUksR0FBRyxDQUFDO1lBQ2QsQ0FBQztZQUVELEVBQUUsQ0FBQSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUM3QixDQUFDO1lBQ0QsNEVBQTRFO1FBQzlFLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoidnMudG9vbGtpdC5taW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIENvbmZpZyB7XG4gICAgLyoqIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKCRsb2dQcm92aWRlcjogbmcuSUxvZ1Byb3ZpZGVyKSB7XG4gICAgICAvLyBlbmFibGUgbG9nXG4gICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKHRydWUpO1xuICAgICAgLy8gc2V0IG9wdGlvbnMgdGhpcmQtcGFydHkgbGliXG4gICAgfVxuXG4gIH1cbn1cbiIsIm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgUnVuQmxvY2sge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nOiBuZy5JTG9nU2VydmljZSkge1xuICAgICAgJGxvZy5kZWJ1ZygncnVuQmxvY2sgZW5kJyk7XG4gICAgfVxuXG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXguY29uZmlnLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5ydW4udHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzJywgW10pXG4gICAgLmNvbmZpZyhDb25maWcpXG4gICAgLnJ1bihSdW5CbG9jayk7XG59XG4iLCJtb2R1bGUgdnMudG9vbHMuZmlsdGVycyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmlsdGVycycsIFtdKVxuICAgIC5maWx0ZXIoJ3JlcGxhY2VTdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihoYXlTdGFjazogc3RyaW5nLCBvbGROZWVkbGU6IHN0cmluZywgbmV3TmVlZGxlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGhheVN0YWNrLnJlcGxhY2Uob2xkTmVlZGxlLCBuZXdOZWVkbGUpO1xuICAgICAgfTtcbiAgICB9KTtcbiB9XG4iLCJtb2R1bGUgdnMudG9vbHMucGFnZUNvbmZpZyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMucGFnZUNvbmZpZycsIFtdKTtcbn1cbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cbmRlY2xhcmUgdmFyIGNvbmZpZztcblxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnBhZ2VDb25maWcnKS5cblx0LyogQG5nSW5qZWN0ICovXG4gIGZhY3RvcnkoJ3BhZ2VDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkge1xuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9jb25maWcvbGlzdCc7XG4gICAgICBxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgICByZXR1cm4gcXVlcnlTdHJpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkOiBzdHJpbmcpIHtcbiAgICAgIHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvY29uZmlnLycgKyBpZDtcbiAgICAgIC8vIHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHJldHVybiBxdWVyeVN0cmluZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0UGFnZUNvbmZpZ0xpc3QoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KF9nZXRMaXN0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgLy8gQFRPRE86IGhhbmRsZSBlcnJvclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9nZXRQYWdlQ29uZmlnKGlkOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgLy8gQFRPRE86IGhhbmRsZSBlcnJvclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBnZXRQYWdlQ29uZmlnczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfZ2V0UGFnZUNvbmZpZ0xpc3QoKTtcbiAgICAgIH0sXG4gICAgICBnZXRQYWdlQ29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBfZ2V0UGFnZUNvbmZpZyhpZCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJtb2R1bGUgdnMudG9vbHMuc2F2ZWRTZWFyY2gge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnNhdmVkU2VhcmNoJywgW10pO1xufVxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnKS5cblx0LyogQG5nSW5qZWN0ICovXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIF9kb1NhdmUocmVxdWVzdCkge1xuICAgICAgcmVxdWVzdC5xdWVyeSArPSAnL2Rpc3A9JyArIHJlcXVlc3QuY29uZmlnO1xuICAgICAgcmVxdWVzdC5wYXRoID0gcmVxdWVzdC5xdWVyeTtcbiAgICAgIC8vIHJldHVybiBzdWdhci5wb3N0SnNvbihyZXF1ZXN0LCAnZGlzcGxheScsICdzc2VhcmNoJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5U3RyaW5nKCkge1xuICAgICAgdmFyIHJvd3MgPSAxNTA7ICAvLyBAVE9ETyBzZXQgdG8gd2hhdCB3ZSByZWFsbHkgd2FudFxuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD8nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJmZsPWlkLHRpdGxlLGRlc2NyaXB0aW9uLG93bmVyLHBhdGgsc2hhcmUscXVlcnksY29uZmlnLG9yZGVyLHNhdmVkLHByaXZhdGUsdmlldyxfdmVyc2lvbl8sY29uZmlnX3RpdGxlOltjb25maWdUaXRsZV0nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKCkge1xuICAgICAgcmV0dXJuICRodHRwLmpzb25wKF9nZXRRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmRhdGEucmVzcG9uc2UuZG9jcztcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2F2ZWRTZWFyY2hlczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfZXhlY3V0ZSgpO1xuICAgICAgfSxcblxuICAgICAgLy8gc2F2ZVNlYXJjaDogZnVuY3Rpb24oc2F2ZWRTZWFyY2gsIHBhcmFtcykge1xuICAgICAgLy8gICBzYXZlZFNlYXJjaC5jb25maWcgPSBjb25maWdTZXJ2aWNlLmdldENvbmZpZ0lkKCk7XG4gICAgICAvLyAgIHNhdmVkU2VhcmNoLnF1ZXJ5ID0gY29udmVydGVyLnRvQ2xhc3NpY1BhcmFtcyhwYXJhbXMpO1xuICAgICAgLy8gICByZXR1cm4gX2RvU2F2ZShzYXZlZFNlYXJjaCk7XG4gICAgICAvLyB9LFxuXG4gICAgICBkZWxldGVTZWFyY2g6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIC8vIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcbiAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZCwgYmVmb3JlSWQsIGFmdGVySWQpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYoYmVmb3JlSWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdiZWZvcmU9JyArIGJlZm9yZUlkO1xuICAgICAgICB9XG4gICAgICAgIGlmKGRhdGEgIT09ICcnKSB7XG4gICAgICAgICAgZGF0YSArPSAnJic7XG4gICAgICAgIH1cblxuICAgICAgICBpZihhZnRlcklkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYWZ0ZXI9JyArIGFmdGVySWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

//# sourceMappingURL=maps/vs.toolkit.src.js.map
