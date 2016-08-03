TESTS = test/**/*-test.js
REPORTER = spec

tests:
	@./node_modules/.bin/mocha \
		--require test/test-helper.js \
		--timeout 10000 \
		--colors \
		--reporter $(REPORTER) \
		$(TESTS)

.PHONY: tests

test:
	@./node_modules/.bin/mocha \
		--require test/test-helper.js \
		--timeout 10000 \
		--colors \
		--reporter $(REPORTER) \
		$(FILE)
