#!/usr/bin/env node
'use strict';
var meow = require('meow');
var fkill = require('fkill');
var chalk = require('chalk');
var inquirer = require('inquirer');
var psList = require('ps-list');
var numSort = require('num-sort');

var cli = meow({
	help: [
		'Usage',
		'  $ fkill [<pid|name> ...]',
		'',
		'Options',
		'  -f, --force  Force kill',
		'',
		'Examples',
		'  $ fkill 1337',
		'  $ fkill Safari',
		'  $ fkill 1337 Safari',
		'  $ fkill',
		'',
		'Run without arguments to use the interactive interface.'
	]
}, {
	alias: {
		f: 'force'
	}
});

function listProcesses(processes) {
	inquirer.prompt([{
		name: 'processes',
		message: 'Running processes:',
		type: 'list',
		choices: processes.sort(function (a, b) {
			numSort.asc(a.pid, b.pid);
		}).map(function (proc) {
			return {
				name: proc.name + ' ' + chalk.dim(proc.pid),
				value: proc.pid
			};
		})
	}], function (answer) {
		fkill(answer.processes, function (err) {
			if (err) {
				console.error(err.message);
				process.exit(1);
			}

			init();
		});
	});
}

function init() {
	psList({all: false}, function (err, processes) {
		if (err) {
			console.error(err.message);
			process.exit(1);
		}

		listProcesses(processes);
	});
}

if (cli.input.length === 0) {
	init();
	return;
}

fkill(cli.input, cli.flags, function (err) {
	if (err) {
		console.error(err.message);
		process.exit(1);
	}
});
