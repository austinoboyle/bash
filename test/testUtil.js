require('babel-core/register')({
    presets: ['react', 'env', 'stage-2']
});

// import {parseCommandText, validateDir, goToPath} from '../src/util';
const util = require('../src/util');
const parseCommandText = util.parseCommandText;
const validateDir = util.validateDir;
const goToPath = util.goToPath;

parseCommandText('  ls  --test -ta -asd  testDir ---blablas   test/test  test2  ');
parseCommandText('ls');
parseCommandText('cd --');
parseCommandText('cd -');