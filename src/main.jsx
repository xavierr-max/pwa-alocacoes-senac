import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  TableProperties,
  AlertTriangle,
  DoorOpen,
  UsersRound,
  GraduationCap,
  UserRound,
  CalendarDays,
  Bell,
  Search,
  ChevronRight,
  Clock3,
  X,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  ChevronDown,
  Columns3,
  BookOpen,
  MapPin,
  ChevronLeft,
  Eye,
} from "lucide-react";
import "./styles.css";
import { initialClasses as spreadsheetClasses } from "./data/turmas.js";

const initialClasses = [
  {
    id: 1,
    code: "2026.11.426",
    course: "Aplicação de Inteligência Artificial para Negócios",
    teacher: "A CONTRATAR",
    room: null,
    start: "10/10/2026",
    end: "31/10/2026",
    days: "Sáb",
    time: "08:00 – 12:00",
    students: 27,
    segment: "Tecnologia",
    local: "CEP Alecrim",
    sig: "Em elaboração",
    priority: "Crítica",
    link: "A contratar",
    semester: "2026.2",
    che: "40h",
    offer: "PSG",
    pedagogue: "Elisia",
    note: "Instrutor em processo de contratação.",
    agenda: true,
  },
  {
    id: 2,
    code: "2026.11.183",
    course: "Programação em C#",
    teacher: "Carlos Silva",
    room: null,
    start: "15/09/2026",
    end: "20/11/2026",
    days: "Ter · Qui",
    time: "08:00 – 12:00",
    students: 20,
    segment: "T.I.",
    local: "CEP Alecrim",
    sig: "Em processo",
    priority: "Alta",
    link: "Horista",
    semester: "2026.2",
    che: "160h",
    offer: "PSG",
    pedagogue: "Elisia",
    note: "",
    agenda: true,
  },
  {
    id: 3,
    code: "2026.11.312",
    course: "Banco de Dados",
    teacher: "Ana Souza",
    room: null,
    start: "28/09/2026",
    end: "15/12/2026",
    days: "Seg · Qua",
    time: "18:30 – 21:30",
    students: 18,
    segment: "T.I.",
    local: "CEP Alecrim",
    sig: "Liberado para matrícula",
    priority: "Normal",
    link: "Mensalista",
    semester: "2026.2",
    che: "120h",
    offer: "PSG",
    pedagogue: "Mariana",
    note: "",
    agenda: true,
  },
  {
    id: 4,
    code: "2026.11.445",
    course: "Programador Full Stack",
    teacher: "Valtemir",
    room: "Sala 107",
    start: "14/09/2026",
    end: "23/12/2026",
    days: "Seg · Qua · Sex",
    time: "08:00 – 12:00",
    students: 12,
    segment: "T.I.",
    local: "CEP Alecrim",
    sig: "EDITAL PSG",
    priority: "",
    link: "Mensalista",
    semester: "2026.2",
    che: "240h",
    offer: "PSG",
    pedagogue: "Elisia",
    note: "Aulas práticas no laboratório.",
    agenda: true,
  },
  {
    id: 5,
    code: "2026.11.247",
    course: "Desenvolvimento Web",
    teacher: "Carlos Silva",
    room: "Sala 222",
    start: "01/09/2026",
    end: "20/11/2026",
    days: "Seg · Qua",
    time: "13:00 – 17:00",
    students: 24,
    segment: "T.I.",
    local: "CEP Alecrim",
    sig: "Em processo",
    priority: "",
    link: "Horista",
    semester: "2026.2",
    che: "160h",
    offer: "PSG",
    pedagogue: "Elisia",
    note: "",
    agenda: true,
  },
  {
    id: 6,
    code: "2026.11.591",
    course: "Informática Básica",
    teacher: "Juliana Santos",
    room: "EXTERNA",
    start: "02/10/2026",
    end: "15/12/2026",
    days: "Ter · Qui",
    time: "13:30 – 17:30",
    students: 16,
    segment: "Gestão",
    local: "Unidade móvel",
    sig: "Liberado para matrícula",
    priority: "",
    link: "Mensalista",
    semester: "2026.2",
    che: "80h",
    offer: "PCG",
    pedagogue: "Mariana",
    note: "Turma em parceiro externo.",
    agenda: true,
  },
];
const roomOptions = [
  {
    name: "Sala 222",
    capacity: 30,
    type: "Sala convencional",
    local: "CEP Alecrim",
  },
  {
    name: "Sala 107",
    capacity: 25,
    type: "Sala convencional",
    local: "CEP Alecrim",
  },
  {
    name: "Laboratório 201",
    capacity: 20,
    type: "Laboratório",
    local: "CEP Alecrim",
  },
  {
    name: "Sala 104",
    capacity: 35,
    type: "Sala convencional",
    local: "CEP Alecrim",
  },
];
for (const roomName of [
  ...new Set(
    spreadsheetClasses
      .map((item) => item.room)
      .filter((room) => /^Sala \d+$/.test(room)),
  ),
]) {
  if (!roomOptions.some((room) => room.name === roomName)) {
    const assigned = spreadsheetClasses.filter(
      (item) => item.room === roomName,
    );
    roomOptions.push({
      name: roomName,
      capacity: Math.max(30, ...assigned.map((item) => item.students || 0)),
      type: "Sala convencional",
      local: "CEP ALECRIM",
    });
  }
}
const dayAliases = {
  Seg: "SEG",
  Ter: "TER",
  Qua: "QUA",
  Qui: "QUI",
  Sex: "SEX",
  Sáb: "SÁB",
};
const dateValue = (value) => {
  if (!value) return null;
  if (value.includes("-")) return new Date(`${value}T00:00:00`);
  const [d, m, y] = value.split("/");
  return new Date(`${y}-${m}-${d}T00:00:00`);
};
const isoToBr = (value) => (value ? value.split("-").reverse().join("/") : "");
const timeRange = (value) => {
  const matches = (value || "").match(/\d{1,2}(?::\d{2}|h)/g) || [];
  if (matches.length < 2) return null;
  const toMinutes = (x) => {
    const [h, m] = x.replace("h", ":00").split(":").map(Number);
    return h * 60 + m;
  };
  return [toMinutes(matches[0]), toMinutes(matches[1])];
};
const timeRanges = (value) => {
  const matches = (value || "").match(/\d{1,2}(?::\d{2}|h)/g) || [];
  const toMinutes = (x) => {
    const [h, m] = x.replace("h", ":00").split(":").map(Number);
    return h * 60 + m;
  };
  const ranges = [];
  for (let index = 0; index + 1 < matches.length; index += 2)
    ranges.push([toMinutes(matches[index]), toMinutes(matches[index + 1])]);
  return ranges;
};
const timeLabels = (value) => {
  const matches = (value || "").match(/\d{1,2}(?::\d{2}|h)/g) || [];
  const normalize = (time) => time.replace("h", ":00").padStart(5, "0");
  const labels = [];
  for (let index = 0; index + 1 < matches.length; index += 2)
    labels.push(
      `${normalize(matches[index])} – ${normalize(matches[index + 1])}`,
    );
  return labels;
};
const timeSummary = (value) => {
  const labels = timeLabels(value);
  return labels.length > 1
    ? `${labels.length} horários`
    : labels[0] || "Horário não informado";
};
const classDays = (value) =>
  Object.entries(dayAliases)
    .filter(([label]) => (value || "").includes(label))
    .map(([, key]) => key);
const datesOverlap = (a, b) =>
  dateValue(a.start) <= dateValue(b.end) &&
  dateValue(b.start) <= dateValue(a.end);
const schedulesOverlap = (a, b) => {
  if (!a.agenda || !b.agenda || !datesOverlap(a, b)) return false;
  const shared = classDays(a.days).some((day) =>
    classDays(b.days).includes(day),
  );
  const aRanges = timeRanges(a.time),
    bRanges = timeRanges(b.time);
  return (
    shared &&
    aRanges.some((ar) => bRanges.some((br) => ar[0] < br[1] && br[0] < ar[1]))
  );
};
function analyzeRooms(target, classes) {
  const teacherConflicts =
    target.teacher !== "A CONTRATAR"
      ? classes.filter(
          (item) =>
            item.id !== target.id &&
            item.teacher.trim().toLowerCase() ===
              target.teacher.trim().toLowerCase() &&
            schedulesOverlap(target, item),
        )
      : [];
  return roomOptions.map((room) => {
    const occupants = classes.filter(
      (t) => t.id !== target.id && t.room === room.name,
    );
    const conflicts = occupants.filter((t) => schedulesOverlap(target, t));
    const capacityOk = !target.students || room.capacity >= target.students;
    const localOk =
      (target.local || "").trim().toUpperCase() ===
      (room.local || "").trim().toUpperCase();
    const issues = [];
    conflicts.forEach((item) =>
      issues.push({
        type: "room",
        title: "Conflito de sala",
        text: `${room.name} já está ocupada por ${item.course}.`,
        item,
      }),
    );
    teacherConflicts.forEach((item) =>
      issues.push({
        type: "teacher",
        title: "Conflito de professor",
        text: `${target.teacher} já ministra ${item.course}.`,
        item,
      }),
    );
    if (!capacityOk)
      issues.push({
        type: "capacity",
        title: "Capacidade insuficiente",
        text: `Necessário: ${target.students} alunos · Sala: ${room.capacity} lugares`,
      });
    if (!localOk)
      issues.push({
        type: "location",
        title: "Unidade incompatível",
        text: `A turma pertence a ${target.local || "outra unidade"}.`,
      });
    if (!target.agenda)
      issues.push({
        type: "agenda",
        title: "Agenda incompatível",
        text: "Defina dias, período e horário antes de alocar.",
      });
    const ok = issues.length === 0;
    const incompatible = issues.some((issue) =>
      ["capacity", "location", "agenda"].includes(issue.type),
    );
    return {
      ...room,
      ok,
      conflict: conflicts.length > 0 || teacherConflicts.length > 0,
      roomAvailable: conflicts.length === 0,
      teacherAvailable: teacherConflicts.length === 0,
      capacityOk,
      localOk,
      issues,
      category: ok ? "available" : incompatible ? "incompatible" : "conflict",
      disabled: !ok,
      state: ok
        ? "Disponível"
        : incompatible
          ? "Incompatível"
          : "Com conflitos",
      detail: ok
        ? "Sala e professor disponíveis durante todo o período."
        : `${issues.length} impedimento(s) encontrado(s).`,
      occupants,
      conflicts,
      teacherConflicts,
    };
  });
}
function roomUsage(room, classes) {
  const referenceDate = new Date("2026-09-08T00:00:00");
  const occupants = classes.filter(
    (t) =>
      t.room === room.name &&
      dateValue(t.start) <= referenceDate &&
      dateValue(t.end) >= referenceDate,
  );
  const hours = occupants.reduce((sum, t) => {
    const range = timeRange(t.time);
    return sum + (range ? (range[1] - range[0]) / 60 : 0);
  }, 0);
  return {
    ...room,
    occupants,
    state:
      occupants.length === 0
        ? "Disponível"
        : hours >= 12
          ? "Totalmente ocupada"
          : "Parcialmente ocupada",
  };
}
const courseData = [
  ...new Map(
    spreadsheetClasses.map((item) => [
      item.course,
      [
        item.course,
        item.che ? `${item.che}h` : "Carga horária não informada",
        item.segment || "Sem segmento",
      ],
    ]),
  ).values(),
];
const teacherData = [
  ...new Map(
    spreadsheetClasses.map((item) => [
      item.teacher,
      [
        item.teacher,
        item.segment || "Área não informada",
        item.link || "Vínculo não informado",
      ],
    ]),
  ).values(),
];
const Badge = ({ children, kind = "" }) => (
  <span
    className={`badge ${kind} ${String(children).toLowerCase().replaceAll(" ", "-")}`}
  >
    {children}
  </span>
);
function TimeDisplay({ value, expanded = false }) {
  const labels = timeLabels(value);
  if (labels.length <= 1)
    return <span className="time-single">{labels[0] || "Não informado"}</span>;
  return expanded ? (
    <span className="time-list">
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </span>
  ) : (
    <span className="time-summary" title={labels.join(" · ")}>
      <Clock3 size={13} />
      {labels.length} horários
    </span>
  );
}
const needsRoom = (item) =>
  !item.room &&
  !["encerrada", "cancelada"].includes((item.sig || "").trim().toLowerCase());

function Sidebar({ page, navigate, pending }) {
  const items = [
    ["dashboard", "Visão geral", LayoutDashboard],
    ["pending", "Turmas aguardando sala", AlertTriangle],
    ["rooms", "Salas", DoorOpen],
    ["classes", "Turmas", UsersRound],
    ["courses", "Cursos", GraduationCap],
    ["teachers", "Professores", UserRound],
    ["calendar", "Calendário", CalendarDays],
    ["week", "Grade semanal", TableProperties],
    ["map", "Mapa de Turmas", TableProperties],
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        senac<i>●</i>
      </div>
      <div className="org">
        <span className="org-mark">S</span>
        <div>
          <strong>Senac Centro</strong>
          <small>Unidade educacional</small>
        </div>
        <ChevronRight size={16} />
      </div>
      <nav>
        {items.map(([id, label, Icon]) => (
          <button
            key={id}
            className={
              page === id || (id === "teachers" && page === "teacher-details")
                ? "active"
                : ""
            }
            onClick={() => navigate(id)}
            aria-current={
              page === id || (id === "teachers" && page === "teacher-details")
                ? "page"
                : undefined
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {id === "pending" && pending > 0 && <b>{pending}</b>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button onClick={() => alert("Central de ajuda: suporte@senac.br")}>
          <Clock3 size={18} />
          Central de ajuda
        </button>
        <div className="profile">
          <div className="avatar">MR</div>
          <div>
            <strong>Mariana Rocha</strong>
            <small>Coordenadora</small>
          </div>
          <MoreHorizontal size={18} />
        </div>
      </div>
    </aside>
  );
}
function Header({ title, subtitle, navigate }) {
  return (
    <header>
      <div>
        <div className="breadcrumb">
          Senac Centro <ChevronRight size={14} />
          {title}
        </div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="header-actions">
        <button
          className="icon-btn"
          onClick={() => navigate("pending")}
          aria-label="Ver notificações"
        >
          <Bell size={20} />
          <em />
        </button>
        <button className="new-btn" onClick={() => navigate("new")}>
          <Plus size={18} />
          Nova turma
        </button>
      </div>
    </header>
  );
}
function SearchBox({ value, onChange, placeholder = "Buscar" }) {
  return (
    <div className="global-search">
      <Search size={18} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Dashboard({ classes, navigate, findRoom }) {
  const pending = classes.filter(needsRoom);
  return (
    <>
      <Header
        title="Visão geral"
        subtitle="Acompanhe a situação das turmas e salas da sua unidade."
        navigate={navigate}
        notifications={() => navigate("pending")}
      />
      <div className="metrics">
        <article className="metric major">
          <div className="metric-icon">
            <AlertTriangle />
          </div>
          <span>Turmas aguardando sala</span>
          <strong>{pending.length}</strong>
          <p>
            {pending.filter((t) => t.priority !== "Normal").length} começam nos
            próximos dias
          </p>
          <button onClick={() => navigate("pending")}>
            Ver turmas pendentes <ChevronRight size={15} />
          </button>
        </article>
        <article className="metric">
          <div className="metric-icon">
            <CheckCircle2 />
          </div>
          <span>Turmas prontas para iniciar</span>
          <strong>{classes.filter((t) => t.room).length}</strong>
          <p>Sem pendências de alocação</p>
          <button onClick={() => navigate("classes")}>
            Ver turmas <ChevronRight size={15} />
          </button>
        </article>
        <article className="metric">
          <div className="metric-icon">
            <DoorOpen />
          </div>
          <span>Salas disponíveis hoje</span>
          <strong>
            {
              roomOptions
                .map((room) => roomUsage(room, classes))
                .filter((room) => room.state === "Disponível").length
            }
          </strong>
          <p>Em diferentes horários</p>
          <button onClick={() => navigate("rooms")}>
            Ver disponibilidade <ChevronRight size={15} />
          </button>
        </article>
      </div>
      <section className="section-head">
        <div>
          <h2>Turmas que precisam de atenção</h2>
          <p>Prioridade operacional por proximidade do início.</p>
        </div>
        <button className="text-btn" onClick={() => navigate("pending")}>
          Ver todas <ChevronRight size={16} />
        </button>
      </section>
      <div className="attention-list">
        {pending.map((t) => (
          <article className="attention" key={t.id}>
            <div className={`priority-icon ${t.priority.toLowerCase()}`}>
              <AlertTriangle size={18} />
            </div>
            <div className="attention-main">
              <div>
                <Badge kind="priority">{t.priority}</Badge>
                <h3>{t.course}</h3>
              </div>
              <p>
                {t.code} · {t.teacher} · {t.start} ·{" "}
                <TimeDisplay value={t.time} />
              </p>
            </div>
            <span className="missing">
              <AlertTriangle size={15} />
              Sala não definida
            </span>
            <button className="outline" onClick={() => findRoom(t)}>
              Encontrar sala
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function Pending({ classes, navigate, findRoom }) {
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("Todas");
  const rows = classes
    .filter(needsRoom)
    .filter(
      (t) =>
        !q ||
        `${t.code} ${t.course} ${t.teacher}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    )
    .filter((t) => priority === "Todas" || t.priority === priority);
  return (
    <>
      <Header
        title="Turmas aguardando sala"
        subtitle="Resolva as pendências para que as turmas possam iniciar."
        navigate={navigate}
        notifications={() => {}}
      />
      <div className="pending-top">
        <strong>
          <AlertTriangle size={18} />
          {rows.length} turmas aguardando alocação
        </strong>
        <span>Ordenação: maior urgência primeiro</span>
      </div>
      <div className="filters">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Buscar turma, código ou instrutor"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Todas</option>
          <option>Crítica</option>
          <option>Alta</option>
          <option>Normal</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Prioridade</th>
              <th>Código / turma</th>
              <th>Professor</th>
              <th>Período</th>
              <th>Agenda</th>
              <th>Alunos</th>
              <th>Sala</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td>
                  <Badge kind="priority">{t.priority}</Badge>
                </td>
                <td>
                  <strong>{t.course}</strong>
                  <small>
                    {t.code} · {t.local}
                  </small>
                </td>
                <td>{t.teacher}</td>
                <td>
                  {t.start} – {t.end}
                </td>
                <td>
                  <strong>{t.days}</strong>
                  <small>
                    <TimeDisplay value={t.time} />
                  </small>
                </td>
                <td>{t.students}</td>
                <td>
                  <span className="missing">
                    <AlertTriangle size={15} />
                    {t.agenda ? "Sala pendente" : "Agenda pendente"}
                  </span>
                </td>
                <td>
                  <button className="primary" onClick={() => findRoom(t)}>
                    {t.agenda ? "Encontrar sala" : "Definir agenda"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <Empty
            title="Todas as turmas estão alocadas"
            text="Não existem pendências para os filtros selecionados."
            action={() => navigate("classes")}
          />
        )}
      </div>
    </>
  );
}

function RoomAvailabilityCard({ room, openAgenda }) {
  const [open, setOpen] = useState(false);
  const free = room.state === "Disponível";
  const full = room.state === "Totalmente ocupada";
  const nextFree = free
    ? "Disponível agora"
    : full
      ? "Sem janela livre hoje"
      : "12:00 – 18:00";
  return (
    <article className={`room-card room-compact ${free ? "recommended" : ""}`}>
      <div className="room-head">
        <div className={`state-icon ${free ? "ok" : full ? "no" : "warn"}`}>
          {free ? <CheckCircle2 /> : <AlertTriangle />}
        </div>
        <div>
          <button
            className="room-title-button"
            onClick={() => openAgenda(room.name)}
          >
            <h3>{room.name}</h3>
          </button>
          <p>{room.type}</p>
        </div>
      </div>
      <div className="room-kpis">
        <span>
          Capacidade<strong>{room.capacity} pessoas</strong>
        </span>
        <span>
          Ocupação<strong>{room.occupants.length} turma(s)</strong>
        </span>
      </div>
      <Badge kind={free ? "allocation" : full ? "danger" : "pending"}>
        {free
          ? "✓ Disponível"
          : full
            ? "✕ Totalmente ocupada"
            : "⚠ Parcialmente ocupada"}
      </Badge>
      <div className="next-free">
        <small>Próximo horário livre</small>
        <strong>{nextFree}</strong>
      </div>
      {open && (
        <div className="occupied-times">
          <strong>Horários ocupados</strong>
          {room.occupants.length ? (
            room.occupants.map((item) => (
              <div key={item.id}>
                <span>{item.days}</span>
                <TimeDisplay value={item.time} />
              </div>
            ))
          ) : (
            <p>Nenhum horário ocupado.</p>
          )}
        </div>
      )}
      <div className="room-footer">
        <button className="outline" onClick={() => openAgenda(room.name)}>
          Ver agenda
        </button>
        <button className="link-btn" onClick={() => setOpen((v) => !v)}>
          {open ? "Ocultar horários" : "Ver horários"}
          <ChevronDown size={14} className={open ? "rotate" : ""} />
        </button>
      </div>
    </article>
  );
}
function RoomsPage({ navigate, classes, openAgenda }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("Todos os estados");
  const rows = roomOptions
    .map((room) => roomUsage(room, classes))
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .filter((r) => state === "Todos os estados" || r.state === state);
  return (
    <>
      <Header
        title="Disponibilidade de Salas"
        subtitle="Consulte capacidade, ocupação e próximos horários livres."
        navigate={navigate}
      />
      <div className="filters">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Buscar sala ou laboratório"
        />
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option>Todos os estados</option>
          <option>Disponível</option>
          <option>Parcialmente ocupada</option>
          <option>Totalmente ocupada</option>
        </select>
      </div>
      <div className="availability-grid">
        {rows.map((room) => (
          <RoomAvailabilityCard
            key={room.name}
            room={room}
            openAgenda={openAgenda}
          />
        ))}
      </div>
      {rows.length === 0 && (
        <Empty
          title="Nenhuma sala encontrada"
          text="Ajuste os filtros de disponibilidade."
        />
      )}
    </>
  );
}
function ClassesPage({ classes, navigate, findRoom, editClass }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Todos os status");
  const rows = classes
    .filter((t) =>
      `${t.code} ${t.course} ${t.teacher} ${t.room}`
        .toLowerCase()
        .includes(q.toLowerCase()),
    )
    .filter(
      (t) =>
        status === "Todos os status" ||
        (status === "Agendada" ? Boolean(t.room) : !t.room),
    );
  return (
    <>
      <Header
        title="Turmas"
        subtitle="Gerencie todas as turmas cadastradas e seus estados de alocação."
        navigate={navigate}
      />
      <div className="filters">
        <SearchBox value={q} onChange={setQ} placeholder="Buscar turma" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Todos os status</option>
          <option>Agendada</option>
          <option>Sala pendente</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Curso</th>
              <th>Professor</th>
              <th>Sala</th>
              <th>Período</th>
              <th>Status de alocação</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td>{t.code}</td>
                <td>
                  <strong>{t.course}</strong>
                </td>
                <td>{t.teacher}</td>
                <td>
                  <div className="row-actions">
                    <button className="link-btn" onClick={() => editClass(t)}>
                      Editar
                    </button>
                    {t.room ? (
                      <span className="room-set">✓ {t.room}</span>
                    ) : (
                      <span className="missing">⚠ Não definida</span>
                    )}
                  </div>
                </td>
                <td>
                  {t.start} – {t.end}
                </td>
                <td>
                  <Badge kind={t.room ? "allocation" : "pending"}>
                    {t.room ? "Completa" : "Sala pendente"}
                  </Badge>
                </td>
                <td>
                  {t.room ? (
                    <button className="outline" onClick={() => findRoom(t)}>
                      Alterar sala
                    </button>
                  ) : (
                    <button className="primary" onClick={() => findRoom(t)}>
                      Encontrar sala
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <Empty
            title="Nenhuma turma encontrada"
            text="Ajuste a busca ou o status selecionado."
          />
        )}
      </div>
    </>
  );
}

function DirectoryPage({ type, navigate, viewTeacher }) {
  const isCourse = type === "courses";
  const data = isCourse ? courseData : teacherData;
  return (
    <>
      <Header
        title={isCourse ? "Cursos" : "Professores"}
        subtitle={
          isCourse
            ? "Catálogo de cursos disponíveis na unidade."
            : "Equipe docente e disponibilidade."
        }
        navigate={navigate}
        notifications={() => {}}
      />
      <div className="directory-grid">
        {data.map((item) => (
          <article className="directory-card" key={item[0]}>
            <div className="directory-icon">
              {isCourse ? <BookOpen /> : <UserRound />}
            </div>
            <h3>{item[0]}</h3>
            <p>{item[1]}</p>
            <Badge kind="sig">{item[2]}</Badge>
            <button
              className="outline"
              onClick={() =>
                isCourse ? navigate("classes") : viewTeacher(item[0])
              }
            >
              <Eye size={15} />
              Visualizar
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function TeacherDetailsPage({
  teacherName,
  classes,
  navigate,
  findRoom,
  editClass,
}) {
  const [view, setView] = useState("availability");
  const [details, setDetails] = useState(null);
  const teacher = teacherData.find((item) => item[0] === teacherName);
  const teacherClasses = classes.filter(
    (item) =>
      item.teacher.trim().toLowerCase() === teacherName.trim().toLowerCase(),
  );
  const days = [
    ["SEG", "Segunda"],
    ["TER", "Terça"],
    ["QUA", "Quarta"],
    ["QUI", "Quinta"],
    ["SEX", "Sexta"],
    ["SÁB", "Sábado"],
  ];
  const turns = [
    ["08:00 – 12:00", 8 * 60, 12 * 60],
    ["13:00 – 17:00", 13 * 60, 17 * 60],
    ["18:30 – 21:30", 18 * 60 + 30, 21 * 60 + 30],
  ];
  const inTurn = (item, start, end) =>
    timeRanges(item.time).some(
      ([itemStart, itemEnd]) => itemStart < end && start < itemEnd,
    );
  const conflicts = [];
  teacherClasses.forEach((item, index) => {
    teacherClasses.slice(index + 1).forEach((other) => {
      if (schedulesOverlap(item, other)) conflicts.push([item, other]);
    });
  });
  const weeklyHours = teacherClasses.reduce((total, item) => {
    const hours = timeRanges(item.time).reduce(
      (sum, [start, end]) => sum + (end - start) / 60,
      0,
    );
    return total + hours * Math.max(classDays(item.days).length, 1);
  }, 0);
  if (!teacher) {
    return (
      <Empty
        title="Professor não encontrado"
        text="Retorne à equipe docente e selecione outro professor."
        action={() => navigate("teachers")}
      />
    );
  }
  return (
    <>
      <Header
        title={teacherName}
        subtitle="Perfil, turmas e disponibilidade calculados pela agenda atual."
        navigate={navigate}
      />
      <button className="back" onClick={() => navigate("teachers")}>
        <ChevronLeft size={16} /> Voltar para professores
      </button>
      <section className="teacher-profile-summary">
        <div className="teacher-profile-main">
          <div className="directory-icon"><UserRound /></div>
          <span>Professor</span>
          <h2>{teacherName}</h2>
          <Badge kind="allocation">✓ Ativo</Badge>
        </div>
        <span>Área/segmento<strong>{teacher[1]}</strong></span>
        <span>Vínculo<strong>{teacher[2]}</strong></span>
        <span>Turmas associadas<strong>{teacherClasses.length}</strong></span>
        <span>Carga semanal<strong>{weeklyHours.toLocaleString("pt-BR")} horas</strong></span>
        <span>Conflitos<strong className={conflicts.length ? "danger-text" : "success-text"}>{conflicts.length ? `⚠ ${conflicts.length}` : "✓ Nenhum"}</strong></span>
      </section>
      <div className="teacher-view-tabs">
        <button className={view === "classes" ? "selected" : ""} onClick={() => setView("classes")}>Ver turmas</button>
        <button className={view === "availability" ? "selected" : ""} onClick={() => setView("availability")}>Ver disponibilidade</button>
        <button className={view === "agenda" ? "selected" : ""} onClick={() => setView("agenda")}>Ver agenda semanal</button>
      </div>
      {conflicts.length > 0 && (
        <section className="teacher-conflict-alert">
          <AlertTriangle />
          <div><strong>Conflito de professor</strong><p>Existem turmas com dias, períodos e horários sobrepostos.</p></div>
          <span>{conflicts.map(([first, second]) => `${first.code} × ${second.code}`).join(" · ")}</span>
        </section>
      )}
      {view === "classes" && (
        <div className="table-wrap">
          <table><thead><tr><th>Curso</th><th>Código</th><th>Sala</th><th>Período</th><th>Dias e horários</th><th>Ação</th></tr></thead>
          <tbody>{teacherClasses.map((item) => <tr key={item.id}><td><strong>{item.course}</strong></td><td>{item.code}</td><td>{item.room || "Sala pendente"}</td><td>{item.start} – {item.end}</td><td>{item.days}<TimeDisplay value={item.time} /></td><td><button className="outline" onClick={() => setDetails(item)}>Ver turma</button></td></tr>)}</tbody></table>
        </div>
      )}
      {(view === "availability" || view === "agenda") && (
        <section className={`teacher-week ${view}`}>
          {days.map(([day, label]) => (
            <article className="teacher-day" key={day}>
              <h3>{label}</h3>
              {turns.map(([labelTime, start, end]) => {
                const occupied = teacherClasses.filter((item) => classDays(item.days).includes(day) && inTurn(item, start, end));
                return <div className={`teacher-slot ${occupied.length ? "occupied" : "free"}`} key={labelTime}><strong>{labelTime}</strong>{occupied.length ? occupied.map((item) => <button key={item.id} onClick={() => setDetails(item)}><span>{item.course}</span><small>{item.code} · {item.room || "Sala pendente"}</small><TimeDisplay value={item.time} /></button>) : <span>✓ Livre</span>}</div>;
              })}
            </article>
          ))}
        </section>
      )}
      {details && (
        <div className="drawer-shade" onClick={() => setDetails(null)}>
          <aside className="allocation-drawer class-drawer" onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setDetails(null)}><X /></button>
            <small className="eyebrow">Detalhes da turma</small><h2>{details.course}</h2><p className="drawer-code">{details.code}</p>
            <div className="drawer-info"><span>Professor<strong>{details.teacher}</strong></span><span>Sala<strong>{details.room || "Pendente"}</strong></span><span>Período<strong>{details.start} – {details.end}</strong></span><span>Dias<strong>{details.days}</strong></span><span>Horário<strong><TimeDisplay value={details.time} expanded /></strong></span><span>Matrículas<strong>{details.students ?? "Não informadas"}</strong></span><span>Status SIG<strong>{details.sig}</strong></span></div>
            <div className="drawer-actions"><button className="outline" onClick={() => { setDetails(null); findRoom(details); }}>Alterar sala</button><button className="primary" onClick={() => { setDetails(null); editClass(details); }}>Alterar agenda</button></div>
          </aside>
        </div>
      )}
    </>
  );
}
const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};
const brDate = (date) =>
  date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
const turnRanges = {
  Manhã: [360, 720],
  Tarde: [720, 1080],
  Noite: [1080, 1320],
};
const occursInTurn = (item, day, turn, date) =>
  dateValue(item.start) <= date &&
  dateValue(item.end) >= date &&
  classDays(item.days).includes(day) &&
  timeRanges(item.time).some(
    ([start, end]) => start < turnRanges[turn][1] && turnRanges[turn][0] < end,
  );
function WeeklyCell({ items, onFree, onDetails }) {
  if (!items.length)
    return (
      <button className="weekly-cell free-cell" onClick={onFree}>
        <CheckCircle2 size={15} />
        <strong>Livre</strong>
        <small>+ Alocar turma</small>
      </button>
    );
  const conflict = items.some((a, i) =>
    items.slice(i + 1).some((b) => schedulesOverlap(a, b)),
  );
  const item = items[0];
  return (
    <button
      className={`weekly-cell occupied-cell ${conflict ? "cell-conflict" : ""}`}
      onClick={() => onDetails(item)}
    >
      {conflict ? <AlertTriangle size={14} /> : <BookOpen size={14} />}
      <strong>{conflict ? "Conflito" : item.course}</strong>
      <small>
        {conflict ? `${items.length} turmas simultâneas` : item.teacher}
      </small>
      <TimeDisplay value={item.time} />
      {items.length > 1 && !conflict && <em>+{items.length - 1}</em>}
    </button>
  );
}
function WeeklyGridPage({
  classes,
  navigate,
  allocateSlot,
  findRoom,
  editClass,
}) {
  const [offset, setOffset] = useState(0),
    [query, setQuery] = useState(""),
    [course, setCourse] = useState("Todos os cursos"),
    [teacher, setTeacher] = useState("Todos os professores"),
    [segment, setSegment] = useState("Todos os segmentos"),
    [details, setDetails] = useState(null),
    [slot, setSlot] = useState(null);
  const monday = addDays(new Date("2026-09-07T00:00:00"), offset * 7);
  const saturday = addDays(monday, 5);
  const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const turns = ["Manhã", "Tarde", "Noite"];
  const filtered = classes.filter(
    (t) =>
      (course === "Todos os cursos" || t.course === course) &&
      (teacher === "Todos os professores" || t.teacher === teacher) &&
      (segment === "Todos os segmentos" || t.segment === segment),
  );
  const hasEntityFilter =
    course !== "Todos os cursos" ||
    teacher !== "Todos os professores" ||
    segment !== "Todos os segmentos";
  const visibleRooms = roomOptions.filter(
    (room) =>
      room.name.toLowerCase().includes(query.toLowerCase()) &&
      (!hasEntityFilter || filtered.some((item) => item.room === room.name)),
  );
  const pending = classes.filter(needsRoom);
  const compatiblePending = slot
    ? pending.filter(
        (item) =>
          item.agenda &&
          dateValue(item.start) <= slot.date &&
          dateValue(item.end) >= slot.date &&
          classDays(item.days).includes(slot.day) &&
          occursInTurn(item, slot.day, slot.turn, slot.date) &&
          (item.local || "").trim().toUpperCase() ===
            (roomOptions.find((room) => room.name === slot.room)?.local || "")
              .trim()
              .toUpperCase() &&
          (!item.students ||
            (roomOptions.find((room) => room.name === slot.room)?.capacity ||
              0) >= item.students),
      )
    : [];
  return (
    <>
      <Header
        title="Grade Semanal de Salas"
        subtitle="Ocupação por sala, dia e turno em uma única visão."
        navigate={navigate}
      />
      <div className="week-navigation">
        <div>
          <button className="outline" onClick={() => setOffset((v) => v - 1)}>
            ‹ Semana anterior
          </button>
          <button className="outline" onClick={() => setOffset(0)}>
            Hoje
          </button>
          <button className="outline" onClick={() => setOffset((v) => v + 1)}>
            Próxima semana ›
          </button>
        </div>
        <strong>
          {brDate(monday)} – {brDate(saturday)}
        </strong>
      </div>
      <div className="weekly-filters">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Buscar sala"
        />
        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option>Todos os cursos</option>
          {courseData.map((c) => (
            <option key={c[0]}>{c[0]}</option>
          ))}
        </select>
        <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
          <option>Todos os professores</option>
          {teacherData.map((t) => (
            <option key={t[0]}>{t[0]}</option>
          ))}
        </select>
        <select value={segment} onChange={(e) => setSegment(e.target.value)}>
          <option>Todos os segmentos</option>
          {[...new Set(classes.map((t) => t.segment).filter(Boolean))].map(
            (x) => (
              <option key={x}>{x}</option>
            ),
          )}
        </select>
      </div>
      <div className="weekly-scroll">
        <div className="weekly-grid">
          <div className="weekly-corner">Sala</div>
          {dayNames.map((name, i) => (
            <div className="weekly-day" key={name}>
              <strong>{name}</strong>
              <small>{brDate(addDays(monday, i)).slice(0, 5)}</small>
            </div>
          ))}
          {visibleRooms.map((room) => (
            <React.Fragment key={room.name}>
              <div className="weekly-room">
                <DoorOpen size={17} />
                <strong>{room.name.replace("Sala ", "")}</strong>
                <small>{room.capacity} lugares</small>
              </div>
              {days.map((day, dayIndex) => (
                <div className="weekly-day-cells" key={day}>
                  {turns.map((turn) => {
                    const date = addDays(monday, dayIndex);
                    const items = classes.filter(
                      (item) =>
                        item.room === room.name &&
                        occursInTurn(item, day, turn, date),
                    );
                    return (
                      <div className="turn-cell" key={turn}>
                        <span className="turn-label">{turn}</span>
                        <WeeklyCell
                          items={items}
                          onDetails={setDetails}
                          onFree={() =>
                            setSlot({ room: room.name, day, turn, date })
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      {details && (
        <div className="drawer-shade" onClick={() => setDetails(null)}>
          <aside
            className="allocation-drawer class-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setDetails(null)}>
              <X />
            </button>
            <small className="eyebrow">Detalhes da turma</small>
            <h2>{details.course}</h2>
            <p className="drawer-code">{details.code}</p>
            <div className="drawer-info">
              <span>
                Professor<strong>{details.teacher}</strong>
              </span>
              <span>
                Sala<strong>{details.room}</strong>
              </span>
              <span>
                Período
                <strong>
                  {details.start} – {details.end}
                </strong>
              </span>
              <span>
                Dias<strong>{details.days}</strong>
              </span>
              <span>
                Horário
                <strong>
                  <TimeDisplay value={details.time} expanded />
                </strong>
              </span>
              <span>
                Matrículas
                <strong>{details.students ?? "Não informadas"}</strong>
              </span>
              <span>
                Status SIG<strong>{details.sig}</strong>
              </span>
              <span>
                Alocação<strong>Completa</strong>
              </span>
            </div>
            <div className="drawer-actions">
              <button
                className="outline"
                onClick={() => {
                  setDetails(null);
                  navigate("classes");
                }}
              >
                Ver turma
              </button>
              <button
                className="outline"
                onClick={() => {
                  setDetails(null);
                  findRoom(details);
                }}
              >
                Alterar sala
              </button>
              <button
                className="primary"
                onClick={() => {
                  setDetails(null);
                  editClass(details);
                }}
              >
                Alterar agenda
              </button>
            </div>
          </aside>
        </div>
      )}
      {slot && (
        <div className="overlay">
          <div className="modal">
            <button className="close" onClick={() => setSlot(null)}>
              <X />
            </button>
            <div className="modal-check">
              <CalendarDays />
            </div>
            <h2>Alocar turma neste período</h2>
            <p>
              {slot.room} · {slot.day} · {slot.turn}
            </p>
            <div className="pending-picker">
              {compatiblePending.length ? (
                compatiblePending.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      allocateSlot(item, slot);
                      setSlot(null);
                    }}
                  >
                    <span>
                      <strong>{item.course}</strong>
                      <small>
                        {item.code} · {item.students ?? "—"} matrículas
                      </small>
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))
              ) : (
                <Empty
                  title="Nenhuma turma compatível"
                  text="Não há turma pendente com este dia, período e turno."
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function CalendarPage({ classes, navigate, initialRoom, findRoom, editClass }) {
  const [room, setRoom] = useState(initialRoom || roomOptions[0]?.name || "");
  const [details, setDetails] = useState(null);
  const weekStart = new Date("2026-09-07T00:00:00"),
    weekEnd = new Date("2026-09-12T00:00:00");
  const scheduled = classes.filter(
    (t) =>
      t.room === room &&
      dateValue(t.start) <= weekEnd &&
      dateValue(t.end) >= weekStart,
  );
  const roomInfo = roomUsage(
    roomOptions.find((item) => item.name === room) || roomOptions[0],
    classes,
  );
  return (
    <>
      <Header
        title={`Detalhes da ${room}`}
        subtitle="Capacidade, situação e agenda semanal do ambiente."
        navigate={navigate}
        notifications={() => {}}
      />
      <section className="room-detail-summary">
        <span>
          Tipo<strong>{roomInfo.type}</strong>
        </span>
        <span>
          Capacidade<strong>{roomInfo.capacity} pessoas</strong>
        </span>
        <span>
          Turmas no período<strong>{scheduled.length}</strong>
        </span>
        <span>
          Situação<strong>{roomInfo.state}</strong>
        </span>
      </section>
      <div className="calendar-toolbar">
        <label>
          Sala
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            {roomOptions.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
        <strong>07 – 12 de setembro de 2026</strong>
      </div>
      <div className="section-heading calendar-section-heading">
        <div>
          <h2>Agenda da {room}</h2>
          <p>Clique em uma turma para consultar os detalhes e ações.</p>
        </div>
      </div>
      <div className="week-grid">
        <div className="time-column">
          <b>Horário</b>
          {[
            "08:00",
            "10:00",
            "12:00",
            "14:00",
            "16:00",
            "18:00",
            "20:00",
            "22:00",
          ].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        {["SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
          <div className="day-column" key={day}>
            <b>{day}</b>
            {scheduled.filter((item) => classDays(item.days).includes(day))
              .length ? (
              scheduled
                .filter((item) => classDays(item.days).includes(day))
                .map((item) => (
                  <button
                    type="button"
                    className="calendar-event"
                    key={item.id}
                    onClick={() => setDetails(item)}
                  >
                    <strong>{item.course}</strong>
                    <small>
                      <TimeDisplay value={item.time} expanded />
                      <br />
                      {item.teacher}
                      <br />
                      {item.code}
                    </small>
                  </button>
                ))
            ) : (
              <span className="free-slot">Livre</span>
            )}
          </div>
        ))}
      </div>
      {details && (
        <div className="drawer-shade" onClick={() => setDetails(null)}>
          <aside
            className="allocation-drawer class-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="close" onClick={() => setDetails(null)}>
              <X />
            </button>
            <small className="eyebrow">Turma alocada em {room}</small>
            <h2>{details.course}</h2>
            <p className="drawer-code">{details.code}</p>
            <div className="drawer-info">
              <span>
                Professor<strong>{details.teacher}</strong>
              </span>
              <span>
                Período
                <strong>
                  {details.start} – {details.end}
                </strong>
              </span>
              <span>
                Dias<strong>{details.days}</strong>
              </span>
              <span>
                Horário
                <strong>
                  <TimeDisplay value={details.time} expanded />
                </strong>
              </span>
            </div>
            <div className="drawer-actions">
              <button
                className="outline"
                onClick={() => {
                  setDetails(null);
                  findRoom(details);
                }}
              >
                Alterar sala
              </button>
              <button
                className="primary"
                onClick={() => {
                  setDetails(null);
                  editClass(details);
                }}
              >
                Alterar agenda
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
function MapPage({ classes, navigate, findRoom, editClass }) {
  const [q, setQ] = useState(""),
    [only, setOnly] = useState(false),
    [compact, setCompact] = useState(false),
    [expanded, setExpanded] = useState(null);
  const rows = classes
    .filter((t) => !only || needsRoom(t))
    .filter((t) =>
      Object.values(t).join(" ").toLowerCase().includes(q.toLowerCase()),
    );
  return (
    <>
      <Header
        title="Mapa de Turmas"
        subtitle="Visão operacional completa dos dados de turmas e ambientes."
        navigate={navigate}
        notifications={() => {}}
      />
      <div className="map-stats">
        <div>
          <span>Turmas cadastradas</span>
          <b>{classes.length}</b>
        </div>
        <button className="warning-stat" onClick={() => setOnly(true)}>
          <span>Aguardando sala</span>
          <b>{classes.filter(needsRoom).length}</b>
        </button>
        <div>
          <span>Em processo</span>
          <b>
            {
              classes.filter((t) => t.sig.toLowerCase() === "em processo")
                .length
            }
          </b>
        </div>
        <div>
          <span>Salas utilizadas</span>
          <b>
            {
              new Set(
                classes
                  .map((t) => t.room)
                  .filter((room) => room && room !== "EXTERNA"),
              ).size
            }
          </b>
        </div>
      </div>
      <div className="tabs">
        <button className="selected" disabled>
          Por turmas
        </button>
        <button onClick={() => navigate("rooms")}>Por salas</button>
        <span />
        <button
          className={!compact ? "selected" : ""}
          onClick={() => setCompact(false)}
        >
          Confortável
        </button>
        <button
          className={compact ? "selected" : ""}
          onClick={() => setCompact(true)}
        >
          Compacta
        </button>
      </div>
      <div className="map-controls">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Buscar curso, código, instrutor, sala ou pedagoga"
        />
        <button
          className={only ? "filter active-filter" : "filter"}
          onClick={() => setOnly((v) => !v)}
        >
          <AlertTriangle size={16} />
          Somente turmas sem sala
        </button>
        <button className="filter" onClick={() => setCompact((v) => !v)}>
          <Columns3 size={16} />
          Densidade
        </button>
        <button
          className="filter"
          onClick={() => {
            setQ("");
            setOnly(false);
          }}
        >
          <SlidersHorizontal size={16} />
          Limpar filtros
        </button>
      </div>
      <div className={`map-table ${compact ? "compact-map" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Código</th>
              <th>Curso</th>
              <th>Instrutor / vínculo</th>
              <th>Início</th>
              <th>Término</th>
              <th>Dias</th>
              <th>Horário</th>
              <th>Matrículas</th>
              <th>Segmento</th>
              <th>Local</th>
              <th>Status SIG</th>
              <th>Sala / ambiente</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <React.Fragment key={t.id}>
                <tr
                  className={!t.room ? "row-pending" : ""}
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                >
                  <td>
                    <Badge kind={t.room ? "allocation" : "pending"}>
                      {t.room ? "✓ Completa" : "⚠ Sala pendente"}
                    </Badge>
                  </td>
                  <td>
                    <strong>{t.code}</strong>
                  </td>
                  <td className="course-cell">
                    <strong>{t.course}</strong>
                    {t.note && <small>📝 Observação</small>}
                  </td>
                  <td>
                    <strong>{t.teacher}</strong>
                    <small>{t.link}</small>
                  </td>
                  <td>{t.start}</td>
                  <td>{t.end}</td>
                  <td>{t.days}</td>
                  <td>
                    <TimeDisplay value={t.time} />
                  </td>
                  <td>{t.students}</td>
                  <td>{t.segment}</td>
                  <td>{t.local}</td>
                  <td>
                    <Badge kind="sig">{t.sig}</Badge>
                  </td>
                  <td>
                    {t.room ? (
                      <span
                        className={
                          t.room === "EXTERNA" ? "external-room" : "room-set"
                        }
                      >
                        {t.room === "EXTERNA"
                          ? "◇ Ambiente externo"
                          : "✓ " + t.room}
                      </span>
                    ) : (
                      <span className="missing">⚠ Sala pendente</span>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="row-actions">
                      <button className="link-btn" onClick={() => editClass(t)}>
                        Editar
                      </button>
                      {!t.room ? (
                        <button className="primary" onClick={() => findRoom(t)}>
                          Encontrar sala
                        </button>
                      ) : (
                        <button className="outline" onClick={() => findRoom(t)}>
                          Alterar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expanded === t.id && (
                  <tr className="expand-row">
                    <td colSpan="14">
                      <div className="expanded">
                        <div>
                          <span>Semestre</span>
                          <strong>{t.semester}</strong>
                          <span>CHE</span>
                          <strong>{t.che}</strong>
                        </div>
                        <div>
                          <span>Oferta</span>
                          <strong>{t.offer}</strong>
                          <span>Pedagoga</span>
                          <strong>{t.pedagogue}</strong>
                        </div>
                        <div>
                          <span>Dias individuais</span>
                          <strong>
                            SEG {t.days.includes("Seg") ? "✓" : "–"} · TER{" "}
                            {t.days.includes("Ter") ? "✓" : "–"} · QUA{" "}
                            {t.days.includes("Qua") ? "✓" : "–"} · QUI{" "}
                            {t.days.includes("Qui") ? "✓" : "–"} · SEX{" "}
                            {t.days.includes("Sex") ? "✓" : "–"} · SÁB{" "}
                            {t.days.includes("Sáb") ? "✓" : "–"}
                          </strong>
                          <span>Observações</span>
                          <strong>{t.note || "Sem observações."}</strong>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function FinderRoomCard({ room, selectRoom, openAgenda }) {
  const [showConflicts, setShowConflicts] = useState(false);
  const conflictCount = room.issues?.length || 0;
  return (
    <article
      className={`room-card finder-room ${room.ok ? "recommended" : ""}`}
    >
      <div className="room-head">
        <div
          className={`state-icon ${room.ok ? "ok" : room.category === "conflict" ? "no" : "warn"}`}
        >
          {room.ok ? <CheckCircle2 /> : <AlertTriangle />}
        </div>
        <div>
          <h3>{room.name}</h3>
          <p>{room.type}</p>
        </div>
        {room.recommended && <Badge kind="allocation">Recomendada</Badge>}
      </div>
      <div className="room-kpis">
        <span>
          Capacidade<strong>{room.capacity} pessoas</strong>
        </span>
        <span>
          Necessário<strong>{room.targetStudents || "Não informado"}</strong>
        </span>
      </div>
      <Badge
        kind={
          room.ok
            ? "allocation"
            : room.category === "conflict"
              ? "danger"
              : "pending"
        }
      >
        {room.state}
      </Badge>
      <div className="validation-list">
        <span className={room.roomAvailable ? "valid" : "invalid"}>
          {room.roomAvailable ? "✓ Sala disponível" : "✕ Sala ocupada"}
        </span>
        <span className={room.teacherAvailable ? "valid" : "invalid"}>
          {room.teacherAvailable
            ? "✓ Professor disponível"
            : "✕ Professor indisponível"}
        </span>
        <span className={room.capacityOk ? "valid" : "invalid"}>
          {room.capacityOk
            ? "✓ Capacidade adequada"
            : "✕ Capacidade insuficiente"}
        </span>
      </div>
      {room.issues.length ? (
        <>
          <p className="conflict-count">
            {conflictCount}{" "}
            {conflictCount === 1
              ? "impedimento encontrado"
              : "impedimentos encontrados"}
          </p>
          {showConflicts && (
            <div className="conflict-summary">
              {room.issues.map((issue, index) => (
                <div
                  className="issue-detail"
                  key={`${issue.type}-${issue.item?.id || index}`}
                >
                  <strong>
                    {index + 1}. {issue.title}
                  </strong>
                  <p>{issue.text}</p>
                  {issue.item && (
                    <>
                      <span>
                        <b>Turma</b>
                        {issue.item.code} · {issue.item.course}
                      </span>
                      <span>
                        <b>Período</b>
                        {issue.item.start} – {issue.item.end}
                      </span>
                      <span>
                        <b>Horário</b>
                        <TimeDisplay value={issue.item.time} />
                      </span>
                      <span>
                        <b>{issue.type === "room" ? "Professor" : "Sala"}</b>
                        {issue.type === "room"
                          ? issue.item.teacher
                          : issue.item.room || "Não definida"}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="room-detail">{room.detail}</p>
      )}
      <div className="room-footer">
        {room.ok ? (
          <button className="primary" onClick={() => selectRoom(room)}>
            Alocar
          </button>
        ) : room.issues.length ? (
          <button
            className="outline"
            onClick={() => setShowConflicts((v) => !v)}
          >
            {showConflicts ? "Ocultar detalhes" : "Ver detalhes"}
          </button>
        ) : (
          <button disabled>Indisponível</button>
        )}
        <button className="link-btn" onClick={() => openAgenda(room.name)}>
          Ver agenda
        </button>
      </div>
    </article>
  );
}
function FinderPage({
  classItem,
  classes,
  navigate,
  selectRoom,
  defineAgenda,
  openAgenda,
}) {
  const analysis = analyzeRooms(classItem, classes);
  const recommendedRoom = analysis.find((room) => room.ok)?.name;
  const analyzedRooms = analysis.map((room) => ({
    ...room,
    targetStudents: classItem.students,
    recommended: room.name === recommendedRoom,
  }));
  const roomGroups = [
    {
      key: "available",
      title: "Salas disponíveis",
      description: "Podem ser alocadas imediatamente.",
    },
    {
      key: "conflict",
      title: "Salas com conflitos",
      description: "Possuem conflito de sala ou professor.",
    },
    {
      key: "incompatible",
      title: "Salas incompatíveis",
      description: "Não atendem capacidade, agenda ou unidade.",
    },
  ];
  if (!classItem.agenda)
    return (
      <>
        <Header
          title="Definir agenda"
          subtitle="A agenda é necessária antes de consultar salas compatíveis."
          navigate={navigate}
        />
        <button
          className="back"
          onClick={() => navigate(classItem.returnPage || "pending")}
        >
          <ChevronLeft size={16} />
          Voltar
        </button>
        <section className="form-card">
          <div className="form-title">
            <span>Agenda pendente</span>
            <h2>{classItem.course}</h2>
            <p>
              Defina um período válido para liberar a busca automática por
              salas.
            </p>
          </div>
          <div className="review">
            <span>
              Período<strong>20/10/2026 – 20/12/2026</strong>
            </span>
            <span>
              Dias<strong>Seg · Qua · Sex</strong>
            </span>
            <span>
              Horário<strong>14:00 – 18:00</strong>
            </span>
          </div>
          <div className="form-actions">
            <button className="outline" onClick={() => navigate("pending")}>
              Cancelar
            </button>
            <button
              className="primary"
              onClick={() => defineAgenda(classItem.id)}
            >
              Salvar agenda e encontrar sala
            </button>
          </div>
        </section>
      </>
    );
  return (
    <>
      <Header
        title="Encontrar sala"
        subtitle="Disponibilidade calculada automaticamente para a turma."
        navigate={navigate}
        notifications={() => {}}
      />
      <button
        className="back"
        onClick={() => navigate(classItem.returnPage || "pending")}
      >
        <ChevronLeft size={16} />
        Voltar
      </button>
      <section className="class-summary">
        <div className="summary-title">
          <span>Turma</span>
          <h2>{classItem.course}</h2>
          <Badge kind="pending">
            {classItem.room ? "Alterar sala" : "Sala pendente"}
          </Badge>
        </div>
        <div>
          <span>Código</span>
          <strong>{classItem.code}</strong>
        </div>
        <div>
          <span>Professor</span>
          <strong>{classItem.teacher}</strong>
        </div>
        <div>
          <span>Período</span>
          <strong>
            {classItem.start} – {classItem.end}
          </strong>
        </div>
        <div>
          <span>Dias e horário</span>
          <strong>
            {classItem.days}
            <br />
            <TimeDisplay value={classItem.time} expanded />
          </strong>
        </div>
        <div>
          <span>Matrículas</span>
          <strong>{classItem.students}</strong>
        </div>
      </section>
      <section className="finder-title">
        <div>
          <h2>Salas compatíveis</h2>
          <p>Agenda, capacidade, local e conflitos já foram considerados.</p>
        </div>
        <span className="validated">
          <CheckCircle2 size={18} />
          Consulta concluída
        </span>
      </section>
      {roomGroups.map((group) => {
        const groupRooms = analyzedRooms.filter(
          (room) => room.category === group.key,
        );
        return groupRooms.length ? (
          <section className={`room-result-group ${group.key}`} key={group.key}>
            <div className="result-group-title">
              <h3>{group.title}</h3>
              <span>{groupRooms.length}</span>
              <p>{group.description}</p>
            </div>
            <div className="room-grid">
              {groupRooms.map((room) => (
                <FinderRoomCard
                  key={room.name}
                  room={room}
                  selectRoom={selectRoom}
                  openAgenda={openAgenda}
                />
              ))}
            </div>
          </section>
        ) : null;
      })}
    </>
  );
}
function NewClassPage({ navigate, createClass }) {
  const [course, setCourse] = useState("Programador Full Stack");
  const [teacher, setTeacher] = useState("Valtemir");
  const [withoutRoom, setWithoutRoom] = useState(true);
  const [withoutAgenda, setWithoutAgenda] = useState(false);
  const [start, setStart] = useState("2026-10-20");
  const [end, setEnd] = useState("2026-12-20");
  const [days, setDays] = useState("Seg · Qua · Sex");
  const [time, setTime] = useState("14:00 – 18:00");
  return (
    <>
      <Header
        title="Nova turma"
        subtitle="Cadastre uma turma com ou sem sala definida."
        navigate={navigate}
        notifications={() => {}}
      />
      <section className="form-card">
        <div className="form-title">
          <span>Cadastro de turma</span>
          <h2>Informações essenciais</h2>
          <p>A sala pode ser alocada posteriormente.</p>
        </div>
        <div className="agenda-fields">
          <label>
            Curso
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
              {courseData.map((c) => (
                <option key={c[0]}>{c[0]}</option>
              ))}
            </select>
          </label>
          <label>
            Professor
            <select
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            >
              {teacherData.map((t) => (
                <option key={t[0]}>{t[0]}</option>
              ))}
            </select>
          </label>
          <label>
            Data inicial
            <input
              type="date"
              value={start}
              disabled={withoutAgenda}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label>
            Data final
            <input
              type="date"
              value={end}
              disabled={withoutAgenda}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
          <label>
            Dias
            <select
              value={days}
              disabled={withoutAgenda}
              onChange={(e) => setDays(e.target.value)}
            >
              <option>Seg · Qua · Sex</option>
              <option>Ter · Qui</option>
            </select>
          </label>
          <label>
            Horário
            <input
              type="text"
              value={time}
              disabled={withoutAgenda}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={withoutAgenda}
            onChange={(e) => {
              setWithoutAgenda(e.target.checked);
              if (e.target.checked) setWithoutRoom(true);
            }}
          />
          Definir agenda posteriormente
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={withoutRoom}
            disabled={withoutAgenda}
            onChange={(e) => setWithoutRoom(e.target.checked)}
          />
          Alocar sala posteriormente
        </label>
        {(withoutRoom || withoutAgenda) && (
          <div className="form-warning">
            <AlertTriangle />
            {withoutAgenda
              ? "A turma será criada com Agenda pendente e não poderá receber sala ainda."
              : "A turma será criada com Sala pendente e aparecerá na fila operacional."}
          </div>
        )}
        <div className="form-actions">
          <button className="outline" onClick={() => navigate("classes")}>
            Cancelar
          </button>
          <button
            className="primary"
            onClick={() =>
              createClass({
                course,
                teacher,
                withoutRoom,
                withoutAgenda,
                start,
                end,
                days,
                time,
              })
            }
          >
            Criar turma
          </button>
        </div>
      </section>
    </>
  );
}
function Empty({ title, text, action }) {
  return (
    <div className="empty">
      <CheckCircle2 size={34} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action && (
        <button className="outline" onClick={action}>
          Ver todas as turmas
        </button>
      )}
    </div>
  );
}
function EditClassModal({ item, close, save }) {
  const [teacher, setTeacher] = useState(item.teacher);
  const [days, setDays] = useState(item.days);
  const [time, setTime] = useState(item.time);
  const [students, setStudents] = useState(item.students);
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <button className="close" onClick={close} aria-label="Fechar">
          <X />
        </button>
        <div className="modal-check">
          <UsersRound />
        </div>
        <h2>Editar turma</h2>
        <p>
          {item.code} · {item.course}
        </p>
        <div className="edit-grid">
          <label>
            Professor
            <select
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            >
              {teacherData.map((t) => (
                <option key={t[0]}>{t[0]}</option>
              ))}
            </select>
          </label>
          <label>
            Dias
            <select value={days} onChange={(e) => setDays(e.target.value)}>
              <option>Seg · Qua · Sex</option>
              <option>Ter · Qui</option>
              <option>Sáb</option>
            </select>
          </label>
          <label>
            Horário
            <input value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label>
            Matrículas
            <input
              type="number"
              min="0"
              value={students}
              onChange={(e) => setStudents(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="outline" onClick={close}>
            Cancelar
          </button>
          <button
            className="primary"
            onClick={() =>
              save({ ...item, teacher, days, time, students, agenda: true })
            }
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
function ConfirmModal({ data, close, confirm }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal confirm">
        <button className="close" onClick={close} aria-label="Fechar">
          <X />
        </button>
        <div className="modal-check">
          <CheckCircle2 />
        </div>
        <h2>Confirmar alocação</h2>
        <p>Revise as informações antes de concluir.</p>
        <div className="review">
          <span>
            Turma<strong>{data.classItem.course}</strong>
          </span>
          <span>
            Código<strong>{data.classItem.code}</strong>
          </span>
          <span>
            Sala<strong>{data.room.name}</strong>
          </span>
          <span>
            Professor<strong>{data.classItem.teacher}</strong>
          </span>
          <span>
            Agenda
            <strong>
              {data.classItem.days}
              <br />
              <TimeDisplay value={data.classItem.time} expanded />
            </strong>
          </span>
          <span>
            Capacidade
            <strong>
              {data.classItem.students} / {data.room.capacity}
            </strong>
          </span>
        </div>
        <div className="validations">
          <p>
            <CheckCircle2 />
            Sala disponível durante todo o período
          </p>
          <p>
            <CheckCircle2 />
            Professor disponível
          </p>
          <p>
            <CheckCircle2 />
            Capacidade adequada
          </p>
          <p>
            <CheckCircle2 />
            Nenhum conflito encontrado
          </p>
        </div>
        <div className="modal-actions">
          <button className="outline" onClick={close}>
            Cancelar
          </button>
          <button className="primary" onClick={confirm}>
            Confirmar alocação
          </button>
        </div>
      </div>
    </div>
  );
}
function App() {
  const [page, setPage] = useState("dashboard");
  const [classes, setClasses] = useState(spreadsheetClasses);
  const [selected, setSelected] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [editing, setEditing] = useState(null);
  const [calendarRoom, setCalendarRoom] = useState(roomOptions[0]?.name || "");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [toast, setToast] = useState("");
  const navigate = (next) => {
    setPage(next);
    if (next !== "finder") setSelected(null);
  };
  const findRoom = (item) => {
    setSelected({ ...item, returnPage: page });
    setPage("finder");
  };
  const openRoomAgenda = (roomName) => {
    setCalendarRoom(roomName);
    setPage("calendar");
    setSelected(null);
  };
  const openTeacher = (teacherName) => {
    setSelectedTeacher(teacherName);
    setPage("teacher-details");
    setSelected(null);
  };
  const defineAgenda = (id) => {
    const agenda = {
      agenda: true,
      start: "20/10/2026",
      end: "20/12/2026",
      days: "Seg · Qua · Sex",
      time: "14:00 – 18:00",
    };
    setClasses((all) =>
      all.map((t) => (t.id === id ? { ...t, ...agenda } : t)),
    );
    setSelected((item) => ({ ...item, ...agenda }));
    setToast("Agenda definida. As salas foram recalculadas.");
    setTimeout(() => setToast(""), 4500);
  };
  const confirmAllocation = () => {
    const candidate = confirmation.classItem;
    const room = confirmation.room.name;
    const currentValidation = analyzeRooms(
      { ...candidate, room },
      classes,
    ).find((option) => option.name === room);
    if (!currentValidation?.ok) {
      setToast(
        currentValidation?.issues?.[0]?.text ||
          "A alocação deixou de ser válida. Revise os conflitos.",
      );
      setTimeout(() => setToast(""), 4500);
      return;
    }
    const { id } = candidate;
    setClasses((all) => all.map((t) => (t.id === id ? { ...t, room } : t)));
    setConfirmation(null);
    setSelected(null);
    setPage("pending");
    setToast(`Sala alocada com sucesso. ${room} foi atribuída à turma.`);
    setTimeout(() => setToast(""), 4500);
  };
  const saveClass = (candidate) => {
    const currentRoom =
      candidate.room &&
      roomOptions.some((room) => room.name === candidate.room);
    const remainsValid =
      !currentRoom ||
      analyzeRooms(candidate, classes).find(
        (room) => room.name === candidate.room,
      )?.ok;
    if (!remainsValid) {
      const validation = analyzeRooms(candidate, classes).find(
        (room) => room.name === candidate.room,
      );
      setToast(
        validation?.issues?.[0]?.text ||
          "A alteração criaria um conflito. Nenhuma mudança foi salva.",
      );
      setTimeout(() => setToast(""), 4500);
      return;
    }
    const updated = candidate;
    setClasses((all) =>
      all.map((item) => (item.id === updated.id ? updated : item)),
    );
    setEditing(null);
    setToast("Turma atualizada com sucesso.");
    setTimeout(() => setToast(""), 4500);
  };
  const createClass = (data) => {
    const draft = {
      ...spreadsheetClasses[0],
      id: Date.now(),
      code: `2026.11.${Math.floor(600 + Math.random() * 300)}`,
      course: data.course,
      teacher: data.teacher,
      room: null,
      agenda: !data.withoutAgenda,
      start: data.withoutAgenda ? "" : isoToBr(data.start),
      end: data.withoutAgenda ? "" : isoToBr(data.end),
      days: data.withoutAgenda ? "" : data.days,
      time: data.withoutAgenda ? "" : data.time,
      priority: "Normal",
    };
    const requestedRoom = !data.withoutRoom && !data.withoutAgenda;
    const canUseSala104 =
      requestedRoom &&
      analyzeRooms(draft, classes).find((room) => room.name === "Sala 104")?.ok;
    const item = { ...draft, room: canUseSala104 ? "Sala 104" : null };
    setClasses((all) => [item, ...all]);
    setPage(item.room ? "classes" : "pending");
    setToast(
      data.withoutAgenda
        ? "Turma criada com agenda pendente."
        : item.room
          ? "Turma criada e alocada."
          : requestedRoom
            ? "Turma criada, mas a Sala 104 possui conflito. Alocação pendente."
            : "Turma criada com sala pendente.",
    );
    setTimeout(() => setToast(""), 4500);
  };
  const allocateWeeklySlot = (item, slot) => {
    const candidate = {
      ...item,
      room: slot.room,
    };
    const room = analyzeRooms(candidate, classes).find(
      (option) => option.name === slot.room,
    );
    if (!room?.ok) {
      setToast(room?.detail || "Este horário não está disponível.");
      setTimeout(() => setToast(""), 4500);
      return;
    }
    setConfirmation({ classItem: candidate, room });
  };
  const props = { navigate };
  let content;
  switch (page) {
    case "dashboard":
      content = (
        <Dashboard classes={classes} navigate={navigate} findRoom={findRoom} />
      );
      break;
    case "pending":
      content = (
        <Pending classes={classes} navigate={navigate} findRoom={findRoom} />
      );
      break;
    case "rooms":
      content = (
        <RoomsPage classes={classes} openAgenda={openRoomAgenda} {...props} />
      );
      break;
    case "classes":
      content = (
        <ClassesPage
          classes={classes}
          defineAgenda={defineAgenda}
          navigate={navigate}
          findRoom={findRoom}
          editClass={setEditing}
        />
      );
      break;
    case "courses":
      content = <DirectoryPage type="courses" {...props} />;
      break;
    case "teachers":
      content = (
        <DirectoryPage
          type="teachers"
          viewTeacher={openTeacher}
          {...props}
        />
      );
      break;
    case "teacher-details":
      content = (
        <TeacherDetailsPage
          teacherName={selectedTeacher}
          classes={classes}
          navigate={navigate}
          findRoom={findRoom}
          editClass={setEditing}
        />
      );
      break;
    case "calendar":
      content = (
        <CalendarPage
          classes={classes}
          initialRoom={calendarRoom}
          findRoom={findRoom}
          editClass={setEditing}
          {...props}
        />
      );
      break;
    case "week":
      content = (
        <WeeklyGridPage
          classes={classes}
          navigate={navigate}
          allocateSlot={allocateWeeklySlot}
          findRoom={findRoom}
          editClass={setEditing}
        />
      );
      break;
    case "map":
      content = (
        <MapPage
          classes={classes}
          navigate={navigate}
          findRoom={findRoom}
          editClass={setEditing}
        />
      );
      break;
    case "finder":
      content = selected ? (
        <FinderPage
          classItem={selected}
          classes={classes}
          navigate={navigate}
          defineAgenda={defineAgenda}
          openAgenda={openRoomAgenda}
          selectRoom={(room) => setConfirmation({ classItem: selected, room })}
        />
      ) : (
        <Pending classes={classes} navigate={navigate} findRoom={findRoom} />
      );
      break;
    case "new":
      content = <NewClassPage navigate={navigate} createClass={createClass} />;
      break;
    default:
      content = (
        <Dashboard classes={classes} navigate={navigate} findRoom={findRoom} />
      );
  }
  return (
    <div className="app">
      <Sidebar
        page={page}
        navigate={navigate}
        pending={classes.filter(needsRoom).length}
      />
      <main>{content}</main>
      {confirmation && (
        <ConfirmModal
          data={confirmation}
          close={() => setConfirmation(null)}
          confirm={confirmAllocation}
        />
      )}{" "}
      {editing && (
        <EditClassModal
          item={editing}
          close={() => setEditing(null)}
          save={saveClass}
        />
      )}{" "}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 />
          {toast}
          <button onClick={() => setToast("")} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
