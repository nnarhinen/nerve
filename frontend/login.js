var bean = require('bean'),
    Sizzle = require('sizzle'),
    ClassList = require('class-list'),
    _ = require('underscore'),
    axios = require('axios'),
    qs = require('qs');

var signupContainer = Sizzle('.signup-container')[0],
    loginContainer = Sizzle('.login-container')[0],
    signupContainerClasses = ClassList(signupContainer),
    loginContainerClasses = ClassList(loginContainer);

var toggleSignup = function() {
  signupContainerClasses.toggle('hide');
  loginContainerClasses.toggle('hide');
};

bean.on(document, 'click', '.signup-toggle', function(ev) {
  ev.preventDefault();
  toggleSignup();
});

var inputAsKeyValuePair = function(el) {
  return el.name + '=' + el.value;
};

bean.on(document, 'submit', '.signup-form', function(ev) {
  ev.preventDefault();
  var form = ev.currentTarget;
  var data = qs.parse(Sizzle('input[name]', form).map(inputAsKeyValuePair).join('&'));
  axios.post(form.action, data).then(function(resp) {
    toggleSignup();
    Sizzle('.login-form [name="email"]')[0].value = resp.data.email;
    Sizzle('.login-form [name="password"]')[0].focus();
  }).catch(function(resp) {
    if (resp.status === 400) {
      var div = document.createElement('div');
      div.innerHTML = resp.data;
      form.parentNode.replaceChild(Sizzle('form', div)[0], form);
    } else {
      alert('Failed to do signup because of internal error');
    }
  });
});
