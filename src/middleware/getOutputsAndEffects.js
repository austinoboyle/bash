import React from 'react';

import {parseCommandText, goToPath, parsePath, pathStringToArray} from '../util';
import {cd, mkdir, rm, touch, clear} from '../actions/terminalActions';
import {initializeVim} from '../actions/vimActions';
import Error from '../components/outputs/Error';
import PlainText from '../components/outputs/PlainText';
import LS from '../components/outputs/LS';

export default function getOutputsAndEffects(text, path, currentDirTree, user){
    let {command, kwflags, flags, dirStrings} = parseCommandText(text);
    currentDirTree = JSON.parse(JSON.stringify(currentDirTree));
    let paths = [];
    if (dirStrings.length === 0) {
        paths = [path];
    } else {
        paths = dirStrings.map(dirString => {
            return path.concat(pathStringToArray(dirString));
        });
    }

    let outputs = [];
    let effects = [];
    console.log("PATHS", paths)
    switch (command) {
        case '':
            outputs.push(null);
            break;
        case 'clear':
            effects.push(clear());
            break;
        case 'ls':
            paths.forEach(path => {
                const dirForCommand = goToPath(currentDirTree, path);
                switch (typeof dirForCommand) {
                    case 'object':
                        outputs.push(<LS dirForCommand={dirForCommand} />);
                        break;
                    case 'string':
                        outputs.push(<PlainText text={path[path.length - 1]}/>);
                        break;
                    default:
                        outputs.push(<Error msg={`${command}: cannot access '${'/' + path.slice(1).join('/')}': No such file or directory`}/>);
                }
            });
            break;
        case 'cd':
            if (paths.length > 1) {
                outputs.push(<Error msg={`${command}: too many arguments.`}/>);
            } else if (dirStrings.length === 0) {
                effects.push(cd(['/', 'home', 'austinoboyle']));
            } else {
                const fullPath = paths[0];
                const dirForCommand = goToPath(currentDirTree, fullPath);
                switch (typeof dirForCommand) {
                    //Path leads to a file
                    case 'string':
                        outputs.push(<Error msg={`bash: cd: ${fullPath[fullPath.length - 1]}: Not a directory.`}/>);
                        break;
                    //Valid path
                    case 'object':
                        outputs.push(null);
                        effects.push(cd(parsePath(paths[0])));
                        break;
                    // Path doesn't exist
                    default:
                        outputs.push(<Error msg={`bash: cd: ${dirStrings[0]}: no such file or directory.`}/>);
                }
            }
            break;
        case 'mkdir':
            if (dirStrings.length < 1) {
                return <Error msg={`mkdir: missing operand`} />;                   
            } else {
                paths.forEach((path, index) => {
                    const lastElement = path.slice(path.length - 1);
                    const pathToLastElement = path.slice(0,path.length - 1);
                    const dirForCommand = goToPath(currentDirTree, pathToLastElement);
                    if (typeof dirForCommand === 'object') {
                        effects.push(mkdir(pathToLastElement, lastElement));
                        outputs.push(null);
                    } else {
                        outputs.push(<Error msg={`mkdir: cannot create directory ${dirStrings[index] || path.join('/')}: No such file or directory`} />);
                    }
                });
            }
            break;
        case 'touch':
            if (dirStrings.length < 1) {
                outputs.push(<Error msg={`touch: missing operand`} />);                   
            } else {
                paths.forEach((path, index) => {
                    const lastElement = path.slice(path.length - 1);
                    const pathToLastElement = path.slice(0,path.length - 1);
                    const dirForCommand = goToPath(currentDirTree, pathToLastElement);
                    if (typeof dirForCommand === 'object') {
                        effects.push(touch(pathToLastElement, lastElement));
                        outputs.push(null);
                    } else {
                        outputs.push(<Error msg={`touch: cannot create file ${dirStrings[index] || path.join('/')}: No such file or directory`} />);
                    }
                });
            }
            break;   
        case 'rm':
            if (dirStrings.length < 1) {
                outputs.push(<Error msg={`rm: missing operand`} />);                   
            } else {
                paths.forEach((path, index) => {
                    const lastElement = path.slice(path.length - 1);
                    const pathToLastElement = path.slice(0,path.length - 1);
                    const dirForCommand = goToPath(currentDirTree, pathToLastElement.concat(lastElement));
                    switch (typeof dirForCommand){
                        case 'string':
                            effects.push(rm(pathToLastElement, lastElement));
                            outputs.push(null);
                            break;
                        case 'object':
                            if (flags.includes('r')) {
                                effects.push(rm(pathToLastElement, lastElement));
                                outputs.push(null);
                            }else {
                                outputs.push(<Error msg={`rm: cannot remove '${dirStrings[index] || path.join('/')}': Is a directory`} />);                                
                            }
                            break;
                        default:
                            outputs.push(<Error msg={`rm: cannot remove '${dirStrings[index] || path.join('/')}': No such file or directory`} />);
                    }
                });
            }
            break;
        case 'cat':
            if (dirStrings.length < 1) {
                outputs.push(<Error msg={`cat: missing operand`} />);                   
            } else {
                paths.forEach((path, index) => {
                    const lastElement = path.slice(path.length - 1);
                    const pathToLastElement = path.slice(0,path.length - 1);
                    const fileContents = goToPath(currentDirTree, pathToLastElement.concat(lastElement));
                    switch (typeof fileContents){
                        case 'string':
                            outputs.push(<PlainText text={fileContents} />);
                            break;                           
                        case 'object':
                            outputs.push(<Error msg={`cat: '${dirStrings[index] || path.join('/')}': Is a directory`} />);
                            break;
                        default:
                            outputs.push(<Error msg={`cat: '${dirStrings[index] || path.join('/')}': No such file or directory`} />);
                    }
                });
            }
            break;
        case 'vim':
            if (dirStrings.length !== 1) {
                outputs.push(<Error msg={`vim: can only handle exactly 1 file right now`} />);                   
            } else {
                let pathToFile = pathStringToArray(dirStrings[0]);
                const fullPath = path.concat(pathToFile);
                const pathToContainerDir = fullPath.slice(0, fullPath.length - 1);
                const containerDir = goToPath(currentDirTree, pathToContainerDir);
                const file = goToPath(currentDirTree, fullPath);
                // PATH TO FILE CANT BE MADE
                if (containerDir === undefined) {
                    outputs.push(<Error msg={`vim: can't handle non-existent dirs right now`} />);
                // PATH LEADS TO A DIR, NOT A FILE
                } else if (typeof file === 'object') {
                    outputs.push(<Error msg={`vim: can't handle dirs right now`} />);       
                } else if (typeof file === 'undefined') {
                    outputs.push(<Error msg={`vim: can't handle undefined files right now`} />);       
                } else {
                    outputs.push(null);
                    effects.push(initializeVim(pathToFile));
                }
            }
            break;
            
        default:
            outputs.push(<Error msg={`${command}: command not found`}/>);
    }
    return {
        outputs,
        effects
    };
}