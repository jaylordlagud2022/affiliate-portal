import React, { useState } from "react";

interface RegisterPageProps {
  onBack: () => void;
  onRegisterSuccess?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onBack,
  onRegisterSuccess,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    suburb: "",
    state: "",
    postcode: "",
    company: "",
    abn: "",
    website: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Format ABN as 11 digits => "12 345 678 901"
  const formatABN = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
  };

  const handleABNChange = async (value: string) => {
    const abnDigits = value.replace(/\s/g, "");

    if (abnDigits.length === 11) {
      try {
        const res = await fetch(
          `https://api.propertyinvestors.com.au/wp-json/abr/v1/lookup1?abn=${abnDigits}`
        );
        const data = await res.json();

        if (res.ok && data?.entity_name) {
          // ✅ Valid ABN
          setFormData((prev) => ({
            ...prev,
            abn: value,
            company: data.entity_name,
            state: data.state || prev.state,
            postcode: data.postcode || prev.postcode,
          }));
          setFormErrors((prev) => ({ ...prev, abn: "" }));
        } else {
          // ❌ Invalid ABN
          setFormErrors((prev) => ({ ...prev, abn: "Invalid ABN" }));
          setFormData((prev) => ({ ...prev, abn: value, company: "" }));
        }
      } catch {
        setFormErrors((prev) => ({ ...prev, abn: "Invalid ABN" }));
        setFormData((prev) => ({ ...prev, abn: value, company: "" }));
      }
    } else {
      // Reset if not 11 digits yet
      setFormErrors((prev) => ({ ...prev, abn: "" }));
      setFormData((prev) => ({ ...prev, abn: value, company: "" }));
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === "abn") {
      value = formatABN(value);
      setFormData((prev) => ({ ...prev, abn: value }));
      await handleABNChange(value);
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      errors.phone = "Enter a valid 10-digit phone";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Enter a valid email";
    if (!formData.suburb) errors.suburb = "Suburb is required";
    if (!formData.state) errors.state = "State is required";
    if (!/^\d{4}$/.test(formData.postcode))
      errors.postcode = "Enter a valid 4-digit postcode";
    if (!formData.company) errors.company = "Company name is required";

    const abnDigits = formData.abn.replace(/\s/g, "");
    if (abnDigits.length !== 11) errors.abn = "ABN must be 11 digits";

    try {
      new URL(formData.website);
    } catch {
      errors.website = "Enter a valid website URL";
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
        "https://api.propertyinvestors.com.au/wp-json/hubspot-api/v1/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            abn: formData.abn.replace(/\s/g, ""),
          }),
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
        setFormErrors({
          general: result?.message || result?.error || "Registration failed",
        });
      }
    } catch (err) {
      console.error("API error:", err);
      setFormErrors({
        general: "Something went wrong. Please try again.",
      });
    }

    setLoading(false);
  };

  const inputClass = (name: string) =>
    `w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
      formErrors[name]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen flex flex-col items-center ">
      <div className="max-w-md w-full bg-white">
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
          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className={inputClass("firstName")}
                disabled={loading}
              />
              {formErrors.firstName && (
                <p className="text-xs text-red-600">{formErrors.firstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className={inputClass("lastName")}
                disabled={loading}
              />
              {formErrors.lastName && (
                <p className="text-xs text-red-600">{formErrors.lastName}</p>
              )}
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
              className={inputClass("phone")}
              disabled={loading}
            />
            {formErrors.phone && (
              <p className="text-xs text-red-600">{formErrors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={inputClass("email")}
              disabled={loading}
            />
            {formErrors.email && (
              <p className="text-xs text-red-600">{formErrors.email}</p>
            )}
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
                className={inputClass("suburb")}
                disabled={loading}
              />
              {formErrors.suburb && (
                <p className="text-xs text-red-600">{formErrors.suburb}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className={inputClass("state")}
                disabled={loading}
              />
              {formErrors.state && (
                <p className="text-xs text-red-600">{formErrors.state}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                placeholder="Postcode"
                className={inputClass("postcode")}
                disabled={loading}
              />
              {formErrors.postcode && (
                <p className="text-xs text-red-600">{formErrors.postcode}</p>
              )}
            </div>
          </div>

          {/* Company (readonly after ABN lookup) */}
          <div>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company"
              className={inputClass("company")}
              readOnly={!!formData.company} // ✅ readonly if set
              disabled={loading}
            />
            {formErrors.company && (
              <p className="text-xs text-red-600">{formErrors.company}</p>
            )}
          </div>

          {/* ABN */}
          <div>
            <input
              type="text"
              name="abn"
              value={formData.abn}
              onChange={handleChange}
              placeholder="ABN (11 digits)"
              className={inputClass("abn")}
              disabled={loading}
            />
            {formErrors.abn && (
              <p className="text-xs text-red-600">{formErrors.abn}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website URL (https://...)"
              className={inputClass("website")}
              disabled={loading}
            />
            {formErrors.website && (
              <p className="text-xs text-red-600">{formErrors.website}</p>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || success}
              className="
                bg-[#d02c37]
                text-white
                text-lg
                border
                rounded-md
                transition-all duration-200
                disabled:opacity-50
                hover:bg-black
                hover:text-white
                hover:underline
                px-10 py-6
                min-w-[280px]   /* ✅ lock minimum width */
              "
              style={{
                fontFamily: '"Maven Pro", sans-serif',
                borderColor: '#BF3C3D',
                borderRadius: '5px',
              }}
            >
              <span className="font-bold hover:font-normal block text-center">
                {loading ? 'SUBMITTING...' : success ? 'SUCCESS!' : 'Partner with us'}
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
