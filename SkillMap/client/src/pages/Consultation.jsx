import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import PageHeader from "../components/common/PageHeader";

import { useLang } from "../context/LanguageContext";
import { useProfile } from "../context/ProfileContext";

const TEAM = [
  {
    id: "maria-smith",
    name: "Maria Smith",
    role: "Frontend Developer",
    company: "Ex-Razorpay",
    expertise: ["React", "CSS", "TypeScript"],
    rating: 4.9,
    sessions: 128,
    tone: "brand",
    image: "https://images.pexels.com/photos/3769161/pexels-photo-3769161.jpeg",
  },
  {
    id: "darren-randolph",
    name: "Darren Randolph",
    role: "Product & Growth",
    company: "Ex-Zoho",
    expertise: ["Product Strategy", "Analytics", "Roadmapping"],
    rating: 4.8,
    sessions: 96,
    tone: "peach",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&fit=crop&crop=faces",
  },
  {
    id: "ayat-black",
    name: "Ayat Black",
    role: "Design Engineer",
    company: "Ex-Swiggy",
    expertise: ["UI/UX", "Wireframing", "Design Systems"],
    rating: 5.0,
    sessions: 74,
    tone: "lilac",
    image:
      "https://images.istockphoto.com/id/1416048929/photo/woman-working-on-laptop-online-checking-emails-and-planning-on-the-internet-while-sitting-in.jpg?s=1024x1024&w=is&k=20&c=rsMEfrDiYh3Y2CbJ8OQYRfJZ2kOGBneREKETBn0vyjU=",
  },
];

const SLOTS = ["10:00", "13:30", "17:00", "20:30"];

const TONE_CHIP = {
  brand: "bg-brand-soft text-brand",
  peach: "bg-peach-soft text-peach",
  lilac: "bg-lilac-soft text-lilac",
};

function MentorCard({ mentor, booked, onBook }) {
  const { tr } = useLang();
  const [slot, setSlot] = useState(null);

  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-[20px] overflow-hidden border border-line shrink-0 bg-canvas-deep">
          <img
            src={mentor.image}
            alt={mentor.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[1.05rem] font-bold leading-tight">{mentor.name}</h3>
          <p className="text-[0.82rem] text-ink-soft">{mentor.role}</p>
          <p className="text-[0.74rem] text-ink-faint mt-0.5">{mentor.company}</p>
        </div>

        <span className={`grid place-items-center w-9 h-9 rounded-xl shrink-0 ${TONE_CHIP[mentor.tone]}`}>
          <Icon name="users" size={17} />
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-[0.76rem] font-bold text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="star" size={13} className="text-amber" />
          {mentor.rating}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="mic" size={13} />
          {mentor.sessions} {tr("cs_sessions")}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
        {mentor.expertise.map((e) => (
          <Badge key={e} tone="neutral" size="sm">
            {e}
          </Badge>
        ))}
      </div>

      <div className="mb-4">
        <div className="sm-eyebrow mb-2">{tr("cs_slots")}</div>
        <div className="flex flex-wrap gap-1.5">
          {SLOTS.map((s) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              aria-pressed={slot === s}
              className={`px-3 py-1.5 rounded-xl border text-[0.75rem] font-bold transition-all ${
                slot === s
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-surface-muted text-ink-soft hover:border-brand/40 hover:text-brand"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Button
        full
        size="sm"
        variant={booked ? "sage" : "primary"}
        icon={booked ? "checkCircle" : "mic"}
        disabled={!slot || booked}
        onClick={() => onBook(mentor, slot)}
      >
        {booked ? tr("cs_booked") : slot ? tr("cs_book_at", { time: slot }) : tr("cs_pick_slot")}
      </Button>
    </Card>
  );
}

export default function Consultation() {
  const navigate = useNavigate();
  const { tr, trSkill } = useLang();
  const { topGap } = useProfile();

  const [booked, setBooked] = useState(null);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={tr("cs_eyebrow")}
        title={tr("cs_title")}
        subtitle={tr("cs_sub")}
        actions={
          <Button variant="secondary" icon="route" onClick={() => navigate("/roadmap")}>
            {tr("rm_back_roadmap")}
          </Button>
        }
      />

      {topGap && (
        <Card className="relative overflow-hidden flex flex-wrap items-center gap-4 justify-between">
          <span className="absolute inset-y-0 left-0 w-1 bg-brand" />
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="grid place-items-center w-11 h-11 rounded-[16px] bg-brand-soft text-brand shrink-0">
              <Icon name="sparkle" size={21} />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-[0.95rem]">{tr("cs_match_title")}</p>
              <p className="text-[0.84rem] text-ink-soft">
                {tr("cs_match_body", { skill: trSkill(topGap.name) })}
              </p>
            </div>
          </div>
        </Card>
      )}

      {booked && (
        <Card className="border-sage/30 bg-sage-soft/40 flex items-center gap-3.5">
          <span className="grid place-items-center w-10 h-10 rounded-[14px] bg-sage text-white shrink-0">
            <Icon name="checkCircle" size={19} />
          </span>
          <p className="text-[0.9rem] font-bold">
            {tr("cs_confirm", { name: booked.name, time: booked.slot })}
          </p>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {TEAM.map((m) => (
          <MentorCard
            key={m.id}
            mentor={m}
            booked={booked?.id === m.id}
            onBook={(mentor, slot) => setBooked({ ...mentor, slot })}
          />
        ))}
      </div>

      <Card>
        <CardHeader
          icon="briefcase"
          tone="sage"
          title={tr("cs_next_title")}
          subtitle={tr("cs_next_sub")}
          action={
            <Button size="sm" variant="secondary" iconRight="arrowRight" onClick={() => navigate("/simulation")}>
              {tr("rm_sim")}
            </Button>
          }
        />
      </Card>
    </div>
  );
}
