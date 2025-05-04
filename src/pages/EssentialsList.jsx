import { useEffect, useState } from "react";
import { getEssentials, deleteEssential } from "../services/essentialService";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sideba";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";

export default function EssentialsList() {
  const [essentials, setEssentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEssentials() {
      try {
        const data = await getEssentials();
        setEssentials(data);
      } catch (error) {
        console.error("Failed to fetch essentials:", error);
        toast.error("Failed to load essentials");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEssentials();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteEssential(id);
      setEssentials(essentials.filter((essential) => essential._id !== id));
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Failed to delete essential:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-essential/${id}`);
  };

  const filteredEssentials = essentials.filter((essential) =>
    essential.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container d-flex">
      <Sidebar />
      
      <div className="container-fluid py-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <FaBoxOpen className="text-primary me-2" size={28} />
            <h2 className="m-0 text-primary">Household Essentials</h2>
          </div>
          <Link to="/add-essential" className="btn btn-primary rounded-pill px-4">
            <FaPlus className="me-2" />
            Add New Essential
          </Link>
        </div>

        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="search-container position-relative">
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control form-control-lg ps-5 rounded-pill"
                placeholder="Search essentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5 text-muted">Loading your essentials...</p>
          </div>
        ) : filteredEssentials.length > 0 ? (
          <div className="essentials-list">
            {filteredEssentials.map((essential) => (
              <div 
                key={essential._id}
                className="essential-item mb-3"
              >
                <div className="d-flex align-items-center p-3">
                  <div className="item-image-container me-3">
                    <div className="item-image-wrapper">
                      <img 
                        src={`/images/${essential.name.toLowerCase()}.jpg`}
                        alt={essential.name}
                        className="item-image"
                        onError={(e) => {
                          e.target.src = '/images/default-item.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="item-name mb-0">{essential.name}</h5>
                      <span className="badge category-badge">
                        {essential.category}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="quantity-info">
                        <div className="d-flex align-items-center">
                          <span className="quantity-label">Quantity:</span>
                          <span className={`quantity-value ${essential.quantity <= essential.threshold ? 'text-danger' : 'text-success'}`}>
                            {essential.quantity}
                          </span>
                          {essential.quantity <= essential.threshold && (
                            <FaExclamationTriangle className="ms-2 text-danger" />
                          )}
                        </div>
                        <div className="threshold-info">
                          <small className="text-muted">Threshold: {essential.threshold}</small>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button 
                          className="btn btn-sm btn-outline-primary me-2 rounded-pill"
                          onClick={() => handleEdit(essential._id)}
                        >
                          <FaEdit className="me-1" /> Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => handleDelete(essential._id)}
                        >
                          <FaTrash className="me-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-3">
              <FaBoxOpen />
            </div>
            <h3 className="text-muted">No essentials found</h3>
            {searchQuery && (
              <p className="text-muted">No items match your search "{searchQuery}"</p>
            )}
            <Link to="/add-essential" className="btn btn-primary mt-3 rounded-pill px-4">
              <FaPlus className="me-2" />
              Add Your First Essential
            </Link>
          </div>
        )}

        <ToastContainer position="bottom-right" />

        <style jsx>{`
          .essentials-list {
            max-height: calc(100vh - 250px);
            overflow-y: auto;
            padding-right: 10px;
          }

          .essentials-list::-webkit-scrollbar {
            width: 6px;
          }

          .essentials-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          .essentials-list::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }

          .essentials-list::-webkit-scrollbar-thumb:hover {
            background: #555;
          }

          .essential-item {
            background: #fff;
            border-radius: 12px;
            transition: all 0.3s ease;
            border: 1px solid rgba(0,0,0,0.1);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .essential-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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

          .quantity-info {
            display: flex;
            flex-direction: column;
          }

          .quantity-label {
            color: #6c757d;
            font-size: 0.9rem;
            margin-right: 8px;
          }

          .quantity-value {
            font-weight: 600;
            font-size: 1.1rem;
          }

          .threshold-info {
            font-size: 0.85rem;
          }

          .item-actions {
            display: flex;
            gap: 8px;
          }

          .item-actions .btn {
            font-size: 0.85rem;
            padding: 4px 12px;
          }
        `}</style>
      </div>
    </div>
  );
}