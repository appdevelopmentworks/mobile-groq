'use client'

import { Message } from '@/lib/chat-store';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex items-start space-x-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
      )}
      <div
        className={cn(
          'px-4 py-3 rounded-lg max-w-md md:max-w-2xl',
          isUser
            ? 'bg-[#fffaf0] text-slate-900 dark:text-slate-900'
            : 'bg-muted text-foreground'
        )}
      >
        <div
          className={cn(
            'prose prose-foreground prose-p:m-0 prose-headings:m-0',
            !isUser && 'dark:prose-invert'
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Customize heading rendering to be smaller
                          h1: ({...props}) => <h2 className="text-xl font-bold" {...props} />,
            h2: ({...props}) => <h3 className="text-lg font-semibold" {...props} />,
            h3: ({...props}) => <h4 className="text-base font-semibold" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
