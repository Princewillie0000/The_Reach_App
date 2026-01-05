'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '../../types';
import { useUser } from '../../contexts/UserContext';

enum VerifyStep {
  PHONE,
  OTP,
  PERSONAL_DETAILS,
  SUCCESS
}

const BuyerRegistration: React.FC = () => {
  const [step, setStep] = useState<VerifyStep>(VerifyStep.PHONE);
  // Shared state for phone/OTP verification
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Personal details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const router = useRouter();
  const { setUser } = useUser();
  const role = UserRole.BUYER;

  const isValidOtp = () => {
    return otp.every(digit => digit.trim() !== '') && otp.length === 6;
  };

  const validatePassword = () => {
    const hasMinLength = password.length >= 8;
    const hasSymbolOrNumber = /[!@#$%^&*(),.?":{}|<>0-9]/.test(password);
    const doesntIncludeName = !firstName && !lastName ? true : 
      !password.toLowerCase().includes(firstName.toLowerCase()) && 
      !password.toLowerCase().includes(lastName.toLowerCase());
    const doesntIncludeEmail = !email ? true : !password.toLowerCase().includes(email.toLowerCase().split('@')[0]);
    
    return { hasMinLength, hasSymbolOrNumber, doesntIncludeName, doesntIncludeEmail };
  };

  const isValidPersonalDetails = () => {
    const passwordValidation = validatePassword();
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      birthday.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword &&
      passwordValidation.hasMinLength &&
      passwordValidation.hasSymbolOrNumber &&
      passwordValidation.doesntIncludeName &&
      passwordValidation.doesntIncludeEmail &&
      agreedToTerms
    );
  };

  const handleNext = () => {
    if (step === VerifyStep.PHONE) setStep(VerifyStep.OTP);
    else if (step === VerifyStep.OTP) {
      if (isValidOtp()) {
        setStep(VerifyStep.PERSONAL_DETAILS);
      }
    } else if (step === VerifyStep.PERSONAL_DETAILS) {
      if (isValidPersonalDetails()) {
        setStep(VerifyStep.SUCCESS);
      }
    }
  };

  const handleFinish = () => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${firstName} ${lastName}`.trim() || "Buyer",
      role: role,
      email: email,
      phone: phone,
      isVerified: true,
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
      <p className="text-center text-sm text-reach-red mb-8 cursor-pointer" onClick={() => setStep(VerifyStep.PHONE)}>
        Change phone/email
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

  const renderPersonalDetails = () => {
    const passwordValidation = validatePassword();
    
    return (
      <div className="p-8 animate-fadeIn h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-reach-navy mt-4">Tell us About You</h2>
        <p className="text-gray-500 mt-2 mb-8">This helps us personalize your experience</p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter first name here"
            className="w-full border border-gray-100 rounded-xl p-4 outline-none"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <div>
            <input
              type="text"
              placeholder="Enter last name here"
              className={`w-full border rounded-xl p-4 outline-none ${
                lastName ? 'border-reach-red' : 'border-gray-100'
              }`}
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1 ml-1">Make sure this matches the name on your ID</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between bg-white">
            <input
              type="text"
              placeholder="Enter Birthday (mm/dd/yyyy)"
              className="w-full outline-none"
              value={birthday}
              onChange={e => setBirthday(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full border border-gray-100 rounded-xl p-4 outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div>
            <input
              type="password"
              placeholder="Enter password here"
              className="w-full border border-gray-100 rounded-xl p-4 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-xs">
                {passwordValidation.hasMinLength ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
                <span className={passwordValidation.hasMinLength ? 'text-gray-600' : 'text-gray-400'}>
                  Use at least 8 characters for a strong, secure password.
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {passwordValidation.hasSymbolOrNumber ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
                <span className={passwordValidation.hasSymbolOrNumber ? 'text-gray-600' : 'text-gray-400'}>
                  Must have at least one symbol or number.
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {passwordValidation.doesntIncludeName && passwordValidation.doesntIncludeEmail ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
                <span className={passwordValidation.doesntIncludeName && passwordValidation.doesntIncludeEmail ? 'text-gray-600' : 'text-gray-400'}>
                  Can't include name or email address.
                </span>
              </div>
            </div>
          </div>
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full border border-gray-100 rounded-xl p-4 outline-none"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="mt-6 mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={e => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-reach-red focus:ring-reach-red"
            />
            <p className="text-xs text-gray-600">
              By selecting Submit, i agree to Reach's{' '}
              <span className="text-reach-red underline">Terms & Services</span>,{' '}
              <span className="text-reach-red underline">payment terms and service</span> and{' '}
              <span className="text-reach-red underline">privacy policy</span>.
            </p>
          </label>
        </div>
        <button
          onClick={handleNext}
          disabled={!isValidPersonalDetails()}
          className={`w-full py-4 rounded-2xl font-bold shadow-lg mb-8 ${
            isValidPersonalDetails() ? 'bg-reach-navy text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    );
  };


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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Your account is ready!</h2>
          <p className="text-gray-600 text-center mb-8">
            You can now browse properties, save favorites, and contact developers.
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
      {step === VerifyStep.PERSONAL_DETAILS && renderPersonalDetails()}
      {step === VerifyStep.SUCCESS && renderSuccess()}
    </div>
  );
};

export default BuyerRegistration;

