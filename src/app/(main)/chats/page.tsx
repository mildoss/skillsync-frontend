import { getMe, getMyChats } from "@/lib/server-api";
import { redirect } from "next/navigation";
import { ChatLayout } from "@/components/chats/ChatLayout";

export default async function ChatsPage() {
  const user = await getMe();
  if (!user) redirect("/login");

  const chats = await getMyChats();

  return (
    <div className="mx-auto h-[calc(100vh-65px)] w-full">
      <ChatLayout initialChats={chats} currentUser={user} />
    </div>
  );
}
