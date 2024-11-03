"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './VendorReport.css';

interface VendorReport {
  reportId: string;
  fullName: string;
  email: string;
  socialMediaPlatform: string;
  accountUsername: string;
  accountURL: string;
  businessType: string;
  businessCategory: string;
  priceRange: string;
  paymentMethods: string[];
  accountAge: string;
  followersCount: string;
  hasBusinessProfile: boolean;
  verifiedAccount: boolean;
  hasRefundPolicy: boolean;
  refundPolicyDetails?: string;
  deliveryMethod: string[];
  urgencyTactics: boolean;
  limitedTimeOffers: boolean;
  requestsPersonalBanking: boolean;
  prePaymentRequired: boolean;
  suspiciousFeatures: string;
  screenshots: Array<{
    url: string;
    publicId: string;
  }>;
  riskAssessment: {
    riskLevel: string;
    score: number;
    riskFactors: string[];
    recommendations: string[];
    summary: string;
  };
  submissionDate: string;
}

export default function VendorReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<VendorReport | null>(null);

  useEffect(() => {
    const storedReport = localStorage.getItem('vendorReport');
    if (!storedReport) {
      router.push('/');
      return;
    }
    setReport(JSON.parse(storedReport));
  }, [router]);

  if (!report) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading report...</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>Vendor Verification Report</h1>
        <p className="report-id">Report ID: {report.reportId}</p>
        <p className="submission-date">Generated on: {formatDate(report.submissionDate)}</p>
      </div>

      {report.riskAssessment.score > 0 ? (
        <div className="warning-section">
<div className="warning-section">
  <div className="warning-icon">⚠️</div>
  <h2>Important Notice</h2>
  
  <div className="profile-highlight">
    <span className="profile-label">Username:</span>
    <span className="profile-value">{report.accountUsername}</span>
    <span className="profile-label">Platform:</span>
    <span className="profile-value">{report.socialMediaPlatform}</span>
  </div>

  <p className="risk-warning">
    If this profile exists, There is a chance you might be at risk with this vendor.
  </p>

  <div className="warning-details">
    <p>• Our analysts will conduct thorough research and contact you within 24 hours.</p>
    <p className="text-red-700">•<b>If you do not hear from us, then it means that the profile doesn't exist</b></p>
    <p>• To protect your cash and investment, do not proceed with any transactions at this time.</p>
    <p>• Please check your email for a detailed report from <span className="support-email">support@scamlens.io</span></p>
  </div>
</div>
          <div className="risk-level">
            Risk Level: <span className={`risk-${report.riskAssessment.riskLevel.toLowerCase()}`}>
              {report.riskAssessment.riskLevel}
            </span>
          </div>
        </div>
      ) : (
        <div className="safe-section">
          <div className="safe-icon">✓</div>
          <h2>Initial Assessment</h2>
          <p>No immediate risks detected. However, always use secure payment methods and never share sensitive financial information.</p>
        </div>
      )}

      <div className="report-section">
        <h2>Vendor Details</h2>
        <div className="details-grid">
          <div className="detail-item">
            <label>Platform:</label>
            <span>{report.socialMediaPlatform}</span>
          </div>
          <div className="detail-item">
            <label>Username:</label>
            <span>{report.accountUsername}</span>
          </div>
          <div className="detail-item">
            <label>Business Type:</label>
            <span>{report.businessType}</span>
          </div>
          <div className="detail-item">
            <label>Category:</label>
            <span>{report.businessCategory}</span>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2>Account Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <label>Account Age:</label>
            <span>{report.accountAge}</span>
          </div>
          <div className="detail-item">
            <label>Followers:</label>
            <span>{report.followersCount}</span>
          </div>
          <div className="detail-item">
            <label>Business Profile:</label>
            <span>{report.hasBusinessProfile ? 'Yes' : 'No'}</span>
          </div>
          <div className="detail-item">
            <label>Verified Account:</label>
            <span>{report.verifiedAccount ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2>Business Practices</h2>
        <div className="details-grid">
          <div className="detail-item">
            <label>Price Range:</label>
            <span>{report.priceRange}</span>
          </div>
          <div className="detail-item">
            <label>Payment Methods:</label>
            <span>{report.paymentMethods.join(', ')}</span>
          </div>
          <div className="detail-item">
            <label>Delivery Methods:</label>
            <span>{report.deliveryMethod.join(', ')}</span>
          </div>
          <div className="detail-item">
            <label>Refund Policy:</label>
            <span>{report.hasRefundPolicy ? 'Available' : 'Not Available'}</span>
          </div>
        </div>
      </div>

      {report.riskAssessment.score > 0 && (
        <div className="report-section risk-factors">
          <h2>Risk Factors</h2>
          <ul>
            {report.riskAssessment.riskFactors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
          
          <h3>Warning Signs</h3>
          <div className="warning-signs">
            {report.urgencyTactics && (
              <div className="warning-item">
                <span className="warning-icon">⚠️</span>
                <span>Uses urgency tactics</span>
              </div>
            )}
            {report.limitedTimeOffers && (
              <div className="warning-item">
                <span className="warning-icon">⚠️</span>
                <span>Frequent limited time offers</span>
              </div>
            )}
            {report.requestsPersonalBanking && (
              <div className="warning-item">
                <span className="warning-icon">⚠️</span>
                <span>Requests personal banking information</span>
              </div>
            )}
            {report.prePaymentRequired && (
              <div className="warning-item">
                <span className="warning-icon">⚠️</span>
                <span>Requires full payment upfront</span>
              </div>
            )}
          </div>
        </div>
      )}

      {report.screenshots.length > 0 && (
        <div className="report-section">
          <h2>Evidence</h2>
          <div className="screenshots-grid">
            {report.screenshots.map((screenshot, index) => (
              <div key={index} className="screenshot-item">
                <Image
                  src={screenshot.url}
                  alt={`Screenshot ${index + 1}`}
                  width={300}
                  height={200}
                  objectFit="cover"
                  className="screenshot-image"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button onClick={() => window.print()} className="print-button">
          Print Report
        </button>
        <button onClick={() => router.push('/')} className="back-button">
          Submit Another Report
        </button>
      </div>
    </div>
  );
}