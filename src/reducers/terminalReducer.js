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
    switch (action.type) {
        case "COMMAND":
            return state;
        case 'CHANGE_DIR':
            return {...state, path: action.payload};
        default: 
            return state;
    }
};