import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEssential } from "../services/essentialService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../components/Sidebar";
import { FaSearch, FaPlus, FaShoppingBasket } from 'react-icons/fa';

const items = [
  { id: 1, name: "Toothpaste", image: "/images/toothpaste.jpg", category: "Personal Care" },
  { id: 2, name: "Toothbrush", image: "/images/toothbrush.jpg", category: "Personal Care" },
  { id: 3, name: "Towel", image: "/images/towel.jpg", category: "Bathroom" },
  { id: 4, name: "Shampoo", image: "/images/shampoo.jpg", category: "Personal Care" },
  { id: 5, name: "Soap", image: "/images/soap.jpg", category: "Personal Care" },
];

export default function AddEssential() {
  const [formData, setFormData] = useState({ name: "", category: "", quantity: "", threshold: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setFormData({ ...formData, name: item.name, category: item.category, quantity: "", threshold: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItem) {
      toast.error("Please select an item to add!");
      return;
    }

    toast.info("Adding essential... Please wait!", { autoClose: 2000 });

    try {
      await addEssential(formData);
      toast.success("Essential added successfully!", { autoClose: 3000 });
      navigate("/");
    } catch (error) {
      console.error("Failed to add essential:", error);
      toast.error("Failed to add essential. Please try again.", { autoClose: 3000 });
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container d-flex">
      <Sidebar />
      
      <div className="container-fluid py-4 px-4">
        <div className="row g-4">
          {/* Left Side - Items List */}
          <div className="col-md-7">
            <div className="card shadow-lg border-0 rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <FaShoppingBasket className="text-primary me-2" size={24} />
                  <h2 className="card-title mb-0">Select Item</h2>
                </div>

                <div className="search-container mb-4 position-relative">
                  <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5 rounded-pill"
                    placeholder="Search for an item..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="items-list">
                  {filteredItems.map((item) => (
                    <div 
                      key={item.id}
                      className={`item-card mb-3 ${selectedItem?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="d-flex align-items-center p-3">
                        <div className="item-image-container me-3">
                          <div className="item-image-wrapper">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="item-image" 
                            />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="item-name mb-1">{item.name}</h5>
                            <span className={`badge category-badge ${selectedItem?.id === item.id ? 'selected' : ''}`}>
                              {item.category}
                            </span>
                          </div>
                          <div className="item-actions">
                            <button 
                              className="btn btn-sm btn-outline-primary rounded-pill"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectItem(item);
                              }}
                            >
                              Select Item
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-md-5">
            <div className="card shadow-lg border-0 rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <FaPlus className="text-primary me-2" size={24} />
                  <h2 className="card-title mb-0">Add Details</h2>
                </div>

                {selectedItem ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Selected Item</label>
                      <div className="d-flex align-items-center p-3 bg-light rounded-3">
                        <div className="me-3" style={{ width: '60px', height: '60px', backgroundColor: '#f8f9fa' }}>
                          <img 
                            src={selectedItem.image} 
                            alt={selectedItem.name} 
                            className="img-fluid h-100 object-fit-contain" 
                          />
                        </div>
                        <div>
                          <h5 className="mb-1">{selectedItem.name}</h5>
                          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                            {selectedItem.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Quantity</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="quantity"
                        onChange={handleChange}
                        value={formData.quantity}
                        required
                        min="1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Threshold</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="threshold"
                        onChange={handleChange}
                        value={formData.threshold}
                        required
                        min="1"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 rounded-pill py-3"
                    >
                      Add Item
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-5">
                    <FaShoppingBasket className="text-muted mb-3" size={48} />
                    <h4 className="text-muted">Select an item to add</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

      <style jsx>{`
        .items-list {
          max-height: calc(100vh - 250px);
          overflow-y: auto;
          padding-right: 10px;
        }

        .items-list::-webkit-scrollbar {
          width: 6px;
        }

        .items-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .items-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .items-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .item-card {
          background: #fff;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .item-card:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .item-card.selected {
          border-color: #0d6efd;
          background: #f8f9ff;
        }

        .item-image-container {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }

        .item-image-wrapper {
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .item-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .item-name {
          color: #2c3e50;
          font-weight: 600;
        }

        .category-badge {
          background: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
        }

        .category-badge.selected {
          background: #0d6efd;
          color: white;
        }

        .item-actions {
          margin-top: 8px;
        }

        .item-actions .btn {
          font-size: 0.85rem;
          padding: 4px 12px;
        }
      `}</style>
    </div>
  );
}