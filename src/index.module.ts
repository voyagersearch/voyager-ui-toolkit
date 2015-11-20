/// <reference path="../.tmp/typings/tsd.d.ts" />

/// <reference path="index.config.ts" />
/// <reference path="index.run.ts" />

module vs.tools {
  'use strict';

  angular.module('vs.tools', [])
    .config(Config)
    .run(RunBlock);
}
