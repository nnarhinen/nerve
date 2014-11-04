/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react'),
    moment = require('moment'),
    DateTimePicker = require('react-widgets').DateTimePicker;

var DatePickerInput = module.exports = React.createClass({
  getInitialState: function() {
    //FIXME
    var ua = window.navigator.userAgent,
        isMobileSafari = !!/iPad|iPhone/.exec(ua),
        isAndroid = !!/Android/.exec(ua);
    return {
      value: this.props.value && moment(this.props.value),
      dateFormat: this.props.dateFormat || 'yyyy-MM-dd',
      useDateTimePicker: !isAndroid && !isMobileSafari
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
  dateInputChanged: function(ev) {
    this.daySelected(moment(ev.target.value));
  },
  render: function() {
    return (
      <div className="form-group">
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        {this.state.useDateTimePicker ? <DateTimePicker id={this.props.id} time={false} format={this.state.dateFormat} onChange={this.datePickerDateChanged} value={this.state.value && this.state.value.toDate()} />
        : <input className="form-control" type="date" value={this.state.value && this.state.value.format('YYYY-MM-DD')} onChange={this.dateInputChanged} />}
      </div>
    );
  }
});


