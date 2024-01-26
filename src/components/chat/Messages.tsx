import { FC } from "react";
import { trpc } from "@/app/_trpc/client";
import Skeleton from "react-loading-skeleton";
import { MessagesProps } from "@/interfaces/components/chat/MessagesProps";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { Loader2, MessagesSquare } from "lucide-react";
import Message from "./Message";

const Messages: FC<MessagesProps> = ({ fileId }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    // eslint-disable-next-line no-constant-condition
    ...(true ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex max-h-[calc(100vh-10.5rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto border border-zinc-200 p-3">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, idx) => {
          const isNextMessageSamePerson =
            combinedMessages[idx - 1]?.isUserMessage ===
            combinedMessages[idx]?.isUserMessage;

          if (idx === combinedMessages.length - 1) {
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          } else {
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          }
        })
      ) : isLoading ? (
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MessagesSquare className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
          <p className="text-zinc-500">
            Ask your first question to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
