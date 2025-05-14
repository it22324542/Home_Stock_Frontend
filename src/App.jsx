// import { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

// function App() {
//   // State management
//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [name, setName] = useState("");
//   const [location, setLocation] = useState("");
//   const [sublocation, setSublocation] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [image, setImage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [notification, setNotification] = useState({ show: false, message: "", type: "" });

//   const [editId, setEditId] = useState(null);
//   const [editName, setEditName] = useState("");
//   const [editLocation, setEditLocation] = useState("");
//   const [editSublocation, setEditSublocation] = useState("");
//   const [editQuantity, setEditQuantity] = useState("");
//   const [editImage, setEditImage] = useState("");
//   const [showEditModal, setShowEditModal] = useState(false);

//   const [errors, setErrors] = useState({
//     name: "",
//     location: "",
//     sublocation: "",
//     quantity: ""
//   });

//   const [editErrors, setEditErrors] = useState({
//     editName: "",
//     editLocation: "",
//     editSublocation: "",
//     editQuantity: ""
//   });

//   // Fetch inventory items
//   useEffect(() => {
//     fetchItems();
//   }, []);

//   // Filter items based on search term
//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredItems(items);
//     } else {
//       const filtered = items.filter(item => 
//         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (item.sublocation && item.sublocation.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredItems(filtered);
//     }
//   }, [searchTerm, items]);

//   const fetchItems = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("/api/inventory");
//       setItems(response.data);
//       setFilteredItems(response.data);
//     } catch (error) {
//       console.error("Error fetching inventory items:", error);
//       showNotification("Failed to load items. Please try again.", "danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Find nearby hardware stores
//   const findNearbyHardwareStores = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           const googleMapsUrl = `https://www.google.com/maps/search/hardware+stores/@${latitude},${longitude},15z`;
//           window.open(googleMapsUrl, '_blank');
//           showNotification("Showing nearby hardware stores...");
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           showNotification("Could not get your location. Showing general hardware stores.", "warning");
//           window.open("https://www.google.com/maps/search/hardware+stores", '_blank');
//         }
//       );
//     } else {
//       showNotification("Showing general hardware stores...", "info");
//       window.open("https://www.google.com/maps/search/hardware+stores", '_blank');
//     }
//   };

//   // Validate fields
//   const validateField = (field, value) => {
//     switch (field) {
//       case 'name':
//       case 'location':
//       case 'sublocation':
//       case 'editName':
//       case 'editLocation':
//       case 'editSublocation':
//         if (!value.trim()) return `${field.replace('edit', '')} is required`;
//         if (!/^[A-Za-z\s]+$/.test(value)) return "Only letters and spaces allowed";
//         return "";
//       case 'quantity':
//       case 'editQuantity':
//         if (!value) return "Quantity is required";
//         if (isNaN(value)) return "Must be a number";
//         if (value < 0) return "Must be positive";
//         return "";
//       default:
//         return "";
//     }
//   };

//   // Validate entire form
//   const validateForm = (formData, isEdit = false) => {
//     const prefix = isEdit ? "edit" : "";
//     const newErrors = {
//       [`${prefix}name`]: validateField(`${prefix}name`, formData.name),
//       [`${prefix}location`]: validateField(`${prefix}location`, formData.location),
//       [`${prefix}sublocation`]: validateField(`${prefix}sublocation`, formData.sublocation || ""),
//       [`${prefix}quantity`]: validateField(`${prefix}quantity`, formData.quantity)
//     };

//     if (isEdit) {
//       setEditErrors(newErrors);
//     } else {
//       setErrors(newErrors);
//     }

//     return !Object.values(newErrors).some(error => error !== "");
//   };

//   // Show notification function
//   const showNotification = (message, type = "success") => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
//   };

//   // Search handler
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Add new item
//   const addItem = async () => {
//     const formData = { name, location, sublocation, quantity, image };

//     if (!validateForm(formData)) {
//       showNotification("Please fix the errors in the form", "danger");
//       return;
//     }

//     try {
//       await axios.post("/api/inventory", { 
//         ...formData, 
//         quantity: parseInt(quantity) 
//       });
//       fetchItems();
//       setName("");
//       setLocation("");
//       setSublocation("");
//       setQuantity("");
//       setImage("");
//       setShowAddForm(false);
//       setErrors({
//         name: "",
//         location: "",
//         sublocation: "",
//         quantity: ""
//       });
//       showNotification("Item added successfully!");
//     } catch (error) {
//       console.error("Error adding item:", error);
//       showNotification("Failed to add item. Please try again.", "danger");
//     }
//   };

//   // Delete item
//   const deleteItem = async (id) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       try {
//         await axios.delete(`/api/inventory/${id}`);
//         fetchItems();
//         showNotification("Item deleted successfully!");
//       } catch (error) {
//         console.error("Error deleting item:", error);
//         showNotification("Failed to delete item. Please try again.", "danger");
//       }
//     }
//   };

//   // Edit item functions
//   const openEditModal = (item) => {
//     setEditId(item._id);
//     setEditName(item.name);
//     setEditLocation(item.location);
//     setEditSublocation(item.sublocation || "");
//     setEditQuantity(item.quantity);
//     setEditImage(item.image);
//     setShowEditModal(true);
//     setEditErrors({
//       editName: "",
//       editLocation: "",
//       editSublocation: "",
//       editQuantity: ""
//     });
//   };

//   const handleEditSubmit = async () => {
//     const formData = {
//       name: editName,
//       location: editLocation,
//       sublocation: editSublocation,
//       quantity: editQuantity,
//       image: editImage
//     };

//     if (!validateForm(formData, true)) {
//       showNotification("Please fix the errors in the form", "danger");
//       return;
//     }

//     try {
//       await axios.put(`/api/inventory/${editId}`, {
//         ...formData,
//         quantity: parseInt(editQuantity)
//       });
//       fetchItems();
//       setShowEditModal(false);
//       showNotification("Item updated successfully!");
//     } catch (error) {
//       console.error("Error updating item:", error);
//       showNotification("Failed to update item. Please try again.", "danger");
//     }
//   };

//   // Generate PDF report
//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.setTextColor(40, 40, 40);
//     doc.text("Inventory List Report", 14, 20);

//     autoTable(doc, {
//       head: [["Name", "Location", "Sublocation", "Quantity"]],
//       body: filteredItems.map(item => [item.name, item.location, item.sublocation || "-", item.quantity]),
//       startY: 30,
//       theme: "grid",
//       styles: { fontSize: 10, cellPadding: 2, valign: "middle", halign: "center" },
//     });

//     doc.save("inventory_report.pdf");
//     showNotification("PDF report generated successfully!");
//   };

//   // Notification component
//   const Notification = () => {
//     if (!notification.show) return null;

//     return (
//       <div className={`alert alert-${notification.type} alert-dismissible fade show position-fixed top-0 end-0 m-3`} 
//            style={{ zIndex: 9999 }}>
//         <i className={`bi ${notification.type === 'success' ? 'bi-check-circle' : 
//                        notification.type === 'danger' ? 'bi-exclamation-triangle' :
//                        notification.type === 'warning' ? 'bi-exclamation-triangle' :
//                        'bi-info-circle'} me-2`}></i>
//         {notification.message}
//         <button type="button" className="btn-close" onClick={() => setNotification({ show: false, message: "", type: "" })}></button>
//       </div>
//     );
//   };

//   return (
//     <div style={{
//       backgroundImage: "url('/images/inventory_background.jpg')",
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//       backgroundRepeat: "no-repeat",
//       backgroundAttachment: "fixed",
//       minHeight: "100vh",
//       padding: "20px",
//     }}>
//       {/* Notification component */}
//       <Notification />

//       <div className="container mt-5" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "10px" }}>
//         <h1 className="text-center mb-4">Inventory Management</h1>

//         {/* Search Bar */}
//         <div className="row mb-4">
//           <div className="col-12 col-md-8 mx-auto">
//             <div className="input-group shadow-sm">
//               <span className="input-group-text bg-white border-end-0">
//                 <i className="bi bi-search text-secondary"></i>
//               </span>
//               <input
//                 type="text"
//                 className="form-control border-start-0"
//                 placeholder="Search by name, location, or sublocation..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//               {searchTerm && (
//                 <button 
//                   className="btn btn-outline-secondary" 
//                   onClick={() => setSearchTerm("")}
//                 >
//                   <i className="bi bi-x"></i>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Add Item Button */}
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h2 className="mb-0">Inventory List</h2>
//           <button
//             className="btn btn-primary"
//             onClick={() => setShowAddForm(!showAddForm)}
//           >
//             <i className={`bi ${showAddForm ? "bi-dash" : "bi-plus"}`}></i>{" "}
//             {showAddForm ? "Minimize" : "Add Item"}
//           </button>
//         </div>

//         {/* Add Item Form */}
//         {showAddForm && (
//           <div className="card mb-4 shadow-sm">
//             <div className="card-body">
//               <h3 className="card-title mb-4">Add New Item</h3>
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <label className="form-label">Name*</label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.name && "is-invalid"}`}
//                     value={name}
//                     onChange={(e) => {
//                       setName(e.target.value);
//                       setErrors({...errors, name: validateField('name', e.target.value)});
//                     }}
//                   />
//                   {errors.name && <div className="invalid-feedback">{errors.name}</div>}
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Location*</label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.location && "is-invalid"}`}
//                     value={location}
//                     onChange={(e) => {
//                       setLocation(e.target.value);
//                       setErrors({...errors, location: validateField('location', e.target.value)});
//                     }}
//                   />
//                   {errors.location && <div className="invalid-feedback">{errors.location}</div>}
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Sublocation</label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.sublocation && "is-invalid"}`}
//                     value={sublocation}
//                     onChange={(e) => {
//                       setSublocation(e.target.value);
//                       setErrors({...errors, sublocation: validateField('sublocation', e.target.value)});
//                     }}
//                   />
//                   {errors.sublocation && <div className="invalid-feedback">{errors.sublocation}</div>}
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Quantity*</label>
//                   <input
//                     type="number"
//                     className={`form-control ${errors.quantity && "is-invalid"}`}
//                     value={quantity}
//                     onChange={(e) => {
//                       setQuantity(e.target.value);
//                       setErrors({...errors, quantity: validateField('quantity', e.target.value)});
//                     }}
//                   />
//                   {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
//                 </div>
//                 <div className="col-12">
//                   <label className="form-label">Image URL</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={image}
//                     onChange={(e) => setImage(e.target.value)}
//                   />
//                 </div>
//                 <div className="col-12">
//                   <button className="btn btn-primary" onClick={addItem}>
//                     <i className="bi bi-check-circle me-2"></i>Add Item
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Inventory List */}
//         {loading ? (
//           <div className="text-center my-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         ) : (
//           <>
//             {filteredItems.length === 0 ? (
//               <div className="alert alert-info text-center">
//                 {searchTerm ? "No items match your search" : "No items found"}
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-striped table-hover align-middle">
//                   <thead className="table-dark">
//                     <tr>
//                       <th style={{width: "80px"}}>Image</th>
//                       <th>Name</th>
//                       <th>Location</th>
//                       <th>Sublocation</th>
//                       <th style={{width: "100px"}}>Quantity</th>
//                       <th style={{width: "120px"}}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredItems.map((item) => (
//                       <tr key={item._id}>
//                         <td>
//                           {item.image ? (
//                             <img
//                               src={item.image}
//                               alt={item.name}
//                               className="img-thumbnail"
//                               style={{ width: "60px", height: "60px", objectFit: "cover" }}
//                             />
//                           ) : (
//                             <div className="bg-light d-flex align-items-center justify-content-center" 
//                                  style={{ width: "60px", height: "60px" }}>
//                               <i className="bi bi-image text-muted"></i>
//                             </div>
//                           )}
//                         </td>
//                         <td>{item.name}</td>
//                         <td>{item.location}</td>
//                         <td>{item.sublocation || "-"}</td>
//                         <td>{item.quantity}</td>
//                         <td>
//                           <div className="d-flex">
//                             <button
//                               className="btn btn-sm btn-outline-primary me-2"
//                               onClick={() => openEditModal(item)}
//                               title="Edit"
//                             >
//                               <i className="bi bi-pencil"></i>
//                             </button>
//                             <button
//                               className="btn btn-sm btn-outline-danger"
//                               onClick={() => deleteItem(item._id)}
//                               title="Delete"
//                             >
//                               <i className="bi bi-trash"></i>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}

//         {/* Action Buttons */}
//         <div className="text-end mt-4">
//           {/* Find Items Nearby Button */}
//           <button 
//             className="btn btn-info me-2"
//             onClick={findNearbyHardwareStores}
//           >
//             <i className="bi bi-geo-alt-fill me-2"></i> Find Items Nearby
//           </button>

//           {/* Download Report Button */}
//           {filteredItems.length > 0 && (
//             <button className="btn btn-success" onClick={generatePDF}>
//               <i className="bi bi-download me-2"></i>Download Report
//             </button>
//           )}
//         </div>

//         {/* Edit Modal */}
//         {showEditModal && (
//           <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header bg-primary text-white">
//                   <h5 className="modal-title">Edit Item</h5>
//                   <button
//                     type="button"
//                     className="btn-close btn-close-white"
//                     onClick={() => setShowEditModal(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Name*</label>
//                     <input
//                       type="text"
//                       className={`form-control ${editErrors.editName && "is-invalid"}`}
//                       value={editName}
//                       onChange={(e) => {
//                         setEditName(e.target.value);
//                         setEditErrors({...editErrors, editName: validateField('editName', e.target.value)});
//                       }}
//                     />
//                     {editErrors.editName && <div className="invalid-feedback">{editErrors.editName}</div>}
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Location*</label>
//                     <input
//                       type="text"
//                       className={`form-control ${editErrors.editLocation && "is-invalid"}`}
//                       value={editLocation}
//                       onChange={(e) => {
//                         setEditLocation(e.target.value);
//                         setEditErrors({...editErrors, editLocation: validateField('editLocation', e.target.value)});
//                       }}
//                     />
//                     {editErrors.editLocation && <div className="invalid-feedback">{editErrors.editLocation}</div>}
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Sublocation</label>
//                     <input
//                       type="text"
//                       className={`form-control ${editErrors.editSublocation && "is-invalid"}`}
//                       value={editSublocation}
//                       onChange={(e) => {
//                         setEditSublocation(e.target.value);
//                         setEditErrors({...editErrors, editSublocation: validateField('editSublocation', e.target.value)});
//                       }}
//                     />
//                     {editErrors.editSublocation && <div className="invalid-feedback">{editErrors.editSublocation}</div>}
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Quantity*</label>
//                     <input
//                       type="number"
//                       className={`form-control ${editErrors.editQuantity && "is-invalid"}`}
//                       value={editQuantity}
//                       onChange={(e) => {
//                         setEditQuantity(e.target.value);
//                         setEditErrors({...editErrors, editQuantity: validateField('editQuantity', e.target.value)});
//                       }}
//                     />
//                     {editErrors.editQuantity && <div className="invalid-feedback">{editErrors.editQuantity}</div>}
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Image URL</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={editImage}
//                       onChange={(e) => setEditImage(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setShowEditModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handleEditSubmit}
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;



import { useEffect, useState } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

//import './App.css'



function App() {
  // State management
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [sublocation, setSublocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [limit, setLimit] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSublocation, setEditSublocation] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editLimit, setEditLimit] = useState("");
  const [editImage, setEditImage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    location: "",
    sublocation: "",
    quantity: ""
  });

  const [editErrors, setEditErrors] = useState({
    editName: "",
    editLocation: "",
    editSublocation: "",
    editQuantity: ""
  });

  // Fetch inventory items
  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.sublocation && item.sublocation.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/inventory");
      setItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      showNotification("Failed to load items. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Delete item function
  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/api/inventory/${id}`);
        fetchItems();
        showNotification("Item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
        showNotification("Failed to delete item. Please try again.", "danger");
      }
    }
  };

  // Find nearby hardware stores
  const findNearbyHardwareStores = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsUrl = `https://www.google.com/maps/search/hardware+stores/@${latitude},${longitude},15z`;
          window.open(googleMapsUrl, '_blank');
          showNotification("Showing nearby hardware stores...");
        },
        (error) => {
          console.error("Error getting location:", error);
          showNotification("Could not get your location. Showing general hardware stores.", "warning");
          window.open("https://www.google.com/maps/search/hardware+stores", '_blank');
        }
      );
    } else {
      showNotification("Showing general hardware stores...", "info");
      window.open("https://www.google.com/maps/search/hardware+stores", '_blank');
    }
  };

  // Validate fields
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
      case 'location':
      case 'sublocation':
      case 'editName':
      case 'editLocation':
      case 'editSublocation':
        if (!value.trim()) return `${field.replace('edit', '')} is required`;
        if (!/^[A-Za-z\s]+$/.test(value)) return "Only letters and spaces allowed";
        return "";
      case 'quantity':
      case 'editQuantity':
        if (!value) return "Quantity is required";
        if (isNaN(value)) return "Must be a number";
        if (value < 0) return "Must be positive";
        return "";
      default:
        return "";
    }
  };

  // Validate entire form
  const validateForm = (formData, isEdit = false) => {
    const prefix = isEdit ? "edit" : "";
    const newErrors = {
      [`${prefix}name`]: validateField(`${prefix}name`, formData.name),
      [`${prefix}location`]: validateField(`${prefix}location`, formData.location),
      [`${prefix}sublocation`]: validateField(`${prefix}sublocation`, formData.sublocation || ""),
      [`${prefix}quantity`]: validateField(`${prefix}quantity`, formData.quantity)
    };

    if (isEdit) {
      setEditErrors(newErrors);
    } else {
      setErrors(newErrors);
    }

    return !Object.values(newErrors).some(error => error !== "");
  };

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Inventory List Report", 14, 20);

    autoTable(doc, {
      head: [["Name", "Location", "Sublocation", "Quantity", "Status"]],
      body: filteredItems.map(item => [
        item.name, 
        item.location, 
        item.sublocation || "-", 
        item.quantity,
        item.limit > 0 && item.quantity <= item.limit ? "Low Stock" : "In Stock"
      ]),
      startY: 30,
      theme: "grid",
      styles: { 
        fontSize: 10, 
        cellPadding: 2, 
        valign: "middle", 
        halign: "center" 
      },
      columnStyles: {
        4: {
          fontStyle: 'bold',
          textColor: (item) => 
            item.limit > 0 && item.quantity <= item.limit ? [255, 0, 0] : [0, 128, 0]
        }
      }
    });

    doc.save("inventory_report.pdf");
    showNotification("PDF report generated successfully!");
  };

  // Add new item
  const addItem = async () => {
    const formData = { name, location, sublocation, quantity, limit, image };
    
    if (!validateForm(formData)) {
      showNotification("Please fix the errors in the form", "danger");
      return;
    }

    try {
      await axios.post("/api/inventory", { 
        ...formData, 
        quantity: parseInt(quantity),
        limit: parseInt(limit) || 0
      });
      fetchItems();
      setName("");
      setLocation("");
      setSublocation("");
      setQuantity("");
      setLimit("");
      setImage("");
      setShowAddForm(false);
      setErrors({
        name: "",
        location: "",
        sublocation: "",
        quantity: ""
      });
      showNotification("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      showNotification("Failed to add item. Please try again.", "danger");
    }
  };

  // Edit item functions
  const openEditModal = (item) => {
    setEditId(item._id);
    setEditName(item.name);
    setEditLocation(item.location);
    setEditSublocation(item.sublocation || "");
    setEditQuantity(item.quantity);
    setEditLimit(item.limit || "");
    setEditImage(item.image);
    setShowEditModal(true);
    setEditErrors({
      editName: "",
      editLocation: "",
      editSublocation: "",
      editQuantity: ""
    });
  };

  const handleEditSubmit = async () => {
    const formData = {
      name: editName,
      location: editLocation,
      sublocation: editSublocation,
      quantity: editQuantity,
      limit: editLimit,
      image: editImage
    };

    if (!validateForm(formData, true)) {
      showNotification("Please fix the errors in the form", "danger");
      return;
    }

    try {
      await axios.put(`/api/inventory/${editId}`, {
        ...formData,
        quantity: parseInt(editQuantity),
        limit: parseInt(editLimit) || 0
      });
      fetchItems();
      setShowEditModal(false);
      showNotification("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      showNotification("Failed to update item. Please try again.", "danger");
    }
  };

  // Notification component
  const Notification = () => {
    if (!notification.show) return null;
    
    return (
      <div className={`alert alert-${notification.type} alert-dismissible fade show position-fixed top-0 end-0 m-3`} 
           style={{ zIndex: 9999 }}>
        <i className={`bi ${notification.type === 'success' ? 'bi-check-circle' : 
                       notification.type === 'danger' ? 'bi-exclamation-triangle' :
                       notification.type === 'warning' ? 'bi-exclamation-triangle' :
                       'bi-info-circle'} me-2`}></i>
        {notification.message}
        <button type="button" className="btn-close" onClick={() => setNotification({ show: false, message: "", type: "" })}></button>
      </div>
    );
  };

  return (
    <div style={{
      backgroundImage: "url('/images/inventory_background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      padding: "20px",
    }}>
      <Notification />

      <div className="container mt-5" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "10px" }}>
        <h1 className="text-center mb-4">Inventory Management</h1>

        {/* Search Bar */}
        <div className="row mb-4">
          <div className="col-12 col-md-8 mx-auto">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name, location, or sublocation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => setSearchTerm("")}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add Item Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Inventory List</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <i className={`bi ${showAddForm ? "bi-dash" : "bi-plus"}`}></i>{" "}
            {showAddForm ? "Minimize" : "Add Item"}
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Add New Item</h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name && "is-invalid"}`}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors({...errors, name: validateField('name', e.target.value)});
                    }}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.location && "is-invalid"}`}
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setErrors({...errors, location: validateField('location', e.target.value)});
                    }}
                  />
                  {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Sublocation</label>
                  <input
                    type="text"
                    className={`form-control ${errors.sublocation && "is-invalid"}`}
                    value={sublocation}
                    onChange={(e) => {
                      setSublocation(e.target.value);
                      setErrors({...errors, sublocation: validateField('sublocation', e.target.value)});
                    }}
                  />
                  {errors.sublocation && <div className="invalid-feedback">{errors.sublocation}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Quantity*</label>
                  <input
                    type="number"
                    className={`form-control ${errors.quantity && "is-invalid"}`}
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                      setErrors({...errors, quantity: validateField('quantity', e.target.value)});
                    }}
                  />
                  {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Minimum Stock Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="0 = no alerts"
                    min="0"
                  />
                  <small className="text-muted">System will alert when stock reaches this level</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" onClick={addItem}>
                    <i className="bi bi-check-circle me-2"></i>Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory List */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="alert alert-info text-center">
                {searchTerm ? "No items match your search" : "No items found"}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th style={{width: "80px"}}>Image</th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Sublocation</th>
                      <th style={{width: "100px"}}>Quantity</th>
                      <th style={{width: "100px"}}>Limit</th>
                      <th style={{width: "120px"}}>Status</th>
                      <th style={{width: "120px"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item._id} className={item.limit > 0 && item.quantity <= item.limit ? "table-warning" : ""}>
                        <td>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-thumbnail"
                              style={{ width: "60px", height: "60px", objectFit: "cover" }}
                            />
                          ) : (
                            <div className="bg-light d-flex align-items-center justify-content-center" 
                                 style={{ width: "60px", height: "60px" }}>
                              <i className="bi bi-image text-muted"></i>
                            </div>
                          )}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.location}</td>
                        <td>{item.sublocation || "-"}</td>
                        <td>{item.quantity}</td>
                        <td>{item.limit || "-"}</td>
                        <td>
                          {item.limit > 0 && item.quantity <= item.limit ? (
                            <span className="badge bg-danger">Low Stock</span>
                          ) : (
                            <span className="badge bg-success">In Stock</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => openEditModal(item)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteItem(item._id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="text-end mt-4">
          {/* Find Items Nearby Button */}
          <button 
            className="btn btn-warning me-2"
            onClick={findNearbyHardwareStores}
          >
            <i className="bi bi-geo-alt-fill me-2"></i> Find Items Nearby
          </button>
          
          {/* Download Report Button */}
          {filteredItems.length > 0 && (
            <button className="btn btn-success" onClick={generatePDF}>
              <i className="bi bi-download me-2"></i>Download Report
            </button>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Edit Item</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name*</label>
                    <input
                      type="text"
                      className={`form-control ${editErrors.editName && "is-invalid"}`}
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setEditErrors({...editErrors, editName: validateField('editName', e.target.value)});
                      }}
                    />
                    {editErrors.editName && <div className="invalid-feedback">{editErrors.editName}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location*</label>
                    <input
                      type="text"
                      className={`form-control ${editErrors.editLocation && "is-invalid"}`}
                      value={editLocation}
                      onChange={(e) => {
                        setEditLocation(e.target.value);
                        setEditErrors({...editErrors, editLocation: validateField('editLocation', e.target.value)});
                      }}
                    />
                    {editErrors.editLocation && <div className="invalid-feedback">{editErrors.editLocation}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sublocation</label>
                    <input
                      type="text"
                      className={`form-control ${editErrors.editSublocation && "is-invalid"}`}
                      value={editSublocation}
                      onChange={(e) => {
                        setEditSublocation(e.target.value);
                        setEditErrors({...editErrors, editSublocation: validateField('editSublocation', e.target.value)});
                      }}
                    />
                    {editErrors.editSublocation && <div className="invalid-feedback">{editErrors.editSublocation}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity*</label>
                    <input
                      type="number"
                      className={`form-control ${editErrors.editQuantity && "is-invalid"}`}
                      value={editQuantity}
                      onChange={(e) => {
                        setEditQuantity(e.target.value);
                        setEditErrors({...editErrors, editQuantity: validateField('editQuantity', e.target.value)});
                      }}
                    />
                    {editErrors.editQuantity && <div className="invalid-feedback">{editErrors.editQuantity}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Minimum Stock Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editLimit}
                      onChange={(e) => setEditLimit(e.target.value)}
                      placeholder="0 = no alerts"
                      min="0"
                    />
                    <small className="text-muted">System will alert when stock reaches this level</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEditSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
