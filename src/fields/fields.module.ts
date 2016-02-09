/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="./fields.resource.ts" />

module vs.tools.fields {
'use strict';

	angular.module('vs.tools.fields', ['vs.tools.util'])
		.service(FieldsResource.refName, FieldsResource);

}
