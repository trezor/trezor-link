check: node_modules
	`npm bin`/flow check src/
	cd src/; `npm bin`/eslint .

git-ancestor:
	git fetch origin
	git merge-base --is-ancestor origin/master master

node_modules:
	npm install

build: node_modules
	rm -rf lib
	cp -r src/ lib
	find lib/ -type f ! -name '*.js' | xargs -I {} rm {}
	find lib/ -name '*.js' | xargs -I {} mv {} {}.flow
	`npm bin`/babel src --out-dir lib
	rm -r lib/flow-test

build-and-publish: git-clean git-ancestor check 
	yarn
	make build
	`npm bin`/bump prerelease
	make build
	npm publish
	rm -rf lib
	git add package.json
	git commit -m `node -e 'process.stdout.write(require("./package.json").version);'`
	git tag v`node -e 'process.stdout.write(require("./package.json").version);'`
	git push
	git push --tags

git-clean:
	test ! -n "$$(git status --porcelain)"

