type Props = {
  title: string;
  total?: string;
  // 合計値だけでは何の値か分からないときに前へ付ける短いラベル
  totalLabel?: string;
  className?: string;
  children: React.ReactNode;
};

// 見出し・合計値・グラフだけを持つ器
export const Panel = ({ title, total, totalLabel, className, children }: Props) => (
  <section className={`aw-panel ${className ?? ""}`}>
    <header className="aw-panel__head">
      <h2 className="aw-panel__title">{title}</h2>
      {total && (
        <span className="aw-panel__total">
          {totalLabel && (
            <span className="aw-caption" style={{ marginRight: 8 }}>
              {totalLabel}
            </span>
          )}
          {total}
        </span>
      )}
    </header>
    {children}
  </section>
);
