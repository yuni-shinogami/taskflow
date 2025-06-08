# E2E Testing Documentation

TaskFlowプロジェクトには、Playwrightを使用した包括的なE2Eテストスイートが含まれています。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Playwrightブラウザのインストール

```bash
# すべてのブラウザをインストール
npx playwright install

# システム依存関係もインストール（sudoが必要）
sudo npx playwright install-deps
```

## テストの実行

### 基本的なコマンド

```bash
# すべてのテストを実行
npm run test:e2e

# UIモードで実行（インタラクティブ）
npm run test:e2e:ui

# デバッグモードで実行
npm run test:e2e:debug

# ブラウザを表示して実行
npm run test:e2e:headed

# テストレポートを表示
npm run test:e2e:report

# 特定のテストスイートを実行
npm run test:suite basic
```

## テストスイート

### 1. 基本テスト (`e2e/basic.spec.ts`)
- ページの表示確認
- タスクの追加
- タスクの完了
- タスクの削除

### 2. 機能テスト (`e2e/taskflow.spec.ts`)
- ヘッダーの表示
- タスク統計カード
- CRUD操作
- フィルタリングとソート
- データの永続化
- 期限切れタスクの表示
- 完了率の更新

### 3. パフォーマンステスト (`e2e/performance.spec.ts`)
- ページロード時間
- 大量データの処理
- スムーズなアニメーション
- 高速な更新処理
- メモリ使用量

### 4. アクセシビリティテスト (`e2e/accessibility.spec.ts`)
- Axeによる自動チェック
- キーボードナビゲーション
- ARIAラベル
- スクリーンリーダー対応
- カラーコントラスト
- フォーカス管理

### 5. 高度なシナリオ (`e2e/advanced-scenarios.spec.ts`)
- 複雑なワークフロー
- バルク操作
- 並行処理
- エッジケース
- データのエクスポート/インポート

### 6. スモークテスト (`e2e/smoke.spec.ts`)
- アプリケーションの起動確認
- 主要セクションの表示
- レスポンシブデザイン

## テストヘルパー

`e2e/helpers/task-helpers.ts` には、テストを簡潔に記述するためのヘルパー関数が含まれています：

- `createTask()` - タスクの作成
- `editTask()` - タスクの編集
- `deleteTask()` - タスクの削除
- `toggleTask()` - タスクの完了/未完了切り替え
- `filterByCategory()` - カテゴリーでフィルタリング
- `sortBy()` - ソート
- `seedTasks()` - テストデータの生成

## CI/CD統合

GitHub Actionsワークフロー（`.github/workflows/e2e-tests.yml`）により、以下のタイミングで自動的にテストが実行されます：

- mainブランチへのプッシュ
- プルリクエストの作成
- developブランチへのプッシュ

テスト結果とスクリーンショットはアーティファクトとして保存されます。

## トラブルシューティング

### ブラウザが見つからないエラー

```bash
# ブラウザを再インストール
npx playwright install --force

# 特定のブラウザのみインストール
npx playwright install chromium
```

### タイムアウトエラー

開発サーバーが起動していることを確認：

```bash
npm run dev
```

### 権限エラー

システム依存関係のインストールにはsudo権限が必要です：

```bash
sudo npx playwright install-deps
```

## ベストプラクティス

1. **テストの独立性**: 各テストは他のテストに依存しないように設計
2. **データのクリーンアップ**: `beforeEach`でlocalStorageをクリア
3. **適切な待機**: 明示的な待機ではなく、Playwrightの自動待機を活用
4. **セレクターの安定性**: role、text、labelベースのセレクターを使用
5. **並列実行**: 可能な限り並列実行でテスト時間を短縮

## 開発時のヒント

1. UIモードを使用してテストをステップごとに確認
2. デバッグモードでブレークポイントを設定
3. `--headed`オプションでブラウザの動作を視覚的に確認
4. トレースファイルで失敗の原因を詳細に分析