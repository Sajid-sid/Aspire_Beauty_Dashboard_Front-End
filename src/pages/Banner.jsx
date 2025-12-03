import React, { useEffect, useState } from "react";
import axios from "axios";

const Banner = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [preview, setPreview] = useState({});
  const [existing, setExisting] = useState({});
  const [updatedImages, setUpdatedImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const bannerKeys = [
    "home1",
    "home2",
    "home3",
    "mobile1",
    "mobile2",
    "mobile3",
    "middle1",
    "middle2",
  ];

  // FETCH EXISTING BANNERS
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/banner`);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setExisting(data);
      } catch (error) {
        console.error(error);
        setMessage("❌ Error loading existing banner");
      }
    };

    fetchBanner();
  }, []);

  // HANDLE FILE CHANGE (UPDATE ONLY)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setUpdatedImages((prev) => ({
      ...prev,
      [name]: file,
    }));

    setPreview((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(file),
    }));
  };

  // SUBMIT UPDATED IMAGES
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (Object.keys(updatedImages).length === 0) {
      return setMessage("⚠️ Please select at least one image to update");
    }

    const formData = new FormData();
    Object.keys(updatedImages).forEach((key) => {
      formData.append(key, updatedImages[key]);
    });

    try {
      setLoading(true);

      await axios.put(`${BASE_URL}/api/banner/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Banner Updated Successfully!");
      setUpdatedImages({});
      setPreview({});
      // Refresh existing banners
      const res = await axios.get(`${BASE_URL}/api/banner`);
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      setExisting(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error updating banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8">
        <h2 className="text-2xl font-bold text-[#03619E] mb-6 text-center">
          Update Banner Images
        </h2>

        {message && (
          <p
            className={`mb-4 text-center font-medium ${
              message.includes("Error") || message.includes("⚠️")
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* EXISTING IMAGES SECTION */}
        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          Current Banner Images
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {bannerKeys.map((key) => (
            <div key={key}>
              <p className="font-semibold mb-1">{key.toUpperCase()}</p>

              {existing[key] ? (
                <img
                  src={existing[key]} // <-- backend now returns full URL
                  alt={key}
                  className="w-full h-32 object-cover rounded-lg border shadow"
                />
              ) : (
                <p className="text-gray-400 text-sm">No image available</p>
              )}
            </div>
          ))}
        </div>

        {/* UPDATE ONLY */}
        <form onSubmit={handleUpdate} className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Update Banner Images
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bannerKeys.map((key) => (
              <div key={key}>
                <label className="font-semibold text-gray-700">
                  {key.toUpperCase()}
                </label>

                <input
                  type="file"
                  name={key}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 text-sm"
                />

                {preview[key] && (
                  <img
                    src={preview[key]}
                    alt="preview"
                    className="w-full h-32 object-cover rounded-lg border mt-2 shadow"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#03619E] hover:bg-blue-900 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Updating..." : "Update Banner"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Banner;
