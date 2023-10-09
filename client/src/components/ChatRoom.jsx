import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import EmojiInput from "react-input-emoji";
import "bootstrap-icons/font/bootstrap-icons.css";
import { format } from "timeago.js";
import { io } from "socket.io-client";

// Other imports as needed

const ChatRoom = () => {
  const [inputValue, setInputValue] = useState("");
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [data, setData] = useState({});
  const msgBoxRef = useRef(null);
  useEffect(() => {
    const socket = io.connect("http://localhost:5000/");
    setSocket(socket);
    socket.on("connect", () => {
      // console.log(socket.id);
      socket.emit("joinRoom", location.state.room);
    });
  }, []);
  useEffect(() => {
    setData(location.state);
  }, [location]);
  useEffect(() => {
   // Retrieve messages from local storage when the component mounts
   const storedMessages = localStorage.getItem("chatMessages");
   if (storedMessages) {
     setMessages(JSON.parse(storedMessages));
   }

   if (socket) {
     socket.on("getNewMessage", (newMessage) => {
       const updatedMessages = [...messages, newMessage];
       setMessages(updatedMessages);

       // Store the updated messages in local storage
       localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

       msgBoxRef.current?.scrollIntoView({ behavior: "smooth" });
       setInputValue("");
     });
   }
  }, [socket, messages]);
  const handleKeyDown = (e) => {
    e.keyCode === 13 ? handleSubmit() : "";
  };
  const handleSubmit = () => {
    if (inputValue) {
      const newMessage = { time: new Date(), inputValue, name: data.name };
      socket.emit("newMessage", { newMessage, room: data.room });
    }
  };

  return (
    <>
      <div className="py-4 m-5 w-50 shadow bg-white text-dark border rounded container">
        <div className="text-center px-3 mb-4 text-capitalize">
          <h1 className="text-warning mb-4">{data?.room} Chat Room</h1>
        </div>
        <div
          className="bg-light border rounded p-3 mb-4"
          style={{ height: "450px", overflow: "scroll" }}
        >
          {messages.map((msg, index) => {
            return data.name === msg.name ? (
              <div className="row justify-content-end pl-5" key={index}>
                <div className="d-flex flex-column align-items-end m-2 shadow p-2 bg-info border rounded w-auto">
                  <div>
                    <strong className="m-1">{msg.name}</strong>
                    <small className="text-muted">{format(msg.time)}</small>
                  </div>
                  <h4 className="m-1">{msg.inputValue}</h4>
                </div>
              </div>
            ) : (
              <div className="row justify-content-start" key={index}>
                <div className="d-flex flex-column m-2 p-2 shadow bg-white border rounded w-auto">
                  <div>
                    <strong className="m-1">{msg.name}</strong>
                    <small className="text-muted m-1">{format(msg.time)}</small>
                  </div>
                  <h4 className="m-1">{msg.inputValue}</h4>
                </div>
              </div>
            );
        })}
        <div ref={msgBoxRef}></div>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <EmojiInput
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            onKeyDown={handleKeyDown}
            cleanOnEnter
            placeholder="Type your message..."
          />
          <button className="btn btn-warning ml-2" onClick={handleSubmit}>
            <i className="bi bi-send"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
