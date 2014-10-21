module.exports.noop = function() {};

module.exports.formatIban = function(str) {
  str = str || '';
  if (!str.length) return '';
  return str.match(/.{1,4}/g).join(' ');
};

module.exports.formatReferenceNumber = function(str) {
  str = str || '';
  if (!str.length) return '';
  return str.replace(/^0+/, '').split('').reverse().join('').match(/.{1,5}/g).map(function(p) { return p.split('').reverse().join(''); }).reverse().join(' ');
};

module.exports.preventDefault = function(ev) {
  ev.preventDefault();
};
