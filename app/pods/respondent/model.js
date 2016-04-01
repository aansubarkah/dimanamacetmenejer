import DS from 'ember-data';

export default DS.Model.extend({
	markers: DS.hasMany('marker', {async: true}),
    sources: DS.hasMany('source', {async: true}),
    twitUserID: DS.attr('number', {defaultValue: ''}),
	name: DS.attr('string'),
	contact: DS.attr('string'),
	active: DS.attr('boolean', {defaultValue: 1})
});
