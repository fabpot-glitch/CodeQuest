import React from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import ResumePreview from "../components/ResumeBuilder/ResumePreview";
import "./PreviewPage.css";

const PreviewPage = () => {
  const { resumeData } = useResume();
  const navigate = useNavigate();

  const hasData = () => {
    if (!resumeData) return false;
    return (
      resumeData.personalInfo?.fullName ||
      resumeData.experience?.length > 0 ||
      resumeData.education?.length > 0
    );
  };

  return (
    <div className="preview-page">

      {/* ===== HEADER ===== */}
      <div className="preview-header">
        <div className="header-left">
          <h1>Resume Preview</h1>
        </div>
        <button
          className="export-btn"
          onClick={() => navigate("/dashboard/resume-builder/export")}
        >
          <i className="fas fa-file-export"></i>
          Export Resume
        </button>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="preview-layout">

        {/* ===== LEFT SIDEBAR ===== */}
        <div className="preview-sidebar">

          {/* ATS Score Card */}
          <div className="control-card ats-card">
            <div className="ats-display">
              <div className="ats-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="92, 100"
                  />
                </svg>
                <span className="ats-percentage">92%</span>
              </div>
              <div className="ats-text">
                <strong>ATS Score</strong>
                <span className="ats-label">Strong resume</span>
              </div>
            </div>
          </div>

          {/* AI Improve Card */}
          <div className="control-card ai-card">
            <h3>
              <i className="fas fa-magic"></i>
              Improve with AI
            </h3>
            <p>Get personalized suggestions to enhance your resume</p>
            <button className="ai-button">
              <i className="fas fa-robot"></i>
              Enhance with AI
            </button>
          </div>

        </div>

        {/* ===== RIGHT — RESUME PREVIEW ===== */}
        <div className="preview-content">
          <div className="preview-container">
            <ResumePreview />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreviewPage;