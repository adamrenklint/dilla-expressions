install:
	@npm install

test:
	@node_modules/mocha/bin/mocha

watch:
	@node_modules/mocha/bin/mocha -w

publish:
	@npm publish && make tag

tag:
	@git tag "v$(shell node -e "var config = require('./package.json'); console.log(config.version);")"
	@git push --tags

.PHONY: test