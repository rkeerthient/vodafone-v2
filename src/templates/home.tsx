import "../index.css";
import {
  GetHeadConfig,
  GetPath,
  HeadConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import {
  SearchHeadlessProvider,
  provideHeadless,
  HeadlessConfig,
  useSearchActions,
} from "@yext/search-headless-react";
import { SearchBar, onSearchFunc } from "@yext/search-ui-react";
import SearchResultsSection from "../components/SearchResultsSection";
import {
  ChatHeadlessProvider,
  HeadlessConfig as ChatHeadlessConfig,
  useChatActions,
  useChatState,
} from "@yext/chat-headless-react";
import AiAnswer from "../components/AiAnswer";
import { ChatModeContextProvider } from "../components/ChatModeContext";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../utils/cn";
import { ChatInput } from "@yext/chat-ui-react";
import { BsSend } from "react-icons/bs";
import { useChatModeContext } from "../hooks";
import { Button } from "../components/Button";
import Header from "../components/header";
import Footer from "../components/footer";

const chatConfig: ChatHeadlessConfig = {
  apiKey: "1066fedb238935bc1d4724ad12c19d72",
  botId: "vodafone-italy",
  saveToSessionStorage: false,
};

export const getPath: GetPath<TemplateProps> = () => {
  return `index.html`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Search & Chat",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const config: HeadlessConfig = {
  apiKey: "ed819551b24f313c9ecb7cf4e279d05c",
  experienceKey: "search",
  locale: "it",
};
const searcher = provideHeadless(config);
const universalLimits = {
  help_articles: 8,
  products: 8,
  locations: 8,
};
function Inner() {
  const searchActions = useSearchActions();
  const chatActions = useChatActions();
  const [hasSearched, setHasSearched] = useState(false);
  const { chatMode, setChatMode } = useChatModeContext();
  const messages = useChatState((s) => s.conversation.messages);

  const handleSearch: onSearchFunc = (searchEventData) => {
    setHasSearched(true);
    const { query } = searchEventData;
    searchActions.setUniversalLimit(universalLimits);
    searchActions.executeUniversalQuery();
    chatActions.restartConversation();
    chatActions.getNextMessage(query);
    const queryParams = new URLSearchParams(window.location.search);

    if (query) {
      queryParams.set("query", query);
    } else {
      queryParams.delete("query");
    }
    history.pushState(null, "", "?" + queryParams.toString());
  };

  return (
    <div className="mx-auto my-4 h-screen max-w-5xl items-center gap-10 overflow-scroll px-6 py-10">
      <SearchBar onSearch={handleSearch} placeholder="Ask a question..." />
      <section className={cn("flex flex-col gap-10", !hasSearched && "hidden")}>
        <AiAnswer />
        <SearchResultsSection />
        <AnimatePresence>
          {chatMode && (
            <motion.div
              className="fixed bottom-0 left-0 flex w-full items-center justify-center gap-4 border-t bg-white px-4 py-8 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Button
                onClick={() => {
                  chatActions.setMessages(messages.slice(0, 2));
                  setChatMode(false);
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }}
              >
                Reset
              </Button>
              <ChatInput
                sendButtonIcon={<BsSend className="text-gray-900" />}
                customCssClasses={{
                  container: " w-full lg:w-1/2 resize-none",
                  sendButton: "right-2 top-5",
                }}
                inputAutoFocus={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

export default function Home({ document }: TemplateProps) {
  return (
    <>
      <SearchHeadlessProvider searcher={searcher}>
        <ChatHeadlessProvider config={chatConfig}>
          <ChatModeContextProvider>
            <Header />
            <AnimatePresence>
              <Inner />
            </AnimatePresence>
            <Footer />
          </ChatModeContextProvider>
        </ChatHeadlessProvider>
      </SearchHeadlessProvider>
    </>
  );
}
