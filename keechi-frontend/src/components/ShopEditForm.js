"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Upload, X, Plus } from "lucide-react";

export function ShopEditForm({ shopId, onSave }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shop, setShop] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
    servicesTagline: "",
    openHours: "",
    policies: "",
    area: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [preview, setPreview] = useState(null);

  // Fetch shop data
  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/shops/${shopId}`);
        setShop(response.data);
        setFormData({
          name: response.data.name || "",
          address: response.data.address || "",
          phone: response.data.phone || "",
          description: response.data.description || "",
          servicesTagline: response.data.servicesTagline || "",
          openHours: response.data.openHours || "",
          policies: response.data.policies || "",
          area: response.data.area || "",
        });
        if (response.data.coverImage) {
          setPreview(response.data.coverImage);
        }
        if (response.data.galleryImages) {
          setGalleryImages(response.data.galleryImages);
        }
      } catch (err) {
        toast.error("Failed to load shop details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShop();
    }
  }, [shopId]);

  // Handle text input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle cover image upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gallery image upload
  const handleGalleryImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setGalleryImages((prev) => [...prev, ...newImages.map((f) => f)]);
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      // Prepare form data for multipart upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("phone", formData.phone);
      data.append("description", formData.description);
      data.append("servicesTagline", formData.servicesTagline);
      data.append("openHours", formData.openHours);
      data.append("policies", formData.policies);
      data.append("area", formData.area);

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      galleryImages.forEach((img, idx) => {
        if (img instanceof File) {
          data.append(`galleryImages`, img);
        }
      });

      const response = await api.patch(`/shops/${shopId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Shop details updated successfully!");
      if (onSave) onSave(response.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update shop");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-charcoal-900 mb-6">Basic Information</h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold text-charcoal-900 mb-2">
              Shop Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter shop name"
              className="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+880 1XX XXXXXXX"
              className="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-charcoal-900 mb-2">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter full address"
            className="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            required
          />
        </div>

        <div className="mt-6">
          <label className="block font-semibold text-charcoal-900 mb-2">
            Area/Zone
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            placeholder="e.g., Gulshan, Banani, Dhanmondi"
            className="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Description & Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-charcoal-900 mb-6">Details</h3>

        <div>
          <label className="block font-semibold text-charcoal-900 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your salon, services, and specialties..."
            rows="4"
            className="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="mt-6">
          <label className="block font-semibold text-charcoal-900 mb-2">
            Services Tagline
          </label>
          <input
            type="text"
            name="servicesTagline"
            value={formData.servicesTagline}
            onChange={handleInputChange}
            placeholder="e.g., Hair • Color • Spa Treatment • Facial"
            className="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <p className="text-xs text-charcoal-500 mt-1">
            This will be displayed on your salon card as a quick preview of your services
          </p>
        </div>

        <div className="mt-6">
          <label className="block font-semibold text-charcoal-900 mb-2">
            Working Hours
          </label>
          <textarea
            name="openHours"
            value={formData.openHours}
            onChange={handleInputChange}
            placeholder="e.g., Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 5 PM, Sun: Closed"
            rows="3"
            className="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="mt-6">
          <label className="block font-semibold text-charcoal-900 mb-2">
            Policies & Important Info
          </label>
          <textarea
            name="policies"
            value={formData.policies}
            onChange={handleInputChange}
            placeholder="Cancellation policy, dress code, special requests, etc."
            rows="3"
            className="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-charcoal-900 mb-6">Cover Image</h3>

        {preview && (
          <div className="mb-6 relative">
            <img
              src={preview}
              alt="Cover preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setCoverImage(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <label className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-charcoal-300 rounded-lg cursor-pointer hover:bg-charcoal-50 transition">
          <div className="text-center">
            <Upload size={32} className="text-gold-500 mx-auto mb-2" />
            <p className="font-semibold text-charcoal-900">Upload Cover Image</p>
            <p className="text-sm text-charcoal-600">PNG, JPG up to 10MB</p>
          </div>
          <input
            type="file"
            onChange={handleCoverImageChange}
            accept="image/*"
            className="hidden"
          />
        </label>
      </div>

      {/* Gallery Images */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-charcoal-900 mb-6">Gallery Images</h3>

        {galleryImages.length > 0 && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={
                    img instanceof File
                      ? URL.createObjectURL(img)
                      : img
                  }
                  alt={`Gallery ${idx}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-charcoal-300 rounded-lg cursor-pointer hover:bg-charcoal-50 transition">
          <div className="text-center">
            <Plus size={32} className="text-gold-500 mx-auto mb-2" />
            <p className="font-semibold text-charcoal-900">Add Gallery Images</p>
            <p className="text-sm text-charcoal-600">Select multiple images</p>
          </div>
          <input
            type="file"
            onChange={handleGalleryImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition ${
            submitting
              ? "bg-charcoal-400 cursor-not-allowed"
              : "bg-gold-500 hover:bg-gold-600"
          }`}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
