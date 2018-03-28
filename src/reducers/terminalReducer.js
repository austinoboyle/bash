import {goToPath, isDirectory} from '../util';
import {resume} from './content/resume';
import {PROFILE} from '../constants';
import _ from 'lodash';

export const initialState = {
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
/**
 * 
 * 
 * @export
 * @param {any} [state=initialState] 
 * @param {any} action 
 * @returns 
 */
export function terminalReducer(state=initialState, action){
    let newDirTree = _.cloneDeep(state.dirTree);
    let pointer = newDirTree;
    let prevContents;
    switch (action.type) {
        
        /**
         * @param {any} payload
         * @returns state with payload apppended to commandHistory
         */
        case "SUBMIT_COMMAND": {
            // Only add non-empty commands to history
            const newCommand = action.payload.length > 0 ? [action.payload] : [];
            return {
                ...state, 
                commandHistory: newCommand.concat(state.commandHistory)
            };
        }


        /**
         * @returns state with empty outputs
         */
        case "CLEAR":
            return {...state, outputs: []};
        

        /**
         * @property {Array<String>} payload.source the file or directory you
         * are copying from
         * @property {Array<String>} payload.dest the location you are copying to
         * @returns state with updated dirTree including copied file
         */
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


        /**
         * @param {Array} payload new React elements to output
         * @returns state with new outputs concatenated to old ones
         */
        case "NEW_OUTPUT":
            return {...state, outputs: state.outputs.concat(action.payload)};
        

        /**
         * @param {Array<String>} payload new path array
         * @returns state with updated path array
         */
        case 'CHANGE_DIR':
            return {...state, path: action.payload};


        /**
         * @param {Array<String>} payload.path container dir to make new dir
         * @param {String} payload.newDir string name of new directory
         * @returns state with dirTree updated with new Directory
         */
        case 'MAKE_DIRECTORY':
            for (let path of action.payload.path) {
                pointer = pointer[path];
            }
            pointer[action.payload.newDir] = {};
            return {...state, dirTree: newDirTree};


        /**
         * @param {Array<String>} payload.path path of container dir
         * @param {String} payload.newFile filename of new file
         * @returns state with dirTree updated with new file
         */
        case 'TOUCH':
            for (let path of action.payload.path) {
                pointer = pointer[path];
            }
            pointer[action.payload.newFile] = '';
            return {...state, dirTree: newDirTree};   
            

        /**
         * @param {Array<String>} payload.path path of container dir
         * @param {String} payload.file string name of file/folder to delete
         * @returns dirTree updated with deleted file/folder
         */
        case 'REMOVE':
            for (let path of action.payload.path) {
                pointer = pointer[path];
            }
            delete pointer[action.payload.file];
            return {...state, dirTree: newDirTree}


        /**
         * @param {Array<String>} payload.dir path of container dir
         * @param {String} payload.prev old file/folder name string
         * @param {String} payload.next new file/folder name string
         * @returns updated dirTree with renamed folder/file
         */
        case 'RENAME':
            action.payload.dir.forEach(path => {
                pointer = pointer[path]
            });
            prevContents = _.cloneDeep(pointer[action.payload.prev]);
            delete pointer[action.payload.prev];
            pointer[action.payload.next] = prevContents;
            return {...state, dirTree: newDirTree};


        /**
         * @param {Array<String>} payload.source path to file/folder being moved
         * @param {Array<String>} payload.dest path to new file/folder location
         * @returns state updated with new dirTree
         */
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


        /**
         * @param {Array<String>} payload array of relative path to file
         * @returns state with isActive false and vim's pathToFile updated
         */
        case 'INITIALIZE_VIM':
            return {...state, isActive: false, vim: {pathToFile: action.payload}};

        
        /**
         * @returns state with isActive true
         */
        case 'QUIT_VIM':
            return {...state, isActive: true};

            
        /**
         * @param {String} payload contents to write to the opened file
         * @returns state with dirTree updated to include new file contents
         */
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