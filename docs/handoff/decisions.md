# decisions.md（GeoSignal MVP）

## 2025-12-29: UIはPages、API/収集はWorkersのハイブリッドで進める

- **Decision**: Cloudflare Pages（UI SPA） + Cloudflare Workers（API/Jobs） + CLI手動実行をデフォ
- **Why**:
  - 価値の初期立ち上げは「読む体験（UI）」が最重要
  - "ヒアリング→MVPを見せる"運用の練度を早期に上げる
  - Workers単体より、UI改善サイクルが速い

## 2025-12-29: Cronは実装してもデフォOFF

- **Decision**: Cron triggerは実装可能だが、初期はOFF（手動実行が主）
- **Why**:
  - コスト/暴発リスクを最小化
  - 監査性（いつ/誰が回したか）を担保しやすい

## 2025-12-29: LLM_MODEはデフォOFF、on_demandのみ

- **Decision**:
  - LLM_MODE=off をデフォ
  - on_demand時のみ GPT-4o mini を使用（文章整形のみ）
- **Constraints**:
  - 新しい事実・根拠URLの追加は禁止
  - 推測ラベル必須（INFERENCE）
- **Why**:
  - 監査性を壊さない
  - 課金ゼロ運用をデフォにする

## 2025-12-29: 情報源は「生きているRSS/公式発表」を優先

- **Decision**: 公式RSSやPress Releaseを軸にする（State Dept / EU Council / UN 等）
- **Note**: OFACはRSSを退役しているため、OFACをRSS前提にしない

## 2025-12-29: スコア上昇理由はDB差分で説明

- **Decision**: score_componentsをJSONで保存し、前日との差分をwhy_upとして生成
- **Why**:
  - 監査性（なぜ上がったかを後から追跡可能）
  - 説明可能性（UIで"寄与シグナル"を表示）

## 2025-12-29: 根拠リンクはDB保存分のみ

- **Decision**: signal_evidenceテーブルに保存されたURLのみを使用
- **Constraints**:
  - LLMが新しいURLを生成することを禁止
  - 必ずraw_items経由でDBに入ったURLを参照
- **Why**:
  - 幻覚URLの防止
  - 監査証跡の確保
