import DS from 'ember-data';

export default DS.Model.extend({
	group: DS.belongsTo('group', {
		async: true
	}),
	group_id: DS.attr('number'),
	/*group_id: DS.belongsTo('group', {
	 async: true
	 }),*/
	//group_id: DS.attr('number'),// consider to use group_id: DS.belongsTo('group',{async:true})
	username: DS.attr('string'),
	email: DS.attr('string'),
	password: DS.attr('string'),
	active: DS.attr('boolean', {defaultValue: 1})
});
