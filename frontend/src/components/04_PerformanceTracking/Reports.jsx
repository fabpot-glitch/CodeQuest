import React, { useState } from 'react';

const Reports = ({ performanceData, onGenerateReport }) => {
  const [reportType, setReportType] = useState('progress');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [generatedReports, setGeneratedReports] = useState([]);

  const reportTypes = [
    { id: 'progress', name: 'Progress Report', icon: '📊', description: 'Overview of your learning progress' },
    { id: 'skills', name: 'Skills Assessment', icon: '📚', description: 'Detailed analysis of skill mastery' },
    { id: 'goals', name: 'Goals Report', icon: '🎯', description: 'Progress towards your learning goals' },
    { id: 'sessions', name: 'Session Analysis', icon: '🎥', description: 'Detailed session performance metrics' },
    { id: 'comparison', name: 'Comparison Report', icon: '📈', description: 'Compare performance over time' }
  ];

  const generateReport = () => {
    const report = {
      id: Date.now(),
      type: reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      data: performanceData
    };
    
    setGeneratedReports([report, ...generatedReports]);
    if (onGenerateReport) {
      onGenerateReport(report);
    }
  };

  const downloadReport = (report) => {
    const reportData = {
      ...report,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = (report) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Performance Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; }
            .report-header { border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .metric { display: flex; justify-content: space-between; padding: 10px; background: #f8fafc; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>Performance Report</h1>
            <p>Generated: ${new Date(report.generatedAt).toLocaleString()}</p>
            <p>Type: ${reportTypes.find(t => t.id === report.type)?.name}</p>
          </div>
          <div class="section">
            <h2>Summary</h2>
            <div class="metric"><span>Total Sessions:</span> <strong>${report.data.totalSessions}</strong></div>
            <div class="metric"><span>Average Score:</span> <strong>${report.data.averageScore}%</strong></div>
            <div class="metric"><span>Completion Rate:</span> <strong>${report.data.completionRate}%</strong></div>
            <div class="metric"><span>Total Hours:</span> <strong>${report.data.totalHours}h</strong></div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="reports-tab">
      <div className="reports-header">
        <h3>Generate Reports</h3>
        <p>Create and download detailed performance reports</p>
      </div>

      {/* Report Generator */}
      <div className="report-generator">
        <div className="generator-form">
          <div className="form-group">
            <label>Report Type</label>
            <div className="report-type-selector">
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  className={`type-btn ${reportType === type.id ? 'active' : ''}`}
                  onClick={() => setReportType(type.id)}
                >
                  <span className="type-icon">{type.icon}</span>
                  <div className="type-info">
                    <span className="type-name">{type.name}</span>
                    <span className="type-description">{type.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="date-input"
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="date-input"
              />
            </div>
          </div>

          <button className="generate-btn" onClick={generateReport}>
            Generate Report
          </button>
        </div>
      </div>

      {/* Generated Reports */}
      {generatedReports.length > 0 && (
        <div className="generated-reports">
          <h4>Recent Reports</h4>
          <div className="reports-list">
            {generatedReports.map(report => (
              <div key={report.id} className="report-item">
                <div className="report-icon">
                  {reportTypes.find(t => t.id === report.type)?.icon}
                </div>
                <div className="report-details">
                  <div className="report-name">
                    {reportTypes.find(t => t.id === report.type)?.name}
                  </div>
                  <div className="report-date">
                    {new Date(report.generatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="report-actions">
                  <button 
                    className="action-btn"
                    onClick={() => downloadReport(report)}
                    title="Download"
                  >
                    💾
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => printReport(report)}
                    title="Print"
                  >
                    🖨️
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => {
                      setGeneratedReports(generatedReports.filter(r => r.id !== report.id));
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Templates */}
      <div className="report-templates">
        <h4>Report Templates</h4>
        <div className="templates-grid">
          <div className="template-card">
            <div className="template-icon">📊</div>
            <h5>Weekly Progress</h5>
            <p>Track your weekly performance trends</p>
            <button className="use-template-btn">Use Template</button>
          </div>
          <div className="template-card">
            <div className="template-icon">📚</div>
            <h5>Skill Mastery</h5>
            <p>Deep dive into your skill development</p>
            <button className="use-template-btn">Use Template</button>
          </div>
          <div className="template-card">
            <div className="template-icon">🎯</div>
            <h5>Goal Tracking</h5>
            <p>Monitor progress towards your goals</p>
            <button className="use-template-btn">Use Template</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;