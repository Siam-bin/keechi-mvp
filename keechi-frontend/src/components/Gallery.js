"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export function Gallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="py-12 px-4 bg-charcoal-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-2">Gallery</h2>
          <p className="text-charcoal-600 mb-8">No gallery images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-charcoal-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-charcoal-900 mb-2">Gallery</h2>
        <p className="text-charcoal-600 mb-8">Explore our salon</p>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(image)}
              className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f5f5f5' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-sm font-semibold">View</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <X size={28} />
            </button>

            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-[80vh] rounded-lg"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Crect fill='%23333' width='600' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
