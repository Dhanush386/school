const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

/**
 * Generates a fee receipt PDF and saves it to uploads/receipts/
 * @param {Object} options
 * @param {string} options.studentName
 * @param {string} options.studentId  - loginId
 * @param {string} options.department
 * @param {string} options.feeType
 * @param {number} options.amount
 * @param {string} options.transactionId
 * @param {string} options.paymentMethod
 * @param {Date}   options.paymentDate
 * @returns {Promise<string>} filename (not full path)
 */
const generateReceipt = async ({
  studentName,
  studentId,
  department,
  feeType,
  amount,
  transactionId,
  paymentMethod,
  paymentDate = new Date(),
}) => {
  // ── Ensure output directory exists ──────────────────────────────────────────
  const outputDir = path.join(__dirname, '..', 'uploads', 'receipts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // ── Create PDF ───────────────────────────────────────────────────────────────
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const primaryColor = rgb(0.1, 0.3, 0.6);
  const grayColor = rgb(0.4, 0.4, 0.4);
  const blackColor = rgb(0, 0, 0);
  const whiteColor = rgb(1, 1, 1);
  const lightBlue = rgb(0.88, 0.93, 0.98);

  // ── Header Background ────────────────────────────────────────────────────────
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: primaryColor,
  });

  // ── Institution Name ─────────────────────────────────────────────────────────
  page.drawText('SCHOOL ERP INSTITUTION', {
    x: 50,
    y: height - 50,
    size: 22,
    font: fontBold,
    color: whiteColor,
  });

  page.drawText('Fee Payment Receipt', {
    x: 50,
    y: height - 75,
    size: 13,
    font: fontRegular,
    color: rgb(0.8, 0.9, 1),
  });

  // ── Receipt number on right ──────────────────────────────────────────────────
  page.drawText(`Receipt #: ${transactionId}`, {
    x: width - 230,
    y: height - 50,
    size: 11,
    font: fontBold,
    color: whiteColor,
  });

  const formattedDate = new Date(paymentDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  page.drawText(`Date: ${formattedDate}`, {
    x: width - 230,
    y: height - 70,
    size: 10,
    font: fontRegular,
    color: rgb(0.8, 0.9, 1),
  });

  // ── Divider ──────────────────────────────────────────────────────────────────
  const sectionStart = height - 140;

  // ── Student Details Section ──────────────────────────────────────────────────
  page.drawRectangle({
    x: 40,
    y: sectionStart - 90,
    width: width - 80,
    height: 100,
    color: lightBlue,
    borderColor: primaryColor,
    borderWidth: 1,
  });

  page.drawText('STUDENT INFORMATION', {
    x: 55,
    y: sectionStart - 20,
    size: 11,
    font: fontBold,
    color: primaryColor,
  });

  const drawLabelValue = (label, value, x, y) => {
    page.drawText(`${label}:`, { x, y, size: 10, font: fontBold, color: grayColor });
    page.drawText(String(value), { x: x + 110, y, size: 10, font: fontRegular, color: blackColor });
  };

  drawLabelValue('Student Name', studentName, 55, sectionStart - 40);
  drawLabelValue('Student ID', studentId, 55, sectionStart - 58);
  drawLabelValue('Department', department, 55, sectionStart - 76);

  // ── Payment Details Section ──────────────────────────────────────────────────
  const paySection = sectionStart - 210;

  page.drawRectangle({
    x: 40,
    y: paySection,
    width: width - 80,
    height: 115,
    color: lightBlue,
    borderColor: primaryColor,
    borderWidth: 1,
  });

  page.drawText('PAYMENT DETAILS', {
    x: 55,
    y: paySection + 95,
    size: 11,
    font: fontBold,
    color: primaryColor,
  });

  drawLabelValue('Fee Type', feeType, 55, paySection + 75);
  drawLabelValue('Payment Method', paymentMethod, 55, paySection + 57);
  drawLabelValue('Transaction ID', transactionId, 55, paySection + 39);
  drawLabelValue('Payment Date', formattedDate, 55, paySection + 21);

  // ── Amount Box ───────────────────────────────────────────────────────────────
  const amtBoxY = paySection - 80;
  page.drawRectangle({
    x: 40,
    y: amtBoxY,
    width: width - 80,
    height: 65,
    color: primaryColor,
  });

  page.drawText('AMOUNT PAID', {
    x: 55,
    y: amtBoxY + 42,
    size: 11,
    font: fontBold,
    color: rgb(0.8, 0.9, 1),
  });

  page.drawText(`₹ ${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, {
    x: 55,
    y: amtBoxY + 18,
    size: 20,
    font: fontBold,
    color: whiteColor,
  });

  // ── Status stamp ─────────────────────────────────────────────────────────────
  page.drawText('PAID', {
    x: width - 140,
    y: amtBoxY + 16,
    size: 28,
    font: fontBold,
    color: rgb(0.2, 0.9, 0.4),
  });

  // ── Footer ───────────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: 40, y: 80 },
    end: { x: width - 40, y: 80 },
    thickness: 0.5,
    color: grayColor,
  });

  page.drawText('This is a computer-generated receipt and does not require a physical signature.', {
    x: 55,
    y: 62,
    size: 8,
    font: fontRegular,
    color: grayColor,
  });

  page.drawText('School ERP Institution  |  admin@schoolerp.edu  |  +91-XXXXXXXXXX', {
    x: 55,
    y: 48,
    size: 8,
    font: fontRegular,
    color: grayColor,
  });

  // ── Serialize & save ─────────────────────────────────────────────────────────
  const pdfBytes = await pdfDoc.save();
  const filename = `receipt_${transactionId}_${Date.now()}.pdf`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, pdfBytes);

  return filename;
};

module.exports = generateReceipt;
