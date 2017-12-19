'use strict';

const initialState = {
    path: ['~']
};

export function terminalReducer(state=initialState, action){
    switch (action.type) {
        case "COMMAND":
            return state;
    }
    return state;
};