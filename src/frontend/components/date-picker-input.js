/**
 * @jsx React.DOM
 */

var React = require('react'),
    moment = require('moment'),
    OverlayTrigger = require('react-bootstrap/OverlayTrigger'),
    Popover = require('react-bootstrap/Popover'),
    Input = require('react-bootstrap/Input'),
    common = require('frontend/common'),
    Calendar = require('react-bootstrap-calendar').Calendar;

var DatePickerInput = module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.value && moment(this.props.value),
      dateFormat: this.props.dateFormat || 'YYYY-MM-DD'
    };
  },
  daySelected: function(m) {
    this.setState({
      value: m
    });
    this.props.onChange && this.props.onChange(m);
  },
  render: function() {
    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={<Popover><Calendar onDaySelected={this.daySelected} selectedDate={this.state.value} /></Popover>}>
        <Input id={this.props.id} type="text" onChange={common.noop} name={this.props.name} value={this.state.value && this.state.value.format(this.state.dateFormat)} label={this.props.label} />
      </OverlayTrigger>
      );
  }
});


