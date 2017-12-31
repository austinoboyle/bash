import {goToPath} from '../util';

const initialState = {
    path: ['/', 'home', 'austinoboyle'],
    isActive: true,
    user: 'austinoboyle',
    outputs: [],
    dirTree: {
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
    },
    commandHistory: [],
    vim: {
        pathToFile: null
    }
};

export function terminalReducer(state=initialState, action){
    let newDirTree = {...state.dirTree};
    let pointer = newDirTree;
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
            console.log("REMOVE", action.payload.path, action.payload.file);
            for (let path of action.payload.path) {
                pointer = pointer[path];
            }
            delete pointer[action.payload.file];
            return {...state, dirTree: newDirTree}
        case 'INITIALIZE_VIM':
            return {...state, isActive: false, vim: {pathToFile: action.payload}};
        case 'QUIT_VIM':
            return {...state, isActive: true};
        case "WRITE":
            const fullPathToFile = state.path.concat(state.vim.pathToFile);
            const pathToContainerDir = fullPathToFile.slice(0, fullPathToFile.length - 1);
            let containerDir = goToPath(state.dirTree, pathToContainerDir);
            containerDir[fullPathToFile[fullPathToFile.length - 1]] = action.payload;
            return {...state};
        default: 
            return state;
    }
};