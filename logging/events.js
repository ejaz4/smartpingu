import fs from 'fs';

export const addEvent = (event) => {
    const currentEvents = JSON.parse(fs.readFileSync('events.json'));

    currentEvents.unshift(event);

    if (currentEvents.length >= 15) {
        currentEvents.pop();
    }

    fs.writeFileSync('events.json', JSON.stringify(currentEvents), {
        encoding: 'utf8',
        flag: 'w+'
    });

    return true;
}