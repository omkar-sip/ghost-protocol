import { SectionProps } from '@/types/theme';

export default function TickerTape({ settings, id }: SectionProps) {
  const items = settings.items || [];
  const tickerContent = items.map((item: any, i: number) => (
    <span key={i}>
      {item.text} <span className="ticker-dot">◆</span>{' '}
    </span>
  ));

  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-inner">
        <span className="ticker-seg">{tickerContent}</span>
        <span className="ticker-seg">{tickerContent}</span>
      </div>
    </div>
  );
}
