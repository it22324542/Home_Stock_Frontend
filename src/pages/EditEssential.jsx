import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEssentials, updateEssential } from "../services/essentialService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";

export default function EditEssential() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "", 
    quantity: "", 
    threshold: "" 
  });
  const [isLoading, setIsLoading] = useState(true);

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
        toast.error("Failed to load essential data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEssential();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    toast.info("Updating essential...", { autoClose: 1500 });

    try {
      await updateEssential(id, formData);
      toast.success("Essential updated successfully!");
      setTimeout(() => navigate("/list-essential"), 2000);
    } catch (error) {
      console.error("Failed to update essential:", error);
      toast.error("Failed to update essential.");
    }
  };

  return (
    <div className="app-container d-flex">
      <Sidebar />
      
      <div className="container-fluid py-4 px-4">
        <div className="card shadow-lg border-0" style={{ 
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderRadius: "15px",
          overflow: "hidden"
        }}>
          <div className="card-header bg-primary text-white py-3">
            <h2 className="m-0">
              <i className="fas fa-edit me-2"></i>
              Edit Essential Item
            </h2>
          </div>
          
          <div className="card-body p-4">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading item details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted">Item Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg border-2 border-primary" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-muted">Category</label>
                    <input 
                      type="text" 
                      className="form-control border-2 border-info" 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-muted">Current Quantity</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        className="form-control border-2 border-success" 
                        name="quantity" 
                        value={formData.quantity} 
                        onChange={handleChange} 
                        required 
                      />
                      <span className="input-group-text bg-success text-white">units</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted">Low Stock Threshold</label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="form-control border-2 border-warning" 
                      name="threshold" 
                      value={formData.threshold} 
                      onChange={handleChange} 
                      required 
                    />
                    <span className="input-group-text bg-warning text-dark">min units</span>
                  </div>
                  <small className="text-muted">System will alert when stock reaches this level</small>
                </div>
                
                <div className="d-flex justify-content-between mt-5">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={() => navigate(-1)}
                  >
                    <i className="fas fa-arrow-left me-2"></i>Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 py-2 shadow-sm"
                  >
                    <i className="fas fa-save me-2"></i>Update Item
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}