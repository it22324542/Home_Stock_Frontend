import { useEffect, useState } from "react";
import axios from "axios";
//import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(response => setMessage(response.data.message))
      .catch(error => console.error("Error fetching data:", error));
  }, []);


  return (
    <>
      <div>qqqq</div> 
      <button type="button" class="btn btn-primary">Primary</button>
      <h1>{message}</h1>;

    </>
  )
}

export default App