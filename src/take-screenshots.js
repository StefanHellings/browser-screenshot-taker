/*
    Take screenshots from a list of URLs
    - Scroll to the bottom of the page
    - Force lazy-loaded images to load
    - Wait for all images to load
    - Take a screenshot of the entire page
    - Save the screenshot as a webp file
    - Crop the screenshot to 1420px wide
    - Save the cropped screenshot as a webp file

    Usage:
    - Install dependencies: npm install
    - Run: node src/take-screenshots.js
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Screenshots directory = 'screenshots' + todays date in format YYYY-MM-DD
const date = new Date().toISOString().slice(0, 10);
const screenshotsDirectory = `./screenshots_${date}`;
const croppedDirectory = `./cropped_${date}`;
const puppeteer = require('puppeteer');

// List of URLs to visit
const urls = [
    'https://www.ambassify.com/',
    'https://www.ambassify.com/features/browser-plugin',
    'https://www.ambassify.com/demo-options/schedule-a-1-on-1-demo-of-the-ambassify-platform',
    'https://www.ambassify.com/free-guided-trial',
    'https://www.ambassify.com/how-to-measure-social-media-roi',
    'https://www.ambassify.com/company/about-us',
    'https://www.ambassify.com/features/instagram-sharing',
    'https://www.ambassify.com/customer-campaign-examples',
    'https://www.ambassify.com/resources/sustainability-live-event',
    'https://www.ambassify.com/features/smart-scheduling',
    'https://www.ambassify.com/contact',
    'https://www.ambassify.com/features/advocacy-software-must-have-features',
    'https://www.ambassify.com/use-cases/social-media-marketing',
    'https://www.ambassify.com/employee-advocacy',
    'https://www.ambassify.com/blog',
    'https://www.ambassify.com/resources/customer-stories',
    'https://www.ambassify.com/company/partner',
    'https://www.ambassify.com/spontaneous-applications',
    'https://www.ambassify.com/use-cases/sustainability',
    'https://www.ambassify.com/features/intention-based-campaign-builder',
    'https://www.ambassify.com/resources/employee-advocacy-examples',
    'https://www.ambassify.com/use-cases/employer-branding',
    'https://www.ambassify.com/features/community-goals',
    'https://www.ambassify.com/content/sitemap/',
    'https://www.ambassify.com/resources/webinars',
    'https://www.ambassify.com/features/native-video-sharing',
    'https://www.ambassify.com/resources/ambassify-brochure',
    'https://www.ambassify.com/pricing',
    'https://www.ambassify.com/de/',
    'https://www.ambassify.com/features/campaign-copy-and-visuals-variations',
    'https://www.ambassify.com/company/vacancies/react-native-developer',
    'https://www.ambassify.com/social-media-content-calendar',
    'https://www.ambassify.com/features/custom-scheduling',
    'https://www.ambassify.com/company/team',
    'https://www.ambassify.com/resources/ambassify-services',
    'https://www.ambassify.com/use-cases/corporate-branding',
    'https://www.ambassify.com/resources/content-library',
    'https://www.ambassify.com/company/vacancies/account-executive',
    'https://www.ambassify.com/sitemap',
    'https://www.ambassify.com/use-cases/employee-advocacy-program',
    'https://www.ambassify.com/company/vacancies',
    'https://www.ambassify.com/demo-options/sign-up-for-our-weekly-ambassify-platform-tour',
    'https://www.ambassify.com/features/microsoft-teams-integration',
    'https://www.ambassify.com/blog/managerial-feedback-tactics-that-build-up-employee-engagement',
    'https://www.ambassify.com/blog/instagram-share-collective-goals-and-more-upgrades',
    'https://www.ambassify.com/blog/what-is-employee-advocacy',
    'https://www.ambassify.com/blog/topic/employee-advocacy',
    'https://www.ambassify.com/de/funktionen/kampagnenbaukasten',
    'https://www.ambassify.com/blog/can-we-use-brain-science-for-business',
    'https://www.ambassify.com/blog/product-change-communication-in-saas',
    'https://www.ambassify.com/de/funktionen/natives-video-teilen',
    'https://www.ambassify.com/content/deutsche-bank-social-media-marketing/',
    'https://www.ambassify.com/content/raiffeisenlandesbank-oberosterreich-social-media-marketing/',
    'https://www.ambassify.com/blog/topic/employer-branding',
    'https://www.ambassify.com/employer-branding',
    'https://www.ambassify.com/resources/corporate-branding-examples',
    'https://www.ambassify.com/de/ressourcen/employer-branding-examples',
    'https://www.ambassify.com/resources/sustainability-campaign-examples',
    'https://www.ambassify.com/blog/employee-advocacy-program',
    'https://www.ambassify.com/de/funktionen/instagram-sharing',
    'https://www.ambassify.com/blog/activating-employee-brand-advocacy',
    'https://www.ambassify.com/resources/customer-stories/how-plutus-engages-its-community-through-gamified-advocacy',
    'https://www.ambassify.com/content/triodos-social-media-marketing/',
    'https://www.ambassify.com/content/forex-bank-social-media-marketing/',
    'https://www.ambassify.com/blog/employee-rewards',
    'https://www.ambassify.com/content/storebrand-bank--social-media-marketing/',
    'https://www.ambassify.com/de/ressourcen/knowledge-hub',
    'https://www.ambassify.com/bnp-paribas-social-media-marketing',
    'https://www.ambassify.com/resources/customer-stories/how-stihl-managed-the-content-distribution-of-its-resellers',
    'https://www.ambassify.com/blog/2023-content-calendar-download',
    'https://www.ambassify.com/de/funktionen/manuelle-planung',
    'https://www.ambassify.com/resources/employee-engagement-book',
    'https://www.ambassify.com/blog/page/4',
    'https://www.ambassify.com/blog/employer-branding-model',
    'https://www.ambassify.com/blog/page/5',
    'https://www.ambassify.com/blog/employee-advocacy-and-internal-comms',
    'https://www.ambassify.com/blog/page/8',
    'https://www.ambassify.com/content/svenska-handelsbanken-social-media-marketing/',
    'https://www.ambassify.com/blog/from-a-one-day-hackathon-to-an-awesome-browser-plugin',
    'https://www.ambassify.com/content/swedbank-social-media-marketing/',
    'https://www.ambassify.com/content/rabobank-social-media-marketing/',
    'https://www.ambassify.com/blog/how-to-engage-your-workforce-for-sustainability',
    'https://www.ambassify.com/blog/barcos-word-of-mouth-campaign',
    'https://www.ambassify.com/de/anwendungsfälle/social-media-marketing',
    'https://www.ambassify.com/blog/page/2',
    'https://www.ambassify.com/blog/page/3',
    'https://www.ambassify.com/resources/customer-stories/how-kbc-increased-involvement-to-boost-engagement-and-branding',
    'https://www.ambassify.com/resources/guides/content-creation-guides',
    'https://www.ambassify.com/de/ressourcen/corporate-branding-examples',
    'https://www.ambassify.com/content/landesbank-baden-württemberg-social-media-marketing/',
    'https://www.ambassify.com/content/erste-group-bank-social-media-marketing/',
    'https://www.ambassify.com/blog/ambassify-march-video-newsletter',
    'https://www.ambassify.com/resources/customer-stories/how-allianz-wields-connectivity-and-pride-as-brand-enhancing-ingredients',
    'https://www.ambassify.com/blog/employee-retention',
    'https://www.ambassify.com/de/preise',
    'https://www.ambassify.com/blog/employee-advocacy-social-media',
    'https://www.ambassify.com/blog/how-to-motivate-employees-to-share-content-and-avoid-sharing-fatigue',
    'https://www.ambassify.com/barclays-social-media-marketing',
    'https://www.ambassify.com/blog/saml-and-single-sign-on-support',
    'https://www.ambassify.com/content/vontobel-social-media-marketing/',
    'https://www.ambassify.com/de/funktionen/browser-plugin',
    'https://www.ambassify.com/blog/why-employee-engagement-is-important',
    'https://www.ambassify.com/de/anwendungsfälle/sustainability',
    'https://www.ambassify.com/blog/employee_advocacy_statistics',
    'https://www.ambassify.com/blog/social-media-marketing',
    'https://www.ambassify.com/blog/sustainable-behavior-how-to-influence-people-to-act-more-sustainably',
    'https://www.ambassify.com/blog/our-super-secret-one-day-hackathon',
    'https://www.ambassify.com/blog/how-to-deal-with-work-from-home-stress',
    'https://www.ambassify.com/blog/employees-as-brand-advocates',
    'https://www.ambassify.com/de/anwendungsfälle/employer-branding',
    'https://www.ambassify.com/blog/employer-branding-strategy',
    'https://www.ambassify.com/content/julius-baer-group-social-media-marketing/',
    'https://www.ambassify.com/blog/sovereign-cloud-to-ensure-data-residency-in-eea',
    'https://www.ambassify.com/de/anwendungsfälle/employee-advocacy',
    'https://www.ambassify.com/blog/essential-kpi-to-measure-the-success-of-your-advocacy-program',
    'https://www.ambassify.com/blog/customer-interview-alpega',
    'https://www.ambassify.com/blog/custom-reporting',
    'https://www.ambassify.com/blog/get-leadership-buy-in-for-advocacy',
    'https://www.ambassify.com/resources/ultimate-guide-to-employer-branding',
    'https://www.ambassify.com/blog/5-onboarding-tips-that-boost-employee-engagement-retention',
    'https://www.ambassify.com/de/funktionen/collective-goals',
    'https://www.ambassify.com/content/belfius-social-media-marketing/',
    'https://www.ambassify.com/resources/customer-stories/how-unique-used-ambassify-to-raise-money-for-de-warmste-week',
    'https://www.ambassify.com/content/osterreichische-kontrollbank-social-media-marketing/',
    'https://www.ambassify.com/corporate-social-responsibility',
    'https://www.ambassify.com/blog/boost-employer-branding-with-employee-advocacy',
    'https://www.ambassify.com/blog/employee-offboarding',
    'https://www.ambassify.com/content/raiffeisen-zentralbank-social-media-marketing/',
    'https://www.ambassify.com/blog/get-a-foolproof-start-with-influencer-marketing',
    'https://www.ambassify.com/blog/relationship-between-employee-advocacy-and-employee-engagament',
    'https://www.ambassify.com/groupe-bpce-social-media-marketing',
    'https://www.ambassify.com/de/demo-optionen/buche-deine-1-on-1-ambassify-demo',
    'https://www.ambassify.com/resources/ultimate-guide-to-kickstarting-your-advocacy-program',
    'https://www.ambassify.com/blog/employee-social-media-policy',
    'https://www.ambassify.com/deutsche-bank-social-media-marketing',
    'https://www.ambassify.com/content/lombard-odier-social-media-marketing/',
    'https://www.ambassify.com/blog/how-to-measure-employee-engagement',
    'https://www.ambassify.com/content/handelsbanken-social-media-marketing/',
    'https://www.ambassify.com/content/asn-bank-social-media-marketing/',
    'https://www.ambassify.com/de/funktionen/kampagnen-text-und-visuelle-variationen',
    'https://www.ambassify.com/blog/the-ultimate-guide-to-hr-digital-transformation-part-4',
    'https://www.ambassify.com/content/nordea-bank-social-media-marketing/',
    'https://www.ambassify.com/blog/the-ultimate-guide-to-hr-digital-transformation-part-1',
    'https://www.ambassify.com/blog/the-ultimate-guide-to-hr-digital-transformation-part-3',
    'https://www.ambassify.com/de/funktionen/intelligente-planung',
    'https://www.ambassify.com/blog/the-ultimate-guide-to-hr-digital-transformation-part-2',
    'https://www.ambassify.com/blog/employee-engagement',
    'https://www.ambassify.com/content/union-bancaire-privee-social-media-marketing/',
    'https://www.ambassify.com/de/funktionen/microsoft-teams-integration',
    'https://www.ambassify.com/content/oberbank-social-media-marketing/',
    'https://www.ambassify.com/blog/ambassify-affiliate-campaigns',
    'https://www.ambassify.com/blog/employee-motivation',
    'https://www.ambassify.com/content/sparebank-social-media-marketing/',
    'https://www.ambassify.com/resources/sustainability-for-companies',
    'https://www.ambassify.com/blog/how-to-interpret-and-deal-with-social-media-data',
    'https://www.ambassify.com/de/anwendungsfälle/corporate-branding',
    'https://www.ambassify.com/content/totalkredit-social-media-marketing/',
    'https://www.ambassify.com/content/skandinaviska-enskilda-banken-social-media-marketing/',
    'https://www.ambassify.com/blog/promoting-your-company-webinars-the-power-of-your-employee-networks',
    'https://www.ambassify.com/content/bnp-paribas-fortis-social-media-marketing/',
    'https://www.ambassify.com/blog/how-to-build-a-culture-of-sustainability-through-employee-engagement',
    'https://www.ambassify.com/blog/share-your-brain-employer-branding',
    'https://www.ambassify.com/resources/customer-stories/how-aca-group-created-a-sense-of-belonging-for-their-employees',
    'https://www.ambassify.com/de/demo-optionen/nimm-an-einer-öffentlichen-demo-der-ambassify-plattform-teil',
    'https://www.ambassify.com/blog/gamification-and-rewards',
    'https://www.ambassify.com/blog/hyperlocal-social-media-marketing',
    'https://www.ambassify.com/blog/how-to-intoduce-sustainability-in-your-workforce',
    'https://www.ambassify.com/blog/15-internal-communications-statistics',
    'https://www.ambassify.com/resources/customer-stories/how-barco-organically-amplified-its-content-through-automated-distribution',
    'https://www.ambassify.com/resources/sustainability-ebook',
    'https://www.ambassify.com/ubs-social-media-marketing',
    'https://www.ambassify.com/de/unternehmen/team',
    'https://www.ambassify.com/content/skandiabanken-social-media-marketing/',
    'https://www.ambassify.com/blog/why-employer-branding-is-important',
    'https://www.ambassify.com/de/ressourcen/employee-advocacy-examples',
    'https://www.ambassify.com/unity-preview-iframe',
    'https://www.ambassify.com/de/unternehmen/partner',
    'https://www.ambassify.com/content-library',
    'https://www.ambassify.com/blog/topic/employee-engagement',
    'https://www.ambassify.com/content/sveriges-riksbank-social-media-marketing/',
    'https://www.ambassify.com/blog/great-ideas-dont-spread-by-themselves',
    'https://www.ambassify.com/content/jyske-bank-social-media-marketing/',
    'https://www.ambassify.com/de/kontaktieren-sie-uns',
    'https://www.ambassify.com/content/commerzbank-social-media-marketing/',
    'https://www.ambassify.com/trust',
    'https://www.ambassify.com/de/demo-options/nimm-an-einer-öffentlichen-demo-der-ambassify-plattform-teil',
    'https://www.ambassify.com/de/ressourcen/ambassify-dienstleistungen',
    'https://www.ambassify.com/resources/employer-branding-examples',
    'https://www.ambassify.com/blog/how-to-increase-engagement-among-your-ambassadors',
    'https://www.ambassify.com/blog/press-release-ambassify-raises-2-million-to-reinvent-employee-engagement',
    'https://www.ambassify.com/blog/tech-blog-post-mirror-me',
    'https://www.ambassify.com/recruitment',
    'https://www.ambassify.com/credit-mutuel-group-social-media-marketing',
    'https://www.ambassify.com/de/ressourcen/sustainability-campaign-examples',
    'https://www.ambassify.com/content/realkredit-danmark-social-media-marketing/',
    'https://www.ambassify.com/content/dnb-bank-social-media-marketing/',
    'https://www.ambassify.com/blog/internal-communications-drives-employee-engagement-and-advocacy',
    'https://www.ambassify.com/blog/hackathon-jingle-bells-edition',
    'https://www.ambassify.com/de/unternehmen/über-uns',
    'https://www.ambassify.com/content/sns-bank-social-media-marketing/',
    'https://www.ambassify.com/blog/ultimate_guide_to_employee_engagement_20',
    'https://www.ambassify.com/resources/services-webinars',
    'https://www.ambassify.com/blog/employee-brand-advocacy',
    'https://www.ambassify.com/customer-stories/how-helan-leveraged-in-house-creativity-to-strengthen-its-employer-branding',
    'https://www.ambassify.com/content/abn-amro-social-media-marketing/',
    'https://www.ambassify.com/resources/ultimate-guide-to-employee-advocacy',
    'https://www.ambassify.com/blog/4-steps-to-start-an-advocate-community',
    'https://www.ambassify.com/content/bank-norwegian-social-media-marketing/',
    'https://www.ambassify.com/content/efg-international-social-media-marketing/',
    'https://www.ambassify.com/de/ressourcen/guides/content-creation-guides',
    'https://www.ambassify.com/blog/video-newsletter-content-calendar-and-new-platform-features',
    'https://www.ambassify.com/blog/employee-engagement-ideas',
    'https://www.ambassify.com/de/ressourcen/kundengeschichten',
    'https://www.ambassify.com/blog/employer-value-proposition-evp',
    'https://www.ambassify.com/blog/how-to-engage-employees-in-sustainability',
    'https://www.ambassify.com/blog/guidelines-for-influencer-marketing-in-belgium',
    'https://www.ambassify.com/de/resources/webinars/corporate-ambassadors-ein-rätsel-das-sich-zu-lösen-lohnt',
    'https://www.ambassify.com/credit-agricole-social-media-marketing',
    'https://www.ambassify.com/content/ing-social-media-marketing/',
    'https://www.ambassify.com/banco-santander-social-media-marketing',
    'https://www.ambassify.com/blog/how-to-ace-the-onboarding-of-an-advocacy-platform',
    'https://www.ambassify.com/blog/social-media-content-ideas',
    'https://www.ambassify.com/lloyds-banking-group-group-social-media-marketing',
    'https://www.ambassify.com/blog/topic/team-ambassify',
    'https://www.ambassify.com/blog/newsletter-campaign-builder-new-features',
    'https://www.ambassify.com/resources/customer-stories/how-helan-leveraged-in-house-creativity-to-strengthen-its-employer-branding',
    'https://www.ambassify.com/de/funktionen/ambassify-kernfunktionen',
    'https://www.ambassify.com/blog/mental-health-awareness-on-the-workplace-employee-engagement',
    'https://www.ambassify.com/blog/the-ultimate-guide-to-instagram-guides',
    'https://www.ambassify.com/blog/ambassify-and-intranet-systems',
    'https://www.ambassify.com/sitemaptitle',
    'https://www.ambassify.com/blog/what-is-employee-satisfaction',
    'https://www.ambassify.com/content/nykredit-realkredit-social-media-marketing/',
    'https://www.ambassify.com/content/unicredit-bank-social-media-marketing/',
    'https://www.ambassify.com/corporate-branding',
    'https://www.ambassify.com/content/pictet-group-social-media-marketing/',
    'https://www.ambassify.com/blog/benefits-of-employee-advocacy',
    'https://www.ambassify.com/blog/topic/platform-features',
    'https://www.ambassify.com/content/landesbank-hessen-thüringen-social-media-marketing/',
    'https://www.ambassify.com/blog/dockerizing-our-heroku-apps',
    'https://www.ambassify.com/blog/importance-of-employee-advocacy-with-rise-of-privacy',
    'https://www.ambassify.com/blog/6-reasons-why-your-business-needs-employee-advocacy',
    'https://www.ambassify.com/blog/do-employee-referral-programs-work',
    'https://www.ambassify.com/sustainability',
    'https://www.ambassify.com/content/kbc-social-media-marketing/',
    'https://www.ambassify.com/hsbcs-social-media-marketing',
    'https://www.ambassify.com/content/danske-bank-social-media-marketing/',
];

// Create the screenshot directory if it doesn't exist
if (!fs.existsSync(screenshotsDirectory)) {
    fs.mkdirSync(screenshotsDirectory);
}

// Create the cropped directory if it doesn't exist
if (!fs.existsSync(croppedDirectory)) {
    fs.mkdirSync(croppedDirectory);
}

// Function to scroll to the bottom of the page
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 100;
            const scrollDelay = 100;

            const timer = setInterval(() => {
                const scrollHeight = document.documentElement.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, scrollDelay);
        });
    });
}

// Function to crop an image
async function cropImage(filePath) {
    const image = sharp(filePath);
    const { width, height } = await image.metadata();

    if (width > 1420) {
        const croppedImage = image.extract({
            left: 0,
            top: 0,
            width: 1420,
            height
        });
        const croppedFilePath = path.join(croppedDirectory, path.basename(filePath));
        await croppedImage.toFile(croppedFilePath);
        console.log(`Cropped ${filePath} to ${croppedFilePath}`);
    } else {
        // copy file to cropped directory
        console.log(`${filePath} does not require cropping`);
        const croppedFilePath = path.join(croppedDirectory, path.basename(filePath));
        fs.copyFileSync(filePath, croppedFilePath);
        console.log(`Copied ${filePath} to ${croppedFilePath}`);
    }
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const url of urls) {
        console.log('Taking screenshot of ', url);
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.setViewport({ width: 1420, height: 900 });

        await autoScroll(page); // Scroll to the bottom of the page

        await page.evaluate(() => {
            // Force lazy-loaded images to load
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            for (const img of lazyImages) {
                img.src = img.dataset.src;
            }
        });

        await page.waitForSelector('img[src]', { timeout: 29000 }) // Wait for all images to load or timeout after 29 seconds
            .catch(err => {
                console.warn('Images did not load within the given time or no images present.', { err });
            });

        await page.screenshot({
            path: `${screenshotsDirectory}/${url.replace(/[^a-zA-Z0-9]/g, '-')}.webp`,
            fullPage: true,
            type: 'webp'
        });
    }

    await browser.close();

    // Iterate through the files and crop each image
    // Get a list of all files in the screenshots directory
    const files = fs.readdirSync(screenshotsDirectory);

    for (const file of files) {
        console.log('Cropping', file);
        const filePath = path.join(screenshotsDirectory, file);
        await cropImage(filePath);
    }
})();
