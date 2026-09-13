import StatCard from "../common/StatCard";
import { useLang } from "../../context/LanguageContext";

/**
 * StatsRow — the four gap buckets, shown as KPI tiles.
 */
export default function StatsRow({ matched, improve, missing, blocked, total }) {
  const { tr } = useLang();

  const pct = (n) => (total > 0 ? (n / total) * 100 : 0);

  const cards = [
    { icon: "checkCircle", tone: "sage", label: tr("stat_matched"), count: matched.length },
    { icon: "trending", tone: "amber", label: tr("stat_improve"), count: improve.length },
    { icon: "alert", tone: "rose", label: tr("stat_missing"), count: missing.length },
    { icon: "lock", tone: "lilac", label: tr("stat_blocked"), count: blocked.length },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <StatCard
          key={c.label}
          icon={c.icon}
          tone={c.tone}
          label={c.label}
          value={c.count}
          suffix={`/ ${total}`}
          progress={pct(c.count)}
        />
      ))}
    </div>
  );
}
