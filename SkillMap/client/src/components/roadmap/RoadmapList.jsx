import RoadmapItem from "./RoadmapItem";

export default function RoadmapList({ roadmap, completed = [], onToggle, onStart }) {
  return (
    <ol className="relative">
      {roadmap.map((step, i) => (
        <RoadmapItem
          key={`${step.skill}-${i}`}
          step={step}
          index={i}
          isLast={i === roadmap.length - 1}
          done={completed.includes(step.skill)}
          onToggle={() => onToggle?.(step.skill)}
          onStart={onStart ? () => onStart(step) : undefined}
        />
      ))}
    </ol>
  );
}
