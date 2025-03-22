import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEssential } from "../services/essentialService";

export default function AddEssential() {
  const [formData, setFormData] = useState({ name: "", quantity: "", threshold: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEssential(formData);
      navigate("/");
    } catch (error) {
      console.error("Failed to add essential:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Essential</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input type="number" className="form-control" name="quantity" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Threshold</label>
          <input type="number" className="form-control" name="threshold" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Add</button>
      </form>
    </div>
  );
}
