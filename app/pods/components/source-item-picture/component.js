import Ember from 'ember';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.set('isShowingModalPicture', false);
        this.set('pictureURL', '');
    },
    actions: {
        togglePicture() {
            this.toggleProperty('isShowingModalPicture');
        }
    }
});
