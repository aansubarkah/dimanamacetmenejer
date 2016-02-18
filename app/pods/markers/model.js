import DS from 'ember-data';

export default DS.Model.extend({
    category: DS.belongsTo('category', {
        async: true
    }),
    user: DS.belongsTo('user', {
        async: true
    }),
    respondent: DS.belongsTo('respondent', {
        async: true
    }),
    weather: DS.belongsTo('weather', {
        async: true
    }),
    category_id: DS.attr('number'),
    user_id: DS.attr('number'),
    respondent_id: DS.attr('number', {defaultValue: 11}),// Suara Surabaya
    weather_id: DS.attr('number'),
    respondentName: DS.attr('string', {defaultValue: ''}),
    respondentContact: DS.attr('string', {defaultValue: ''}),
    lat: DS.attr('number'),
    lng: DS.attr('number'),
    created: DS.attr('string'),
    modified: DS.attr('string'),
    info: DS.attr('string'),
    twitID: DS.attr('string', {defaultValue: null}),
    twitPlaceID: DS.attr('string', {defaultValue: null}),
    twitTime: DS.attr('string', {defaultValue: null}),
    twitURL: DS.attr('string', {defaultValue: null}),
    twitPlaceName: DS.attr('string', {defaultValue: null}),
    isTwitPlacePrecise: DS.attr('boolean', {defaultValue: 0}),
    twitImage: DS.attr('string', {defaultValue: null}),
    pinned: DS.attr('boolean', {defaultValue: 0}),
    cleared: DS.attr('boolean', {defaultValue: 0}),
    active: DS.attr('boolean', {defaultValue: 1})
});
