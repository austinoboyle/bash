;

const initialState = {
    path: ['~']
};

export function vimReducer(state=initialState, action){
    switch (action.type) {
        case "COMMAND":
            return state;
        default:
            return state;
    }
};