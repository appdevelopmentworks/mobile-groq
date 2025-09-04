'use client'

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/chat-store';
import { useSettingsStore } from '@/lib/store';
import { ChatMessage } from '@/components/chat-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, LoaderCircle, X } from 'lucide-react';
import Groq from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';

export function ChatPage() {
  const { messages, addMessage, appendToLastMessage, clearMessages } = useChatStore();
  const { apiKey, model } = useSettingsStore(); // Destructure model here
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 現在のメッセージに添付ファイルが含まれるか
  const [hasAttachment, setHasAttachment] = useState(false);
  // 画像添付（Maverick用: image_urlで送る）
  const [imageAttachment, setImageAttachment] = useState<{
    name: string;
    dataUrl: string;
  } | null>(null);
  // 自動スクロール用の末尾アンカー
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // ファイル入力のrefを追加

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click(); // 非表示のファイル入力をクリック
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHasAttachment(true);

    // 画像は data URL として保持し、送信時に image_url としてAPIに渡す
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = String(event.target?.result || '');
        setImageAttachment({ name: file.name, dataUrl });
        // 入力欄には注記のみ追加（実データはAPIへ別途添付）
        setInputValue((prev) => `${prev}\n[画像を添付: ${file.name}]`);
        e.target.value = '';
      };
      reader.readAsDataURL(file);
      return;
    }

    // テキストは従来通りプレーンテキストとして取り込み
    if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setInputValue((prev) =>
          `${prev}\n\n--- 添付ファイル: ${file.name} ---\n~~~\n${fileContent}\n~~~`
        );
        e.target.value = '';
      };
      reader.readAsText(file);
      return;
    }

    // その他のファイルタイプは簡易注記のみ（モデル切替は行う）
    setInputValue((prev) => `${prev}\n[添付: ${file.name}]`);
    e.target.value = '';
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!
      inputValue.trim() && !imageAttachment
    ) || isLoading) return;

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

      const baseMessages: Groq.Chat.Completions.ChatCompletionMessageParam[] = messages.map(({ role, content }) => ({ role, content }));

      // 直近のユーザーメッセージを構築（画像があれば content parts 形式）
      const currentUserForApi: Groq.Chat.Completions.ChatCompletionMessageParam = imageAttachment
        ? {
            role: 'user',
            content: [
              { type: 'text', text: userMessage.content },
              { type: 'image_url', image_url: { url: imageAttachment.dataUrl, detail: 'auto' } },
            ],
          }
        : { role: 'user', content: userMessage.content };

      const messagesForApi = [...baseMessages, currentUserForApi];

      // 添付がある場合は指定モデルへ自動切替、なければ現状の選択を使用
      const selectedModel = hasAttachment
        ? 'meta-llama/llama-4-maverick-17b-128e-instruct'
        : model;

      const stream = await groq.chat.completions.create({
        messages: messagesForApi,
        model: selectedModel,
        stream: true,
      });

      const assistantMessage = { id: uuidv4(), role: 'assistant' as const, content: '' };
      addMessage(assistantMessage);

      for await (const chunk of stream) {
        const contentChunk = chunk.choices[0]?.delta?.content || '';
        if (contentChunk) {
          appendToLastMessage(contentChunk);
          // UIへ反映する時間を与える（逐次描画を促す）
          await new Promise<void>((resolve) => {
            if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
              window.requestAnimationFrame(() => resolve());
            } else {
              setTimeout(resolve, 0);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error calling Groq API:', error);
      const errorMessage = { id: uuidv4(), role: 'assistant' as const, content: 'エラーが発生しました。' };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
      // 送信処理が完了したらフラグをリセット
      setHasAttachment(false);
      setImageAttachment(null);
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
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
             <div className="flex items-start space-x-4 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                </div>
             </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" type="button" onClick={handleFileButtonClick}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {imageAttachment && (
            <div className="flex items-center space-x-2 text-xs px-2 py-1 rounded bg-muted">
              <span>画像: {imageAttachment.name}</span>
              <button
                type="button"
                onClick={() => {
                  setImageAttachment(null);
                  setHasAttachment(false);
                }}
                aria-label="添付を削除"
                className="hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
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
