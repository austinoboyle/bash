const initialState = {
    pathToFile: null
};

export function vimReducer(state=initialState, action){
    switch (action.type) {
        case "COMMAND":
            return state;
        case "INITIALIZE_VIM":
            return {...state, pathToFile: action.payload};
        case "QUIT_VIM":
            // return {...state, pathToFile: null};

        default:
            return state;
    }
};