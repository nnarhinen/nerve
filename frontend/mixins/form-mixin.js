var validator = require('../../schemas/validator'),
    _ = require('underscore');

module.exports = {
  onPropertyChanged: function(property, newValue) {
    var newObject = _.extend({}, this.props[this.objectPropertyPath], this.state[this.objectPropertyPath], _.isObject(property) ? property : _.object([[property, newValue]]));
    newObject = this.transformObject(newObject);
    var prms = {validationErrors: {}};
    prms[this.objectPropertyPath] = newObject;
    this.setState(prms); // Modify only locally
    var validationReport = validator.validate(newObject, this.validationSchema);
    if (!validationReport.errors.length) {
      if (_.result(this, 'autoSave')) this.updateOne(newObject);
      return;
    }
    var validationErrors = _.chain(validationReport.errors)
                                .map(function(e) {
                                  var pr = e.property.split('.')[1]; //FIXME this is not a generic solutions
                                  return [pr, e.message];
                                })
                                .object().value();
    this.setState({
      validationErrors: validationErrors
    });
  },
  validationState: function(property) {
    if (this.state.validationErrors[property]) return 'error';
    return null;
  },
  validationMessage: function(property) {
    return this.state.validationErrors[property];
  },
  onIBANChange: function(ev) {
    this.onPropertyChanged('iban', ev.target.value.toUpperCase().replace(/ /g, ''));
  },
  onReferenceNumberChange: function(ev) {
    this.onPropertyChanged('reference_number', ev.target.value.replace(/ /g, ''));
  },
  onNumericInputChange: function(ev) {
    this.onPropertyChanged(ev.target.name, ev.target.value.replace(',', '.'));
  },
  onUppercaseInputChange: function(ev) {
    this.onPropertyChanged(ev.target.name, ev.target.value.toUpperCase());
  },
  onTextInputChange: function(ev) {
    this.onPropertyChanged(ev.target.name, ev.target.value);
  }
};
