import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(response => setMessage(response.data.message))
      .catch(error => console.error("Error fetching data:", error));
  }, []);


  return (
    <>
      <div>Yasas</div>
      <button type="button" class="btn btn-primary">Primary</button>
      <h1>{message}</h1>;

    </>
  )
}

export default App
