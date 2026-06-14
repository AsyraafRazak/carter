const PDFDocument = require('pdfkit');

function writeVoucherPdf({ user, orderId, items, res }) {
  const doc = new PDFDocument({ size: 'A4', margin: 48 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="carter-vouchers-${orderId}.pdf"`);

  doc.pipe(res);

  doc.fontSize(22).text('Carter Bank Voucher Redemption', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Order ID: ${orderId}`);
  doc.text(`Customer: ${user.username} <${user.email}>`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown();

  items.forEach((item, index) => {
    const voucher = item.voucher;
    doc.fontSize(14).text(`${index + 1}. ${voucher.title}`, { underline: true });
    doc.fontSize(11).text(`Quantity: ${item.quantity}`);
    doc.text(`Points each: ${voucher.points}`);
    doc.text(`Coupon code: ${item.couponCode}`);
    doc.text(`Expiry: ${new Date(voucher.expiryDate).toLocaleDateString()}`);
    doc.text(`Terms: ${voucher.terms || 'Standard Carter Bank voucher terms apply.'}`);

    if (item.qrCode) {
      doc.moveDown(0.25);
      doc.image(Buffer.from(item.qrCode.split(',')[1], 'base64'), { width: 92 });
    }

    doc.moveDown();
  });

  doc.fontSize(10).text('Show this PDF at redemption. Coupon codes are unique and non-transferable.');
  doc.end();
}

module.exports = { writeVoucherPdf };
