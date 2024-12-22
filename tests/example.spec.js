// @ts-check
const { test, expect } = require('@playwright/test');

let urlQRGenerator = 'https://zxing.appspot.com/generator/'
let xpath_generateQR = 'xpath=//*[@id="leftpanel"]/tbody/tr[5]/td/table/tbody/tr/td[2]/button'
let xpath_dropdownContent = 'xpath=//*[@id="leftpanel"]/tbody/tr[1]/td/table/tbody/tr/td[2]/select'

async function generateQR(page, testName) {
  await page.locator(xpath_generateQR).click();
  await page.waitForTimeout(1000)

  let decodedText = await page.locator('xpath=//*[@id="rawtextresult"]').inputValue()

  await page.screenshot({ path: `${__dirname}/evidences/${testName}.png` });
  await page.getByRole('link', { name: 'Download' }).click();

  let filePath = `${__dirname}/files/qr code ${testName}.png`
  await page.screenshot({ path: filePath });

  await page.goto('https://m28dev.github.io/qrdecoder/');
  await page.getByLabel('QR code image:').setInputFiles(filePath);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('xpath=//*[@id="decoded"]')).toHaveText(decodedText, { timeout: 60000 });
  await page.waitForTimeout(500)
}

test.beforeEach(async ({ page }) => {
  test.setTimeout(100000)
  await page.goto(urlQRGenerator);  
})


test('01 create qr code for content calendar event', async ({ page }, testInfo) => {
  let xpath_dateStart = 'xpath=//*[@id="leftpanel"]/tbody/tr[2]/td/table/tbody/tr[3]/td[2]/table/tbody/tr[2]/td/table/tbody/tr[2]/td[1]/div'
  let xpath_dateEnd = 'xpath=//*[@id="leftpanel"]/tbody/tr[2]/td/table/tbody/tr[5]/td[2]/table/tbody/tr[2]/td/table/tbody/tr[7]/td[7]/div'

  let eventTitle = 'test event title'
  let location = 'test location'
  let description = 'test description'

  await page.locator(xpath_dropdownContent).selectOption('Calendar event');
  await page.getByRole('row', { name: 'All day event', exact: true }).getByLabel('').check();
  await page.getByRole('row', { name: 'Event title', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Event title', exact: true }).getByRole('textbox').fill(eventTitle);
  await page.locator(xpath_dateStart).click();
  await page.locator(xpath_dateEnd).click();
  await page.getByRole('row', { name: 'Location', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Location', exact: true }).getByRole('textbox').fill(location);
  await page.getByRole('row', { name: 'Description', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Description', exact: true }).getByRole('textbox').fill(description);
  await page.getByRole('button', { name: 'Generate →' }).click();

  await generateQR(page, testInfo.title)
})

test('02 create qr code for contact information', async ({ page }, testInfo) => {
  let name = 'test name'
  let company = 'test company'
  let title = 'test title'
  let phoneNumber = '082222222222'
  let email = 'test@gmail.com'
  let address1 = 'test address1'
  let address2 = 'test address2'
  let website = 'test.com'
  let memo = 'test memo'

  await page.locator(xpath_dropdownContent).selectOption('Contact information');
  await page.getByRole('row', { name: 'Name', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Name', exact: true }).getByRole('textbox').fill(name);
  await page.getByRole('row', { name: 'Company', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Company', exact: true }).getByRole('textbox').fill(company);
  await page.getByRole('row', { name: 'Title', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Title', exact: true }).getByRole('textbox').fill(title);
  await page.getByRole('row', { name: 'Phone number', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Phone number', exact: true }).getByRole('textbox').fill(phoneNumber);
  await page.getByRole('row', { name: 'Email', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Email', exact: true }).getByRole('textbox').fill(email);
  await page.getByRole('row', { name: 'Address', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Address', exact: true }).getByRole('textbox').fill(address1);
  await page.getByRole('row', { name: 'Address 2', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Address 2', exact: true }).getByRole('textbox').fill(address2);
  await page.getByRole('row', { name: 'Website', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Website', exact: true }).getByRole('textbox').fill(website);
  await page.getByRole('row', { name: 'Memo', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Memo', exact: true }).getByRole('textbox').fill(memo);
  await page.getByRole('cell', { name: 'MECARD', exact: true }).getByRole('combobox').selectOption('vCard');
  await page.getByRole('button', { name: 'Generate →' }).click();

  await generateQR(page, testInfo.title)
});

test('03 create qr code for email address', async ({ page }, testInfo) => {
  let email = 'test@gmail.com'

  await page.locator(xpath_dropdownContent).selectOption('Email address');
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill(email);

  await generateQR(page, testInfo.title)
});

test('04 create qr code for geo location', async ({ page }, testInfo) => {
  let latitude = '40.7128'
  let longitude = '74.0060'
  let query = 'test query'

  await page.locator(xpath_dropdownContent).selectOption('Geo location');
  await page.getByRole('row', { name: 'Latitude', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Latitude', exact: true }).getByRole('textbox').fill(latitude);
  await page.getByRole('row', { name: 'Longitude', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Longitude', exact: true }).getByRole('textbox').fill(longitude)
  await page.getByRole('row', { name: 'Query', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Query', exact: true }).getByRole('textbox').fill(query);

  await generateQR(page, testInfo.title)
});

test('05 create qr code for phone number', async ({ page }, testInfo) => {
  let phoneNumber = '082222222222'

  await page.locator(xpath_dropdownContent).selectOption('Phone number');
  await page.getByRole('textbox').fill(phoneNumber);

  await generateQR(page, testInfo.title)
});

test('06 create qr code for sms', async ({ page }, testInfo) => {
  let phoneNumber = '082222222222'
  let message = 'test message'

  await page.locator(xpath_dropdownContent).selectOption('SMS');
  await page.getByRole('row', { name: 'Phone number', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Phone number', exact: true }).getByRole('textbox').fill(phoneNumber);
  await page.getByRole('row', { name: 'Message', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Message', exact: true }).getByRole('textbox').fill(message);

  await generateQR(page, testInfo.title)
});

test('07 create qr code for content text', async ({ page }, testInfo) => {
  let text = 'test text'

  await page.locator(xpath_dropdownContent).selectOption('Text');
  await page.getByRole('textbox').fill(text);

  await generateQR(page, testInfo.title)
});

test('08 create qr code for url', async ({ page }, testInfo) => {
  let url = 'http://test.com'

  await page.locator(xpath_dropdownContent).selectOption('URL');
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill(url);
  await generateQR(page, testInfo.title)
});

test('09 create qr code for wifi network', async ({ page }, testInfo) => {
  let ssid = 'test_ssid'
  let password = 'test password'

  await page.locator(xpath_dropdownContent).selectOption('Wifi network');
  await page.getByRole('row', { name: 'SSID', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'SSID', exact: true }).getByRole('textbox').fill(ssid);
  await page.getByRole('row', { name: 'Password', exact: true }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'Password', exact: true }).getByRole('textbox').fill(password);
  await page.getByRole('cell', { name: 'WEP', exact: true }).getByRole('combobox').selectOption('WPA');

  await generateQR(page, testInfo.title)
});

test('10 create qr code for each content with empty field', async ({ page }, testInfo) => {
  const validations = [
    { type: 'Calendar event', message: 'Event name must be at least 1 character.' },
    { type: 'Contact information', message: 'Name must be at least 1 character.' },
    { type: 'Email address', message: 'Email must be present.' },
    { type: 'Geo location', message: 'Latitude is not a correct value.' },
    { type: 'Phone number', message: 'Phone number must be present.' },
    { type: 'SMS', message: 'Phone number must be present.' },
    { type: 'Text', message: 'Text should be at least 1 character.' },
    { type: 'URL', message: 'URL is not valid.' },
    { type: 'Wifi network', message: 'SSID must be at least 1 character.' }
  ];

  for (const validation of validations) {
    await page.locator(xpath_dropdownContent).selectOption(validation.type);

    if (validation.type === 'URL') {
      await page.getByRole('textbox').click();
      await page.getByRole('textbox').fill('');
    }

    await page.locator(xpath_generateQR).click();    
    await expect(page.locator('xpath=//*[@id="errorMessageID"]')) .toHaveText(validation.message);

    await page.screenshot({path: `${__dirname}/evidences/${testInfo.title} ${validation.type}.png`});
  }
})


