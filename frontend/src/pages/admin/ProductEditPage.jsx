import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../admin/AdminLayout';
import { toast } from 'sonner';
import { Save, Plus, Trash2, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    material: '',
    images: [''], // Start with one empty slot
    careInstructions: [''],
    details: [''],
    variants: []
  });

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://127.0.0.1:5000/api/products/${id}`);
        setFormData({
          name: data.name,
          price: data.price,
          category: data.category,
          description: data.description,
          material: data.material || '',
          // Ensure arrays exist
          images: data.images.length ? data.images : [''],
          careInstructions: data.careInstructions.length ? data.careInstructions : [''],
          details: data.details.length ? data.details : [''],
          variants: data.variants || []
        });
      } catch (error) {
        toast.error('Could not load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- 2. HANDLERS ---
  
  // Generic Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dynamic Array Handler (Images, Lists)
  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  // Variant Handler
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '', size: '', stock: 0 }]
    }));
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  // --- 3. SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://127.0.0.1:5000/api/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product Updated Successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Editor...</div>;

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-20">
        
        {/* HEADER ACTIONS */}
        <div className="flex justify-between items-center mb-8 sticky top-20 bg-gray-50 z-20 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-200 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-serif text-2xl">Edit Product</h1>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg text-sm tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Basic Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4">General Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Product Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Price (₦)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-3 rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
                    <input name="category" value={formData.category} onChange={handleChange} className="w-full border p-3 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full border p-3 rounded-lg" />
                </div>
              </div>
            </div>

            {/* 2. Media (Images) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ImageIcon size={18}/> Product Images (URLs)</h3>
              <div className="space-y-3">
                {formData.images.map((img, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      type="text" 
                      value={img} 
                      onChange={(e) => handleArrayChange(i, e.target.value, 'images')}
                      placeholder="https://..." 
                      className="flex-1 border p-3 rounded-lg text-sm" 
                    />
                    <button type="button" onClick={() => removeArrayItem(i, 'images')} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('images')} className="text-sm text-primary font-bold flex items-center gap-1">+ Add Another Image</button>
              </div>
            </div>

            {/* 3. Variants (Matrix) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Variants (Color/Size)</h3>
                <button type="button" onClick={addVariant} className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">+ Add Variant</button>
              </div>
              
              {formData.variants.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No variants added yet.</p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-400 uppercase">
                    <div className="col-span-4">Color</div>
                    <div className="col-span-3">Size</div>
                    <div className="col-span-3">Stock</div>
                    <div className="col-span-2"></div>
                  </div>
                  {formData.variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2">
                      <input 
                        className="col-span-4 border p-2 rounded text-sm" 
                        placeholder="e.g. Emerald"
                        value={v.color} 
                        onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                      />
                      <input 
                        className="col-span-3 border p-2 rounded text-sm" 
                        placeholder="e.g. L"
                        value={v.size} 
                        onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
                      />
                      <input 
                        type="number"
                        className="col-span-3 border p-2 rounded text-sm" 
                        placeholder="0"
                        value={v.stock} 
                        onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                      />
                      <button type="button" onClick={() => removeVariant(i)} className="col-span-2 text-red-500 hover:bg-red-50 flex items-center justify-center rounded"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Details */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Material */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-sm uppercase text-gray-500 mb-4">Fabric Info</h3>
              <textarea 
                name="material" 
                value={formData.material} 
                onChange={handleChange} 
                placeholder="e.g. 100% Adire Silk from Abeokuta" 
                className="w-full border p-3 rounded-lg text-sm h-24"
              />
            </div>

            {/* Care Instructions (List) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-sm uppercase text-gray-500 mb-4">Fabric Care (List)</h3>
              <div className="space-y-2">
                {formData.careInstructions.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      value={item} 
                      onChange={(e) => handleArrayChange(i, e.target.value, 'careInstructions')}
                      className="flex-1 border p-2 rounded text-sm" 
                      placeholder="e.g. Dry Clean Only"
                    />
                    <button type="button" onClick={() => removeArrayItem(i, 'careInstructions')} className="text-red-400"><X size={14}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('careInstructions')} className="text-xs text-primary font-bold">+ Add Instruction</button>
              </div>
            </div>

            {/* Extra Details (List) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-sm uppercase text-gray-500 mb-4">Product Details (List)</h3>
              <div className="space-y-2">
                {formData.details.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      value={item} 
                      onChange={(e) => handleArrayChange(i, e.target.value, 'details')}
                      className="flex-1 border p-2 rounded text-sm" 
                      placeholder="e.g. Side Pockets"
                    />
                    <button type="button" onClick={() => removeArrayItem(i, 'details')} className="text-red-400"><X size={14}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('details')} className="text-xs text-primary font-bold">+ Add Detail</button>
              </div>
            </div>

          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

// Small helper for X icon
function X({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> }