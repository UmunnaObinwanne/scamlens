"use client"

import React, { useRef, useState, useEffect } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './Onlineplatform.css'

// Validation Schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  websiteURL: Yup.string()
    .url('Must be a valid URL')
    .required('Website URL is required'),
  platformType: Yup.string()
    .oneOf(['investment', 'ecommerce', 'crypto', 'gaming', 'social', 'other'])
    .required('Platform type is required'),
  moneyInvolved: Yup.string()
    .oneOf(['yes', 'no'])
    .required('Please indicate if money is involved'),
  investmentAmount: Yup.string().when('moneyInvolved', {
    is: 'yes',
    then: Yup.string().required('Please specify the amount involved'),
  }),
  suspiciousFeatures: Yup.string()
    .min(20, 'Please provide more details')
    .required('Please describe any suspicious features'),
  contactMethods: Yup.string()
    .oneOf(['full', 'limited', 'none'])
    .required('Please select available contact methods'),
  screenshot: Yup.mixed()
    .required('Please upload a screenshot of the platform')
});

const PlatformVerificationForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

   // Cleanup effect for preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const initialValues = {
    fullName: '',
    email: '',
    websiteURL: '',
    platformType: '',
    moneyInvolved: '',
    investmentAmount: '',
    suspiciousFeatures: '',
    contactMethods: '',
    screenshot: null,
  };

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      setFieldValue('screenshot', file);
      setError(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
    return interval;
  };


const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      setShowLoader(true);
      setError(null);
      setIsGeneratingReport(false);
      
      const progressInterval = simulateProgress();
      
      const formData = new FormData();
      
      Object.keys(values).forEach((key) => {
        if (key === 'screenshot' && values[key]) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key].toString());
        }
      });

      const response = await fetch('/api/submit-onlineplatform', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsGeneratingReport(true);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      if (data.success) {
        // Clear form and file input
        resetForm();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setPreviewUrl(null);

        // Store both report and risk assessment data
        if (data.report && data.riskAssessment) {
          localStorage.setItem('platformReport', JSON.stringify(data.report));
          localStorage.setItem('riskAssessment', JSON.stringify(data.riskAssessment));
          
          // Show success state
          setShowSuccess(true);

          // Redirect after delay
          setTimeout(() => {
            router.push('/platformreport');
          }, 1500);
        } else {
          throw new Error('Report data is incomplete');
        }
      } else {
        throw new Error(data.error || 'Submission failed');
      }

    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Submission failed. Please try again.');
    } finally {
      setShowLoader(false);
      setSubmitting(false);
      setIsGeneratingReport(false);
      setUploadProgress(0);
    }
  };


  return (
    <div className="form-container">
      <h1 className="form-title">Platform Safety Verification</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <FormikForm className="verification-form">
            {/* Basic Information */}
            <div className="form-section">
              <h2 className="section-title">Basic Information</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="fullName">Full Name</label>
                  <Field 
                    name="fullName" 
                    type="text" 
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage name="fullName" component="div" className="error" />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <Field 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>
              </div>
            </div>

            {/* Platform Details */}
            <div className="form-section">
              <h2 className="section-title">Platform Details</h2>
              <div className="form-field">
                <label htmlFor="websiteURL">Website URL</label>
                <Field 
                  name="websiteURL" 
                  type="url" 
                  placeholder="https://example.com"
                />
                <ErrorMessage name="websiteURL" component="div" className="error" />
              </div>

             <div className="form-field platform-type-field">
  <label htmlFor="platformType" className="platform-type-label">Platform Type</label>
  <Field 
    name="platformType" 
    as="select"
    className="platform-type-select"
  >
    <option value="" disabled>Select platform type</option>
    <option value="investment" className="investment-option">Investment/Trading</option>
    <option value="ecommerce" className="ecommerce-option">E-commerce</option>
    <option value="crypto" className="crypto-option">Cryptocurrency</option>
    <option value="gaming" className="gaming-option">Gaming/Gambling</option>
    <option value="social" className="social-option">Social Network</option>
    <option value="other" className="other-option">Other</option>
  </Field>
  <ErrorMessage name="platformType" component="div" className="error" />
</div>
            </div>

            {/* Risk Assessment */}
            <div className="form-section">
              <h2 className="section-title">Risk Assessment</h2>
              <div className="form-field">
                <label>Does it involve money?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <Field type="radio" name="moneyInvolved" value="yes" />
                    Yes
                  </label>
                  <label className="radio-label">
                    <Field type="radio" name="moneyInvolved" value="no" />
                    No
                  </label>
                </div>
                <ErrorMessage name="moneyInvolved" component="div" className="error" />
              </div>

              {values.moneyInvolved === 'yes' && (
                <div className="form-field">
                  <label htmlFor="investmentAmount">Required Investment Amount</label>
                  <Field 
                    name="investmentAmount" 
                    type="text" 
                    placeholder="e.g., $500"
                  />
                  <ErrorMessage name="investmentAmount" component="div" className="error" />
                </div>
              )}
            </div>

            {/* Warning Signs */}
            <div className="form-section">
              <h2 className="section-title">Warning Signs</h2>
              <div className="form-field">
                <label htmlFor="suspiciousFeatures">Suspicious Features</label>
                <Field 
                  name="suspiciousFeatures" 
                  as="textarea" 
                  rows="4"
                  placeholder="Describe any red flags (e.g., pressure tactics, unrealistic promises, poor grammar)"
                />
                <ErrorMessage name="suspiciousFeatures" component="div" className="error" />
              </div>

              <div className="form-field">
                <label htmlFor="contactMethods">Available Contact Methods</label>
                <Field name="contactMethods" as="select">
                  <option value="">Select contact availability</option>
                  <option value="full">Full contact information available</option>
                  <option value="limited">Limited contact options</option>
                  <option value="none">No contact information</option>
                </Field>
                <ErrorMessage name="contactMethods" component="div" className="error" />
              </div>
            </div>

            {/* Screenshot Upload */}
            <div className="form-section">
              <h2 className="section-title">Evidence</h2>
              <div className="form-field">
                <label htmlFor="screenshot">Platform Screenshot</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFileChange(event, setFieldValue)}
                  className="file-input"
                />
                <ErrorMessage name="screenshot" component="div" className="error" />
                
                {previewUrl && (
                  <div className="image-preview">
                    <Image 
                      src={previewUrl} 
                      alt="Screenshot preview" 
                      width={200}
                      height={150}
                      objectFit="contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || showLoader}
              className="submit-button"
            >
              {isSubmitting || showLoader ? 'Verifying...' : 'Verify Platform'}
            </button>
          </FormikForm>
        )}
      </Formik>

{/* Updated loader */}
      {showLoader && (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loader-text">
            {isGeneratingReport 
              ? 'Analyzing platform and generating report...' 
              : `Uploading screenshot & Generating Report... ${uploadProgress}%`}
          </p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>
            <h2>Report Generated Successfully!</h2>
            <p>Redirecting to your report...</p>
          </div>
        </div>
      )}
      

    </div>
  );
};

export default PlatformVerificationForm;