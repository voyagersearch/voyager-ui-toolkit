/// <reference path="../.tmp/typings/tsd.d.ts" />

/// <reference path="index.config.ts" />
/// <reference path="index.run.ts" />

module vs.tools {
  'use strict';

  declare var config;

  angular.module('vs.tools', [])
    .config(Config)
    .run(RunBlock)
    .constant('config', config);
}
