MOCHA = ./node_modules/mocha/bin/mocha
_MOCHA = ./node_modules/mocha/bin/_mocha
ISTANBUL = ./node_modules/istanbul/lib/cli.js
CC_REPORTER = ./node_modules/codeclimate-test-reporter/bin/codeclimate.js
CC_REPO_TOKEN = 5fcfae76120f1ee25bdbbde12bb295a9cb7177d8cbb0defd11006956df3dd3cc
JSHINT = ./node_modules/jshint/bin/jshint

install:
	@npm install

test: lint
	@$(MOCHA) -s 10

watch:
	@$(MOCHA) -w -s 10

coverage:
	@$(ISTANBUL) cover $(_MOCHA) -- test/*.test.js -R dot
	@CODECLIMATE_REPO_TOKEN=$(CC_REPO_TOKEN) $(CC_REPORTER) < coverage/lcov.info

publish:
	@make test && make coverage && npm publish && make tag

lint:
	@$(JSHINT) index.js

tag:
	@git tag "v$(shell node -e "var config = require('./package.json'); console.log(config.version);")"
	@git push --tags

.PHONY: test coverage