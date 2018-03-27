export function changeMode() {
    console.log("MODE CHANGE");
    return {
        type: 'CHANGE_MODE'
    };
};

export function initializeVim(pathToFile) {
    return {
        type: "INITIALIZE_VIM",
        payload: pathToFile
    };
}

export function quit(){
    return {
        type: "QUIT_VIM"
    };
};

export function write(text){
    return {
        type: "WRITE",
        payload: text
    };
}