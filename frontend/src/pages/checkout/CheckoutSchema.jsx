import * as z from 'zod';

export const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[0-9]+$/, 'Phone number must only contain digits'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  street: z.string().min(5, 'Please enter a full address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(4, 'Valid postcode required'),
});