import DS from 'ember-data';

export default DS.Model.extend({
    sources: DS.hasMany('source', {async: true}),
    lat: DS.attr('number'),
    lng: DS.attr('number'),
    name: DS.attr('string'),
    active: DS.attr('boolean', {defaultValue: 1})
});
