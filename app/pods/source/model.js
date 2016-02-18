import DS from 'ember-data';

export default DS.Model.extend({
    respondent: DS.belongsTo('respondent', {
        async: true
    }),
    region: DS.belongsTo('region', {
        async: true
    }),
    respondent_id: DS.attr('number', {defaultValue: 25}),// @TMC
    region_id: DS.attr('number', {defaultValue: 1}),// all
    regionName: DS.attr('string'),
    regionLat: DS.attr('number'),
    regionLng: DS.attr('number'),
    lat: DS.attr('number'),
    lng: DS.attr('number'),
    twitID: DS.attr('number'),
    twitid_str: DS.attr('string'),
    twitTime: DS.attr('string'),
    twitUserID: DS.attr('number'),
    twitUserScreenName: DS.attr('string'),
    url: DS.attr('string', {defaultValue: null}),
    info: DS.attr('string'),
    media: DS.attr('string', {defaultValue: null}),
    isImported: DS.attr('boolean', {defaultValue: 0}),
    active: DS.attr('boolean', {defaultValue: 1})
});
