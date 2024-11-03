"use client"

import React, { useRef, useState } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import './RomanceForm.css'
import { SubmissionLoader } from "../ui/SubmissionLoader"
import { CompletionModal } from "../ui/CompletionModal"
import { useRouter } from 'next/navigation';


const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  country: Yup.string().required('Country is required'),
  address: Yup.string().required('Address is required'),
  personName: Yup.string().required('Person\'s name is required'),
  contactDuration: Yup.string().required('Contact duration is required'),
  meetingPlace: Yup.string().required('Meeting place is required'),
  metInRealLife: Yup.string().required('This field is required'),
  locationOfPartner: Yup.string().required('Location of partner is required'),
  communicationFrequency: Yup.string().required('Communication frequency is required'),
  discussionTopics: Yup.string().required('Discussion topics are required'),
  sharedPhotosVideos: Yup.string().required('This field is required'),
  askedForMoney: Yup.string().required('This field is required'),
  personalInfoShared: Yup.string().required('This field is required'),
  suspiciousBehavior: Yup.string().required('This field is required'),
  photosAuthentic: Yup.string().when('sharedPhotosVideos', {
    is: 'yes',
    then: Yup.string().required('Please indicate if the photos seem authentic'),
  }),
  photoUpload: Yup.mixed().when(['sharedPhotosVideos', 'photosAuthentic'], {
    is: (sharedPhotosVideos:string, photosAuthentic:string) => sharedPhotosVideos === 'yes' && photosAuthentic === 'yes',
    then: Yup.mixed().required('Please upload a photo for analysis'),
  }),
});

const RomanceForm = () => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModalClose = () => {
    setShowCompletionModal(false);
      router.push('/');
  };

  const initialValues = {
    fullName: '',
    email: '',
    country: '',
    address: '',
    personName: '',
    contactDuration: '',
    meetingPlace: '',
    otherMeetingPlace: '',
    metInRealLife: '',
    whyNotMet: '',
    communicationFrequency: '',
    locationOfPartner: '',
    discussionTopics: '',
    sharedPhotosVideos: '',
    photosAuthentic: '',
    photoUpload: null,
    askedForMoney: '',
    moneyAmount: '',
    moneyPurpose: '',
    personalInfoShared: '',
    suspiciousBehavior: '',
    };
    


// ... existing code ...
// ... existing code ...

const handleSubmit = async (values: typeof initialValues, formikHelpers: FormikHelpers<typeof initialValues>) => {
    const { setSubmitting, resetForm } = formikHelpers;
    try {
        setShowLoader(true); // Move this before any async operations
        setSubmitting(true);
        
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'photoUpload' && values[key]) {
                formData.append(key, values[key] as File);
            } else {
                formData.append(key, values[key]);
            }
        });

        const response = await fetch('/api/submit-romance', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Form submitted successfully:', result);
            
            // Wait for 6.5 seconds before resetting
            await new Promise(resolve => setTimeout(resolve, 6500));
            
            resetForm({ values: initialValues });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
    } finally {
        setSubmitting(false);
      setShowLoader(false); // Make sure loader is hidden after everything is done
       setShowCompletionModal(true);
    }
};

// ... existing code ...

  return (
    <div className="form-container">
      <h1 className="form-title">Romance Scam Detection Form</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <FormikForm className="compact-form">
            <div className="form-section">
              <h2 className="section-title">Personal Information</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="fullName">Full Name</label>
                  <Field name="fullName" type="text" />
                  <ErrorMessage name="fullName" component="div" className="error" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <Field name="email" type="email" />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>
                <div className="form-field">
                  <label htmlFor="country">Country of Residence</label>
                  <Field name="country" as="select">
                    <option value="">Select a country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                  </Field>
                  <ErrorMessage name="country" component="div" className="error" />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="address">Address</label>
                <Field name="address" as="textarea" rows="2" />
                <ErrorMessage name="address" component="div" className="error" />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Information About the Person</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="personName">Name of the person you're communicating with</label>
                  <Field name="personName" type="text" />
                  <ErrorMessage name="personName" component="div" className="error" />
                </div>
                <div className="form-field">
                  <label htmlFor="contactDuration">How long have you been in contact?</label>
                  <Field name="contactDuration" as="select">
                    <option value="">Select duration</option>
                    <option value="less-than-week">Less than a week</option>
                    <option value="1-4-weeks">1-4 weeks</option>
                    <option value="1-3-months">1-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="more-than-6-months">More than 6 months</option>
                  </Field>
                  <ErrorMessage name="contactDuration" component="div" className="error" />
                </div>
                <div className="form-field">
                  <label htmlFor="meetingPlace">Where did you meet them?</label>
                  <Field name="meetingPlace" as="select">
                    <option value="">Select meeting place</option>
                    <option value="dating-website">Dating website</option>
                    <option value="social-media">Social media</option>
                    <option value="chat-room">Chat room</option>
                    <option value="messaging-app">Messaging app</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="meetingPlace" component="div" className="error" />
                </div>
                {values.meetingPlace === 'other' && (
                  <div className="form-field">
                    <label htmlFor="otherMeetingPlace">Please specify where you met</label>
                    <Field name="otherMeetingPlace" type="text" />
                  </div>
                )}
              </div>
              <div className="form-field">
                <label>Have you ever met this person in real life?</label>
                <div className="radio-group">
                  <label>
                    <Field type="radio" name="metInRealLife" value="yes" />
                    Yes
                  </label>
                  <label>
                    <Field type="radio" name="metInRealLife" value="no" />
                    No
                  </label>
                </div>
                <ErrorMessage name="metInRealLife" component="div" className="error" />
              </div>
              {values.metInRealLife === 'no' && (
                <div className="form-field">
                  <label htmlFor="whyNotMet">If no, why not?</label>
                  <Field name="whyNotMet" as="textarea" rows="2" />
                  <ErrorMessage name="whyNotMet" component="div" className="error" />
                </div>
              )}
            </div>

            <div className="form-section">
              <h2 className="section-title">Communication Behavior</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="communicationFrequency">How often do you communicate?</label>
                  <Field name="communicationFrequency" as="select">
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                  </Field>
                  <ErrorMessage name="communicationFrequency" component="div" className="error" />
                </div>
                <div className="form-field">
                  <label htmlFor="discussionTopics">What kind of topics do you typically discuss?</label>
                  <Field name="discussionTopics" as="textarea" rows="2" />
                  <ErrorMessage name="discussionTopics" component="div" className="error" />
                </div>
              </div>
                 <div className="form-field">
                  <label htmlFor="locationOfPartner">Where is this person located?</label>
                  <Field name="locationOfPartner" type="text" />
                  <ErrorMessage name="locationOfPartner" component="div" className="error" />
                </div>
        <div className="form-field">
                <label>Have they shared personal photos or videos with you?</label>
                <div className="radio-group">
                  <label>
                    <Field type="radio" name="sharedPhotosVideos" value="yes" />
                    Yes
                  </label>
                  <label>
                    <Field type="radio" name="sharedPhotosVideos" value="no" />
                    No
                  </label>
                </div>
                <ErrorMessage name="sharedPhotosVideos" component="div" className="error" />
              </div>
              {values.sharedPhotosVideos === 'yes' && (
                <div className="form-field">
                  <label>If yes, do these photos seem authentic?</label>
                  <div className="radio-group">
                    <label>
                      <Field type="radio" name="photosAuthentic" value="yes" />
                      Yes
                    </label>
                    <label>
                      <Field type="radio" name="photosAuthentic" value="no" />
                      No
                    </label>
                  </div>
                  <ErrorMessage name="photosAuthentic" component="div" className="error" />
                </div>
              )}
          {values.sharedPhotosVideos === 'yes' && values.photosAuthentic === 'yes' && (
                <div className="form-field">
                  <label htmlFor="photoUpload">Upload a photo for analysis</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                        if (event.currentTarget.files && event.currentTarget.files[0]) {
    setFieldValue("photoUpload", event.currentTarget.files[0]);
  }
                    }}
                  />
                  <ErrorMessage name="photoUpload" component="div" className="error" />
                </div>
              )}
           
            </div>

            <div className="form-section">
              <h2 className="section-title">Financial Requests or Actions</h2>
              <div className="form-field">
                <label>Have they ever asked you for money?</label>
                <div className="radio-group">
                  <label>
                    <Field type="radio" name="askedForMoney" value="yes" />
                    Yes
                  </label>
                  <label>
                    <Field type="radio" name="askedForMoney" value="no" />
                    No
                  </label>
                </div>
                <ErrorMessage name="askedForMoney" component="div" className="error" />
              </div>
              {values.askedForMoney === 'yes' && (
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="moneyAmount">If yes, how much did they ask for?</label>
                    <Field name="moneyAmount" type="number" />
                    <ErrorMessage name="moneyAmount" component="div" className="error" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="moneyPurpose">What was the stated purpose for the money?</label>
                    <Field name="moneyPurpose" as="textarea" rows="2" />
                    <ErrorMessage name="moneyPurpose" component="div" className="error" />
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
              <h2 className="section-title">Additional Information</h2>
              <div className="form-field">
                <label>Have you shared any personal or financial information with this person?</label>
                <div className="radio-group">
                  <label>
                    <Field type="radio" name="personalInfoShared" value="yes" />
                    Yes
                  </label>
                  <label>
                    <Field type="radio" name="personalInfoShared" value="no" />
                    No
                  </label>
                </div>
                <ErrorMessage name="personalInfoShared" component="div" className="error" />
              </div>
              <div className="form-field">
                <label htmlFor="suspiciousBehavior">Have you noticed any suspicious behavior or inconsistencies in their story?</label>
                <Field name="suspiciousBehavior" as="textarea" rows="3" />
                <ErrorMessage name="suspiciousBehavior" component="div" className="error" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </FormikForm>
        )}
      </Formik>
            {/* Loader and Modal at the end, inside the main container */}
      {showLoader && (
        <SubmissionLoader 
          onComplete={() => {
            setShowLoader(false);
            setShowCompletionModal(true);
          }} 
        />
      )}
      <CompletionModal 
        isOpen={showCompletionModal}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default RomanceForm;


