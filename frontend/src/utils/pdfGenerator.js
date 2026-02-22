// utils/pdfGenerator.js (or services/pdfExportService.js)
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads PDF from resume data
 */
export const downloadPDF = async (resumeData, fileName = 'My_Resume') => {
  try {
    // Create a temporary container for the resume
    const container = createResumeContainer(resumeData);
    document.body.appendChild(container);
    
    // Wait for fonts to load
    await document.fonts.ready;
    
    // Capture the container as canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
      useCORS: true,
    });
    
    // Remove the temporary container
    document.body.removeChild(container);
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const width = imgWidth * ratio;
    const height = imgHeight * ratio;
    
    pdf.addImage(imgData, 'PNG', (pdfWidth - width) / 2, 0, width, height);
    
    // Generate filename
    const sanitizedName = fileName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFileName = `${sanitizedName}-${timestamp}.pdf`;
    
    // Save the PDF
    pdf.save(finalFileName);
    
    return { success: true, fileName: finalFileName };
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates a formatted resume container from data
 */
const createResumeContainer = (data) => {
  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.padding = '48px';
  container.style.background = '#ffffff';
  container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  
  container.innerHTML = generateResumeHTML(data);
  
  return container;
};

/**
 * Generates HTML for the resume
 */
const generateResumeHTML = (data) => {
  const { personalInfo = {}, experience = [], education = [], skills = {}, projects = [], certifications = [], languages = [] } = data;
  
  // Flatten skills
  const skillsArray = [];
  Object.entries(skills).forEach(([category, skillList]) => {
    if (Array.isArray(skillList)) {
      skillList.forEach(skill => skillsArray.push(skill));
    }
  });
  
  return `
    <div style="max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 3px solid #2563eb;">
        <div style="width: 80px; height: 80px; background: #2563eb; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 600;">
          ${getInitials(personalInfo.fullName)}
        </div>
        <div>
          <h1 style="font-size: 32px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">${personalInfo.fullName || 'John Doe'}</h1>
          <p style="font-size: 16px; color: #475569; margin: 0 0 12px 0;">${personalInfo.headline || 'Professional Resume'}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; color: #64748b;">
            ${personalInfo.email ? `<span>📧 ${personalInfo.email}</span>` : ''}
            ${personalInfo.phone ? `<span>📱 ${personalInfo.phone}</span>` : ''}
            ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
          </div>
        </div>
      </div>
      
      <!-- Summary -->
      ${personalInfo.summary ? `
        <div style="margin-bottom: 28px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 16px;">Professional Summary</h2>
          <p style="font-size: 14px; color: #334155; line-height: 1.6;">${personalInfo.summary}</p>
        </div>
      ` : ''}
      
      <!-- Experience -->
      ${experience.length > 0 ? `
        <div style="margin-bottom: 28px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 16px;">Work Experience</h2>
          ${experience.map(exp => `
            <div style="margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                <div>
                  <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 4px 0;">${exp.position}</h3>
                  <span style="font-size: 14px; color: #2563eb;">${exp.company}</span>
                </div>
                <span style="font-size: 13px; color: #64748b;">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              ${exp.description ? `
                <ul style="margin-top: 8px; padding-left: 20px;">
                  ${Array.isArray(exp.description) ? exp.description.map(d => `<li style="font-size: 14px; color: #334155; margin-bottom: 6px;">${d}</li>`).join('') : ''}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Skills -->
      ${skillsArray.length > 0 ? `
        <div style="margin-bottom: 28px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 16px;">Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${skillsArray.map(skill => `<span style="padding: 6px 16px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 40px; font-size: 13px; color: #0f172a;">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
};

const getInitials = (name) => {
  if (!name) return 'JD';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (date) => {
  if (!date) return 'Present';
  try {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return date;
  }
};

export const previewPDF = async (resumeData) => {
  try {
    const container = createResumeContainer(resumeData);
    document.body.appendChild(container);
    
    await document.fonts.ready;
    
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });
    
    document.body.removeChild(container);
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / imgWidth;
    const height = imgHeight * ratio;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
    
    // Open PDF in new tab
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
    return { success: true };
  } catch (error) {
    console.error('PDF Preview Error:', error);
    return { success: false, error: error.message };
  }
};