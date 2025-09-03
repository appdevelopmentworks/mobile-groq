'use client'

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/chat-store';
import { useSettingsStore } from '@/lib/store';
import { ChatMessage } from '@/components/chat-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, LoaderCircle } from 'lucide-react';
import Groq from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';

export function ChatPage() {
  const { messages, addMessage, appendToLastMessage, clearMessages } = useChatStore();
  const { apiKey, model } = useSettingsStore(); // Destructure model here
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (!apiKey) {
      alert('APIキーが設定されていません。設定ページでAPIキーを設定してください。');
      return;
    }

    const userMessage = { id: uuidv4(), role: 'user' as const, content: inputValue };
    addMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const messagesForApi: Groq.Chat.Completions.ChatCompletionMessageParam[] = [...messages, userMessage].map(({ role, content }) => ({ role, content }));

      const stream = await groq.chat.completions.create({
        messages: messagesForApi,
        model: model, // Use the selected model
        stream: true,
      });

      const assistantMessage = { id: uuidv4(), role: 'assistant' as const, content: '' };
      addMessage(assistantMessage);

      for await (const chunk of stream) {
        const contentChunk = chunk.choices[0]?.delta?.content || '';
        appendToLastMessage(contentChunk);
      }
    } catch (error) {
      console.error('Error calling Groq API:', error);
      const errorMessage = { id: uuidv4(), role: 'assistant' as const, content: 'エラーが発生しました。' };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">チャット</h1>
        <Button variant="outline" size="sm" onClick={() => {
          if (confirm('本当に会話履歴を消去しますか？')) {
            clearMessages();
          }
        }}>
          履歴を消去
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex items-start space-x-4 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                </div>
             </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" type="button" disabled>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            autoComplete="off"
            name="message"
            placeholder="メッセージを送信..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
