/**
 * Write a program that will print out the total number of lines in the file.
 * Notice that the 8th column contains a person’s name. Write a program that loads in this data and creates an array with all name strings. Print out the 432nd and 43243rd names.
 * Notice that the 5th column contains a form of date. Count how many donations occurred in each month and print out the results.
 * Notice that the 8th column contains a person’s name. Create an array with each first name. Identify the most common first name in the data and how many times it occurs.
 */

const fs = require('fs');
const path = require('path');
// const readline = require('readline');
// const Stream = require('stream');
const eventStream = require('event-stream');

const pathToFile = path.resolve('./', 'indiv18/itcont.txt');
const readStream = fs.createReadStream(pathToFile);
// const outStream = new Stream();
// const rl = readline.createInterface(readStream, outStream);

let lineCount = 0;
const names = [];

const dateDonationCount = [];
const dateDonations = {};
const firstNames = [];
const dupeNames = {};

function addDataToList(obj, data) {
    if (obj[data]) {
        ++obj[data];
    } else {
        obj[data] = 1;
    }
}

readStream
    .pipe(eventStream.split())
    .pipe(eventStream.mapSync(line => {
        ++lineCount;

        const dataInLine = line.split('|');
        const name = dataInLine[7];

        if (lineCount === 443 || lineCount === 43243){
            names.push(name);
        }

        if (!line || !name) {
            return;
        }
        let firstHalfOfName = name.split(', ')[1];
        if (firstHalfOfName !== undefined) {
            firstHalfOfName = firstHalfOfName.trim();
            if (firstHalfOfName.includes(' ') && firstHalfOfName !== ' ') {
                const firstName = firstHalfOfName.split(' ')[0].trim();
                firstNames.push(firstName);
                addDataToList(dupeNames, firstName);
            } else {
                firstNames.push(firstHalfOfName);
                addDataToList(dupeNames, firstHalfOfName);
            }
        }

        const timeDonation = dataInLine[4].slice(0, 6);
        const formattedDate = timeDonation.slice(0, 4) + ' - ' + timeDonation.slice(4, 6);
        addDataToList(dateDonations, formattedDate);
        dateDonationCount.push(formattedDate);
    }).on('error', err => {
        console.error(err);
    }).on('end', () => {
        console.log('Line count: ', lineCount);
        console.log('423nd name: ', names[0]);
        console.log('43243rd name: ', names[1]);
    
        const sortedDupeNames = Object.entries(dupeNames).sort((a, b) => {
            return b[1] - a[1];
        });
    
        console.log('Most common first name: ', sortedDupeNames[0]);
    
        Object.entries(dateDonations).forEach((value, key) => {
            console.log(`Donations per month - year: ${value[0]} and donation count ${value[1]}`);
        });
    }));

// rl.on('line', (line) => {
//     ++lineCount;

//     const dataInLine = line.split('|');
//     const name = dataInLine[7];
//     names.push(name);

//     let firstHalfOfName = name.split(', ')[1];
//     if (firstHalfOfName !== undefined) {
//         firstHalfOfName = firstHalfOfName.trim();
//         if (firstHalfOfName.includes(' ') && firstHalfOfName !== ' ') {
//             const firstName = firstHalfOfName.split(' ')[0].trim();
//             firstNames.push(firstName);
//             addDataToList(dupeNames, firstName);
//         } else {
//             firstNames.push(firstHalfOfName);
//             addDataToList(dupeNames, firstHalfOfName);
//         }
//     }

//     const timeDonation = dataInLine[4].slice(0, 6);
//     const formattedDate = timeDonation.slice(0, 4) + ' - ' + timeDonation.slice(4, 6);
//     addDataToList(dateDonations, formattedDate);
//     dateDonationCount.push(formattedDate);
// });

// rl.on('close', () => {
//     console.log('Line count: ', lineCount);
//     console.log('423nd name: ', names[422]);
//     console.log('43243rd name: ', names[43242]);

//     const sortedDupeNames = Object.entries(dupeNames).sort((a, b) => {
//         return b[1] - a[1];
//     });

//     console.log('Most common first name: ', sortedDupeNames[0]);

//     Object.entries(dateDonations).forEach((value, key) => {
//         console.log(`Donations per month - year: ${value[0]} and donation count ${value[1]}`);
//     });
// });
