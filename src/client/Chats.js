import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Loading from "./components/loading.js";
import Error from "./components/error.js";

const GET_CHATS = gql`
  {
    chats {
      id
      users {
        id
        avatar
        username
      }
      lastMessage {
        text
      }
    }
  }
`;

const GET_CHAT = gql`
  query chat($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        avatar
        username
      }
      messages {
        id
        text
        user {
          id
        }
      }
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
      user {
        id
      }
    }
  }
`;

export default function Chats() {
  const { loading, error, data } = useQuery(GET_CHATS);
  const [textInputs, setTextInputs] = useState({});
  const [openChats, setOpenChats] = useState([]);
  const chats = data?.chats || [];

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;
  if (!chats.length)
    return <p className="text-center mt-8">There are no chats. Let's start!</p>;

  const shorten = (text) =>
    text.length > 22 ? text.slice(0, 22) + "..." : text;
  const usernamesToString = (users) =>
    users
      .slice(1)
      .map((u) => u.username)
      .join(", ");

  const openChat = (id) => {
    setOpenChats((prev) => {
      if (prev.includes(id)) return prev;
      let updated = [...prev];
      if (updated.length >= 3) updated = updated.slice(1);
      updated.push(id);
      return updated;
    });
    setTextInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const closeChat = (id) => {
    setOpenChats((prev) => prev.filter((cid) => cid !== id));
    setTextInputs((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const onChangeChatInput = (e, id) => {
    setTextInputs((prev) => ({ ...prev, [id]: e.target.value }));
  };

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {chats.map((chat) => (
        <div
          key={"chat" + chat.id}
          className="bg-white shadow-md rounded-lg p-4 w-64 cursor-pointer hover:bg-gray-50 transition"
          onClick={() => openChat(chat.id)}
        >
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full"
              alt="avatar"
              src={
                chat.users.length > 2 ? "/avatar.png" : chat.users[1]?.avatar
              }
            />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">
                {shorten(usernamesToString(chat.users))}
              </span>
              <span className="text-sm text-gray-500">
                {chat.lastMessage && shorten(chat.lastMessage.text)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {openChats.map((chatId) => (
        <ChatWindow
          key={"chatWindow" + chatId}
          chatId={chatId}
          closeChat={closeChat}
          inputValue={textInputs[chatId] || ""}
          onChangeInput={onChangeChatInput}
        />
      ))}
    </div>
  );
}

function ChatWindow({ chatId, closeChat, inputValue, onChangeInput }) {
  const { loading, error, data } = useQuery(GET_CHAT, {
    variables: { chatId },
  });

  const [addMessage] = useMutation(ADD_MESSAGE, {
    update(cache, { data: { addMessage } }) {
      const existing = cache.readQuery({
        query: GET_CHAT,
        variables: { chatId },
      });
      cache.writeQuery({
        query: GET_CHAT,
        variables: { chatId },
        data: {
          chat: {
            ...existing.chat,
            messages: [...existing.chat.messages, addMessage],
          },
        },
      });
    },
  });

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      addMessage({ variables: { message: { text: inputValue, chatId } } });
      onChangeInput({ target: { value: "" } }, chatId);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;
  const chat = data?.chat || {};
  if (!chat) return <p>No chat to display.</p>;

  return (
    <div className="w-80 bg-white shadow-xl rounded-lg flex flex-col">
      <div className="flex justify-between items-center bg-red-600 text-white px-4 py-2 rounded-t-lg">
        <span className="font-semibold">{chat.users[1].username}</span>
        <button
          onClick={() => closeChat(chatId)}
          className="hover:text-gray-300"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-100 h-64">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              message.user.id > 1
                ? "bg-red-500 text-white ml-auto"
                : "bg-white border text-gray-800"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="p-2 border-t bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onChangeInput(e, chat.id)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </div>
  );
}
