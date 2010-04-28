require('./vendor/jspec/lib/jspec');
require('./vendor/jspec_dot_reporter/jspec_dot_reporter');
require('./unit/spec.helper');
require.paths.unshift("./lib");
JM = require("jm");

JSpec
  .exec('spec/unit/spec.js')
  .run({ reporter: JSpecDotReporter, fixturePath: 'spec/fixtures' })
  .report();
