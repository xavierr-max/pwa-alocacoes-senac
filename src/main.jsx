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
  const matches = (value || "").match(/(\d{2}):(\d{2})/g) || [];
  if (matches.length < 2) return null;
  const toMinutes = (x) => {
    const [h, m] = x.split(":").map(Number);
    return h * 60 + m;
  };
  return [toMinutes(matches[0]), toMinutes(matches[1])];
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
  const ar = timeRange(a.time),
    br = timeRange(b.time);
  return shared && ar && br && ar[0] < br[1] && br[0] < ar[1];
};
function analyzeRooms(target, classes) {
  const teacherConflict =
    target.teacher !== "A CONTRATAR" &&
    classes.some(
      (item) =>
        item.id !== target.id &&
        item.teacher === target.teacher &&
        schedulesOverlap(target, item),
    );
  return roomOptions.map((room) => {
    const occupants = classes.filter(
      (t) => t.id !== target.id && t.room === room.name,
    );
    const conflicts = occupants.filter((t) => schedulesOverlap(target, t));
    const capacityOk = !target.students || room.capacity >= target.students;
    const localOk = target.local === room.local;
    const ok = Boolean(
      target.agenda &&
      capacityOk &&
      localOk &&
      !conflicts.length &&
      !teacherConflict,
    );
    return {
      ...room,
      ok,
      conflict: conflicts.length > 0,
      disabled: !ok,
      state: !target.agenda
        ? "Agenda necessária"
        : teacherConflict
          ? "Professor indisponível"
          : !capacityOk
            ? "Incompatível"
            : !localOk
              ? "Outra unidade"
              : conflicts.length
                ? "Conflito"
                : "Disponível",
      detail: !target.agenda
        ? "Defina uma agenda antes de alocar."
        : teacherConflict
          ? "O professor já possui outra turma neste dia e horário."
          : !capacityOk
            ? `Capacidade insuficiente: ${room.capacity} para ${target.students} matrículas.`
            : !localOk
              ? "Sala localizada em outra unidade."
              : conflicts.length
                ? `Conflita com ${conflicts.map((t) => `${t.code} (${t.time})`).join(", ")}.`
                : "Disponível durante todo o período.",
      occupants,
      conflicts,
    };
  });
}
function roomUsage(room, classes) {
  const occupants = classes.filter((t) => t.room === room.name);
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
  ["Programador Full Stack", "240h", "Tecnologia"],
  ["Programação em C#", "160h", "Tecnologia"],
  ["Banco de Dados", "120h", "Tecnologia"],
  ["Informática Básica", "80h", "Gestão"],
];
const teacherData = [
  ["Valtemir", "Desenvolvimento de sistemas", "Mensalista"],
  ["Carlos Silva", "Programação", "Horista"],
  ["Ana Souza", "Banco de dados", "Mensalista"],
  ["Juliana Santos", "Informática", "Mensalista"],
];
const Badge = ({ children, kind = "" }) => (
  <span
    className={`badge ${kind} ${String(children).toLowerCase().replaceAll(" ", "-")}`}
  >
    {children}
  </span>
);

function Sidebar({ page, navigate, pending }) {
  const items = [
    ["dashboard", "Visão geral", LayoutDashboard],
    ["pending", "Turmas aguardando sala", AlertTriangle],
    ["rooms", "Salas", DoorOpen],
    ["classes", "Turmas", UsersRound],
    ["courses", "Cursos", GraduationCap],
    ["teachers", "Professores", UserRound],
    ["calendar", "Calendário", CalendarDays],
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
            className={page === id ? "active" : ""}
            onClick={() => navigate(id)}
            aria-current={page === id ? "page" : undefined}
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
  const pending = classes.filter((t) => !t.room);
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
                {t.code} · {t.teacher} · {t.start} · {t.time}
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
    .filter((t) => !t.room)
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
                  <small>{t.time}</small>
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

function RoomsPage({ navigate, classes }) {
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
        {rows.map((r) => (
          <article
            className={`room-card ${r.state === "Disponível" ? "recommended" : ""}`}
            key={r.name}
          >
            <div className="room-head">
              <div
                className={`state-icon ${r.state === "Disponível" ? "ok" : r.state === "Totalmente ocupada" ? "no" : "warn"}`}
              >
                {r.state === "Disponível" ? (
                  <CheckCircle2 />
                ) : (
                  <AlertTriangle />
                )}
              </div>
              <div>
                <h3>{r.name}</h3>
                <p>{r.type}</p>
              </div>
            </div>
            <div className="capacity">
              <span>Capacidade</span>
              <strong>{r.capacity} pessoas</strong>
              <small>{r.occupants.length} turma(s) alocada(s)</small>
            </div>
            <Badge
              kind={
                r.state === "Disponível"
                  ? "allocation"
                  : r.state === "Totalmente ocupada"
                    ? "danger"
                    : "pending"
              }
            >
              {r.state}
            </Badge>
            <p className="room-detail">
              {r.state === "Disponível"
                ? "Nenhuma turma alocada."
                : r.occupants.map((t) => `${t.days} · ${t.time}`).join(" | ")}
            </p>
            <div className="room-footer">
              <button className="outline" onClick={() => navigate("calendar")}>
                Ver agenda
              </button>
            </div>
          </article>
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

function DirectoryPage({ type, navigate }) {
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
              onClick={() => navigate(isCourse ? "classes" : "calendar")}
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
function CalendarPage({ classes, navigate }) {
  const [room, setRoom] = useState("Sala 107");
  const scheduled = classes.filter((t) => t.room === room);
  return (
    <>
      <Header
        title="Calendário"
        subtitle="Agenda semanal de ocupação das salas."
        navigate={navigate}
        notifications={() => {}}
      />
      <div className="calendar-toolbar">
        <label>
          Sala
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option>Sala 107</option>
            <option>Sala 222</option>
            <option>Sala 104</option>
          </select>
        </label>
        <strong>07 – 12 de setembro de 2026</strong>
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
                  <article key={item.id}>
                    <strong>{item.course}</strong>
                    <small>
                      {item.time}
                      <br />
                      {item.teacher}
                    </small>
                  </article>
                ))
            ) : (
              <span className="free-slot">Livre</span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
function MapPage({ classes, navigate, findRoom, editClass }) {
  const [q, setQ] = useState(""),
    [only, setOnly] = useState(false),
    [compact, setCompact] = useState(false),
    [expanded, setExpanded] = useState(null);
  const rows = classes
    .filter((t) => !only || !t.room)
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
          <b>{classes.filter((t) => !t.room).length}</b>
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
                  <td>{t.time}</td>
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

function FinderPage({
  classItem,
  classes,
  navigate,
  selectRoom,
  defineAgenda,
}) {
  const analyzedRooms = analyzeRooms(classItem, classes);
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
            {classItem.time}
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
      <div className="room-grid">
        {analyzedRooms.map((r) => (
          <article
            className={`room-card ${r.ok ? "recommended" : ""}`}
            key={r.name}
          >
            <div className="room-head">
              <div
                className={`state-icon ${r.ok ? "ok" : r.disabled ? "no" : "warn"}`}
              >
                {r.ok ? <CheckCircle2 /> : <AlertTriangle />}
              </div>
              <div>
                <h3>{r.name}</h3>
                <p>{r.type}</p>
              </div>
              {r.name === "Sala 222" && (
                <Badge kind="allocation">Recomendada</Badge>
              )}
            </div>
            <div className="capacity">
              <span>Capacidade</span>
              <strong>{r.capacity} pessoas</strong>
              <small>
                {r.capacity >= classItem.students
                  ? "Adequada para a turma"
                  : `Necessário: ${classItem.students}`}
              </small>
            </div>
            <Badge
              kind={
                r.ok
                  ? "allocation"
                  : r.conflict || r.state === "Incompatível"
                    ? "danger"
                    : "pending"
              }
            >
              {r.state}
            </Badge>
            <p className="room-detail">{r.detail}</p>
            <div className="room-footer">
              {r.ok ? (
                <button className="primary" onClick={() => selectRoom(r)}>
                  Alocar {r.name}
                </button>
              ) : r.conflict ? (
                <button className="outline" onClick={() => alert(r.detail)}>
                  Ver conflitos
                </button>
              ) : (
                <button disabled>Indisponível</button>
              )}
              <button className="link-btn" onClick={() => navigate("calendar")}>
                Ver agenda
              </button>
            </div>
          </article>
        ))}
      </div>
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
              {data.classItem.days} · {data.classItem.time}
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
  const [classes, setClasses] = useState(initialClasses);
  const [selected, setSelected] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");
  const navigate = (next) => {
    setPage(next);
    if (next !== "finder") setSelected(null);
  };
  const findRoom = (item) => {
    setSelected({ ...item, returnPage: page });
    setPage("finder");
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
    const { id } = confirmation.classItem;
    const room = confirmation.room.name;
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
    const updated = remainsValid ? candidate : { ...candidate, room: null };
    setClasses((all) =>
      all.map((item) => (item.id === updated.id ? updated : item)),
    );
    setEditing(null);
    setToast(
      remainsValid
        ? "Turma atualizada com sucesso."
        : "Turma atualizada. A sala foi liberada porque a nova agenda possui conflito.",
    );
    setTimeout(() => setToast(""), 4500);
  };
  const createClass = (data) => {
    const draft = {
      ...initialClasses[1],
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
      content = <RoomsPage classes={classes} {...props} />;
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
      content = <DirectoryPage type="teachers" {...props} />;
      break;
    case "calendar":
      content = <CalendarPage classes={classes} {...props} />;
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
        pending={classes.filter((t) => !t.room).length}
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
