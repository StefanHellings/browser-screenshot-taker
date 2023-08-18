/*
[...document.querySelectorAll('.is--text--help .private-truncated-string__inner')].map(el => ({ url: el.innerText, name: el.parentNode.parentNode.previousSibling.ariaLabel }));
*/

const puppeteer = require("puppeteer");
const pages = [
    // Insert pages here
    // Example:
    /*
    {
        "url": "https://www.ambassify.com",
        "name": "Ambassify homepage"
    },
    {
        "url": "https://www.ambassify.com/company/vacancies",
        "name": "Page name LP - Vacancies overview multi language primary in English"
    },
    */
].map((page) => {
    page.url = page.url.replace("get.", "https://www.");
    page.name = page.name.replace("Page name ", "");
    return page;
});


function getDifferenceInSeconds(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);

    return diffInMs / 1000;
}

function getDuration(timeStart, timeEnd) {
    const time = getDifferenceInSeconds(timeStart, timeEnd);
    let duration = `${time} seconds!`;

    if (time > 60) {
        const minutes = Math.floor(time / 60);
        const seconds = time - minutes * 60;

        duration = `${minutes} minutes and ${seconds} seconds!`;
    }

    return duration;
}

puppeteer
    .launch({
        defaultViewport: {
            width: 1440,
            height: 2000,
        },
    })
    .then(async (browser) => {
        const timeStart = new Date();
        let timeEnd = timeStart;
        let duration = 0;

        for (let i = 0; i < pages.length; i++) {
            const { name, url } = pages[i];
            const page = await browser.newPage();
            const safeName = name.replaceAll('/', '-');
            console.log(`Opening ${i + 1} of ${pages.length}: ${url}`);

            await page.goto(url, { waitUntil: 'networkidle0' });
            await page.screenshot({
                path: `captured-screenshots/${safeName}.png`,
                type: 'png',
                fullPage: true,
            });
        }

        console.log('All screenshots captured... Closing browser.');
        await browser.close();

        timeEnd = new Date();
        duration = getDuration(timeStart, timeEnd);

        console.log(`Done in ${duration}!`);
    });
