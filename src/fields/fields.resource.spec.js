angular.module('vs.tools.fields', [])
	.service('fieldResourceService', vs.tools.fields.FieldResourceService);

var fieldResourceService;
describe('Field Resource Service', function () {

	beforeEach(function() {
		module('vs.tools.fields');

		inject(function(_fieldResourceService_) {
			fieldResourceService = _fieldResourceService_;
		})
	});

	it('should be defined', function() {
			expect(fieldResourceService).toBeDefined();
	});

});
