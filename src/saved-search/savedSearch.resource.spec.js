describe('savedSearchResource', function () {

  var $http, $q, savedSearchResource;

  beforeEach(function(){
    // module('vs.tools');
    // module('vs.tools.savedSearch');
    // module(function ($provide) {
    //   $provide.constant('config', cfg);
    // });
    inject(function (_$http_, _$q_, _savedSearchResource_) {
      // $http = _$http_;
      // $q = _$q_;
      savedSearchResource = _savedSearchResource_;
    });
  });

  // Setup the mock service in an anonymous module.
  // beforeEach(module(function ($provide) {
  //   $provide.value('oneOfMyOtherServicesStub', {
  //       someVariable: 1
  //   });
  // }));

  it('can get an instance of my factory', function() {
    expect(savedSearchResource).toBeDefined();
  });
});
