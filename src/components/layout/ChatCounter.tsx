import Link from "next/link";
import { MessageSquare } from "lucide-react";

export const ChatCounter = ({ initialCount }: { initialCount: number }) => {
  return (
    <Link
      href="/chats"
      className="hover:bg-muted relative flex size-9 items-center justify-center rounded-full transition-colors"
    >
      <MessageSquare className="text-muted-foreground hover:text-foreground size-5 transition-colors" />
      {initialCount > 0 && (
        <span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
          {initialCount > 99 ? "99+" : initialCount}
        </span>
      )}
    </Link>
  );
};