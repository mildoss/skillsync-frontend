"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getMyNotificationsAction, markNotificationsAsReadAction } from "@/actions/notifications";
import { Notification } from "@/types/notifications";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const load = async () => {
      const res = await getMyNotificationsAction();
      if (res) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    };

    void load();

    const interval = setInterval(load, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      setUnreadCount(0);

      startTransition(async () => {
        await markNotificationsAsReadAction();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="bg-destructive absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[9px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b p-6">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-muted-foreground p-8 text-center">
              <Bell className="mx-auto mb-3 size-8 opacity-20" />
              <p>You have no notifications yet.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link || "#"}
                  onClick={() => setIsOpen(false)}
                  className={`hover:bg-muted/50 block border-b p-4 transition-colors ${
                    notification.isRead ? "opacity-75" : "bg-primary/5"
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold">{notification.title}</h4>
                    <span className="text-muted-foreground mt-0.5 shrink-0 text-[10px]">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-snug">
                    {notification.message}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
