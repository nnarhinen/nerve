/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react'),
    moment = require('moment'),
    DateTimePicker = require('react-widgets').DateTimePicker;

var DatePickerInput = module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.value && moment(this.props.value),
      dateFormat: this.props.dateFormat || 'yyyy-MM-dd'
    };
  },
  daySelected: function(m) {
    this.setState({
      value: m
    });
    if (this.props.onChange) this.props.onChange(m);
  },
  datePickerDateChanged: function(d) {
    this.daySelected(moment(d));
  },
  render: function() {
    return (
      <div className="form-group">
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <DateTimePicker id={this.props.id} time={false} format={this.state.dateFormat} onChange={this.datePickerDateChanged} value={this.state.value.toDate()} />
      </div>
    );
  }
});


