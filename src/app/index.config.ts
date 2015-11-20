module vs.tools {
  'use strict';

  export class Config {
    /** @ngInject */
    constructor($logProvider: ng.ILogProvider) {
      // enable log
      $logProvider.debugEnabled(true);
      // set options third-party lib
    }

  }
}
