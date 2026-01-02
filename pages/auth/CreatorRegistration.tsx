import { User, UserRole } from '../../types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onComplete: (user: User) => void;
}

enum VerifyStep {
  PHONE,
  OTP,
  PERSONAL_DETAILS,
  SOCIAL_LINKS,
  SUCCESS
}

const CreatorRegistration: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<VerifyStep>(VerifyStep.PHONE);
  // Shared state for phone/OTP verification
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Personal details (Step 1)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Social links (Step 2)
  const [instagramLink, setInstagramLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [emailLink, setEmailLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  
  const navigate = useNavigate();
  const role = UserRole.CREATOR;

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
        setStep(VerifyStep.SOCIAL_LINKS);
      }
    } else if (step === VerifyStep.SOCIAL_LINKS) setStep(VerifyStep.SUCCESS);
  };

  const handleFinish = () => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${firstName} ${lastName}`.trim() || "Creator",
      role: role,
      email: email,
      phone: phone,
      isVerified: true,
      avatarUrl: "https://picsum.photos/200?random=15"
    };
    onComplete(mockUser);
    navigate('/dashboard');
  };

  // --- Creator-specific onboarding screens below. Avoid reusing Developer screens. ---
  // Phone and OTP screens are shared (same verification flow), but DETAILS and KYC are creator-specific

  const renderPhone = () => (
    <div className="p-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-reach-navy mt-4">Enter your phone number</h2>
      <p className="text-gray-500 mt-2 mb-8">We'll send you a quick verification code</p>
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-xl p-4 flex items-center bg-white">
          <span className="font-semibold text-gray-700 mr-2">Nigeria</span>
          <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div className="border border-reach-red rounded-xl p-4 bg-white">
          <input
            type="tel"
            placeholder="Enter phone number here"
            className="w-full outline-none text-lg"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoFocus
            required
          />
        </div>
      </div>
      <button
        onClick={handleNext}
        disabled={!phone}
        className={`w-full py-4 mt-12 rounded-2xl font-bold shadow-lg ${phone ? 'bg-reach-navy text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full ${i === 1 ? 'bg-reach-red' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-400">Step 1</span>
        </div>
        <h2 className="text-2xl font-bold text-reach-navy">Tell us About You</h2>
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
              By selecting Agree and continue, i agree to Reach's{' '}
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
          Agree and Continue
        </button>
      </div>
    );
  };

  const renderSocialLinks = () => (
    <div className="p-8 animate-fadeIn h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full ${i === 2 ? 'bg-reach-red' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400">Step 2</span>
      </div>
      <h2 className="text-2xl font-bold text-reach-navy">Link your social account</h2>
      <p className="text-gray-500 mt-2 mb-8">Linking your social account helps us categories</p>
      
      <div className="space-y-4">
        {/* Instagram */}
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span className="font-medium">Instagram</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              placeholder="Paste social link here"
              className="flex-1 outline-none"
              value={instagramLink}
              onChange={e => setInstagramLink(e.target.value)}
            />
          </div>
        </div>

        {/* X (Twitter) */}
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">X</span>
            </div>
            <span className="font-medium">X</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              placeholder="Paste social link here"
              className="flex-1 outline-none"
              value={twitterLink}
              onChange={e => setTwitterLink(e.target.value)}
            />
          </div>
        </div>

        {/* Facebook */}
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">f</span>
            </div>
            <span className="font-medium">Facebook</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              placeholder="Paste social link here"
              className="flex-1 outline-none"
              value={facebookLink}
              onChange={e => setFacebookLink(e.target.value)}
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">in</span>
            </div>
            <span className="font-medium">LinkedIn</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              placeholder="Paste social link here"
              className="flex-1 outline-none"
              value={linkedinLink}
              onChange={e => setLinkedinLink(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold">@</span>
            </div>
            <span className="font-medium">Email</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              placeholder="Paste social link here"
              className="flex-1 outline-none"
              value={emailLink}
              onChange={e => setEmailLink(e.target.value)}
            />
          </div>
        </div>

        {/* TikTok */}
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-pink-500 to-red-500 opacity-80 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </div>
            </div>
            <span className="font-medium">TikTok</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              placeholder="Paste social link here"
              className="flex-1 outline-none"
              value={tiktokLink}
              onChange={e => setTiktokLink(e.target.value)}
            />
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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">You're all set!</h2>
          <p className="text-gray-600 text-center mb-8">
            Congratulations!!! You're a <span className="font-bold text-gray-900">Tier-one</span> Creator
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
        <button
          onClick={() => navigate(-1)}
          className="bg-white p-2 rounded-full shadow-sm"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      {step === VerifyStep.PHONE && renderPhone()}
      {step === VerifyStep.OTP && renderOtp()}
      {step === VerifyStep.PERSONAL_DETAILS && renderPersonalDetails()}
      {step === VerifyStep.SOCIAL_LINKS && renderSocialLinks()}
      {step === VerifyStep.SUCCESS && renderSuccess()}
    </div>
  );
};

export default CreatorRegistration;


