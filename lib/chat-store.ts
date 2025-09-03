import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  appendToLastMessage: (contentChunk: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      appendToLastMessage: (contentChunk) =>
        set((state) => {
          if (state.messages.length === 0 || state.messages[state.messages.length - 1].role !== 'assistant') {
            return state;
          }
          const lastMessage = state.messages[state.messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + contentChunk,
          };
          return {
            messages: [...state.messages.slice(0, -1), updatedMessage],
          };
        }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'groq-chat-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
