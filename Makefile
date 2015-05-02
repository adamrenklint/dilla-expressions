MOCHA = ./node_modules/mocha/bin/mocha
_MOCHA = ./node_modules/mocha/bin/_mocha
ISTANBUL = ./node_modules/istanbul/lib/cli.js
CC_REPORTER = ./node_modules/codeclimate-test-reporter/bin/codeclimate.js
CC_REPO_TOKEN = 5fcfae76120f1ee25bdbbde12bb295a9cb7177d8cbb0defd11006956df3dd3cc
JSHINT = ./node_modules/jshint/bin/jshint
COVERAGE_LIMIT = 95

install:
	@npm install

test: lint
	multi='mocha-osx-reporter=- spec=-' $(MOCHA) -s 5 test/*.test.js --reporter mocha-multi

watch:
	multi='mocha-osx-reporter=- spec=-' $(MOCHA) -s 5 test/*.test.js --reporter mocha-multi -w

coverage:
	@$(ISTANBUL) cover $(_MOCHA) -- test/*.test.js -R dot

check-coverage: coverage
	@$(ISTANBUL) check-coverage --statement $(COVERAGE_LIMIT) --branch $(COVERAGE_LIMIT) --function $(COVERAGE_LIMIT)

report-coverage:
	@CODECLIMATE_REPO_TOKEN=$(CC_REPO_TOKEN) $(CC_REPORTER) < coverage/lcov.info

publish: test check-coverage report-coverage
	@npm publish && make tag

lint:
	@$(JSHINT) index.js

tag:
	@git tag "v$(shell node -e "var config = require('./package.json'); console.log(config.version);")"
	@git push --tags

.PHONY: test coverage
