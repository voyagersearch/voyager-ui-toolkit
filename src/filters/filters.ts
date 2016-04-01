module vs.tools.filters {
  'use strict';

  angular.module('vs.tools.filters', [])
    .filter('replaceString', function() {
      return function(hayStack: string, oldNeedle: string, newNeedle: string) {
        return hayStack.replace(new RegExp(oldNeedle, 'g'), newNeedle);
      };
    });
 }
