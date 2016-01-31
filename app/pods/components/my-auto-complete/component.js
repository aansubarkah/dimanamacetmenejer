//import Ember from 'ember';
import AutoComplete from "ember-cli-auto-complete/components/auto-complete";

export default AutoComplete.extend({
	valueProperty: "name",//label
	triggerSuggestions: 0,
	suggestions: function () {
		//console.log('suggestions triggered');
		return this.get('options');
	}.property('triggerSuggestions'),
	updateOptions: function () {
		//console.log('updateOptions triggered');
		var inputVal = this.get('inputVal');
		this.sendAction('action', inputVal);
	}.observes('inputVal'),
	optionsToMatch: function () {
		//console.log('optionsToMatch triggered');
		var caseInsensitiveOptions = [];
		this.get('options').forEach(function (item) {
			var value = item.get('id');//id to returned
			caseInsensitiveOptions.push(value);
			caseInsensitiveOptions.push(value.toLowerCase());
		});
		return caseInsensitiveOptions;
	}.property('options.[]')
});
