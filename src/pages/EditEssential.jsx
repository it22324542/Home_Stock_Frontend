import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEssentials, updateEssential } from "../services/essentialService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaArrowLeft, FaSave, FaBox, FaExclamationTriangle } from "react-icons/fa";

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
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-header bg-transparent border-0 py-4">
            <div className="d-flex align-items-center">
              <FaEdit className="text-primary me-2" size={28} />
              <h2 className="m-0 text-primary">Edit Essential Item</h2>
            </div>
          </div>
          
          <div className="card-body p-4">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 fs-5 text-muted">Loading item details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-bold">Item Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <FaBox className="text-primary" />
                        </span>
                        <input 
                          type="text" 
                          className="form-control form-control-lg border-0 bg-light" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-bold">Category</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <FaBox className="text-primary" />
                        </span>
                        <input 
                          type="text" 
                          className="form-control form-control-lg border-0 bg-light" 
                          name="category" 
                          value={formData.category} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-bold">Current Quantity</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <FaBox className="text-primary" />
                        </span>
                        <input 
                          type="number" 
                          className="form-control form-control-lg border-0 bg-light" 
                          name="quantity" 
                          value={formData.quantity} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="input-group-text bg-light border-0 text-muted">units</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-bold">Low Stock Threshold</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <FaExclamationTriangle className="text-warning" />
                        </span>
                        <input 
                          type="number" 
                          className="form-control form-control-lg border-0 bg-light" 
                          name="threshold" 
                          value={formData.threshold} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="input-group-text bg-light border-0 text-muted">min units</span>
                      </div>
                      <small className="text-muted mt-2 d-block">
                        System will alert when stock reaches this level
                      </small>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between mt-5">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary rounded-pill px-4 py-2"
                    onClick={() => navigate(-1)}
                  >
                    <FaArrowLeft className="me-2" />
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill px-4 py-2"
                  >
                    <FaSave className="me-2" />
                    Update Item
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        <ToastContainer position="bottom-right" />

        <style jsx>{`
          .edit-form {
            max-width: 800px;
            margin: 0 auto;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-label {
            color: #2c3e50;
            margin-bottom: 0.5rem;
          }

          .input-group {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .input-group-text {
            padding: 0.75rem 1rem;
          }

          .form-control {
            padding: 0.75rem 1rem;
            transition: all 0.3s ease;
          }

          .form-control:focus {
            box-shadow: none;
            background-color: #f8f9fa;
          }

          .btn {
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .btn-outline-secondary:hover {
            background-color: #6c757d;
            color: white;
          }

          .btn-primary {
            background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
            border: none;
          }

          .btn-primary:hover {
            background: linear-gradient(135deg, #0a58ca 0%, #084298 100%);
            transform: translateY(-1px);
          }

          .card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          }
        `}</style>
      </div>
    </div>
  );
}