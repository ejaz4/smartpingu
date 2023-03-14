import player from 'play-sound';

export async function sound(filename, first = true) {
    const device = player({ player: 'play' });
    
    console.log("Sound Play Request:", first ? 'sounds/chime.mp3' : filename);

    if (first) {
        await device.play('sounds/chime.mp3');
        setTimeout(() => {
            sound(filename, false);
        }, 2000)
    } else {
        device.play(filename);
    }

    return true;
}