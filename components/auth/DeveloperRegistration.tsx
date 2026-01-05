
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '../../types';
import { useUser } from '../../contexts/UserContext';

enum VerifyStep {
  PHONE,
  OTP,
  COMPANY_DETAILS,
  UPLOAD_CERTIFICATE,
  PAYMENT_METHOD,
  CONFIGURE_PLAN,
  REVIEW_SUBMIT,
  SUCCESS
}

const DeveloperRegistration: React.FC = () => {
  const [step, setStep] = useState<VerifyStep>(VerifyStep.PHONE);
  // Shared state for phone/OTP verification
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Company details (Step 1)
  const [companyName, setCompanyName] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [administratorName, setAdministratorName] = useState('');
  const [position, setPosition] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  
  // Upload certificate (Step 2)
  const [selectedDocumentType, setSelectedDocumentType] = useState('Certificate of Incorporation');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  
  // Payment method (Step 3)
  const [paymentStructure, setPaymentStructure] = useState<'subscription' | 'per-listing'>('subscription');
  
  // Configure plan (Step 4)
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [billingFullName, setBillingFullName] = useState('');
  const [billingCountry, setBillingCountry] = useState('Nigeria');
  const [billingAddress, setBillingAddress] = useState('');
  
  const router = useRouter();
  const { setUser } = useUser();
  const role = UserRole.DEVELOPER;

  const isValidOtp = () => {
    return otp.every(digit => digit.trim() !== '') && otp.length === 6;
  };

  const isValidCompanyDetails = () => {
    return (
      companyName.trim() !== '' &&
      rcNumber.trim() !== '' &&
      administratorName.trim() !== '' &&
      position.trim() !== '' &&
      businessEmail.trim() !== '' &&
      companyAddress.trim() !== ''
    );
  };

  const handleNext = () => {
    if (step === VerifyStep.PHONE) setStep(VerifyStep.OTP);
    else if (step === VerifyStep.OTP) {
      if (isValidOtp()) {
        setStep(VerifyStep.COMPANY_DETAILS);
      }
    }
    else if (step === VerifyStep.COMPANY_DETAILS) {
      if (isValidCompanyDetails()) {
        setStep(VerifyStep.UPLOAD_CERTIFICATE);
      }
    }
    else if (step === VerifyStep.UPLOAD_CERTIFICATE) {
      if (certificateFile) {
        setStep(VerifyStep.PAYMENT_METHOD);
      }
    }
    else if (step === VerifyStep.PAYMENT_METHOD) setStep(VerifyStep.CONFIGURE_PLAN);
    else if (step === VerifyStep.CONFIGURE_PLAN) setStep(VerifyStep.REVIEW_SUBMIT);
    else if (step === VerifyStep.REVIEW_SUBMIT) setStep(VerifyStep.SUCCESS);
  };

  const handleFinish = () => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: administratorName || "Developer",
      role: role,
      email: businessEmail,
      phone: phone,
      isVerified: true,
      companyName: companyName,
      avatarUrl: "https://picsum.photos/200?random=5"
    };
    setUser(mockUser);
    router.push('/dashboard');
  };

  const renderPhone = () => (
    <div className="p-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-reach-navy mt-4">Enter your phone Number</h2>
      <p className="text-gray-500 mt-2 mb-8">We'll send you a quick verification code</p>
      
      <div className="space-y-4">
         <div className="border border-gray-200 rounded-xl p-4 flex items-center bg-white">
            <span className="font-semibold text-gray-700 mr-2">Nigeria</span>
            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
         </div>
         <div className="border border-reach-red rounded-xl p-4 bg-white">
            <input 
               type="tel" 
               placeholder="Enter phone number here" 
               className="w-full outline-none text-lg"
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
            />
         </div>
      </div>
      <button onClick={handleNext} disabled={!phone} className={`w-full py-4 mt-12 rounded-2xl font-bold shadow-lg ${phone ? 'bg-reach-navy text-white' : 'bg-gray-200 text-gray-400'}`}>
        Continue
      </button>
    </div>
  );

  const renderOtp = () => (
    <div className="p-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-reach-navy mt-4">Verify Your Identity</h2>
      <p className="text-gray-500 mt-2 mb-8">Type in the 6-digit code sent to your phone</p>
      <div className="flex gap-3 justify-center mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            className={`w-12 h-14 border-2 rounded-xl text-center text-xl font-bold bg-white focus:outline-none ${
              i === 0 ? 'border-reach-red' : 'border-gray-100 focus:border-reach-red'
            }`}
            value={digit}
            onChange={e => {
              const newOtp = [...otp];
              newOtp[i] = e.target.value;
              setOtp(newOtp);
            }}
          />
        ))}
      </div>
      <p className="text-center text-sm text-gray-400 mb-2">
        Didn't get code? <span className="text-reach-red font-semibold">Resend in 33s</span>
      </p>
      <button
        onClick={handleNext}
        disabled={!isValidOtp()}
        className={`w-full py-4 mt-4 rounded-2xl font-bold shadow-lg ${
          isValidOtp() ? 'bg-reach-navy text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );

  const renderCompanyDetails = () => (
    <div className="p-8 animate-fadeIn h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full ${i === 1 ? 'bg-reach-red' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400">Step 1</span>
      </div>
      <h2 className="text-2xl font-bold text-reach-navy">Company Details</h2>
      <p className="text-gray-500 mt-2 mb-8">Almost Done! Fill in your company details</p>
      
      <div className="space-y-4">
        <div>
          <input 
            type="text" 
            placeholder="Enter company name here" 
            className={`w-full border rounded-xl p-4 outline-none ${
              companyName ? 'border-reach-red' : 'border-gray-100'
            }`}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1 ml-1">Make sure this matches the name on your ID</p>
        </div>
        <input 
          type="text" 
          placeholder="Enter RC Number here" 
          className="w-full border border-gray-100 rounded-xl p-4 outline-none" 
          value={rcNumber}
          onChange={(e) => setRcNumber(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Enter name of administrator here" 
          className="w-full border border-gray-100 rounded-xl p-4 outline-none" 
          value={administratorName}
          onChange={(e) => setAdministratorName(e.target.value)}
        />
        <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between bg-white">
          <select 
            className="w-full outline-none bg-transparent"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="">Select position/Role here</option>
            <option value="CEO">CEO</option>
            <option value="Agent">Agent</option>
          </select>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <input 
          type="email" 
          placeholder="Enter business email address" 
          className="w-full border border-gray-100 rounded-xl p-4 outline-none" 
          value={businessEmail}
          onChange={(e) => setBusinessEmail(e.target.value)}
        />
        <textarea 
          placeholder="Enter company registered address" 
          className="w-full border border-gray-100 rounded-xl p-4 outline-none h-24" 
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
        />
      </div>
      <button 
        onClick={handleNext}
        disabled={!isValidCompanyDetails()}
        className={`w-full py-4 mt-8 rounded-2xl font-bold shadow-lg mb-8 ${
          isValidCompanyDetails() ? 'bg-reach-navy text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );

  const renderUploadCertificate = () => (
    <div className="p-8 animate-fadeIn h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full ${i <= 2 ? 'bg-reach-red' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400">Step 2</span>
      </div>
      <h2 className="text-2xl font-bold text-reach-navy">Upload certificate</h2>
      <p className="text-gray-500 mt-2 mb-8">Please upload one of the selected official documents to verify your business registration</p>
      
      <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-white mb-4">
        <span className="text-gray-700">Select preferred document</span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <div className="space-y-3 mb-8">
        <div 
          className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between cursor-pointer"
          onClick={() => setSelectedDocumentType('Certificate of Incorporation')}
        >
          <span>Certificate of Incorporation</span>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedDocumentType === 'Certificate of Incorporation' ? 'border-reach-navy' : 'border-gray-300'
          }`}>
            {selectedDocumentType === 'Certificate of Incorporation' && (
              <div className="w-2.5 h-2.5 bg-reach-navy rounded-full" />
            )}
          </div>
        </div>
        <div 
          className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between cursor-pointer"
          onClick={() => setSelectedDocumentType('CAC / Govt registration document')}
        >
          <span>CAC / Govt registration document</span>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedDocumentType === 'CAC / Govt registration document' ? 'border-reach-navy' : 'border-gray-300'
          }`}>
            {selectedDocumentType === 'CAC / Govt registration document' && (
              <div className="w-2.5 h-2.5 bg-reach-navy rounded-full" />
            )}
          </div>
        </div>
        <div 
          className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between cursor-pointer"
          onClick={() => setSelectedDocumentType('National Identity Number (NIN)')}
        >
          <span>National Identity Number (NIN)</span>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedDocumentType === 'National Identity Number (NIN)' ? 'border-reach-navy' : 'border-gray-300'
          }`}>
            {selectedDocumentType === 'National Identity Number (NIN)' && (
              <div className="w-2.5 h-2.5 bg-reach-navy rounded-full" />
            )}
          </div>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 mb-8">
        {certificateFile ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">A</span>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 font-medium">Your certificate has been successfully uploaded</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Upload your certificate here</p>
            <p className="text-xs text-gray-400 mt-1">2MB Max · PDF, MS</p>
          </>
        )}
        <input 
          type="file" 
          className="hidden" 
          id="certificate-upload" 
          accept=".pdf,.doc,.docx"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
              }
              setCertificateFile(file);
            }
          }}
        />
        <label htmlFor="certificate-upload" className="mt-4 text-reach-navy font-bold cursor-pointer underline">
          Browse files
        </label>
      </div>

      <button 
        onClick={handleNext}
        disabled={!certificateFile}
        className={`w-full py-4 rounded-2xl font-bold shadow-lg ${
          certificateFile ? 'bg-reach-navy text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {certificateFile ? 'Submit & Continue' : 'Continue'}
      </button>
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="p-8 animate-fadeIn h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full ${i <= 3 ? 'bg-reach-red' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400">Step 3</span>
      </div>
      <h2 className="text-2xl font-bold text-reach-navy">Payment method</h2>
      <p className="text-gray-500 mt-2 mb-8">Please choose a payment structure for your listing</p>
      
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <div 
          className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer"
          onClick={() => setPaymentStructure('subscription')}
        >
          <span className="font-medium">Subscription payment</span>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            paymentStructure === 'subscription' ? 'border-reach-navy' : 'border-gray-300'
          }`}>
            {paymentStructure === 'subscription' && (
              <div className="w-2.5 h-2.5 bg-reach-navy rounded-full" />
            )}
          </div>
        </div>
        <div className="border-t border-gray-200"></div>
        <div 
          className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer"
          onClick={() => setPaymentStructure('per-listing')}
        >
          <span className="font-medium">Per-listing payment</span>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            paymentStructure === 'per-listing' ? 'border-reach-navy' : 'border-gray-300'
          }`}>
            {paymentStructure === 'per-listing' && (
              <div className="w-2.5 h-2.5 bg-reach-navy rounded-full" />
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={handleNext}
        className="w-full py-4 mt-8 bg-reach-navy text-white rounded-2xl font-bold shadow-lg mb-8"
      >
        Continue
      </button>
    </div>
  );

  const renderConfigurePlan = () => {
    const monthlySubscription = 10000;
    const vat = Math.round(monthlySubscription * 0.075);
    const total = monthlySubscription + vat;
    
    return (
      <div className="p-8 animate-fadeIn h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full ${i <= 4 ? 'bg-reach-red' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-400">Step 4</span>
        </div>
        <h2 className="text-2xl font-bold text-reach-navy">Configure your plan</h2>
        <p className="text-gray-500 mt-2 mb-8">Confirm your details and submit for verification</p>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-reach-navy mb-4">Payment Method</h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full border border-gray-100 rounded-xl p-4 outline-none pr-12"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">MC</span>
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Expiration date"
                className="w-full border border-gray-100 rounded-xl p-4 outline-none"
                value={expirationDate}
                onChange={e => setExpirationDate(e.target.value)}
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Security code"
                  className="w-full border border-gray-100 rounded-xl p-4 outline-none pr-12"
                  value={securityCode}
                  onChange={e => setSecurityCode(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-reach-navy mb-4">Billing Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full name"
                className="w-full border border-gray-100 rounded-xl p-4 outline-none"
                value={billingFullName}
                onChange={e => setBillingFullName(e.target.value)}
              />
              <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between bg-white">
                <span className="text-gray-700">{billingCountry}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Address line 1"
                className="w-full border border-gray-100 rounded-xl p-4 outline-none"
                value={billingAddress}
                onChange={e => setBillingAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Monthly Subscription</span>
              <span className="font-semibold">NGN {monthlySubscription.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">VAT (7.5%)</span>
              <span className="font-semibold">NGN {vat.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-300 my-4"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">TOTAL</span>
              <span className="font-bold text-lg">NGN {total.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-4 mt-6 bg-reach-navy text-white rounded-2xl font-bold shadow-lg"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewSubmit = () => (
    <div className="p-8 animate-fadeIn h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full ${i <= 5 ? 'bg-reach-red' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400">Step 5</span>
      </div>
      <h2 className="text-2xl font-bold text-reach-navy">Review & Submit</h2>
      <p className="text-gray-500 mt-2 mb-8">Confirm your details and submit for verification</p>
      
      <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[400px] mb-8">
        {/* Review content area - can be populated with summary of all entered data */}
        <div className="space-y-4 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Company Name:</span>
            <span className="ml-2 text-gray-600">{companyName || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">RC Number:</span>
            <span className="ml-2 text-gray-600">{rcNumber || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Administrator:</span>
            <span className="ml-2 text-gray-600">{administratorName || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Position:</span>
            <span className="ml-2 text-gray-600">{position || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-600">{businessEmail || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Payment Structure:</span>
            <span className="ml-2 text-gray-600 capitalize">{paymentStructure.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleNext}
        className="w-full py-4 bg-reach-navy text-white rounded-2xl font-bold shadow-lg mb-8"
      >
        Submit for Verification
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-100">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Verification in progress</h2>
          <p className="text-gray-600 text-center mb-8">
            Your company documents are being reviewed. We'll update your status as soon as possible.
          </p>
          <button
            onClick={handleFinish}
            className="w-full py-4 bg-reach-navy text-white rounded-2xl font-bold shadow-lg hover:bg-blue-900 transition-all"
          >
            Let's go
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-reach-light">
      <div className="p-6">
        <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-sm">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>
      {step === VerifyStep.PHONE && renderPhone()}
      {step === VerifyStep.OTP && renderOtp()}
      {step === VerifyStep.COMPANY_DETAILS && renderCompanyDetails()}
      {step === VerifyStep.UPLOAD_CERTIFICATE && renderUploadCertificate()}
      {step === VerifyStep.PAYMENT_METHOD && renderPaymentMethod()}
      {step === VerifyStep.CONFIGURE_PLAN && renderConfigurePlan()}
      {step === VerifyStep.REVIEW_SUBMIT && renderReviewSubmit()}
      {step === VerifyStep.SUCCESS && renderSuccess()}
    </div>
  );
};

export default DeveloperRegistration;

