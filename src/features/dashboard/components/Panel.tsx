type Props = {
  title: string;
  total?: string;
  className?: string;
  children: React.ReactNode;
};

// 見出し・合計値・グラフだけを持つ器
export const Panel = ({ title, total, className, children }: Props) => (
  <section className={`aw-panel ${className ?? ""}`}>
    <header className="aw-panel__head">
      <h2 className="aw-panel__title">{title}</h2>
      {total && <span className="aw-panel__total">{total}</span>}
    </header>
    {children}
  </section>
);
