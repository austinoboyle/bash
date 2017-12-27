require('babel-core/register')({
    presets: ['react', 'env', 'stage-2']
});

// import {parseCommandText, validateDir, goToPath} from '../src/util';
const util = require('../src/util');
const parseCommandText = util.parseCommandText;
const validateDir = util.validateDir;
const goToPath = util.goToPath;
const parsePath = util.parsePath;
const dirTree = {
    '/':{ 
        home: {
            austinoboyle: {
                projects: {
                    'animated_menus.sh': '/animated-menus',
                    'bash.sh': '/bash'
                },
                'resume.md': "Austin O'Boyle - Resume"
            }
        }
    }
}


parseCommandText('  ls  --test -ta -asd  testDir ---blablas   test/test  test2  ');
parseCommandText('ls');
parseCommandText('cd --');
parseCommandText('cd -');

console.log(parsePath(['/', 'home', 'austinoboyle', '/', 'home']));

