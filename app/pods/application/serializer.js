import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	/*keyForRelationship: function (rel, kind) {
		if (kind === 'belongsTo') {
			var underscored = rel.underscore();
			return underscored + "_id";
		} else {
			var singular = rel.singularize();
			var underscored = singular.underscore();
			return underscored + "_ids";
		}
	}*/
	/*keyForRelationship(key, relationship) {
	 return key + '_id';
	 }*/
});
