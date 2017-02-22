#!/usr/bin/env node

// Check user's node version
const pkg = require('../package.json');
const expectedVersion = pkg.engines.node;
if (!require('semver').satisfies(process.version, expectedVersion)) {
  console.log(require('log-symbols').error,
    'Nuxeo CLI requires Node.js version ' + expectedVersion + '. ' +
    'Current version is ' + process.version + '.');
  process.exit(1);
}

// Notify if update is required
const updateNotifier = require('update-notifier');
updateNotifier({
  pkg
}).notify();

const optimist = require('yargs')
  .usage('Usage: $0 <command> [options] [args]')
  .command('bootstrap', 'Bootstrap Nuxeo project, bundles or several components in the current folder.', require('../commands/bootstrap'))
  .example('$0 bootstrap operation listener')
  .command('hotreload', 'Hotreload your latest modifications in a Nuxeo Server.', require('../commands/hotreload'))
  .example('$0 hotreload configure')
  .command('sample', 'Generate a Sample project to discover how things work.', require('../commands/sample'))
  .example('$0 sample')
  .command('update', 'Update Nuxeo CLI to get latest features.', require('../commands/update'))
  .options('h', {
    alias: 'help',
    describe: 'Print Nuxeo CLI version',
    type: 'boolean'
  })
  .options('v', {
    alias: 'version',
    describe: 'Show version',
    type: 'boolean'
  });
const argv = optimist.argv;

if (argv.version) {
  require('../lib/display_version')(console.log);
  process.exit(0);
}

if (argv._.length === 0) {
  optimist.showHelp();
  process.exit(argv.help ? 0 : 1);
}
