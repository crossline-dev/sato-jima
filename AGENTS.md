# AI Agent Rules (AGENTS.md)

本プロジェクト（sato-jima）における AI エージェント共通ルールのハブ。
`GEMINI.md` `CLAUDE.md` はこのファイルへのシンボリックリンク。

## 0. このファイルの役割

- 短い索引として維持する — 詳細は `docs/agent-rules/` に分離
- 仕様衝突時は SSOT 優先順位に従う

## 1. SSOT 優先順位

1. 実装済みコード（実際の挙動）
2. `docs/` 配下の正式ドキュメント
3. `AGENTS.md` / ツール別の補助指示
4. 会話内の一時的な仮定

不整合を見つけたら、実装前にユーザーへ確認すること。

## 2. 技術スタック

| 領域 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) / React 19 |
| EC バックエンド | Shopify Storefront API (GraphQL Codegen) |
| CMS | microCMS |
| スタイリング | Tailwind CSS v4 + CVA + tailwind-merge |
| UI コンポーネント | shadcn/ui (Base UI ベース, `base-vega` スタイル) |
| バリデーション | Valibot（Zod は既存分のみ、新規は Valibot） |
| Lint / Format | Biome (TS/TSX) + Prettier (md/yml 限定) |
| パッケージマネージャ | pnpm |
| Git Hooks | Lefthook |

## 3. 設計原則（要約）

- **Humans steer, agents execute** — 人間が目的と制約を定め、AI が実行する
- **曖昧性の排除** — 推測で進めず、実装前に質問する
- **小さく分割** — レビューしやすい差分に保つ
- **既存パターン優先** — 詳細は `docs/agent-rules/01-principles.md`
- **shadcn/ui 優先** — `src/components/ui/` の既存コンポーネントを活用し、独自実装より優先する
- **単一責務 (SRP)** — 1ファイル・1コンポーネント・1関数に1つの責務
- **DRY** — 同じロジックの重複を避け、共通化・再利用する

## 4. 品質ゲート（最小）

変更後は以下を順に満たす:

1. `pnpm build`
2. `pnpm lint`
3. 必要に応じて `pnpm format`

詳細・プロジェクト固有の DoD → `docs/agent-rules/03-quality-gates.md`

## 5. Git 運用

- **ブランチ戦略**: `main` 直コミット（ソロ開発フェーズ）
  - **ブランチを切る場合**: 実験的変更・大規模リファクタ・途中で捨てる可能性がある作業
- **コミット形式**: Conventional Commits
  - `feat:` / `fix:` / `refactor:` / `docs:` / `chore:` / `security:` / `perf:`
  - スコープ任意: `feat(cart):`, `fix(shopify):`
  - 日本語 OK（subject は簡潔に）
- **コミット粒度**: 1 コミット = 1 つの論理的変更。混在させない
- **doc 同時更新**: 仕様に関わる変更では、関連ドキュメントを同一コミットに含める

## 6. 詳細ルール

| ファイル | 内容 |
|---------|------|
| `docs/agent-rules/README.md` | 全体像と運用 |
| `docs/agent-rules/01-principles.md` | 原則と既存パターン一覧 |
| `docs/agent-rules/02-workflow.md` | Constrain / Inform / Verify / Correct |
| `docs/agent-rules/03-quality-gates.md` | DoD と検証 |
| `docs/agent-rules/04-doc-governance.md` | ドキュメント統治 |
| `docs/agent-rules/05-takt-workflow.md` | TAKT 自律エージェント運用 |
| `docs/business/domain-spec.md` | ビジネスドメイン仕様（ブランド・機能要件・マイルストーン） |
| `docs/business/migration-checklist.md` | sato-triplets → sato-jima 移行チェックリスト |
| `docs/adr/README.md` | Architecture Decision Records（設計判断の記録） |
