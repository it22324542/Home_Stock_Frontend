import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEssentials, updateEssential } from "../services/essentialService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditEssential() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", category: "", quantity: "", threshold: "" });

  useEffect(() => {
    async function fetchEssential() {
      try {
        const essentials = await getEssentials();
        const essentialToEdit = essentials.find((item) => item._id === id);
        if (essentialToEdit) {
          setFormData(essentialToEdit);
        } else {
          toast.error("Essential not found.");
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to fetch essential:", error);
      }
    }
    fetchEssential();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateEssential(id, formData);
      toast.success("Essential updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to update essential:", error);
      toast.error("Failed to update essential.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Essential</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input type="number" className="form-control" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Threshold</label>
          <input type="number" className="form-control" name="threshold" value={formData.threshold} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Update</button>
      </form>
      <ToastContainer />
    </div>
  );
}
