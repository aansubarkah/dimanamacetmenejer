import DS from 'ember-data';

export default DS.Model.extend({
    group: DS.belongsTo('group', {
        async: true
    }),
    group_id: DS.attr('number'),
    /*group_id: DS.belongsTo('group', {
      async: true
      }),*/
    username: DS.attr('string'),
    email: DS.attr('string'),
    password: DS.attr('string'),
    password1: DS.attr('string', {defaultValue: ''}),
    password2: DS.attr('string', {defaultValue: ''}),
    active: DS.attr('boolean', {defaultValue: 1})
});
