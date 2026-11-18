import { motion, useReducedMotion } from "framer-motion";
import type { TokenStatus } from "../../types/queue";

// ─── Seat positions in the isometric room (% of container) ───────────────────
export const SEATS: { x: number; y: number; label: string }[] = [
  { x: 12, y: 60, label: "Sofa left A" },
  { x: 22, y: 65, label: "Sofa left B" },
  { x: 42, y: 55, label: "Centre seat A" },
  { x: 52, y: 60, label: "Centre seat B" },
  { x: 62, y: 55, label: "Centre seat C" },
  { x: 30, y: 72, label: "Chair front A" },
  { x: 48, y: 72, label: "Chair front B" },
  { x: 66, y: 70, label: "Chair front C" },
  { x: 76, y: 60, label: "Sofa right A" },
  { x: 85, y: 65, label: "Sofa right B" },
];

// ─── Character colours ────────────────────────────────────────────────────────
const CHAR_COLORS = [
  "#D8B9A5", // peach
  "#A8B9C5", // dust
  "#B9C9B0", // sage
  "#E6B34D", // mustard
  "#8B6F5C", // brown
  "#777C68", // olive
  "#c0c8b8", // sage light
  "#d4c5b0", // warm tan
];

export type CharacterActivity = "sitting" | "reading" | "phone" | "relaxing" | "approaching" | "standing" | "serving" | "leaving";

interface CharacterProps {
  seatIndex: number;
  color: string;
  activity: CharacterActivity;
  status: TokenStatus;
  isMyToken: boolean;
  tokenLabel: string;
}

function activityOffset(activity: CharacterActivity): { dy: number } {
  switch (activity) {
    case "standing":
    case "approaching":
    case "leaving":
      return { dy: -6 };
    default:
      return { dy: 0 };
  }
}

function Character({ seatIndex, color, activity, status, isMyToken, tokenLabel }: CharacterProps) {
  const seat = SEATS[seatIndex % SEATS.length];
  const reduce = useReducedMotion();
  const { dy } = activityOffset(activity);

  const bodyY = reduce ? 0 : dy;

  const isActive = status === "CALLED" || status === "APPROACHING" || status === "SERVING";

  // Animation variants
  const bobAnim = reduce
    ? {}
    : activity === "sitting" || activity === "reading" || activity === "relaxing"
    ? {
        y: [0, -2, 0],
        transition: { repeat: Infinity, duration: 3 + (seatIndex % 3), ease: "easeInOut" },
      }
    : activity === "phone"
    ? {
        y: [0, -1, 0],
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
      }
    : {};

  const glowRing = isMyToken ? "drop-shadow(0 0 6px rgba(230,179,77,0.9))" : undefined;

  return (
    <motion.g
      style={{
        transform: `translate(${seat.x}%, ${seat.y}%)`,
        transformBox: "fill-box",
      }}
      animate={{ y: bodyY, ...bobAnim }}
    >
      {/* Shadow ellipse */}
      <ellipse cx={0} cy={12} rx={9} ry={3} fill="rgba(52,58,53,0.12)" />

      {/* Body */}
      <motion.g
        style={{ filter: glowRing }}
        animate={isActive && !reduce ? { scale: [1, 1.04, 1], transition: { repeat: Infinity, duration: 1.5 } } : {}}
      >
        {/* Torso */}
        <rect x={-7} y={-4} width={14} height={12} rx={4} fill={color} />
        {/* Head */}
        <circle cx={0} cy={-10} r={7} fill={color} />
        {/* Eyes */}
        <circle cx={-2.5} cy={-10.5} r={1.2} fill="#343A35" />
        <circle cx={2.5} cy={-10.5} r={1.2} fill="#343A35" />
        {/* Activity prop */}
        {activity === "reading" && (
          <rect x={-6} y={6} width={12} height={8} rx={2} fill="#fff" stroke={color} strokeWidth={0.5} />
        )}
        {activity === "phone" && (
          <rect x={-3} y={2} width={6} height={9} rx={1.5} fill="#A8B9C5" />
        )}
        {/* Called indicator */}
        {(status === "CALLED" || status === "APPROACHING") && !reduce && (
          <motion.text
            x={8}
            y={-16}
            fontSize={9}
            fill="#E6B34D"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            ★
          </motion.text>
        )}
        {/* My token badge */}
        {isMyToken && (
          <g>
            <rect x={-14} y={-26} width={28} height={12} rx={6} fill="#343A35" />
            <text x={0} y={-17} textAnchor="middle" fontSize={6.5} fill="#E9E7D8" fontFamily="Outfit, sans-serif">
              {tokenLabel}
            </text>
          </g>
        )}
      </motion.g>
    </motion.g>
  );
}

// ─── Room background SVG ──────────────────────────────────────────────────────
function RoomBackground() {
  return (
    <>
      {/* Floor */}
      <rect x={0} y={0} width={800} height={400} fill="#E9E7D8" rx={0} />
      {/* Back wall */}
      <rect x={0} y={0} width={800} height={180} fill="#F5F3EA" />
      {/* Wall border */}
      <rect x={0} y={175} width={800} height={5} fill="#E3DDCF" />

      {/* Windows */}
      <rect x={80} y={20} width={120} height={120} rx={8} fill="#A8C8D8" opacity={0.5} />
      <rect x={80} y={20} width={120} height={120} rx={8} fill="none" stroke="#D8D0C0" strokeWidth={4} />
      <line x1={140} y1={20} x2={140} y2={140} stroke="#D8D0C0" strokeWidth={2} />
      <line x1={80} y1={80} x2={200} y2={80} stroke="#D8D0C0" strokeWidth={2} />
      {/* Sunlight from window */}
      <polygon points="80,140 200,140 260,400 20,400" fill="#E6B34D" opacity={0.07} />

      <rect x={320} y={20} width={120} height={120} rx={8} fill="#A8C8D8" opacity={0.5} />
      <rect x={320} y={20} width={120} height={120} rx={8} fill="none" stroke="#D8D0C0" strokeWidth={4} />
      <line x1={380} y1={20} x2={380} y2={140} stroke="#D8D0C0" strokeWidth={2} />
      <line x1={320} y1={80} x2={440} y2={80} stroke="#D8D0C0" strokeWidth={2} />

      <rect x={570} y={20} width={120} height={120} rx={8} fill="#A8C8D8" opacity={0.5} />
      <rect x={570} y={20} width={120} height={120} rx={8} fill="none" stroke="#D8D0C0" strokeWidth={4} />
      <line x1={630} y1={20} x2={630} y2={140} stroke="#D8D0C0" strokeWidth={2} />
      <line x1={570} y1={80} x2={690} y2={80} stroke="#D8D0C0" strokeWidth={2} />

      {/* Clock on wall */}
      <circle cx={750} cy={70} r={28} fill="#fff" stroke="#D8D0C0" strokeWidth={3} />
      <line x1={750} y1={48} x2={750} y2={70} stroke="#343A35" strokeWidth={2} strokeLinecap="round" />
      <line x1={750} y1={70} x2={765} y2={70} stroke="#343A35" strokeWidth={2} strokeLinecap="round" />

      {/* Service counter (right back) */}
      <rect x={650} y={160} width={150} height={50} rx={4} fill="#8B6F5C" />
      <rect x={650} y={145} width={150} height={18} rx={3} fill="#A08070" />
      {/* Queue display board on counter */}
      <rect x={690} y={128} width={70} height={35} rx={4} fill="#343A35" />
      <text x={725} y={148} textAnchor="middle" fontSize={12} fill="#E6B34D" fontFamily="Outfit, sans-serif" fontWeight="600">
        NOW
      </text>
      <text x={725} y={160} textAnchor="middle" fontSize={9} fill="#E9E7D8" fontFamily="Outfit, sans-serif">
        SERVING
      </text>

      {/* Left sofa */}
      <rect x={30} y={280} width={130} height={70} rx={12} fill="#E6B34D" />
      <rect x={30} y={260} width={130} height={25} rx={8} fill="#D4A23C" />
      <rect x={28} y={260} width={18} height={70} rx={8} fill="#D4A23C" />
      <rect x={144} y={260} width={18} height={70} rx={8} fill="#D4A23C" />

      {/* Centre sofa */}
      <rect x={280} y={260} width={190} height={70} rx={12} fill="#E6B34D" />
      <rect x={280} y={240} width={190} height={25} rx={8} fill="#D4A23C" />
      <rect x={278} y={240} width={18} height={70} rx={8} fill="#D4A23C" />
      <rect x={454} y={240} width={18} height={70} rx={8} fill="#D4A23C" />

      {/* Right sofa */}
      <rect x={590} y={280} width={130} height={70} rx={12} fill="#E6B34D" />
      <rect x={590} y={260} width={130} height={25} rx={8} fill="#D4A23C" />
      <rect x={588} y={260} width={18} height={70} rx={8} fill="#D4A23C" />
      <rect x={704} y={260} width={18} height={70} rx={8} fill="#D4A23C" />

      {/* Centre coffee table */}
      <ellipse cx={400} cy={360} rx={70} ry={25} fill="#8B6F5C" />
      <ellipse cx={400} cy={356} rx={70} ry={22} fill="#A08070" />

      {/* Individual chairs */}
      <rect x={175} y={345} width={55} height={50} rx={8} fill="#B9C9B0" />
      <rect x={175} y={332} width={55} height={18} rx={6} fill="#A8B9A0" />
      <rect x={385} y={355} width={55} height={50} rx={8} fill="#B9C9B0" />
      <rect x={385} y={342} width={55} height={18} rx={6} fill="#A8B9A0" />
      <rect x={520} y={345} width={55} height={50} rx={8} fill="#B9C9B0" />
      <rect x={520} y={332} width={55} height={18} rx={6} fill="#A8B9A0" />

      {/* Plants */}
      {/* Left plant */}
      <rect x={25} y={170} width={12} height={25} rx={3} fill="#8B6F5C" />
      <ellipse cx={31} cy={162} rx={22} ry={18} fill="#4F5D49" />
      <ellipse cx={22} cy={170} rx={15} ry={12} fill="#B9C9B0" />
      <ellipse cx={42} cy={168} rx={14} ry={11} fill="#4F5D49" />
      {/* Right plant */}
      <rect x={760} y={170} width={12} height={25} rx={3} fill="#8B6F5C" />
      <ellipse cx={766} cy={162} rx={22} ry={18} fill="#4F5D49" />
      <ellipse cx={757} cy={170} rx={15} ry={12} fill="#B9C9B0" />
      <ellipse cx={777} cy={168} rx={14} ry={11} fill="#4F5D49" />
      {/* Centre plant */}
      <rect x={400} y={190} width={10} height={20} rx={3} fill="#8B6F5C" />
      <ellipse cx={405} cy={183} rx={18} ry={15} fill="#B9C9B0" />

      {/* Receptionist silhouette at counter */}
      <circle cx={730} cy={152} r={10} fill="#D8B9A5" />
      <rect x={722} y={160} width={16} height={18} rx={5} fill="#A8B9C5" />
    </>
  );
}

// ─── Main waiting room ────────────────────────────────────────────────────────
interface WaitingRoomProps {
  occupants: Array<{
    id: string;
    tokenLabel: string;
    status: TokenStatus;
    isMyToken: boolean;
    colorIndex: number;
  }>;
  currentToken?: string;
}

export function WaitingRoom({ occupants, currentToken }: WaitingRoomProps) {
  const reduce = useReducedMotion();

  function getActivity(status: TokenStatus, colorIndex: number): CharacterActivity {
    if (status === "CALLED" || status === "APPROACHING") return "approaching";
    if (status === "SERVING") return "serving";
    // Deterministic activity from colorIndex
    const activities: CharacterActivity[] = ["sitting", "reading", "phone", "relaxing", "sitting", "reading"];
    return activities[colorIndex % activities.length];
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
      <svg
        viewBox="0 0 800 420"
        className="w-full"
        aria-label="Animated waiting room with seated characters"
        role="img"
      >
        <RoomBackground />

        {/* Characters */}
        {occupants.map((occ, idx) => (
          <Character
            key={occ.id}
            seatIndex={idx}
            color={CHAR_COLORS[occ.colorIndex % CHAR_COLORS.length]}
            activity={getActivity(occ.status, occ.colorIndex)}
            status={occ.status}
            isMyToken={occ.isMyToken}
            tokenLabel={occ.tokenLabel}
          />
        ))}

        {/* Queue display text */}
        {currentToken && (
          <>
            <text x={725} y={148} textAnchor="middle" fontSize={12} fill="#E6B34D" fontFamily="Outfit, sans-serif" fontWeight="600">
              NOW
            </text>
            <text x={725} y={158} textAnchor="middle" fontSize={8} fill="#E9E7D8" fontFamily="Outfit, sans-serif">
              {currentToken}
            </text>
          </>
        )}

        {/* Subtle ambient particles (floating dust) */}
        {!reduce && [120, 250, 400, 560, 700].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={200 + i * 15}
            r={2}
            fill="#E6B34D"
            opacity={0.3}
            animate={{ y: [-8, 8, -8], opacity: [0.1, 0.4, 0.1] }}
            transition={{ repeat: Infinity, duration: 4 + i, delay: i * 0.7 }}
          />
        ))}
      </svg>
    </div>
  );
}
