import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calendar, Upload, AlertCircle, Check } from 'lucide-react';

export default function BookConsultation() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  
  // Watch event date to warn about timeline
  const eventDate = watch('eventDate');
  
  const onSubmit = async (data) => {
    // We will connect this to the Backend API later
    console.log("Form Data:", data);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API delay
    alert("Request sent! We will contact you shortly.");
  };

  // Timeline Warning Logic
  const isUrgent = eventDate && new Date(eventDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Less than 30 days

  return (
    <div className="min-h-screen bg-secondary pt-32 pb-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white p-8 md:p-12 border border-border shadow-sm"
      >
        <div className="text-center mb-10">
          <span className="text-accent text-xs uppercase tracking-[0.2em]">The Yuwa Brand</span>
          <h1 className="text-3xl md:text-4xl font-serif mt-3 mb-4">Request Consultation</h1>
          <p className="text-muted font-light">
            Tell us about your occasion. We will review your request and confirm availability within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* SECTION 1: Personal Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif border-b border-border pb-2">01. Contact Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-2">Full Name</label>
                <input 
                  {...register("fullName", { required: "Name is required" })}
                  className="w-full bg-secondary border-none p-4 focus:ring-1 focus:ring-accent outline-none transition-all"
                  placeholder="Jane Doe"
                />
                {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName.message}</span>}
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-2">Email Address</label>
                <input 
                  {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
                  className="w-full bg-secondary border-none p-4 focus:ring-1 focus:ring-accent outline-none transition-all"
                  placeholder="jane@example.com"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
              </div>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-2">Phone (WhatsApp Preferred)</label>
              <input 
                {...register("phone", { required: "Phone is required" })}
                className="w-full bg-secondary border-none p-4 focus:ring-1 focus:ring-accent outline-none transition-all"
                placeholder="+61 ..."
              />
            </div>
          </div>

          {/* SECTION 2: Event Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif border-b border-border pb-2">02. The Occasion</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-2">Occasion Type</label>
                <select 
                  {...register("occasion", { required: true })}
                  className="w-full bg-secondary border-none p-4 focus:ring-1 focus:ring-accent outline-none appearance-none"
                >
                  <option value="">Select an occasion...</option>
                  <option value="prom">Prom</option>
                  <option value="wedding_guest">Wedding Guest</option>
                  <option value="dinner">Dinner / Special Event</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-2">Event Date</label>
                <div className="relative">
                  <input 
                    type="date"
                    {...register("eventDate", { required: "Date is required" })}
                    className="w-full bg-secondary border-none p-4 focus:ring-1 focus:ring-accent outline-none"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {/* Dynamic Warning for Rush Orders */}
            {isUrgent && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-accent/10 p-4 border border-accent/20 flex items-start gap-3"
              >
                <AlertCircle className="text-accent shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-primary">
                  <span className="font-medium block mb-1">Express Order Detected</span>
                  Your event is less than 4 weeks away. An express fee ($100–$200 AUD) will apply. Subject to availability.
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-2">Budget Range (AUD)</label>
              <select 
                {...register("budget", { required: true })}
                className="w-full bg-secondary border-none p-4 focus:ring-1 focus:ring-accent outline-none appearance-none"
              >
                <option value="">Select a budget...</option>
                <option value="350-500">$350 - $500</option>
                <option value="500-800">$500 - $800</option>
                <option value="800+">$800+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-2">Design Ideas / Notes</label>
              <textarea 
                {...register("notes")}
                rows={4}
                className="w-full bg-secondary border-none p-4 focus:ring-1 focus:ring-accent outline-none transition-all"
                placeholder="Describe your vision (colors, fabrics, style references)..."
              />
            </div>
          </div>

          {/* SECTION 3: Agreement */}
          <div className="pt-4">
             <label className="flex items-start gap-3 cursor-pointer group">
               <input 
                 type="checkbox" 
                 {...register("agreement", { required: "You must agree to the policy" })}
                 className="mt-1 accent-accent"
               />
               <span className="text-sm text-muted group-hover:text-primary transition-colors">
                 I understand that custom orders require a <strong>50% non-refundable deposit</strong> and standard production takes 4–6 weeks.
               </span>
             </label>
             {errors.agreement && <span className="text-red-500 text-xs block mt-2">{errors.agreement.message}</span>}
          </div>

          <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-primary text-white py-5 uppercase tracking-widest text-sm hover:bg-accent transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>

        </form>
      </motion.div>
    </div>
  );
}