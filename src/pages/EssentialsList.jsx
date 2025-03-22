import { useEffect, useState } from "react";
import { getEssentials } from "../services/essentialService";
import { Link } from "react-router-dom";

export default function EssentialsList() {
  const [essentials, setEssentials] = useState([]);

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

  return (
    <div className="container mt-4">
      <h2>Household Essentials List</h2>
      <Link to="/add-essential" className="btn btn-primary my-3">Add Essential</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Threshold</th>
          </tr>
        </thead>
        <tbody>
          {essentials.map((essential) => (
            <tr key={essential._id}>
              <td>{essential.name}</td>
              <td>{essential.quantity}</td>
              <td>{essential.threshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
