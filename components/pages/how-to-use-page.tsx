import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HowToUsePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">使い方</h1>
      <Card>
        <CardHeader>
          <CardTitle>1. Groq APIキーを取得する</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            本アプリを使用するには、GroqCloudが提供するAPIキーが必要です。
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                GroqCloudの公式サイト
              </a>
              にアクセスし、アカウントを作成またはログインします。
            </li>
            <li>
              API Keysページで「Create API Key」ボタンをクリックします。
            </li>
            <li>
              作成されたAPIキーをコピーします。このキーは一度しか表示されないため、安全な場所に保管してください。
            </li>
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>2. APIキーを設定する</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            画面下（PCの場合は左側）の「設定」メニューに移動し、取得したAPIキーを所定のフィールドに貼り付けて「保存」ボタンを押してください。
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>3. チャットを開始する</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            「チャット」メニューに戻り、メッセージを入力してAIとの会話を始めましょう。画像ファイルを添付することも可能です。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
