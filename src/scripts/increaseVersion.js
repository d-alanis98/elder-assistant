/**
 * Custom script for package.json version automatic increment, based on the argument that indicates the update level, according
 * to the Semantic Versioning 2.0.0 system (MAJOR.MINOR.PATCH) which can be:
 * - MAJOR version when you make incompatible API changes.
 * - MINOR version when you add functionality in a backwards compatible manner.
 * - PATCH version when you make backwards compatible bug fixes.
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const packageJson = require(`${process.cwd()}/package.json`);
const { applyStyles, RED_COLOR, BLUE_COLOR, GREEN_COLOR, WHITE_BACKGROUND, GREEN_BACKGROUND, WHITE_COLOR } = require('../utils/cliStyles');


const arguments = process.argv;
let patchUpdate = false; minorUpdate = false, majorUpdate = false;

if(arguments.includes('patch') || arguments.includes('PATCH'))
    patchUpdate = true;
else if(arguments.includes('minor') || arguments.includes('MINOR'))
    minorUpdate = true;
else if(arguments.includes('major') || arguments.includes('MAJOR'))
    majorUpdate = true;

//We get the existing the version
let version = packageJson.version;
//We validate the version, and set the default one if it is undefined
if(!version)
    version = '0.1.0';
//We show the exiting version
console.log(
    applyStyles(
        BLUE_COLOR,
        `Previous version ${version}`
    )
);

let versionMembers = version.split('.');
if(versionMembers.length < 3) { //If there are less than 3 members, we fill the remaining ones with zeros
    let missingMembers = 3 - versionMembers.length;
    for(let iterator = 0; iterator < missingMembers; iterator++)
        versionMembers.push(0);
} else if(versionMembers > 3) //If there are more than 3 version members, we discard the last one
    versionMembers.pop();
//At this point, the version has exactly 3 members, but some of them may still be strings, so we map and transform each one to number
try {
    versionMembers = versionMembers.map(versionMember => Number(versionMember));
} catch(error) {
    console.log(
        applyStyles(
            RED_COLOR,
            'Version syntax error, review package.json and try again'
        )
    );
    process.exit(1);
}

//We increase the corresponding version member
if(majorUpdate)
    versionMembers[0]++;
else if(minorUpdate)
    versionMembers[1]++;
else if(patchUpdate)
    versionMembers[2]++;

//We get the version in string format
const stringVersion = versionMembers.join('.');
console.log(
    applyStyles(
        GREEN_COLOR,
        `\nNew package version: ${ stringVersion }`
    )
);
//We set the package.json version in string format
packageJson.version = stringVersion;
//We save the changes in the package.json file
fs.writeFileSync(
    `${process.cwd()}/package.json`, 
    JSON.stringify(packageJson, null, 2)
);

console.log('\nPushing update to git repository');

//Command to add the package.json to staging area, commit and push to the git repository.
const command = 'git add package.json && git commit -m \"Update package.json\" && git push';
//We execute the command and handle the response
exec(command, (error, output, errorMessage) => {
    if(error)
        console.log(
            applyStyles(
                RED_COLOR,
                `\n${errorMessage}`
            )
        );
    else console.log(`\n\n${
        applyStyles(
            [GREEN_BACKGROUND, WHITE_COLOR],
            'Successful operation: '
        )}\n${ applyStyles(
            GREEN_COLOR,
            output
        )}`
    )
});
