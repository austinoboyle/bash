import {initialState, terminalReducer} from './terminalReducer';
describe('Terminal Reducer', () => {
    it('handles SUBMIT_COMMAND', () => {
        const action = {
            type: "SUBMIT_COMMAND",
            payload: 'test'
        }
        expect(terminalReducer(undefined, action).commandHistory)
            .toEqual(initialState.commandHistory.concat([action.payload]))
    })

    it('handles empty SUBMIT_COMMAND', () => {
        const action = {
            type: "SUBMIT_COMMAND",
            payload: ''
        }
        expect(terminalReducer(undefined, action).commandHistory)
            .toEqual(initialState.commandHistory);
    })

    it('handles CLEAR', () => {
        const action = {type: "CLEAR"};
        expect(terminalReducer({...initialState, outputs: ['test']}, action))
            .toEqual(initialState)
    })

    it('handles COPY to directory', () => {
        let action = {
            type: "COPY",
            payload: {
                source: ['/', 'home'],
                dest: ['/', 'home']
            }
        };
        expect(terminalReducer(undefined, action).dirTree['/'].home.home)
            .toEqual(initialState.dirTree['/'].home)
    })
    it('handles COPY to file', () => {
        let action = {
            type: "COPY",
            payload :{
                source: ['/', 'home', 'austinoboyle', 'resume.md'],
                dest: ['/', 'resume.txt']
            }
        };
        const newTree = terminalReducer(undefined, action).dirTree;
        expect(newTree['/']['resume.txt'])
            .toEqual(initialState.dirTree["/"].home.austinoboyle["resume.md"])
    })
    it('handles NEW_OUTPUT', () => {
        const action = {
            type: "NEW_OUTPUT",
            payload: ['test']
        };
        expect(terminalReducer(undefined, action).outputs)
            .toEqual(initialState.outputs.concat(action.payload));
    })
    it('handles CHANGE_DIR', () => {
        const action = {
            type: "CHANGE_DIR",
            payload: ['/']
        }
        expect(terminalReducer(undefined, action).path)
            .toEqual(action.payload)
    })
    it('handles MAKE_DIRECTORY', () => {
        const action = {
            type: "MAKE_DIRECTORY",
            payload: {
                path: ['/', 'home'],
                newDir: 'test'
            }
        }
        expect(terminalReducer(undefined, action).dirTree['/'].home.test)
            .toEqual({})
    })
    it('handles TOUCH', () => {
        const action = {
            type: "TOUCH",
            payload: {
                path: ['/', 'home'],
                newFile: 'test.txt'
            }
        }
        expect(terminalReducer(undefined, action).dirTree['/'].home['test.txt'])
            .toEqual('')
    })
    it('handles REMOVE', () => {
        const action = {
            type: "REMOVE",
            payload: {
                path: ['/'],
                file: 'home'
            }
        }
        expect(terminalReducer(undefined, action).dirTree)
            .toEqual({'/': {}})
    })
    it('handles RENAME', () => {
        const action = {
            type: "RENAME",
            payload: {
                dir: ['/', 'home'],
                prev: 'austinoboyle',
                next: 'test'
            }
        };
        const newTree = terminalReducer(undefined, action).dirTree;
        expect(newTree['/'].home.austinoboyle).toBeUndefined();
        expect(newTree['/'].home.test)
            .toEqual(initialState.dirTree["/"].home.austinoboyle)
    })
    it('handles MOVE', () => {
        const action = {
            type: "MOVE",
            payload: {
                source: ['/', 'home', 'austinoboyle'],
                dest: ['/']
            }
        }
        const newTree = terminalReducer(undefined, action).dirTree;
        expect(newTree['/'].austinoboyle)
            .toEqual(initialState.dirTree["/"].home.austinoboyle)
        expect(newTree['/'].home.austinoboyle).toBeUndefined();
    })
    it('handles INITIALIZE_VIM', () => {
        const action = {
            type: "INITIALIZE_VIM",
            payload: ['resume.md']
        }
        const res = terminalReducer(undefined, action);
        expect(res.isActive).toBe(false);
        expect(res.vim.pathToFile).toEqual(action.payload);
    })
    it('handles QUIT_VIM', () => {
        const action = {type: "QUIT_VIM"};
        expect(terminalReducer(undefined, action).isActive).toBe(true);
    });
    it('handles WRITE', () => {
        const action = {
            type: "WRITE",
            payload: 'test'
        };
        const state = {...initialState, vim: {pathToFile: ['resume.md']}};
        const newTree = terminalReducer(state, action).dirTree;
        expect(newTree['/'].home.austinoboyle['resume.md'])
            .toEqual('test');
    })
})