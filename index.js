const path = require('path');
const fs = require('fs');

const winston = require('winston');
winston.level = process.env.LOG_LEVEL || 'warn';
// LOG_LEVEL=debug webpack --config ...

const defaultOjCorePath = "node_modules/oraclejet/dist/js/libs/oj/debug/ojcore.js";

module.exports = class ojPlugin {

	/**
	 * ojCorePath (String): location where to find ojcore
	 * restoreOjCore (Boolean): whether to restore ojcore after compilation or not
	 * @param {*} options
	 */
	constructor(options = {}) {
		this.ojCorePath = options.ojCorePath || defaultOjCorePath;
		this.restoreOjCore = options.restoreOjCore !== undefined ? options.restoreOjCore : true;
	}

	apply(compiler) {
		const ojCore = path.join(process.cwd(), this.ojCorePath);
		const originalOjCore = fs.readFileSync(ojCore, 'utf8');
		if (originalOjCore.indexOf('myUniqueFunctionToReplaceInOjCore') === -1) {

			winston.debug(`Replacing ojs/ojcore.js in ${ojCore}`);

			const newOjCore = originalOjCore
			// avoid un-resolvable dynamic require
				.replace("require(requestedBundles,", "myUniqueFunctionToReplaceInOjCore(requestedBundles,")
				// we don't want 'oj' to be added in window
				.replace("typeof window !== 'undefined'", "false")
				// self equals to window, so we replace it for a new object
				.replace("_scope = self;", "_scope = {};")
				// if amd is present, we define the ojs/ojcore module returning our oj object
				.replace(";return oj;", `
                                                if(oj.__isAmdLoaderPresent()) {
                                                  define("ojs/ojcore", [], function() {
                                                    return oj;
                                                  } );
                                                }
                                                ;return oj;`);

			winston.debug(`Writing the new content...`);
			fs.writeFileSync(ojCore, newOjCore);

			compiler.plugin("done", (stats) => {
				if (this.restoreOjCore) {
					winston.debug(`Restoring ojcore.js with the original content...`);
					fs.writeFileSync(ojCore, originalOjCore);
				}
			});

		} else {
			winston.debug(`ojcore.js in ${ojCore} is already replaced, skipping replacement...`);
		}
	}
};
