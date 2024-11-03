"use client"

import React, { useRef, useState } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './SocialVendor.css';

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  socialMediaPlatform: Yup.string()
    .required('Please select a platform'),
  accountUsername: Yup.string()
    .required('Account username is required'),
  accountURL: Yup.string()
    .url('Must be a valid URL')
    .required('Account URL is required'),
  businessType: Yup.string()
    .required('Please select business type'),
  businessCategory: Yup.string()
    .required('Business category is required'),
  priceRange: Yup.string()
    .required('Price range is required'),
  paymentMethods: Yup.array()
    .min(1, 'Select at least one payment method')
    .required('Payment methods are required'),
  accountAge: Yup.string()
    .required('Account age is required'),
  followersCount: Yup.string()
    .required('Follower count is required'),
  deliveryMethod: Yup.array()
    .min(1, 'Select at least one delivery method'),
  suspiciousFeatures: Yup.string()
    .min(20, 'Please provide more details')
    .required('Please describe any suspicious features'),
  screenshots: Yup.array()
    .min(1, 'At least one screenshot is required')
    .required('Screenshots are required'),
});

const SocialVendorForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const initialValues = {
    fullName: '',
    email: '',
    socialMediaPlatform: '',
    accountUsername: '',
    accountURL: '',
    businessType: '',
    businessCategory: '',
    priceRange: '',
    paymentMethods: [],
    accountAge: '',
    followersCount: '',
    hasBusinessProfile: false,
    verifiedAccount: false,
    hasRefundPolicy: false,
    refundPolicyDetails: '',
    deliveryMethod: [],
    urgencyTactics: false,
    limitedTimeOffers: false,
    requestsPersonalBanking: false,
    prePaymentRequired: false,
    suspiciousFeatures: '',
    screenshots: [],
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const files = event.currentTarget.files;
    if (files) {
      // Create array from FileList
      const filesArray = Array.from(files);
      
      // Validate file types and sizes
      const validFiles = filesArray.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isUnderLimit = file.size <= 5 * 1024 * 1024; // 5MB limit
        return isImage && isUnderLimit;
      });

      if (validFiles.length !== filesArray.length) {
        setError('Some files were skipped. Files must be images under 5MB.');
      }

      // Update form value
      setFieldValue('screenshots', validFiles);
      
      // Create preview URLs
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
      
      // Cleanup old preview URLs when component unmounts
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    }
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      setShowLoader(true);
      setError(null);
      
      const formData = new FormData();
      
      // Append all non-file fields
      Object.keys(values).forEach((key) => {
        if (key !== 'screenshots') {
          if (Array.isArray(values[key])) {
            values[key].forEach((value: any) => {
              formData.append(key, value);
            });
          } else {
            formData.append(key, values[key].toString());
          }
        }
      });
      
      // Append screenshots
      values.screenshots.forEach((file: File) => {
        formData.append('screenshots', file);
      });

      const response = await fetch('/api/submit-socialvendor', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      if (data.success) {
        // Reset form
        resetForm();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setPreviewUrls([]);

        // Store report data and redirect
        localStorage.setItem('vendorReport', JSON.stringify(data.report));
        localStorage.setItem('vendorRiskAssessment', JSON.stringify(data.riskAssessment));
        router.push('/vendorreport');
      }

    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Submission failed. Please try again.');
    } finally {
      setShowLoader(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Social Media Vendor Verification</h1>
      
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
                  <label htmlFor="fullName">Your Full Name</label>
                  <Field 
                    name="fullName" 
                    type="text" 
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage name="fullName" component="div" className="error" />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Your Email Address</label>
                  <Field 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>
              </div>
            </div>

            {/* Vendor Details */}
            <div className="form-section">
              <h2 className="section-title">Vendor Details</h2>
              
              <div className="form-field">
                <label htmlFor="socialMediaPlatform">Social Media Platform</label>
                <Field name="socialMediaPlatform" as="select">
                  <option value="">Select platform</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="other">Other</option>
                </Field>
                <ErrorMessage name="socialMediaPlatform" component="div" className="error" />
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="accountUsername">Account Username/Handle</label>
                  <Field 
                    name="accountUsername" 
                    type="text" 
                    placeholder="@username"
                  />
                  <ErrorMessage name="accountUsername" component="div" className="error" />
                </div>

                <div className="form-field">
                  <label htmlFor="accountURL">Account/Post URL</label>
                  <Field 
                    name="accountURL" 
                    type="url" 
                    placeholder="https://..."
                  />
                  <ErrorMessage name="accountURL" component="div" className="error" />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="form-section">
              <h2 className="section-title">Business Information</h2>
              
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="businessType">Type of Business</label>
                  <Field name="businessType" as="select">
                    <option value="">Select type</option>
                    <option value="retail">Retail/Products</option>
                    <option value="investment">Investment/Trading</option>
                    <option value="services">Services</option>
                    <option value="dropshipping">Dropshipping</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="businessType" component="div" className="error" />
                </div>

                <div className="form-field">
                  <label htmlFor="businessCategory">Business Category</label>
                  <Field 
                    name="businessCategory" 
                    type="text" 
                    placeholder="e.g., Wigs, Clothes, Forex, etc."
                  />
                  <ErrorMessage name="businessCategory" component="div" className="error" />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="priceRange">Price Range</label>
                <Field 
                  name="priceRange" 
                  type="text" 
                  placeholder="e.g., $10-$100"
                />
                <ErrorMessage name="priceRange" component="div" className="error" />
              </div>
            </div>

            {/* Continue with Part 2... */}
            
         {/* Add this inside the FormikForm, after the Business Information section */}

            {/* Payment & Delivery */}
            <div className="form-section">
              <h2 className="section-title">Payment & Delivery</h2>
              
              <div className="form-field">
                <label htmlFor="paymentMethods">Payment Methods Accepted</label>
                <div className="checkbox-group">
                  <label>
                    <Field type="checkbox" name="paymentMethods" value="bank_transfer" />
                    Bank Transfer
                  </label>
                  <label>
                    <Field type="checkbox" name="paymentMethods" value="cash" />
                    Cash
                  </label>
                  <label>
                    <Field type="checkbox" name="paymentMethods" value="crypto" />
                    Cryptocurrency
                  </label>
                  <label>
                    <Field type="checkbox" name="paymentMethods" value="gift_cards" />
                    Gift Cards
                  </label>
                  <label>
                    <Field type="checkbox" name="paymentMethods" value="paypal" />
                    PayPal
                  </label>
                  <label>
                    <Field type="checkbox" name="paymentMethods" value="other" />
                    Other
                  </label>
                </div>
                <ErrorMessage name="paymentMethods" component="div" className="error" />
              </div>

              <div className="form-field">
                <label htmlFor="deliveryMethod">Delivery Methods</label>
                <div className="checkbox-group">
                  <label>
                    <Field type="checkbox" name="deliveryMethod" value="in_person" />
                    In-Person Delivery
                  </label>
                  <label>
                    <Field type="checkbox" name="deliveryMethod" value="shipping" />
                    Shipping
                  </label>
                  <label>
                    <Field type="checkbox" name="deliveryMethod" value="digital" />
                    Digital Delivery
                  </label>
                </div>
                <ErrorMessage name="deliveryMethod" component="div" className="error" />
              </div>
            </div>

            {/* Account Verification */}
            <div className="form-section">
              <h2 className="section-title">Account Verification</h2>
              
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="accountAge">Account Age</label>
                  <Field name="accountAge" as="select">
                    <option value="">Select age</option>
                    <option value="less_than_month">Less than 1 month</option>
                    <option value="1_6_months">1-6 months</option>
                    <option value="6_12_months">6-12 months</option>
                    <option value="1_2_years">1-2 years</option>
                    <option value="over_2_years">Over 2 years</option>
                  </Field>
                  <ErrorMessage name="accountAge" component="div" className="error" />
                </div>

                <div className="form-field">
                  <label htmlFor="followersCount">Follower Count</label>
                  <Field 
                    name="followersCount" 
                    type="text" 
                    placeholder="e.g., 1000"
                  />
                  <ErrorMessage name="followersCount" component="div" className="error" />
                </div>
              </div>

              <div className="form-field">
                <div className="checkbox-group vertical">
                  <label>
                    <Field type="checkbox" name="hasBusinessProfile" />
                    Has Business/Professional Profile
                  </label>
                  <label>
                    <Field type="checkbox" name="verifiedAccount" />
                    Account is Verified (Blue Check)
                  </label>
                </div>
              </div>
            </div>

            {/* Risk Indicators */}
            <div className="form-section warning-section">
              <h2 className="section-title">Risk Indicators</h2>
              
              <div className="form-field">
                <div className="checkbox-group vertical">
                  <label>
                    <Field type="checkbox" name="urgencyTactics" />
                    Uses urgency tactics ("Limited time!", "Act now!")
                  </label>
                  <label>
                    <Field type="checkbox" name="limitedTimeOffers" />
                    Frequent "limited time" offers
                  </label>
                  <label>
                    <Field type="checkbox" name="requestsPersonalBanking" />
                    Requests personal banking information
                  </label>
                  <label>
                    <Field type="checkbox" name="prePaymentRequired" />
                    Requires full payment before showing products
                  </label>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="suspiciousFeatures">Suspicious Features or Behavior</label>
                <Field 
                  name="suspiciousFeatures" 
                  as="textarea" 
                  rows="4"
                  placeholder="Describe any suspicious behavior, red flags, or concerns..."
                />
                <ErrorMessage name="suspiciousFeatures" component="div" className="error" />
              </div>
            </div>

            {/* Evidence Upload */}
            <div className="form-section">
              <h2 className="section-title">Evidence</h2>
              
              <div className="form-field">
                <label htmlFor="screenshots">Upload Screenshots</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => handleFileChange(event, setFieldValue)}
                  className="file-input"
                />
                <p className="help-text">Upload screenshots of the account, posts, or conversations (Max 5MB per image)</p>
                <ErrorMessage name="screenshots" component="div" className="error" />
                
                {previewUrls.length > 0 && (
                  <div className="image-preview-grid">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="image-preview">
                        <Image 
                          src={url} 
                          alt={`Screenshot ${index + 1}`} 
                          width={200}
                          height={150}
                          objectFit="contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || showLoader}
              className="submit-button"
            >
              {isSubmitting || showLoader ? 'Verifying...' : 'Submit Report'}
            </button>
          </FormikForm>
        )}
      </Formik>

      {showLoader && (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loader-text">Analyzing vendor and generating report...</p>
        </div>
      )}
    </div>
  );
};

export default SocialVendorForm;