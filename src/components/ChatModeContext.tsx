import { useState, createContext } from "react";

export type ChatModeContextType = {
  chatMode: boolean;
  setChatMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatModeContext = createContext<ChatModeContextType | undefined>(
  undefined
);

export const ChatModeContextProvider = (props: React.PropsWithChildren) => {
  const [chatMode, setChatMode] = useState(false);

  return (
    <ChatModeContext.Provider value={{ chatMode, setChatMode }}>
      {props.children}
    </ChatModeContext.Provider>
  );
};
