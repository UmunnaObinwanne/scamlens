/*
import ReportFormWrapper from '@/components/ReportFormWrapper';

export default function ReportPage() {
  return <ReportFormWrapper />;
}
*/

"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './Report.css';

interface DetailedReport {
  reportId: string;
  submissionDate: string;
  platformDetailsName: string;
  platformDetailsType: string;
  platformDetailsContact: string;
  riskSummary: string;
  financialRequired: boolean;
  financialAmount: string;
  suspiciousDetails: string;
  suspiciousAnalyzed: string[];
  recommendationsImmediate: string[];
  recommendationsGeneral: string[];
  hasScreenshot: boolean;
  screenshotURL: string;
}

interface RiskAssessment {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  score: number;
  riskFactors: string[];
  recommendations: string[];
}

export default function Report() {
  const router = useRouter();
  const [report, setReport] = useState<DetailedReport | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);

  useEffect(() => {
    try {
      const storedReport = localStorage.getItem('platformReport');
      const storedAssessment = localStorage.getItem('riskAssessment');

      if (!storedReport || !storedAssessment) {
        router.push('/');
        return;
      }

      setReport(JSON.parse(storedReport));
      setRiskAssessment(JSON.parse(storedAssessment));
    } catch (error) {
      console.error('Error loading report:', error);
      router.push('/');
    }
  }, [router]);

  if (!report || !riskAssessment) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Checking report...</p>
      </div>
    );
  }

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>Platform Verification Report</h1>
        <p className="report-id">Report ID: {report.reportId}</p>
        <p className="submission-date">
          Generated on: {new Date(report.submissionDate).toLocaleString()}
        </p>
      </div>

      <div className="report-section">
        <h2>Platform Details</h2>
        <div className="details-grid">
          <div className="detail-item">
            <label>Website:</label>
            <span>{report.platformDetailsName}</span>
          </div>
          <div className="detail-item">
            <label>Type:</label>
            <span>{report.platformDetailsType}</span>
          </div>
          <div className="detail-item">
            <label>Contact Availability:</label>
            <span>{report.platformDetailsContact}</span>
          </div>
        </div>
      </div>

    <div className="report-section risk-assessment">
  <h2>Risk Assessment</h2>
  <div className={`risk-level ${getRiskLevelColor(riskAssessment.riskLevel)}`}>
    Risk Level: {riskAssessment.riskLevel}
  </div>
  <div className="risk-score">
    Risk Score: {riskAssessment.score}
  </div>
  <p className="risk-summary">{report.riskSummary}</p>
  
  {/* Add this conditional notice */}
  {riskAssessment.score > 0 && (
    <div className="analyst-notice">
      <div className="notice-content">
        <p className="notice-title">⚠️ Important Notice</p>
        <p>This is an elementary report based on initial assessment. Our analysts are currently conducting a thorough investigation of this platform. We strongly advise against rushing into any investment decisions at this time.</p>
        <p>Please wait for our comprehensive analysis before making any financial commitments.</p>
      </div>
    </div>
  )}
</div>

      <div className="report-section">
        <h2>Financial Information</h2>
        <div className="financial-info">
          <p>Money Involved: {report.financialRequired ? 'Yes' : 'No'}</p>
          {report.financialRequired && (
            <p>Amount Required: {report.financialAmount}</p>
          )}
        </div>
      </div>

      <div className="report-section">
        <h2>Risk Factors</h2>
        <ul className="risk-factors">
          {report.suspiciousAnalyzed.map((factor, index) => (
            <li key={index}>{factor}</li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h2>Recommendations</h2>
        <div className="recommendations">
          <div className="immediate-actions">
            <h3>Immediate Actions</h3>
            <ul>
              {report.recommendationsImmediate.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
          <div className="general-advice">
            <h3>General Advice</h3>
            <ul>
              {report.recommendationsGeneral.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {report.hasScreenshot && (
        <div className="report-section">
          <h2>Evidence</h2>
          <div className="screenshot-container">
            <Image 
              src={report.screenshotURL}
              alt="Platform Screenshot"
              width={600}
              height={400}
              layout="responsive"
              objectFit="contain"
              className="screenshot"
            />
          </div>
        </div>
      )}

      <div className="report-actions">
        <button 
          onClick={() => window.print()} 
          className="print-button"
        >
          Print Report
        </button>
        <button 
          onClick={() => router.push('/')} 
          className="back-button"
        >
          Submit Another Report
        </button>
      </div>
    </div>
  );
}