export PATH := ./node_modules/.bin/:$(PATH)
export NODE_PATH := $(NODE_PATH):src/:.

.PHONY: js, prod, cleanjs


src/backend/public/css/default.css: src/backend/public/css/bootstrap.css src/backend/public/css/react-widgets.css src/styl/variables.styl src/styl/bootstrap-overrides.styl
	stylus --include-css -u nib --import nib -p src/styl/default.styl > $@

src/backend/public/css/auth.css: $(wildcard src/styl/*.styl)
	stylus --include-css -u nib --import nib -p src/styl/auth.styl > $@

src/backend/public/css/bootstrap.css: $(wildcard src/less/build-bootstrap.less node_modules/*.less)
	lessc src/less/build-bootstrap.less > $@
src/backend/public/css/react-widgets.css: $(wildcard src/less/build-react-widgets.less node_modules/*.less)
	lessc src/less/build-react-widgets.less > $@

src/backend/public/js/application.fi.js: $(wildcard src/frontend/*.js node_modules/*.js)
	browserify -t reactify -t [ jedify --lang fi ] --debug --full-paths src/frontend/index.js > $@

src/backend/public/js/application.en.js: $(wildcard src/frontend/*.js node_modules/*.js)
	browserify -t reactify -t [ jedify --lang en ] --debug --full-paths src/frontend/index.js > $@

src/backend/public/js/application.fi.min.js: $(wildcard src/frontend/*.js node_modules/*.js)
	NODE_ENV=production browserify -t reactify -t [ jedify --lang fi ] -t uglifyify src/frontend/index.js | uglifyjs -c -m > $@

src/backend/public/js/application.en.min.js: $(wildcard src/frontend/*.js node_modules/*.js)
	NODE_ENV=production browserify -t reactify -t [ jedify --lang en ] -t uglifyify src/frontend/index.js | uglifyjs -c -m > $@


js: src/backend/public/js/application.fi.js src/backend/public/js/application.en.js
prod: src/backend/public/js/application.fi.min.js src/backend/public/js/application.en.min.js
cleanjs: 
	rm src/backend/public/js/application*
