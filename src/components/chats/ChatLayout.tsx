"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { User } from "@/types/users";
import { ChatRoom, Message } from "@/types/chat";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { MessageSquare, ChevronLeft, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getChatMessages } from "@/lib/server-api";
import { cn, formatChatTime } from "@/lib/utils";
import { toast } from "sonner";
import { ChatWindow } from "@/components/chats/ChatWindow";
import { revalidate } from "@/actions/chat";
import { useDebounce } from "@/hooks/use-debounce";

type ChatLayoutProps = {
  initialChats: ChatRoom[];
  currentUser: User;
}

export const ChatLayout = ({ initialChats, currentUser }: ChatLayoutProps) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [readTrigger, setReadTrigger] = useState(0);
  const debouncedReadTrigger = useDebounce(readTrigger, 800);

  useEffect(() => {
    if (debouncedReadTrigger > 0) {
      void revalidate(["/", "/chats"]);
    }
  }, [debouncedReadTrigger]);

  const getChatInfo = useCallback(
    (chat: ChatRoom) => {
      const isApplicant = currentUser.role === "APPLICANT";

      if (isApplicant) {
        return {
          name: chat.vacancy.company.name,
          avatar: chat.vacancy.company.logoUrl,
          subtitle: chat.vacancy.title,
          status: chat.status,
        };
      } else {
        return {
          name: chat.applicant.name,
          avatar: chat.applicant.avatarUrl,
          subtitle: chat.vacancy.title,
          status: chat.status,
        };
      }
    },
    [currentUser.role],
  );

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return initialChats;
    const query = searchQuery.toLowerCase();
    return initialChats.filter((chat) => {
      const info = getChatInfo(chat);
      return info.name.toLowerCase().includes(query) || info.subtitle.toLowerCase().includes(query);
    });
  }, [initialChats, searchQuery, getChatInfo]);

  const activeChat = initialChats.find((c) => c.id === activeChatId) || null;

  const handleOpenChat = async (chatId: string) => {
    setActiveChatId(chatId);
    setIsLoadingMessages(true);

    try {
      const messages = await getChatMessages(chatId);
      setChatMessages(messages || []);
    } catch {
      toast.error("Failed to load chat");
      setChatMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleCloseChat = () => {
    setActiveChatId(null);
    setChatMessages([]);
  };

  return (
    <div className="flex h-full overflow-hidden bg-card border-border border shadow-sm rounded-lg md:rounded-none">
      <div
        className={cn(
          "flex-col border-border border-r md:flex md:w-96 transition-all duration-300",
          activeChatId ? "hidden" : "flex w-full",
        )}
      >
        <div className="border-border border-b p-5 shrink-0">
          <h2 className="text-foreground text-2xl font-black tracking-tight mb-4">
            Messages
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full bg-muted border-none focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto p-3">
          {filteredChats.length === 0 && (
            <div className="text-muted-foreground p-8 text-center text-sm font-medium">
              {initialChats.length === 0
                ? "No conversations yet"
                : "No chats match your search"}
            </div>
          )}

          {filteredChats.map((chat) => {
            const info = getChatInfo(chat);
            const lastMessage = chat.messages?.[0];
            const unreadCount = chat._count?.messages || 0;

            return (
              <button
                key={chat.id}
                onClick={() => handleOpenChat(chat.id)}
                className={cn(
                  "hover:bg-muted/70 focus:ring-1 focus:ring-primary flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 group cursor-pointer",
                  activeChatId === chat.id ? "bg-muted shadow-sm" : "",
                )}
              >
                <CustomAvatar
                  imageUrl={info.avatar}
                  fallbackText={info.name}
                  size="md"
                  className="border shadow-sm shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <h3 className="text-foreground truncate text-sm font-bold">
                      {info.name}
                    </h3>
                    {lastMessage && (
                      <span
                        className="text-muted-foreground text-[10px] font-medium tracking-wider whitespace-nowrap uppercase shrink-0">
                        {formatChatTime(new Date(lastMessage.createdAt))}
                      </span>
                    )}
                  </div>

                  <p className="text-primary/80 mb-2 truncate text-xs font-semibold">
                    {info.subtitle}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-muted-foreground truncate text-xs leading-relaxed">
                      {lastMessage ? lastMessage.text : "No messages yet"}
                    </p>
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="flex size-5 shrink-0 items-center justify-center p-0 text-[10px] font-bold"
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          "bg-background relative flex-1 flex-col",
          !activeChatId ? "hidden md:flex" : "flex",
        )}
      >
        {activeChat ? (
          <div className="flex h-full flex-col">
            <div
              className="bg-card border-border z-10 flex items-center justify-between gap-4 border-b p-4 shadow-sm shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={handleCloseChat}
                  className="text-muted-foreground hover:text-foreground md:hidden transition-colors"
                  aria-label="Back to chats"
                >
                  <ChevronLeft className="size-6" />
                </button>

                <CustomAvatar
                  imageUrl={getChatInfo(activeChat).avatar}
                  fallbackText={getChatInfo(activeChat).name}
                  size="sm"
                />

                <div className="min-w-0">
                  <h3 className="text-foreground truncate text-sm font-bold leading-tight">
                    {getChatInfo(activeChat).name}
                  </h3>
                  <p className="text-muted-foreground truncate text-xs font-medium">
                    {getChatInfo(activeChat).subtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
              {isLoadingMessages ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <Loader2 className="size-8 animate-spin text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Loading messages...</p>
                </div>
              ) : (
                <ChatWindow
                  key={activeChat.id}
                  applicationId={activeChat.id}
                  currentUser={currentUser}
                  initialMessages={chatMessages}
                  onMessagesRead={() => setReadTrigger((prev) => prev + 1)}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
            <div className="bg-muted mb-4 rounded-full p-6 shadow-inner">
              <MessageSquare className="size-12 opacity-25" />
            </div>
            <p className="text-lg font-bold">Your Messages</p>
            <p className="text-sm text-center max-w-xs">
              Select a conversation from the sidebar to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};