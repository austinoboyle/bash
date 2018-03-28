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

    it('handles CLEAR', () => {
        const action = {type: "CLEAR"};
        expect(terminalReducer({...initialState, outputs: ['test']}, action))
            .toEqual(initialState)
    })

    it('')
})