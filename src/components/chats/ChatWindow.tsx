"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChevronUp, Loader2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { ApplicationStatus } from "@/types/application";

interface ChatWindowProps {
  initialMessages: Message[];
  applicationId: string;
  currentUser: { id: string; name: string; role: "APPLICANT" | "EMPLOYER", avatarUrl: string | null };
  initialStatus: ApplicationStatus;
  onMessagesRead?: () => void;
}

export const ChatWindow = ({ initialMessages, applicationId, currentUser, onMessagesRead, initialStatus }: ChatWindowProps) => {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const processedMessages = useRef(new Set<string>());

  const { messages, sendMessage, isConnected, markAsRead, chatStatus } = useChatSocket({
    user: currentUser,
    applicationId,
    initialMessages,
    initialStatus,
  });

  const isApplicant = currentUser.role === "APPLICANT";
  const isPending = chatStatus === "PENDING";
  const isRejected = chatStatus === "REJECTED";
  const isInputBlocked = (isApplicant && isPending) || isRejected;

  const scrollToBottom = (smooth = true) => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      }, 0);
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (!scrollRef.current) return;

      const observerOptions = {
        root: scrollRef.current,
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries) => {

        const unreadMessageIds = entries
          .filter((entry) => {
            if (!entry.isIntersecting) return false;

            const msgId = entry.target.getAttribute("data-message-id");
            if (!msgId) return false;

            const isOptimistic = msgId.startsWith("temp-");
            const msg = messages.find((m) => m.id === msgId);
            const isMyMessage = msg?.senderId === currentUser.id;
            const alreadyProcessed = processedMessages.current.has(msgId);

            if (alreadyProcessed) return false;

            return !isOptimistic && msg && !isMyMessage && !msg.isRead;
          })
          .map((entry) => entry.target.getAttribute("data-message-id"))
          .filter((id): id is string => id !== null);

        if (unreadMessageIds.length > 0) {
          unreadMessageIds.forEach(id => processedMessages.current.add(id));

          markAsRead(unreadMessageIds);

          if (onMessagesRead) {
            onMessagesRead();
          }
        }
      }, observerOptions);

      const messageElements = scrollRef.current.querySelectorAll("[data-message-id]");
      messageElements.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [messages, currentUser.id, markAsRead, onMessagesRead, isConnected]);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    setShowScrollButton(scrollHeight - (scrollTop + clientHeight) > 300);
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !isConnected) return;

    sendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="bg-background flex h-full flex-col">
      {!isConnected && (
        <div className="animate-pulse border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-600 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
          Connecting to chat...
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative flex-1 space-y-4 overflow-y-auto px-4 py-6"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="bg-muted mb-3 rounded-full p-4">
              <Send className="text-muted-foreground size-6 opacity-30" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="animate-in fade-in my-6 flex justify-center">
                <span className="bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-center text-[10px] font-bold tracking-wider uppercase shadow-sm">
                  {msg.text}
                </span>
              </div>
            );
          }
          const isMe = msg.senderId === currentUser.id;
          const isOptimistic = msg.id.startsWith("temp-");

          return (
            <div
              key={msg.id}
              data-message-id={msg.id}
              className={cn(
                "animate-in fade-in slide-in-from-bottom-2 flex items-end gap-3 duration-300",
                isMe ? "flex-row-reverse" : "flex-row",
                isOptimistic && "opacity-60",
              )}
            >
              <CustomAvatar
                imageUrl={msg.sender?.avatarUrl}
                fallbackText={msg.sender?.name || "Unknown"}
                size="sm"
              />

              <div className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-xs rounded-2xl px-4 py-2 text-sm wrap-break-word shadow-sm lg:max-w-md",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none",
                  )}
                >
                  {msg.text}
                </div>

                <div className="flex items-center gap-2 px-1">
                  <p className="text-muted-foreground text-[11px] font-medium">
                    {formatDate(msg.createdAt)}
                  </p>

                  {isMe && !isOptimistic && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold",
                        msg.isRead ? "text-blue-500" : "text-muted-foreground",
                      )}
                    >
                      {msg.isRead ? "✓✓" : "✓"}
                    </span>
                  )}

                  {isMe && isOptimistic && (
                    <Loader2 className="text-muted-foreground size-3 animate-spin" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showScrollButton && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <button
            onClick={() => scrollToBottom()}
            className={cn(
              "bg-primary text-primary-foreground rounded-full p-2 shadow-lg",
              "hover:bg-primary/90 animate-in fade-in slide-in-from-bottom-2 transition-all",
            )}
            aria-label="Scroll to bottom"
          >
            <ChevronUp className="size-5 rotate-180" />
          </button>
        </div>
      )}

      <div className="bg-card shrink-0 border-t p-4">
        {isRejected ? (
          <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl border px-4 py-3 text-center text-sm font-medium">
            Discussion closed. The recruiter has rejected this application.
          </div>
        ) : isApplicant && isPending ? (
          <div className="bg-muted text-muted-foreground rounded-xl border px-4 py-3 text-center text-sm font-medium">
            You will be able to send messages once the recruiter accepts your application.
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              disabled={!isConnected || isInputBlocked}
              className="bg-muted/50 flex-1 rounded-full border-none focus-visible:ring-1 disabled:opacity-50"
              autoComplete="off"
            />
            <Button
              type="submit"
              size="icon"
              className="shrink-0 rounded-full"
              disabled={!inputText.trim() || !isConnected || isInputBlocked}
            >
              <Send className="size-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};