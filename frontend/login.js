var bean = require('bean'),
    Sizzle = require('sizzle'),
    ClassList = require('class-list');

var signupContainer = Sizzle('.signup-container')[0],
    loginContainer = Sizzle('.login-container')[0],
    signupContainerClasses = ClassList(signupContainer),
    loginContainerClasses = ClassList(loginContainer);

bean.on(document, 'click', '.signup-toggle', function(ev) {
  ev.preventDefault();
  signupContainerClasses.toggle('hide');
  loginContainerClasses.toggle('hide');
});
