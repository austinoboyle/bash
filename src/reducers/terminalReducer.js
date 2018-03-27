import {goToPath, isDirectory, isFile, isFileOrDirectory} from '../util';
import {resume} from './content/resume';
import {PROFILE} from '../constants';
import _ from 'lodash';
const initialState = {
    path: PROFILE.HOME_DIR_ARR,
    isActive: true,
    user: 'austinoboyle',
    outputs: [],
    dirTree: {
        '/':{ 
            home: {
                austinoboyle: {
                    projects: {
                        'animated_menus.sh': '/animated-menus',
                        'bash.sh': '/bash',
                        'scrape_linkedin.sh': 'https://github.com/austinoboyle/scrape-linkedin-selenium',
                        'uni_verse.sh': 'https://github.com/shaunbennett/qhacks2018-feapp',
                        'blog.sh': '/blog'
                    },
                    'resume.md': resume
                }
            }
        }
    },
    commandHistory: [],
    vim: {
        pathToFile: null
    }
};

export function terminalReducer(state=initialState, action){
    let newDirTree = _.cloneDeep(state.dirTree);
    let pointer = newDirTree;
    let prevContents;
    switch (action.type) {
        case "SUBMIT_COMMAND": {
            // Only add non-empty commands to history
            const newCommand = action.payload.length > 0 ? [action.payload] : [];
            return {...state, 
                commandHistory: newCommand.concat(state.commandHistory)
            };
        }
        case "CLEAR":
            return {...state, outputs: []};
        case 'COPY':
            prevContents = goToPath(state.dirTree, action.payload.source);
            _.dropRight(action.payload.dest).forEach(path => {
                pointer = pointer[path];
            })
            if (isDirectory(state.dirTree, action.payload.dest)) {
                pointer = pointer[_.last(action.payload.dest)]
                pointer[_.last(action.payload.source)] = prevContents;
            } else {
                pointer[_.last(action.payload.dest)] = prevContents;
            }            
            return {...state, dirTree: newDirTree};
        case "NEW_OUTPUT":
            return {...state, outputs: state.outputs.concat(action.payload)};
        case 'CHANGE_DIR':
            return {...state, path: action.payload};
        case 'MAKE_DIRECTORY':
            for (let path of action.payload.path) {
                pointer = pointer[path];
            }
            pointer[action.payload.newDir] = {};
            return {...state, dirTree: newDirTree};
        case 'TOUCH':
            for (let path of action.payload.path) {
                pointer = pointer[path];
            }
            pointer[action.payload.newFile] = '';
            return {...state, dirTree: newDirTree};            
        case 'REMOVE':
            for (let path of action.payload.path) {
                pointer = pointer[path];
            }
            delete pointer[action.payload.file];
            return {...state, dirTree: newDirTree}
        case 'RENAME':
            action.payload.dir.forEach(path => {
                pointer = pointer[path]
            });
            prevContents = _.cloneDeep(pointer[action.payload.prev]);
            delete pointer[action.payload.prev];
            pointer[action.payload.next] = prevContents;
            return {...state, dirTree: newDirTree};
        case 'MOVE':
            _.dropRight(action.payload.source).forEach(path => {
                pointer = pointer[path]
            });
            prevContents = _.cloneDeep(pointer[_.last(action.payload.source)]);
            delete pointer[_.last(action.payload.source)];
            pointer = newDirTree;
            for (let path of action.payload.dest) {
                pointer = pointer[path]
            }
            pointer[_.last(action.payload.source)] = prevContents;
            return {...state, dirTree: newDirTree};
        case 'INITIALIZE_VIM':
            return {...state, isActive: false, vim: {pathToFile: action.payload}};
        case 'QUIT_VIM':
            return {...state, isActive: true};
        case "WRITE":
            const fullPathToFile = state.path.concat(state.vim.pathToFile);
            _.dropRight(fullPathToFile).forEach(path => {
                pointer = pointer[path];
            });
            pointer[_.last(fullPathToFile)] = action.payload;
            return {...state, dirTree: newDirTree};
        default: 
            return state;
    }
};