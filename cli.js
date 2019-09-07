#!/usr/bin/env node
const chalk = require('chalk')
const fn = require('./lib/functions')
const exec = require('child_process').execSync

// Parse arguments
let args = process.argv.splice(2, process.argv.length)
const DEBUG = process.argv.indexOf('--debug') >= 0

args = args.filter(arg => arg !== '--debug')

if (args.length === 0) {
  console.log('No command specified.')
  process.exit(0)
}

let CMD = args.shift()

// Process commands
switch (cmd.trim().toLowerCase()) {
  case 'configure':
    fn.configure(DEBUG)
    return

  case 'setup':
    fn.setup()
    return

  case 'deploy':
    console.log(chalk.magenta(`\n\nConfiguring environment variables...`))
    fn.configure(DEBUG)
    console.log(chalk.magenta(`\n\nDeploying cloud functions...`))
    console.log(chalk.gray(exec('firebase deploy --only functions')))
    return
}