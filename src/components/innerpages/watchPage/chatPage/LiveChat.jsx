// import React, { useEffect, useState } from "react";
// import ChatMessage from "./ChatMessage";
// import { useDispatch, useSelector } from "react-redux";
// import { addMessage } from "../../../../store/slices/chatSlice";
// import {
//   generateRandomMessage,
//   generateRandomName,
// } from "../../../../utils/helper";
// import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

// const LiveChat = () => {
//   const [liveMessage, setLiveMessage] = useState("");

//   const dispatch = useDispatch();

//   const chatMessages = useSelector((store) => store.chat.messages);

//   useEffect(() => {
//     const i = setInterval(() => {
//       dispatch(
//         addMessage({
//           name: generateRandomName(),
//           message: generateRandomMessage(),
//         })
//       );
//     }, 1000);

//     return () => clearInterval(i);
//   }, [dispatch]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (liveMessage.trim() === "") return;
//     dispatch(
//       addMessage({
//         name: "You",
//         message: liveMessage,
//       })
//     );
//     setLiveMessage("");
//   };

//   return (
//     <>
//       {/* <div className="w-full ml-2 p-2 border border-black h-[600px] bg-slate-50 rounded-md overflow-y-scroll flex flex-col-reverse">
//         <div>
//           {chatMessages.map((c, i) => (
//             <ChatMessage key={i} name={c.name} message={c.message} />
//           ))}
//         </div>
//       </div> */}

//       <form
//         className="w-full p-2 ml-2 border border-black flex flex-row"
//         onSubmit={handleSubmit}
//       >
//         <input
//           className="w-100 py-1"
//           type="text"
//           value={liveMessage}
//           onChange={(e) => setLiveMessage(e.target.value)}
//         />
//         <button className="px-2 py-2 bg-slate-300 ml-2 rounded-md cursor-pointer">
//           <PaperAirplaneIcon className="h-4 w-4" />
//         </button>
//       </form>
//     </>
//   );
// };

// export default LiveChat;
