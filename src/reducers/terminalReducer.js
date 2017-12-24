const initialState = {
    path: ['home', 'austinoboyle'],
    isActive: true,
    user: 'austinoboyle',
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
    }
};

export function terminalReducer(state=initialState, action){
    let newDirTree = {...state.dirTree};
    let pointer = newDirTree;
    switch (action.type) {
        case "COMMAND":
            return state;
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
        
        default: 
            return state;
    }
};