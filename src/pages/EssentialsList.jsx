import { useEffect, useState } from "react";
import { getEssentials, deleteEssential } from "../services/essentialService";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBoxOpen } from "react-icons/fa";

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
          <h2 className="m-0 text-primary">
            <FaBoxOpen className="me-2" />
            Household Essentials
          </h2>
          <Link to="/add-essential" className="btn btn-success">
            <FaPlus className="me-2" />
            Add New Essential
          </Link>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control form-control-lg"
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
            <p className="mt-3 fs-5">Loading your essentials...</p>
          </div>
        ) : filteredEssentials.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {filteredEssentials.map((essential) => (
              <div className="col" key={essential._id}>
                <div className="card h-100 shadow-sm border-0" style={{ 
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  borderRadius: "12px",
                  overflow: "hidden"
                }}>
                  <div className="card-img-top" style={{ height: "180px", overflow: "hidden" }}>
                    <img 
                      src={`/images/${essential.name.toLowerCase()}.jpg`} 
                      alt={essential.name}
                      className="img-fluid w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.src = '/images/default-item.jpg';
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title text-primary">{essential.name}</h5>
                    <div className="mb-2">
                      <span className="badge bg-info text-dark">{essential.category}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <small className="text-muted">Quantity:</small>
                        <h6 className={`mb-0 ${essential.quantity <= essential.threshold ? 'text-danger' : 'text-success'}`}>
                          {essential.quantity}
                        </h6>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">Threshold:</small>
                        <h6 className="mb-0">{essential.threshold}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <div className="d-flex justify-content-between">
                      <button 
                        onClick={() => handleEdit(essential._id)}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaEdit className="me-1" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(essential._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <FaTrash className="me-1" /> Delete
                      </button>
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
            <Link to="/add-essential" className="btn btn-primary mt-3">
              <FaPlus className="me-2" />
              Add Your First Essential
            </Link>
          </div>
        )}

        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}