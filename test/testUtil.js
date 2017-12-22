function parseCommandText(text){
    text = text.trim();
    const command = text.split(/\s+/g)[0];
    const args = text.split(/\s+/g).slice(1);
    const kwflags = args
        //Must contain leading double dash
        .filter(arg => new RegExp('^-{2}').test(arg))
        // Remove leading double dash
        .map(arg => arg.replace(/^--/, ""));

    const flags = args
        .filter(arg => new RegExp('^-{1}[^-]').test(arg))
        // Remove leading dashes
        .map(arg => arg.replace(/^-/, ""))
        // Turn into array of single flags
        .reduce((accum, flagString) => accum.concat(flagString.split('')), [])
        // Only unique elements
        .reduce((accum, flag) => accum.includes(flag) ? accum : accum.concat([flag]), []);

    const dirs = args.filter(arg => new RegExp('^[^-]+').test(arg));
    console.log('TEXT:', text);
    console.log(command, args, kwflags,flags, dirs);
    return {
        command,
        flags,
        dirs
    };
}

function validateDir(dirTree, path, dirs){
    console.log('VALIDATING DIRS', dirTree, path, dirs);
    
    for (let dir of ['/'].concat(path)) {
        dirTree = dirTree[dir];
        if (dirTree === null || dirTree === undefined) {
            console.log('NO SUCH DIR');
            
            return false;
        }
    }
    return true;
}

parseCommandText('  ls  --test -ta -asd  testDir ---blablas   test/test  test2  ');