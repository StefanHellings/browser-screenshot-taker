const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const date = '2023-06-07';
const screenshotsDirectory = `./cropped_${date}`;
const croppedDirectory = `./double-cropped_${date}`;

// Create the cropped directory if it doesn't exist
if (!fs.existsSync(croppedDirectory)) {
    fs.mkdirSync(croppedDirectory);
}

// Function to crop an image
async function cropImage(filePath) {
    const image = sharp(filePath);
    const { width, height } = await image.metadata();

    if (width > 1420) {
        const croppedFilePath = path.join(croppedDirectory, path.basename(filePath));
        const croppedImage = image.extract({
            left: 0,
            top: 0,
            width: 1420,
            height
        });

        await croppedImage.toFile(croppedFilePath);
    } else {
        // copy file to cropped directory
        const croppedFilePath = path.join(croppedDirectory, path.basename(filePath));
        fs.copyFileSync(filePath, croppedFilePath);
    }

    /*
    // Figma has a height limit of 4096px for images
    if (height > 4096) {
        const croppedFilePath = path.join(croppedDirectory, path.basename(filePath));
        const croppedImage = image.extract({
            left: 0,
            top: 0,
            width,
            height: 4096
        });

        await croppedImage.toFile(croppedFilePath);
    } else {
        // copy file to cropped directory
        const croppedFilePath = path.join(croppedDirectory, path.basename(filePath));
        fs.copyFileSync(filePath, croppedFilePath);
    }
    */
}

(async () => {
    // Iterate through the files and crop each image
    // Get a list of all files in the screenshots directory
    const files = fs.readdirSync(screenshotsDirectory);
    files.splice(files.indexOf('.DS_Store'), 1);

    for (const file of files) {
        console.log('Cropping', file);
        const filePath = path.join(screenshotsDirectory, file);
        await cropImage(filePath);
    }
})();
