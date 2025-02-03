import { ALGO_EXPLORER, IS_OFFLINE } from '@/config';
import { PDFDocument, rgb } from 'pdf-lib';
import { getFontFromS3, getTemplateFromS3 } from '@/libs/pdf/helper';
import { getFullDateString, getFullHourString } from '@/utils/date-helper';
import fontkit from '@pdf-lib/fontkit';
import fs from 'node:fs';
import { generateQRCode } from '@/libs/qr-code';

const TEMPLATE_FILE_NAME = 'tokenization-certificate.pdf';
const TEMPLATE_PATH = `./src/libs/pdf/template/${TEMPLATE_FILE_NAME}`;

const POPPINS_LIGHT_FILE = 'Poppins-Light.ttf';
const POPPINS_REGULAR_FILE = 'Poppins-Regular.ttf';
const POPPINS_SEMI_BOLD_FILE = 'Poppins-SemiBold.ttf';

const POPPINS_LIGHT = `./src/libs/pdf/fonts/${POPPINS_LIGHT_FILE}`;
const POPPINS_REGULAR = `./src/libs/pdf/fonts/${POPPINS_REGULAR_FILE}`;
const POPPINS_SEMI_BOLD = `./src/libs/pdf/fonts/${POPPINS_SEMI_BOLD_FILE}`;

const QRCODE_WIDTH = 300 as const;
const QRCODE_HEIGHT = 300 as const;
const SHA_256_HEIGHT = 1100 as const;
const NAME_HEIGHT = 700 as const;
const DESCRIPTION_HEIGHT = 650 as const;

const LEFT_SIDE = 500 as const;
const RIGHT_SIDE = 1265 as const;

const VERTICAL_FIRST_ROW = 1780 as const;
const VERTICAL_SECOND_ROW = 1805 as const;
const VERTICAL_THIRD_ROW = 1805 as const;

const FONT_SIZE_BOLD = 32 as const;
const FONT_SIZE_REGULAR = 24 as const;
const FONT_SIZE_LIGHT = 20 as const;

export const makeTokenizationCertification = async (
  assetId: number,
  name: string,
  description: string,
  sha256: string,
  timestamp: Date,
  wallet: string
) => {
  //Read custom fonts
  const poppinsLightBytes = IS_OFFLINE
    ? fs.readFileSync(POPPINS_LIGHT)
    : await getFontFromS3(POPPINS_LIGHT_FILE);
  const poppinsRegularBytes = IS_OFFLINE
    ? fs.readFileSync(POPPINS_REGULAR)
    : await getFontFromS3(POPPINS_REGULAR_FILE);
  const poppinsSemiboldBytes = IS_OFFLINE
    ? fs.readFileSync(POPPINS_SEMI_BOLD)
    : await getFontFromS3(POPPINS_SEMI_BOLD_FILE);

  //Read Template
  const initPdfBytes = IS_OFFLINE
    ? fs.readFileSync(TEMPLATE_PATH)
    : await getTemplateFromS3(TEMPLATE_FILE_NAME);

  const pdfDoc = await PDFDocument.load(initPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  // Set fonts
  const poppinsLightFont = await pdfDoc.embedFont(poppinsLightBytes);
  const poppinsRegularFont = await pdfDoc.embedFont(poppinsRegularBytes);
  const poppinsSemiboldFont = await pdfDoc.embedFont(poppinsSemiboldBytes);

  const pages = pdfDoc.getPages();
  const page = pages[0];
  const { width, height } = page.getSize();

  page.setFontColor(rgb(0, 0, 0));
  page.setFontSize(FONT_SIZE_BOLD);
  //Draw file SHA-256 hash.

  const textSha256Width = poppinsSemiboldFont.widthOfTextAtSize(sha256, FONT_SIZE_BOLD);

  page.drawText(sha256, {
    x: width / 2 - textSha256Width / 2,
    y: SHA_256_HEIGHT,
    font: poppinsSemiboldFont,
  });

  //Draw QRCode.
  const qrCodeImg = await generateQRCode(`${ALGO_EXPLORER}/asset/${assetId}`);
  const img = await pdfDoc.embedPng(qrCodeImg!);
  const positionQrCodeX = width / 2 - QRCODE_WIDTH / 2;
  const positionQrCodeY = 750;

  page.drawImage(img, {
    x: positionQrCodeX,
    y: positionQrCodeY,
    width: QRCODE_WIDTH,
    height: QRCODE_HEIGHT,
  });

  // Draw the file name.

  const textNameWidth = poppinsRegularFont.widthOfTextAtSize(name, FONT_SIZE_BOLD);
  page.drawText(name, {
    x: width / 2 - textNameWidth / 2,
    y: NAME_HEIGHT,
    font: poppinsSemiboldFont,
  });

  // Draw the file desc.

  page.setFontColor(rgb(0.5, 0.5, 0.5));

  const textDescWidth = poppinsLightFont.widthOfTextAtSize(description, FONT_SIZE_REGULAR);
  page.drawText(description, {
    x: width / 2 - textDescWidth / 2,
    y: DESCRIPTION_HEIGHT,
    font: poppinsLightFont,
    size: FONT_SIZE_REGULAR,
  });

  page.setFontSize(FONT_SIZE_LIGHT);

  // Draw timestamp 1
  const timeStampFirstPart = getFullDateString(timestamp);

  const textTimeStampFirstPartWidth = poppinsLightFont.widthOfTextAtSize(
    timeStampFirstPart,
    FONT_SIZE_LIGHT
  );

  page.drawText(timeStampFirstPart, {
    x: LEFT_SIDE - textTimeStampFirstPartWidth / 2,
    y: height - VERTICAL_FIRST_ROW,
    font: poppinsLightFont,
  });

  // Draw timestamp 2
  const timeStampSecondPart = getFullHourString(timestamp);

  const textTimeStampSecondPartWidth = poppinsLightFont.widthOfTextAtSize(
    timeStampSecondPart,
    FONT_SIZE_LIGHT
  );

  page.drawText(timeStampSecondPart, {
    x: LEFT_SIDE - textTimeStampSecondPartWidth / 2,
    y: height - VERTICAL_SECOND_ROW,
    font: poppinsLightFont,
  });

  // Draw Wallet first row
  const walletFirstPart = wallet.slice(0, 29);
  const textWalletFirstPartWidth = poppinsLightFont.widthOfTextAtSize(
    walletFirstPart,
    FONT_SIZE_LIGHT
  );

  page.drawText(walletFirstPart, {
    x: RIGHT_SIDE - textWalletFirstPartWidth / 2,
    y: height - VERTICAL_FIRST_ROW,
    font: poppinsLightFont,
  });

  // Draw Wallet second row
  const walletSecondtPart = wallet.slice(29);
  const textWalletSecondPartWidth = poppinsLightFont.widthOfTextAtSize(
    walletSecondtPart,
    FONT_SIZE_LIGHT
  );

  page.drawText(walletSecondtPart, {
    x: RIGHT_SIDE - textWalletSecondPartWidth / 2,
    y: height - VERTICAL_THIRD_ROW,
    font: poppinsLightFont,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
