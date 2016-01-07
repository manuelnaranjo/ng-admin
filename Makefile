.PHONY: build

install:
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run:
	@cp node_modules/sinon/pkg/sinon-server-1.14.1.js examples/blog/build/sinon-server.js
	@./node_modules/webpack-dev-server/bin/webpack-dev-server.js --colors --devtool cheap-module-inline-source-map --content-base examples/blog --port 8000

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress --devtool source-map
	@cp -Rf build examples/blog/
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (with minification)"

test-unit:
	@./node_modules/.bin/karma start src/javascripts/test/karma.conf.js --single-run

test-e2e:
	@./node_modules/.bin/grunt test:e2e

test: test-unit test-e2e
