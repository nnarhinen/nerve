export PATH := ./node_modules/.bin/:$(PATH)

src/backend/public/css/default.css: src/backend/public/css/bootstrap.css src/backend/public/css/react-widgets.css src/styl/variables.styl src/styl/bootstrap-overrides.styl
	stylus --include-css -u nib --import nib -p src/styl/default.styl > $@

src/backend/public/css/auth.css: $(wildcard src/styl/*.styl)
	stylus --include-css -u nib --import nib -p src/styl/auth.styl > $@

src/backend/public/css/bootstrap.css: $(wildcard src/less/build-bootstrap.less node_modules/*.less)
	lessc src/less/build-bootstrap.less > $@
src/backend/public/css/react-widgets.css: $(wildcard src/less/build-react-widgets.less node_modules/*.less)
	lessc src/less/build-react-widgets.less > $@

