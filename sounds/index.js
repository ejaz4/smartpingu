import player from 'play-sound';
import fs from 'fs';

export async function sound(filename, first = true) {
    const manifest = JSON.parse(fs.readFileSync("manifest.json"));

    const device = player({ player: 'play' });

    console.log("Sound Play Request:", first ? 'sounds/chime.mp3' : filename);

    if (first) {
        if (manifest["sounds"]["warningChime"] == true) {
            if (!manifest["sounds"]["shorterChime"]) {
                (await device.play('sounds/chime.mp3'));
            } else {
                (await device.play('sounds/shorterChime.mp3'));
            }
        }
        setTimeout(() => {
            sound(filename, false);
        }, 2000)
    } else {
        if (manifest["sounds"]["speech"] == true) {
            device.play(filename);
        }
    }

    return true;
}