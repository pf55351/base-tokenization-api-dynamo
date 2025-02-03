import QRCode from 'qrcode';

export const generateQRCode = async (url: string) => {
  try {
    const qrCodeCanvas = await QRCode.toDataURL(url);
    return qrCodeCanvas;
  } catch (err) {
    console.error(err);
  }
};
