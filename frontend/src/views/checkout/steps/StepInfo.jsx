// ============================================================
// STEP 1: Contact Information + Shipping Address
// ============================================================

import FormField from '../FormField';

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
];

// Nigerian states for auto-fill
const NG_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

export default function StepInfo({ form }) {
  const { register, formState: { errors }, watch } = form;
  const country = watch('country');

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl mb-4">Contact Information</h2>

      <FormField error={errors.email}>
        <input
          {...register('email')}
          type="email"
          placeholder="Email address"
          className={fieldClass(errors.email)}
        />
      </FormField>

      <FormField error={errors.phone}>
        <input
          {...register('phone')}
          placeholder="Phone number (e.g. +2348012345678)"
          className={fieldClass(errors.phone)}
        />
      </FormField>

      <h2 className="font-serif text-2xl pt-4 mb-4">Shipping Address</h2>

      <div className="grid grid-cols-2 gap-4">
        <FormField error={errors.firstName}>
          <input {...register('firstName')} placeholder="First name" className={fieldClass(errors.firstName)} />
        </FormField>
        <FormField error={errors.lastName}>
          <input {...register('lastName')} placeholder="Last name" className={fieldClass(errors.lastName)} />
        </FormField>
      </div>

      <FormField error={errors.street}>
        <input {...register('street')} placeholder="Street address" className={fieldClass(errors.street)} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField error={errors.country}>
          <select {...register('country')} className="w-full p-4 border border-gray-200 rounded-sm outline-none bg-white focus:border-black">
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </FormField>

        {country === 'NG' ? (
          <FormField error={errors.state}>
            <select {...register('state')} className="w-full p-4 border border-gray-200 rounded-sm outline-none bg-white focus:border-black">
              <option value="">Select state</option>
              {NG_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
        ) : (
          <FormField error={errors.state}>
            <input {...register('state')} placeholder="State / Province" className={fieldClass(errors.state)} />
          </FormField>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField error={errors.city}>
          <input {...register('city')} placeholder="City" className={fieldClass(errors.city)} />
        </FormField>
        <FormField error={errors.zip}>
          <input {...register('zip')} placeholder="Postcode / Zip" className={fieldClass(errors.zip)} />
        </FormField>
      </div>
    </div>
  );
}

function fieldClass(error) {
  return `w-full p-4 border rounded-sm outline-none transition-colors ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'
  }`;
}