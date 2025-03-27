import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEssential } from "../services/essentialService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../components/Sidebar";

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
      {/* Sidebar */}
      <Sidebar />
      
      <div className="container-fluid py-4 px-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4">Add Essential</h2>

            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search for an item..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="row g-3 mb-4">
              {filteredItems.map((item) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
                  <div 
                    className={`card h-100 cursor-pointer ${selectedItem?.id === item.id ? 'border-primary border-2' : ''}`}
                    onClick={() => handleSelectItem(item)}
                  >
                    <div className="card-img-top p-3" style={{ height: '150px' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="img-fluid h-100 object-fit-contain mx-auto d-block" 
                      />
                    </div>
                    <div className="card-body text-center">
                      <h5 className="card-title">{item.name}</h5>
                      <span className="badge bg-info text-dark">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedItem && (
              <div className="mt-4">
                <h3 className="mb-4">Add {selectedItem.name}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      name="category"
                      value={formData.category}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      onChange={handleChange}
                      value={formData.quantity}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Threshold</label>
                    <input
                      type="number"
                      className="form-control"
                      name="threshold"
                      onChange={handleChange}
                      value={formData.threshold}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary px-4 py-2">
                    Add Item
                  </button>
                </form>
              </div>
            )}

            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}