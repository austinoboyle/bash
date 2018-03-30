import React from 'react';
import * as _ from 'lodash';
import {
    parseCommandText,
    goToPath,
    parsePath,
    pathStringToArray,
    getFileExtension,
    pathArrayToString,
    isFileOrDirectory,
    isFile,
    isDirectory
} from '../util';
import {
    cd,
    mkdir,
    rm,
    touch,
    clear,
    execute,
    move,
    rename,
    copy
} from '../actions/terminalActions';
import { initializeVim } from '../actions/vimActions';
import Error from '../components/outputs/Error/Error';
import PlainText from '../components/outputs/PlainText/PlainText';
import LS from '../components/outputs/LS/LS';
import { PROFILE } from '../constants';

/**
 * Get the outputs and effects that a command should invoke
 *
 * @export
 * @param {String} text user input to be parsed
 * @param {Array<String>} path current path in the terminal
 * @param {Object} currentDirTree current full dir tree
 * @param {String} user username
 * @returns {Object} {outputs, effects}:
 * - outputs {Array<JSX>}: array of child components of an OutputWrapper for the command
 * - effects {Array<Object>} array of actions to be dispatched
 *
 */
export default function getOutputsAndEffects(text, path, currentDirTree, user) {
    // eslint-disable-next-line
    let { command, kwflags, flags, dirStrings, args } = parseCommandText(text);
    currentDirTree = JSON.parse(JSON.stringify(currentDirTree));
    let paths = [path];
    if (dirStrings.length > 0) {
        paths = dirStrings.map(dirString => {
            return parsePath(path.concat(pathStringToArray(dirString)));
        });
    }

    let outputs = [];
    let effects = [];
    switch (command) {
        case '':
            break;
        case 'cat':
            if (dirStrings.length < 1) {
                outputs.push(<Error msg={`cat: missing operand`} />);
            } else {
                paths.forEach((path, index) => {
                    if (isFile(currentDirTree, path)) {
                        outputs.push(
                            <PlainText text={goToPath(currentDirTree, path)} />
                        );
                    } else if (isDirectory(currentDirTree, path)) {
                        outputs.push(
                            <Error
                                msg={`cat: '${dirStrings[index] ||
                                    path.join('/')}': Is a directory`}
                            />
                        );
                    } else {
                        outputs.push(
                            <Error
                                msg={`cat: '${dirStrings[index] ||
                                    path.join(
                                        '/'
                                    )}': No such file or directory`}
                            />
                        );
                    }
                });
            }
            break;

        case 'cd':
            if (paths.length > 1) {
                outputs.push(<Error msg={`${command}: too many arguments.`} />);
            } else if (dirStrings.length === 0) {
                effects.push(cd(PROFILE.HOME_DIR_ARR));
            } else {
                const fullPath = paths[0];
                if (isFile(currentDirTree, fullPath)) {
                    outputs.push(
                        <Error
                            msg={`bash: cd: ${
                                fullPath[fullPath.length - 1]
                            }: Not a directory.`}
                        />
                    );
                } else if (isDirectory(currentDirTree, fullPath)) {
                    effects.push(cd(parsePath(fullPath)));
                } else {
                    outputs.push(
                        <Error
                            msg={`bash: cd: ${
                                dirStrings[0]
                            }: no such file or directory.`}
                        />
                    );
                }
            }
            break;
        case 'clear':
            effects.push(clear());
            break;
        case 'cp':
            if (dirStrings.length < 1) {
                outputs.push(<Error msg={`cp: missing file operand`} />);
            } else if (dirStrings.length < 2) {
                outputs.push(
                    <Error
                        msg={`cp: missing destination file operand after '${
                            dirStrings[0]
                        }'`}
                    />
                );
            } else {
                const sources = _.dropRight(paths);
                const dest = _.last(paths);
                const validSources = [];

                sources.forEach((source, i) => {
                    if (!isFileOrDirectory(currentDirTree, source)) {
                        outputs.push(
                            <Error
                                key={i}
                                msg={`cp: '${dirStrings[0]}' and '${
                                    dirStrings[1]
                                }' are the same file`}
                            />
                        );
                    } else {
                        validSources.push(source);
                    }
                });
                if (sources.length > 1 && !isDirectory(currentDirTree, dest)) {
                    outputs = [
                        <Error
                            msg={`cp: target '${_.last(
                                dirStrings
                            )}' is not a directory`}
                        />
                    ];
                } else {
                    _.uniqWith(validSources, _.isEqual).forEach((source, i) => {
                        if (_.isEqual(source, dest)) {
                            outputs.push(
                                <Error
                                    key={i}
                                    msg={`mv: '${dirStrings[i]}' and '${
                                        dirStrings[dirStrings.length - 1]
                                    }' are the same file`}
                                />
                            );
                        } else if (
                            isDirectory(currentDirTree, source) &&
                            !flags.includes('r')
                        ) {
                            outputs.push(
                                <Error
                                    key={i}
                                    msg={`cp: -r flag is missing; ommiting directory '${
                                        dirStrings[i]
                                    }'`}
                                />
                            );
                        } else {
                            effects.push(copy(source, dest));
                        }
                    });
                }
            }
            break;
        case 'echo':
            outputs.push(<PlainText key={1} text={args.join(' ')} />);
            break;
        case 'ls':
            paths.forEach((path, i) => {
                if (isFile(currentDirTree, path)) {
                    outputs.push(
                        <PlainText key={i} text={path[path.length - 1]} />
                    );
                } else if (isDirectory(currentDirTree, path)) {
                    outputs.push(
                        <LS
                            key={i}
                            dirForCommand={goToPath(currentDirTree, path)}
                        />
                    );
                } else {
                    outputs.push(
                        <Error
                            key={i}
                            msg={`${command}: cannot access '${
                                dirStrings[i]
                            }': No such file or directory`}
                        />
                    );
                }
            });
            break;
        case 'mv':
            // Must have at least two dirStrings as args
            if (dirStrings.length < 1) {
                outputs.push(<Error msg={`mv: missing file operand`} />);
            } else if (dirStrings.length < 2) {
                outputs.push(
                    <Error
                        msg={`mv: missing destination file operand after '${
                            dirStrings[0]
                        }'`}
                    />
                );
            } else {
                // Get sources, destination, and valid sources
                const sources = paths.slice(0, paths.length - 1);
                let validSources = [];
                const dest = paths[paths.length - 1];
                sources.forEach((source, i) => {
                    if (!isFileOrDirectory(currentDirTree, source)) {
                        outputs.push(
                            <Error
                                msg={`mv: cannot stat '${
                                    dirStrings[i]
                                }': no such file or directory`}
                            />
                        );
                    } else {
                        validSources.push(source);
                    }
                });
                if (validSources.length > 0 && sources.length === 1) {
                    const parsedSource = parsePath(validSources[0]);
                    // If only 1 source and dest is directory, move source there
                    // TODO - If file already exists with that path
                    if (_.isEqual(parsedSource, parsePath(dest))) {
                        outputs.push(
                            <Error
                                msg={`mv: '${dirStrings[0]}' and '${
                                    dirStrings[1]
                                }' are the same file`}
                            />
                        );
                    } else if (isDirectory(currentDirTree, dest)) {
                        effects.push(move(parsedSource, dest));
                    } else if (isDirectory(currentDirTree, _.dropRight(dest))) {
                        effects.push(move(parsedSource, _.dropRight(dest)));
                        const updatedSource = dest
                            .slice(0, dest.length - 1)
                            .concat(parsedSource[parsedSource.length - 1]);
                        effects.push(
                            rename(updatedSource, dest.slice(dest.length - 1))
                        );
                    }
                } else if (validSources.length > 0) {
                    // Invalid dest error overrides other errors with more than
                    // 1 source passed in
                    if (!isDirectory(currentDirTree, dest)) {
                        outputs = [
                            <Error
                                msg={`mv: target '${
                                    dirStrings[dirStrings.length - 1]
                                }' is not a directory`}
                            />
                        ];
                    } else {
                        _.uniqWith(validSources, _.isEqual).forEach(
                            (source, i) => {
                                if (_.isEqual(source, dest)) {
                                    outputs.push(
                                        <Error
                                            msg={`mv: '${dirStrings[i]}' and '${
                                                dirStrings[
                                                    dirStrings.length - 1
                                                ]
                                            }' are the same file`}
                                        />
                                    );
                                }
                                effects.push(move(source, dest));
                            }
                        );
                    }
                }
            }
            break;
        case 'mkdir':
            // Must have a non-flag argument
            if (dirStrings.length < 1) {
                outputs.push(<Error msg={`mkdir: missing operand`} />);
            } else {
                paths.forEach((path, index) => {
                    const lastElement = _.last(path);
                    const pathToLastElement = _.dropRight(path);
                    if (isFileOrDirectory(currentDirTree, path)) {
                        outputs.push(
                            <Error
                                msg={`mkdir: cannot create directory ${
                                    dirStrings[index]
                                }: File exists`}
                            />
                        );
                    } else if (isDirectory(currentDirTree, pathToLastElement)) {
                        effects.push(mkdir(pathToLastElement, lastElement));
                    } else {
                        outputs.push(
                            <Error
                                msg={`mkdir: cannot create directory ${
                                    dirStrings[index]
                                }: No such file or directory`}
                            />
                        );
                    }
                });
            }
            break;
        case 'rm':
            //
            if (dirStrings.length < 1) {
                outputs.push(<Error msg={`rm: missing operand`} />);
            } else {
                paths.forEach((path, index) => {
                    const lastElement = _.last(path);
                    const pathToLastElement = _.dropRight(path);
                    // Remove file if path leads to one
                    if (isFile(currentDirTree, path)) {
                        effects.push(rm(pathToLastElement, lastElement));
                        // Only remove dir if r flag is specified
                    } else if (isDirectory(currentDirTree, path)) {
                        if (flags.includes('r')) {
                            effects.push(rm(pathToLastElement, lastElement));
                        } else {
                            outputs.push(
                                <Error
                                    msg={`rm: cannot remove '${
                                        dirStrings[index]
                                    }': Is a directory`}
                                />
                            );
                        }
                        // Output error if path not valid
                    } else {
                        outputs.push(
                            <Error
                                msg={`rm: cannot remove '${
                                    dirStrings[index]
                                }': No such file or directory`}
                            />
                        );
                    }
                });
            }
            break;
        case 'touch':
            if (dirStrings.length < 1) {
                outputs.push(<Error msg={`touch: missing operand`} />);
            } else {
                paths.forEach((path, index) => {
                    const lastElement = _.last(path);
                    const pathToLastElement = _.dropRight(path);
                    if (isDirectory(currentDirTree, pathToLastElement)) {
                        effects.push(touch(pathToLastElement, lastElement));
                    } else {
                        outputs.push(
                            <Error
                                msg={`touch: cannot create file ${dirStrings[
                                    index
                                ] ||
                                    path.join('/')}: No such file or directory`}
                            />
                        );
                    }
                });
            }
            break;
        case 'vim':
            if (dirStrings.length !== 1) {
                outputs.push(
                    <Error
                        msg={`vim: can only handle exactly 1 file right now`}
                    />
                );
            } else {
                const relativePath = pathStringToArray(dirStrings[0]);
                const fullPath = paths[0];
                const pathToContainerDir = _.dropRight(fullPath);
                // PATH TO FILE CANT BE MADE
                if (!isFileOrDirectory(currentDirTree, pathToContainerDir)) {
                    outputs.push(
                        <Error
                            msg={`vim: can't handle non-existent dirs right now`}
                        />
                    );
                }
                // Valid Path
                if (isFile(currentDirTree, fullPath)) {
                    effects.push(initializeVim(relativePath));
                    // PATH LEADS TO A DIR, NOT A FILE
                } else if (isDirectory(currentDirTree, fullPath)) {
                    outputs.push(
                        <Error msg={`vim: can't handle dirs right now`} />
                    );
                    // File doesn't exist yet
                } else {
                    outputs.push(
                        <Error
                            msg={`vim: can't handle undefined files right now`}
                        />
                    );
                }
            }
            break;

        default:
            // Check for a path to an executable
            const couldBeDirOrFile = command.includes('/') || command === '~';
            if (couldBeDirOrFile) {
                const relativePath = pathStringToArray(command);
                const fullPath = parsePath(path.concat(relativePath));
                const fileName = _.last(fullPath);
                if (
                    isFile(currentDirTree, fullPath) &&
                    getFileExtension(fileName) === 'sh'
                ) {
                    effects.push(execute(goToPath(currentDirTree, fullPath)));
                } else if (isFile(currentDirTree, fullPath)) {
                    outputs.push(
                        <Error msg={`bash: '${fileName}' is not executable`} />
                    );
                } else if (isDirectory(currentDirTree, fullPath)) {
                    outputs.push(
                        <PlainText
                            text={`bash: ${pathArrayToString(
                                relativePath
                            )}: Is a directory`}
                        />
                    );
                } else {
                    outputs.push(
                        <Error
                            msg={`bash: ${pathArrayToString(
                                relativePath
                            )}: No such file or directory`}
                        />
                    );
                }
            } else {
                outputs.push(<Error msg={`${command}: command not found`} />);
            }
    }
    return {
        outputs,
        effects
    };
}
