import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainForm = () => {
  const [data, setData] = useState({ name: "", room: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    // console.log(e.target.value, e.target.name);
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const validation = () => {
    if (!data.name) {
      setError("Pls Enter Name");
      return false;
    }
    if (!data.room) {
      setError("Pls Enter room");
      return false;
    }
    if (!data.name && !data.room) {
      setError("Pls Enter Name and Select room");
      return false;
    }
    setError("");
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validation();
    if (isValid) {
      navigate(`/chat/${data.room}`,{state:data});
    }
  };
  return (
    <div className="px-3 py-4 shadow bg-white text-dark border rounded row">
      <form action="" onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <h2 className="text-warning mb-4">Welcome to Chatclub</h2>
        </div>
        {error ? (
          <div className="d-flex justify-content-center mb-4">
            <small className="text-danger">{error}</small>
          </div>
        ) : null}

        <div className="form-group mb-4">
          <input
            type="text"
            className="form-control bg-light"
            name="name"
            placeholder="Enter Name"
            onChange={handleChange}
            autoComplete="true"
          />
        </div>
        <div className="form-group mb-4">
          <select
            name="room"
            className="form-select bg-light"
            id=""
            onChange={handleChange}
          >
            <option value="">Select Room</option>
            <option value="gaming">Gaming</option>
            <option value="coding">Coding</option>
            <option value="socialMedia">Social Media</option>
          </select>
        </div>
        <button className="btn btn-warning w-100 mb-2" type="submit">
          Enter
        </button>
      </form>
    </div>
  );
};

export default MainForm;
