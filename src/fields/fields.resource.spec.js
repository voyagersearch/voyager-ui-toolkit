// @TODO this is completely wrong - don't redefine the module and service here then check that its defined
//  angular.module('vs.tools.fields', [])
//	  .service('fieldsResource', vs.tools.fields.FieldsResource);

var fieldResourceService;
describe('Field Resource Service', function () {

	beforeEach(function() {
		module('vs.tools.fields');

		inject(function(_fieldsResource_) {
			fieldResourceService = _fieldsResource_;
		})
	});

	it('should be defined', function() {
			expect(fieldResourceService).toBeDefined();
	});

});
