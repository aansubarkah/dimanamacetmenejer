import Ember from 'ember';

export default Ember.Component.extend({
    loadText: 'Load more',
    loadedText: 'Loaded',
    click: function(){
        this.sendAction();
    }
});
