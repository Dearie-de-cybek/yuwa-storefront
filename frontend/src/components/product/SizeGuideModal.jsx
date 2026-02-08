import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-[90%] max-w-2xl h-fit max-h-[90vh] bg-white shadow-2xl z-[90] overflow-y-auto"
          >
            <div className="p-6 md:p-10 relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-serif text-3xl mb-2 text-center">Size Guide</h2>
              <p className="text-muted text-center mb-8 text-sm">Measurements are in centimeters (cm).</p>

              {/* The Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary text-primary font-serif">
                      <th className="p-4 border border-border">Size</th>
                      <th className="p-4 border border-border">Bust</th>
                      <th className="p-4 border border-border">Waist</th>
                      <th className="p-4 border border-border">Hips</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    {[
                      { size: "XS (AU 6)", bust: "80-84", waist: "60-64", hips: "88-92" },
                      { size: "S (AU 8)", bust: "85-89", waist: "65-69", hips: "93-97" },
                      { size: "M (AU 10)", bust: "90-94", waist: "70-74", hips: "98-102" },
                      { size: "L (AU 12)", bust: "95-99", waist: "75-79", hips: "103-107" },
                      { size: "XL (AU 14)", bust: "100-105", waist: "80-85", hips: "108-113" },
                      { size: "XXL (AU 16)", bust: "106-111", waist: "86-91", hips: "114-119" },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="p-4 font-medium text-primary border-r border-border">{row.size}</td>
                        <td className="p-4 border-r border-border">{row.bust}</td>
                        <td className="p-4 border-r border-border">{row.waist}</td>
                        <td className="p-4">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-secondary p-4 text-xs text-muted leading-relaxed">
                <strong>How to Measure:</strong><br/>
                • <strong>Bust:</strong> Measure around the fullest part of your chest.<br/>
                • <strong>Waist:</strong> Measure at the narrowest part of your waistline.<br/>
                • <strong>Hips:</strong> Measure at the fullest part of your hips.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}