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
        var savedSearch;
        (function (savedSearch) {
            'use strict';
            angular.module('vs.tools.savedSearch', []);
        })(savedSearch = tools.savedSearch || (tools.savedSearch = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.savedSearch').
    factory('savedSearchResource', function (sugar, $http, $q) {
    'use strict';
    function _doSave(request) {
        //   if (configService.hasChanges()) {
        //     var deferred = $q.defer();
        //     sugar.postJson(configService.getUpdatedSettings(), 'display', 'config').then(function(response) {
        //       request.config = response.data.id;
        //       /* jshint ignore:start */
        //       request.query += '/disp=' + request.config;
        //       request.path = request.query;
        //       sugar.postJson(request, 'display', 'ssearch').then(function(savedResponse) {
        //         deferred.resolve();
        //       }, function(error) {
        //         deferred.reject(error);
        //       });
        //       /* jshint ignore:end */
        //     }, function(error) {
        //       deferred.reject(error);
        //     });
        //     return deferred.promise;
        //   } else {
        //     request.query += '/disp=' + request.config;
        //     request.path = request.query;
        //     return sugar.postJson(request, 'display', 'ssearch');
        //   }
    }
    function _getQueryString() {
        var rows = 150; // @TODO set to what we really want
        var queryString = config.root + 'solr/ssearch/select?';
        queryString += 'rows=' + rows + '&rand=' + Math.random();
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
        saveSearch: function (savedSearch, params) {
            // savedSearch.config = configService.getConfigId();
            // savedSearch.query = converter.toClassicParams(params);
            return _doSave(savedSearch);
        },
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
            return sugar.postForm('api/rest/display/ssearch/' + id + '/order', data);
        }
    };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImZpbHRlcnMvZmlsdGVycy50cyIsInNhdmVkLXNlYXJjaC9zYXZlZC1zZWFyY2gtbW9kdWxlLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkU2VhcmNoLnJlc291cmNlLnRzIl0sIm5hbWVzIjpbInZzIiwidnMudG9vbHMiLCJ2cy50b29scy5Db25maWciLCJ2cy50b29scy5Db25maWcuY29uc3RydWN0b3IiLCJ2cy50b29scy5SdW5CbG9jayIsInZzLnRvb2xzLlJ1bkJsb2NrLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZmlsdGVycyIsInZzLnRvb2xzLnNhdmVkU2VhcmNoIiwiX2RvU2F2ZSIsIl9nZXRRdWVyeVN0cmluZyIsIl9leGVjdXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0FZUjtBQVpELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxLQUFLQSxDQVlkQTtJQVpTQSxXQUFBQSxLQUFLQSxFQUFDQSxDQUFDQTtRQUNmQyxZQUFZQSxDQUFDQTtRQUViQTtZQUNFQyxnQkFBZ0JBO1lBQ2hCQSxnQkFBWUEsWUFBNkJBO2dCQUN2Q0MsYUFBYUE7Z0JBQ2JBLFlBQVlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNoQ0EsOEJBQThCQTtZQUNoQ0EsQ0FBQ0E7WUFFSEQsYUFBQ0E7UUFBREEsQ0FSQUQsQUFRQ0MsSUFBQUQ7UUFSWUEsWUFBTUEsU0FRbEJBLENBQUFBO0lBQ0hBLENBQUNBLEVBWlNELEtBQUtBLEdBQUxBLFFBQUtBLEtBQUxBLFFBQUtBLFFBWWRBO0FBQURBLENBQUNBLEVBWk0sRUFBRSxLQUFGLEVBQUUsUUFZUjs7QUNaRCxJQUFPLEVBQUUsQ0FVUjtBQVZELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxLQUFLQSxDQVVkQTtJQVZTQSxXQUFBQSxLQUFLQSxFQUFDQSxDQUFDQTtRQUNmQyxZQUFZQSxDQUFDQTtRQUViQTtZ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QUMsV0FBVyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVELFlBQVksRUFBRSxVQUFTLEVBQUU7WUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRywyQkFBMkIsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ25FLHVDQUF1QztnQkFDdkMsZUFBZTtnQkFDZixNQUFNO1lBQ1IsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDO1FBRUQsS0FBSyxFQUFFLFVBQVMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQ25DLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNkLEVBQUUsQ0FBQSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUMvQixDQUFDO1lBQ0QsRUFBRSxDQUFBLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsQ0FBQztZQUNkLENBQUM7WUFFRCxFQUFFLENBQUEsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDN0IsQ0FBQztZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLDJCQUEyQixHQUFHLEVBQUUsR0FBRyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0UsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJ2cy50b29sa2l0Lm1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgQ29uZmlnIHtcbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJGxvZ1Byb3ZpZGVyOiBuZy5JTG9nUHJvdmlkZXIpIHtcbiAgICAgIC8vIGVuYWJsZSBsb2dcbiAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQodHJ1ZSk7XG4gICAgICAvLyBzZXQgb3B0aW9ucyB0aGlyZC1wYXJ0eSBsaWJcbiAgICB9XG5cbiAgfVxufVxuIiwibW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBSdW5CbG9jayB7XG4gICAgLyoqIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKCRsb2c6IG5nLklMb2dTZXJ2aWNlKSB7XG4gICAgICAkbG9nLmRlYnVnKCdydW5CbG9jayBlbmQnKTtcbiAgICB9XG5cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbmRleC5jb25maWcudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LnJ1bi50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scyB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMnLCBbXSlcbiAgICAuY29uZmlnKENvbmZpZylcbiAgICAucnVuKFJ1bkJsb2NrKTtcbn1cbiIsIm1vZHVsZSB2cy50b29scy5maWx0ZXJzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWx0ZXJzJywgW10pXG4gICAgLmZpbHRlcigncmVwbGFjZVN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gaGF5U3RhY2sucmVwbGFjZShvbGROZWVkbGUsIG5ld05lZWRsZSk7XG4gICAgICB9O1xuICAgIH0pO1xuIH1cbiIsIm1vZHVsZSB2cy50b29scy5zYXZlZFNlYXJjaCB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnLCBbXSk7XG59XG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXG5kZWNsYXJlIHZhciBjb25maWc7XG5cbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcpLlxuICBmYWN0b3J5KCdzYXZlZFNlYXJjaFJlc291cmNlJywgZnVuY3Rpb24gKHN1Z2FyLCAkaHR0cCwgJHEpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBfZG9TYXZlKHJlcXVlc3QpIHtcblxuICAgIC8vICAgaWYgKGNvbmZpZ1NlcnZpY2UuaGFzQ2hhbmdlcygpKSB7XG4gICAgLy8gICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgLy8gICAgIHN1Z2FyLnBvc3RKc29uKGNvbmZpZ1NlcnZpY2UuZ2V0VXBkYXRlZFNldHRpbmdzKCksICdkaXNwbGF5JywgJ2NvbmZpZycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICByZXF1ZXN0LmNvbmZpZyA9IHJlc3BvbnNlLmRhdGEuaWQ7XG4gICAgLy8gICAgICAgLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuICAgIC8vICAgICAgIHJlcXVlc3QucXVlcnkgKz0gJy9kaXNwPScgKyByZXF1ZXN0LmNvbmZpZztcbiAgICAvLyAgICAgICByZXF1ZXN0LnBhdGggPSByZXF1ZXN0LnF1ZXJ5O1xuICAgIC8vICAgICAgIHN1Z2FyLnBvc3RKc29uKHJlcXVlc3QsICdkaXNwbGF5JywgJ3NzZWFyY2gnKS50aGVuKGZ1bmN0aW9uKHNhdmVkUmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAvLyAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAvLyAgICAgICB9KTtcbiAgICAvLyAgICAgICAvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuICAgIC8vICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAvLyAgIH0gZWxzZSB7XG4gICAgLy8gICAgIHJlcXVlc3QucXVlcnkgKz0gJy9kaXNwPScgKyByZXF1ZXN0LmNvbmZpZztcbiAgICAvLyAgICAgcmVxdWVzdC5wYXRoID0gcmVxdWVzdC5xdWVyeTtcbiAgICAvLyAgICAgcmV0dXJuIHN1Z2FyLnBvc3RKc29uKHJlcXVlc3QsICdkaXNwbGF5JywgJ3NzZWFyY2gnKTtcbiAgICAvLyAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlTdHJpbmcoKSB7XG4gICAgICB2YXIgcm93cyA9IDE1MDsgIC8vIEBUT0RPIHNldCB0byB3aGF0IHdlIHJlYWxseSB3YW50XG4gICAgICB2YXIgcXVlcnlTdHJpbmcgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0Pyc7XG4gICAgICBxdWVyeVN0cmluZyArPSAncm93cz0nICsgcm93cyArICcmcmFuZD0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmd3Q9anNvbiZqc29uLndyZj1KU09OX0NBTExCQUNLJztcbiAgICAgIHJldHVybiBxdWVyeVN0cmluZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZXhlY3V0ZSgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5qc29ucChfZ2V0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YS5kYXRhLnJlc3BvbnNlLmRvY3M7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNhdmVkU2VhcmNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIHNhdmVTZWFyY2g6IGZ1bmN0aW9uKHNhdmVkU2VhcmNoLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xuICAgICAgICAvLyBzYXZlZFNlYXJjaC5xdWVyeSA9IGNvbnZlcnRlci50b0NsYXNzaWNQYXJhbXMocGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIF9kb1NhdmUoc2F2ZWRTZWFyY2gpO1xuICAgICAgfSxcblxuICAgICAgZGVsZXRlU2VhcmNoOiBmdW5jdGlvbihpZCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9zc2VhcmNoLycgKyBpZCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAvLyBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgLy8gICBlbnRyeShpZCk7XG4gICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBvcmRlcjogZnVuY3Rpb24oaWQsIGJlZm9yZUlkLCBhZnRlcklkKSB7XG4gICAgICAgIHZhciBkYXRhID0gJyc7XG4gICAgICAgIGlmKGJlZm9yZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYmVmb3JlPScgKyBiZWZvcmVJZDtcbiAgICAgICAgfVxuICAgICAgICBpZihkYXRhICE9PSAnJykge1xuICAgICAgICAgIGRhdGEgKz0gJyYnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoYWZ0ZXJJZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGRhdGEgKz0gJ2FmdGVyPScgKyBhZnRlcklkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnYXBpL3Jlc3QvZGlzcGxheS9zc2VhcmNoLycgKyBpZCArICcvb3JkZXInLCBkYXRhKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

//# sourceMappingURL=maps/vs.toolkit.src.js.map
