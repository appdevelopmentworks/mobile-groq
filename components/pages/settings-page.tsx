'use client'

import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SettingsPage() {
  const { apiKey, setApiKey, model, setModel } = useSettingsStore();
  const [localApiKey, setLocalApiKey] = useState('');
  const [localModel, setLocalModel] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // The component is mounted, so we can safely access localStorage (via the store)
    setIsMounted(true);
    setLocalApiKey(apiKey);
    setLocalModel(model);
  }, [apiKey, model]);

  const handleSave = () => {
    setApiKey(localApiKey);
    setModel(localModel);
    alert('設定を保存しました。');
  };

  const maskedApiKey = apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}` : '未設定';

  if (!isMounted) {
    // Avoid rendering the form on the server to prevent hydration mismatch
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">設定</h1>
      <Card>
        <CardHeader>
          <CardTitle>Groq APIキー</CardTitle>
          <CardDescription>
            ご自身のGroq APIキーを設定してください。APIキーはサーバーに送信されず、お使いのブラウザにのみ保存されます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>現在のAPIキー</Label>
            <p className="text-sm font-mono p-2 bg-muted rounded-md">{maskedApiKey}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key">新しいAPIキー</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="gsk_..."
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>モデル選択</CardTitle>
          <CardDescription>
            使用するAIモデルを選択してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>現在のモデル</Label>
            <p className="text-sm font-mono p-2 bg-muted rounded-md">{model}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model-select">モデル</Label>
            <Select value={localModel} onValueChange={setLocalModel}>
              <SelectTrigger id="model-select" className="w-[280px]">
                <SelectValue placeholder="モデルを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai/gpt-oss-120b">openai/gpt-oss-120b (テキストのみ)</SelectItem>
                <SelectItem value="meta-llama/llama-4-maverick-17b-128e-instruct">meta-llama/llama-4-maverick-17b-128e-instruct (画像対応)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSave}>設定を保存</Button>
    </div>
  );
}
