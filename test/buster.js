var config = module.exports;

config["Test Browser"] = {

  // Advanced config
  extensions: [ require("buster-lint") ],
  "buster-lint": {
      linter: "jshint",
      linterOptions: {
        // Formatting Conventions
        indent: 2,
        maxlen: 100,
        white: false,

        // Syntax Conventions
        browser: true,
        immed: true,
        undef: true,
        trailing: true,
        onevar: false,
        camelcase: true,
        curly: true,
        newcap: true,
        quotemark: "double",
        laxcomma: true,
        nomen: false,

        // Code Conventions
        plusplus: false,
        bitwise: false,
        latedef: false,
        unused: true,
        forin: true,
        eqnull: true,
        strict: true,
        noarg: true,
        maxparams: 3,
        maxdepth: 3,
        maxstatements: 8,
        maxcomplexity: 7 // Cyclomatic Complexity Score
      }
  },

  // Basic config
  rootPath: "../",
  environment: "browser",
  sources: ["src/qmock.js"],
  tests: ["test/*-test.js"]
};

// config["Test Node"] = {
//     rootPath: "../",
//     environment: "node",
//     sources: ["lib/sut.js"],
//     tests: ["test/*-test.js"]
// }
