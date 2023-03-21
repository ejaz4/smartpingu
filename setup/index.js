import fs from 'fs';


export const startUp = () => {
    console.log("Starting up Smart Pingu...")

    const manifestStatus = fs.existsSync('manifest.json');
    
    if (!manifestStatus) {
        setup();
    }
}


const setup = () => {
    console.log("Setting up Smart Pingu for first-time use...");
    fs.copyFileSync("example.manifest.json", "manifest.json");
};