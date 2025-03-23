import { useEffect, useState } from "react";
import { getEssentials, deleteEssential } from "../services/essentialService";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/EssentialsList.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EssentialsList() {
  const [essentials, setEssentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEssentials() {
      try {
        const data = await getEssentials();
        setEssentials(data);
      } catch (error) {
        console.error("Failed to fetch essentials:", error);
      }
    }
    fetchEssentials();
  }, []);

  // Handle delete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteEssential(id);
      setEssentials(essentials.filter((essential) => essential._id !== id));
      toast.success("Essential deleted successfully!");
    } catch (error) {
      console.error("Failed to delete essential:", error);
      toast.error("Failed to delete essential.");
    }
  };

  // Handle edit function (redirect to edit page)
  const handleEdit = (id) => {
    navigate(`/edit-essential/${id}`);
  };

  const filteredEssentials = essentials.filter((essential) =>
    essential.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <h2 className="title">Household Essentials</h2>
        <input
          type="text"
          className="form-control search-bar"
          placeholder="Search for an item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Link to="/add-essential" className="btn btn-success my-3">+ Add Essential</Link>

        <div className="essentials-grid">
          {filteredEssentials.length > 0 ? (
            filteredEssentials.map((essential) => (
              <div className="essential-card" key={essential._id}>
                <img src={`/images/${essential.name.toLowerCase()}.jpg`} alt={essential.name} className="essential-image" />
                <div className="essential-info">
                  <h5>{essential.name}</h5>
                  <p><strong>Category:</strong> {essential.category}</p>
                  <p>Quantity: {essential.quantity}</p>
                  <p>Threshold: {essential.threshold}</p>
                  <div className="actions">
                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(essential._id)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(essential._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No essentials found.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
