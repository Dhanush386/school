const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

/**
 * Generates a certificate PDF and saves it to uploads/certificates/
 * @param {Object} options
 * @param {string} options.certificateType  - 'bonafide' | 'transfer' | 'conduct' | 'study'
 * @param {string} options.studentName
 * @param {string} options.studentId        - loginId
 * @param {string} options.department
 * @param {string} options.className        - e.g. "Class 10 - A"
 * @param {string} options.academicYear     - e.g. "2024-25"
 * @param {string} [options.purpose]        - reason/purpose (bonafide)
 * @param {string} [options.remarks]        - extra remarks
 * @param {Date}   [options.issueDate]
 * @returns {Promise<string>} filename
 */
const generateCertificatePDF = async ({
  certificateType = 'bonafide',
  studentName,
  studentId,
  department,
  className,
  academicYear,
  purpose = '',
  remarks = '',
  issueDate = new Date(),
}) => {
  // ── Ensure output directory exists ──────────────────────────────────────────
  const outputDir = path.join(__dirname, '..', 'uploads', 'certificates');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // ── Certificate meta ─────────────────────────────────────────────────────────
  const certTitleMap = {
    bonafide: 'BONAFIDE CERTIFICATE',
    transfer: 'TRANSFER CERTIFICATE',
    conduct: 'CONDUCT CERTIFICATE',
    study: 'CERTIFICATE OF STUDY',
  };
  const certTitle = certTitleMap[certificateType] || 'CERTIFICATE';

  const formattedDate = new Date(issueDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // ── Create PDF ───────────────────────────────────────────────────────────────
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const primaryColor = rgb(0.1, 0.3, 0.6);
  const goldColor = rgb(0.72, 0.53, 0.04);
  const grayColor = rgb(0.4, 0.4, 0.4);
  const blackColor = rgb(0, 0, 0);
  const whiteColor = rgb(1, 1, 1);

  // ── Outer border ─────────────────────────────────────────────────────────────
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: primaryColor,
    borderWidth: 3,
    color: rgb(1, 1, 1),
  });

  // Inner decorative border
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: goldColor,
    borderWidth: 1,
  });

  // ── Header ───────────────────────────────────────────────────────────────────
  page.drawRectangle({
    x: 20,
    y: height - 130,
    width: width - 40,
    height: 110,
    color: primaryColor,
  });

  // Institution name
  page.drawText('SCHOOL ERP INSTITUTION', {
    x: 60,
    y: height - 65,
    size: 22,
    font: fontBold,
    color: whiteColor,
  });

  page.drawText('Affiliated to State Board of Education | Est. 2000', {
    x: 60,
    y: height - 86,
    size: 10,
    font: fontRegular,
    color: rgb(0.8, 0.9, 1),
  });

  page.drawText('admin@schoolerp.edu  |  +91-XXXXXXXXXX', {
    x: 60,
    y: height - 102,
    size: 9,
    font: fontRegular,
    color: rgb(0.8, 0.9, 1),
  });

  // ── Certificate Title ────────────────────────────────────────────────────────
  const certTitleY = height - 175;
  page.drawText(certTitle, {
    x: width / 2 - (certTitle.length * 7) / 2,
    y: certTitleY,
    size: 20,
    font: fontBold,
    color: primaryColor,
  });

  // Underline
  page.drawLine({
    start: { x: 100, y: certTitleY - 8 },
    end: { x: width - 100, y: certTitleY - 8 },
    thickness: 1.5,
    color: goldColor,
  });

  // ── Certificate Number / Date ────────────────────────────────────────────────
  page.drawText(`Certificate No: CERT-${studentId}-${Date.now().toString().slice(-6)}`, {
    x: 60,
    y: certTitleY - 35,
    size: 10,
    font: fontRegular,
    color: grayColor,
  });

  page.drawText(`Date of Issue: ${formattedDate}`, {
    x: width - 230,
    y: certTitleY - 35,
    size: 10,
    font: fontRegular,
    color: grayColor,
  });

  // ── Body Text ────────────────────────────────────────────────────────────────
  const bodyStartY = certTitleY - 80;
  const lineHeight = 28;

  // Build body paragraphs based on certificate type
  let bodyLines = [];

  if (certificateType === 'bonafide') {
    bodyLines = [
      'This is to certify that',
      `${studentName} (Student ID: ${studentId})`,
      `is a bonafide student of this institution in ${className},`,
      `Department of ${department}, for the Academic Year ${academicYear}.`,
      '',
      purpose
        ? `This certificate is issued for the purpose of: ${purpose}.`
        : 'This certificate is issued for bonafide purposes.',
    ];
  } else if (certificateType === 'transfer') {
    bodyLines = [
      'This is to certify that',
      `${studentName} (Student ID: ${studentId})`,
      `was a bonafide student of this institution in ${className},`,
      `Department of ${department}, for the Academic Year ${academicYear}.`,
      '',
      'The student has completed their studies and is hereby granted this',
      'Transfer Certificate for seeking admission elsewhere.',
    ];
  } else if (certificateType === 'conduct') {
    bodyLines = [
      'This is to certify that',
      `${studentName} (Student ID: ${studentId})`,
      `student of ${className}, Department of ${department},`,
      `Academic Year ${academicYear},`,
      '',
      'has been a student of good conduct and character during their tenure',
      'at this institution. No disciplinary action has been taken against them.',
    ];
  } else {
    bodyLines = [
      'This is to certify that',
      `${studentName} (Student ID: ${studentId})`,
      `has been studying in ${className}, Department of ${department},`,
      `Academic Year ${academicYear} at this institution.`,
    ];
  }

  bodyLines.forEach((line, i) => {
    const isNameLine = line.includes(studentName) && line.includes(studentId);
    page.drawText(line, {
      x: 60,
      y: bodyStartY - i * lineHeight,
      size: isNameLine ? 13 : 12,
      font: isNameLine ? fontBold : fontRegular,
      color: isNameLine ? primaryColor : blackColor,
    });
  });

  // ── Remarks ──────────────────────────────────────────────────────────────────
  if (remarks) {
    const remarkY = bodyStartY - bodyLines.length * lineHeight - 20;
    page.drawText('Remarks:', { x: 60, y: remarkY, size: 11, font: fontBold, color: grayColor });
    page.drawText(remarks, { x: 60, y: remarkY - 18, size: 11, font: fontOblique, color: grayColor });
  }

  // ── Signature Section ────────────────────────────────────────────────────────
  const sigY = 160;

  // Left - Class Teacher
  page.drawLine({ start: { x: 60, y: sigY }, end: { x: 200, y: sigY }, thickness: 0.8, color: blackColor });
  page.drawText('Class Teacher / HOD', { x: 60, y: sigY - 16, size: 10, font: fontRegular, color: grayColor });

  // Center - Principal
  page.drawLine({ start: { x: 235, y: sigY }, end: { x: 375, y: sigY }, thickness: 0.8, color: blackColor });
  page.drawText('Principal', { x: 285, y: sigY - 16, size: 10, font: fontRegular, color: grayColor });

  // Right - Official Seal placeholder
  page.drawRectangle({
    x: width - 190,
    y: sigY - 50,
    width: 100,
    height: 70,
    borderColor: grayColor,
    borderWidth: 0.5,
  });
  page.drawText('Official Seal', {
    x: width - 177,
    y: sigY - 20,
    size: 9,
    font: fontOblique,
    color: grayColor,
  });

  // ── Footer ───────────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: 28, y: 80 },
    end: { x: width - 28, y: 80 },
    thickness: 0.5,
    color: goldColor,
  });

  page.drawText(
    'This certificate is computer-generated and is valid without a physical signature unless otherwise stated.',
    { x: 60, y: 60, size: 8, font: fontOblique, color: grayColor }
  );

  page.drawText(
    `Generated on: ${new Date().toLocaleString('en-IN')}`,
    { x: 60, y: 44, size: 8, font: fontRegular, color: grayColor }
  );

  // ── Save ─────────────────────────────────────────────────────────────────────
  const pdfBytes = await pdfDoc.save();
  const filename = `${certificateType}_${studentId}_${Date.now()}.pdf`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, pdfBytes);

  return filename;
};

module.exports = generateCertificatePDF;
