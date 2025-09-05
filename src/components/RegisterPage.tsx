import React, { useState } from 'react';
import profileImage from '../assets/profile-placeholder.png';

interface RegisterPageProps {
  onBack: () => void;
  onRegisterSuccess?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    suburb: '',
    state: '',
    postcode: '',
    company: '',
    abn: '',
    website: '',
    profileImage: '' // base64 or uploaded URL
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Format ABN: 11 digits => "12 345 678 901"
  const formatABN = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11); // keep only numbers
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'abn') {
      value = formatABN(value);
    }
    setFormData({
      ...formData,
      [name]: value
    });
    setFormErrors({
      ...formErrors,
      [name]: '' // clear error on typing
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) errors.phone = 'Enter a valid 10-digit phone';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Enter a valid email';
    if (!formData.suburb) errors.suburb = 'Suburb is required';
    if (!formData.state) errors.state = 'State is required';
    if (!/^\d{4}$/.test(formData.postcode)) errors.postcode = 'Enter a valid 4-digit postcode';
    if (!formData.company) errors.company = 'Company name is required';

    const abnDigits = formData.abn.replace(/\s/g, '');
    if (abnDigits.length !== 11) errors.abn = 'ABN must be 11 digits';

    try {
      new URL(formData.website);
    } catch {
      errors.website = 'Enter a valid website URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'https://api.researchtopurchase.com.au/wp-json/hubspot-api/v1/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, abn: formData.abn.replace(/\s/g, '') }) // send digits only
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setTimeout(() => {
          onRegisterSuccess?.();
          onBack();
        }, 2000);
      } else {
        setFormErrors({ general: result?.message || result?.error || 'Registration failed' });
      }
    } catch (err) {
      console.error('API error:', err);
      setFormErrors({ general: 'Something went wrong. Please try again.' });
    }

    setLoading(false);
  };

  const inputClass = (name: string) =>
    `w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
      formErrors[name]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-blue-500'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center p-1">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-1">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 border rounded-lg"
          >
            ← Back
          </button>
        </div>

        {formErrors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {formErrors.general}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Registration successful! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center">
            <img
              src={formData.profileImage || profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-2 border"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
              className="text-sm text-gray-600"
            />
          </div>

          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className={inputClass('firstName')}
                disabled={loading}
              />
              {formErrors.firstName && <p className="text-xs text-red-600">{formErrors.firstName}</p>}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className={inputClass('lastName')}
                disabled={loading}
              />
              {formErrors.lastName && <p className="text-xs text-red-600">{formErrors.lastName}</p>}
            </div>
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={inputClass('phone')}
              disabled={loading}
            />
            {formErrors.phone && <p className="text-xs text-red-600">{formErrors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={inputClass('email')}
              disabled={loading}
            />
            {formErrors.email && <p className="text-xs text-red-600">{formErrors.email}</p>}
          </div>

          {/* Suburb / State / Postcode */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="text"
                name="suburb"
                value={formData.suburb}
                onChange={handleChange}
                placeholder="Suburb"
                className={inputClass('suburb')}
                disabled={loading}
              />
              {formErrors.suburb && <p className="text-xs text-red-600">{formErrors.suburb}</p>}
            </div>
            <div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className={inputClass('state')}
                disabled={loading}
              />
              {formErrors.state && <p className="text-xs text-red-600">{formErrors.state}</p>}
            </div>
            <div>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                placeholder="Postcode"
                className={inputClass('postcode')}
                disabled={loading}
              />
              {formErrors.postcode && <p className="text-xs text-red-600">{formErrors.postcode}</p>}
            </div>
          </div>

          {/* Company */}
          <div>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company"
              className={inputClass('company')}
              disabled={loading}
            />
            {formErrors.company && <p className="text-xs text-red-600">{formErrors.company}</p>}
          </div>

          {/* ABN */}
          <div>
            <input
              type="text"
              name="abn"
              value={formData.abn}
              onChange={handleChange}
              placeholder="ABN (11 digits)"
              className={inputClass('abn')}
              disabled={loading}
            />
            {formErrors.abn && <p className="text-xs text-red-600">{formErrors.abn}</p>}
          </div>

          {/* Website */}
          <div>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website URL (https://...)"
              className={inputClass('website')}
              disabled={loading}
            />
            {formErrors.website && <p className="text-xs text-red-600">{formErrors.website}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 bg-[#d02c37] text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'SUBMITTING...' : success ? 'SUCCESS!' : 'SUBMIT APPLICATION'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
