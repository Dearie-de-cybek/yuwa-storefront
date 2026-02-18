import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function useCustomerData() {
  const { token, user, setUser } = useAuth(); // We need setUser to update local profile state
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Dashboard Metrics
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0
  });

  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  // --- 1. FETCH ALL DATA ---
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Parallel requests for speed
      const [ordersRes, addressesRes, wishlistRes] = await Promise.all([
        api.get('/api/orders/my-orders'),
        api.get('/api/users/profile'), // Profile includes addresses usually, or separate endpoint
        api.get('/api/users/wishlist')  // Assuming you have a wishlist endpoint
      ]);

      setOrders(ordersRes.data || []);
      setAddresses(addressesRes.data.addresses || []); 
      setWishlist(wishlistRes.data || []);

      // Calculate Metrics
      const spent = ordersRes.data.reduce((acc, order) => acc + parseFloat(order.totalAmount), 0);
      setMetrics({
        totalOrders: ordersRes.data.length,
        totalSpent: spent,
        wishlistCount: wishlistRes.data.length
      });

    } catch (error) {
      console.error("Dashboard Load Error:", error);
      // Don't toast error here to avoid spamming on login, just log it.
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [fetchDashboardData, token]);

  // --- 2. ACTIONS ---

  const updateProfile = async (formData) => {
    try {
      const { data } = await api.put('/api/users/profile', formData);
      setUser(data); // Update Auth Context
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return { success: false, error: error.message };
    }
  };

  const addAddress = async (addressData) => {
    try {
      const { data } = await api.post('/api/users/addresses', addressData);
      setAddresses([...addresses, data]);
      toast.success('Address added');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const deleteAddress = async (id) => {
    if(!window.confirm("Delete this address?")) return;
    try {
      await api.delete(`/api/users/addresses/${id}`);
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('Address removed');
    } catch (error) {
      toast.error('Failed to remove address');
    }
  };

  return {
    loading,
    orders,
    addresses,
    wishlist,
    metrics,
    user, // Current user profile
    updateProfile,
    addAddress,
    deleteAddress,
    refresh: fetchDashboardData
  };
}