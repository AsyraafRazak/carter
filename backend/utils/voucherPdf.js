const PDFDocument = require('pdfkit');

function drawHeader(doc, user, orderId) {
  // Title / Brand block
  doc.fillColor('#14213d')
     .fontSize(18)
     .font('Helvetica-Bold')
     .text('Carter Bank Loyalty Rewards', 48, 48);

  doc.fillColor('#64748b')
     .fontSize(9)
     .font('Helvetica')
     .text('E-Voucher Statement', 48, 68);

  // Metadata block (Right-aligned)
  const metaX = doc.page.width - 248; // Right margin 48
  doc.fillColor('#14213d')
     .fontSize(9)
     .font('Helvetica-Bold')
     .text(`Order ID: ${orderId}`, metaX, 48, { align: 'right', width: 200 });

  doc.font('Helvetica')
     .text(`Customer: ${user.username} (${user.email})`, metaX, 60, { align: 'right', width: 200 });

  doc.fillColor('#64748b')
     .text(`Issued: ${new Date().toLocaleString()}`, metaX, 72, { align: 'right', width: 200 });

  // Divider line
  doc.lineWidth(1)
     .strokeColor('#cbd5e1')
     .moveTo(48, 92)
     .lineTo(doc.page.width - 48, 92)
     .stroke();
}

function writeVoucherPdf({ user, orderId, items, res }) {
  const doc = new PDFDocument({ size: 'A4', margin: 48, bufferPages: true });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="carter-vouchers-${orderId}.pdf"`);

  doc.pipe(res);

  // Draw header branding
  drawHeader(doc, user, orderId);

  let y = 110; // Starting Y coordinate for first card

  items.forEach((item) => {
    const cardHeight = 135;
    const spacing = 15;

    // Check page overflow
    if (y + cardHeight > doc.page.height - 64) {
      doc.addPage();
      drawHeader(doc, user, orderId);
      y = 110;
    }

    const x = 48; // Left margin
    const w = doc.page.width - 96; // 499.28 printable width

    // Draw card border
    doc.lineWidth(1)
       .strokeColor('#e2e8f0')
       .rect(x, y, w, cardHeight)
       .stroke();

    // Draw subtle left border decoration (Carter Bank brand accent color)
    doc.lineWidth(4)
       .strokeColor('#2563eb')
       .moveTo(x, y)
       .lineTo(x, y + cardHeight)
       .stroke();

    // Draw tear-off separator line for QR code (110 points from right)
    const sepX = x + w - 110;
    doc.lineWidth(1)
       .strokeColor('#cbd5e1')
       .dash(4, { space: 4 })
       .moveTo(sepX, y)
       .lineTo(sepX, y + cardHeight)
       .stroke()
       .undash();

    // Draw details text inside the card
    const textPadding = 15;
    const titleX = x + textPadding;
    const titleY = y + 15;

    doc.fillColor('#14213d')
       .fontSize(13)
       .font('Helvetica-Bold')
       .text(item.voucher?.title || 'Rewards Voucher', titleX, titleY, { width: sepX - titleX - 10, ellipsis: true });

    doc.fillColor('#2563eb')
       .fontSize(10)
       .font('Helvetica-Bold')
       .text(`COUPON: ${item.couponCode}`, titleX, titleY + 22);

    doc.fillColor('#64748b')
       .fontSize(8.5)
       .font('Helvetica')
       .text(`Points Spent: ${item.voucher?.points || 0} pts`, titleX, titleY + 38);

    const expiryStr = item.voucher?.expiryDate ? new Date(item.voucher.expiryDate).toLocaleDateString() : 'N/A';
    doc.text(`Expiry Date: ${expiryStr}`, titleX, titleY + 50);

    // Terms with line wrap
    doc.fillColor('#94a3b8')
       .fontSize(7.5)
       .text(`Terms: ${item.voucher?.terms || 'Standard Carter Bank voucher terms apply.'}`, titleX, titleY + 64, {
         width: sepX - titleX - 10,
         height: 38,
         ellipsis: true
       });

    // Draw QR code on the right side
    if (item.qrCode) {
      try {
        const qrImageBuffer = Buffer.from(item.qrCode.split(',')[1], 'base64');
        const qrSize = 80;
        const qrX = sepX + (110 - qrSize) / 2;
        const qrY = y + 15;

        doc.image(qrImageBuffer, qrX, qrY, { width: qrSize, height: qrSize });
        
        doc.fillColor('#64748b')
           .fontSize(7)
           .font('Helvetica-Bold')
           .text('SCAN TO REDEEM', sepX, qrY + qrSize + 8, { align: 'center', width: 110 });
      } catch (err) {
        console.error('Failed to embed QR code', err);
      }
    }

    y += cardHeight + spacing;
  });

  // Footer on each page using page buffer
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    
    // Draw footer divider
    doc.lineWidth(1)
       .strokeColor('#cbd5e1')
       .moveTo(48, doc.page.height - 48)
       .lineTo(doc.page.width - 48, doc.page.height - 48)
       .stroke();

    // Footer texts
    doc.fillColor('#94a3b8')
       .fontSize(8)
       .font('Helvetica')
       .text('This is an official voucher confirmation issued by Carter Bank. Terms apply.', 48, doc.page.height - 40, { align: 'left' })
       .text(`Page ${i + 1} of ${pages.count}`, 48, doc.page.height - 40, { align: 'right', width: doc.page.width - 96 });
  }

  doc.end();
}

module.exports = { writeVoucherPdf };

