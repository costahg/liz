// src/relatorio.jsx
import React, { useMemo, useState, useEffect } from "react";

// UI (shadcn) — usando caminhos relativos para evitar problema de alias
import { Card, CardHeader, CardContent, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/ui/accordion";

// Ícones
import {
  BarChart3,
  ExternalLink,
  FileSpreadsheet,
  CheckCircle2,
  Rocket,
  Users,
  Star,
  Filter,
  Download,
  Calendar,
  Notebook,
  BookOpenText,
  ArrowUpRight,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/**
 * Relatório visual em React baseado no conteúdo final.
 * - Resumo em tópicos com o texto EXATO
 * - Resultados Mensuráveis com linhas claras + gráfico + links de evidência
 * - Relatório Diário em carrossel
 */

// -----------------------------
// Dados
// -----------------------------

const linksEvidencias = [
  {
    title: "Planilha de Leads",
    href: "https://docs.google.com/spreadsheets/d/1Ia0cftQ9RcxpBbvV9p_XsEX4ZGRrkppYvzJ8D3zgqkw/edit?usp=sharing",
    icon: FileSpreadsheet,
  },
  {
    title: "Leads Perdidos Antes do Nosso Contrato",
    href: "https://drive.google.com/file/d/1HUYZ0vJKWFrpyn_xqtW7zzwKMCotAux6/view?usp=sharing",
    icon: ExternalLink,
  },
  {
    title: "Volume de Posts",
    href: "https://drive.google.com/file/d/1PEovQH8lv74UWh11osD63XMv6H7kxJeS/view?usp=sharing",
    icon: ExternalLink,
  },
];

const resultadosMensuraveis = {
  ate: "22/09/2025",
  leads: { media: 57, pico: 119, picoData: "18/09", total: 803 },
  interacoes: { media: 32, pico: 43 },
  conteudos: 70,
  decorados: 6,
  meetings: 1,
  reunioes: 9,
  takes: 183,
  edicoes: 47,
  artes: 94,
};

const sugestoes = [
  {
    titulo: "Publicação multicanal automática",
    objetivo:
      "1 clique publica no Instagram, TikTok e Facebook das 5 imobiliárias",
    beneficio: "padroniza copy e hashtags, reduz tempo operacional",
  },
  {
    titulo: "Robô de Social Selling",
    objetivo:
      "cobrir interações em 24h para leads recebidos nas redes sociais",
    beneficio: "menos não respondidos, mais conversão",
  },
  {
    titulo: "Leads: WhatsApp → C2S",
    objetivo: "corrigir o site de envio de lead para enviar via C2S",
    beneficio: "rastreabilidade, distribuição justa, menor risco de exposição",
  },
];

const equipe = [
  {
    role: "Filmmaker",
    stars: 7,
    desc: "grava tudo, reduz gargalo de captura",
    icon: Video,
  },
  {
    role: "Editor",
    stars: 6,
    desc: "5 vídeos por dia pedem edição dedicada",
    icon: Notebook,
  },
  {
    role: "Social Selling",
    stars: 5,
    desc: "5 contas ativas exigem presença contínua",
    icon: Users,
  },
  { role: "Gestor de Tráfego", stars: 4, desc: "otimiza gasto e ROI", icon: Rocket },
  { role: "Design", stars: 3, desc: "demanda real, tira fila", icon: BookOpenText },
  {
    role: "Content Uploader",
    stars: 2,
    desc: "operação de posts multicanal",
    icon: ArrowUpRight,
  },
  {
    role: "Content Creator",
    stars: 1,
    desc: "ativa quando corretor não grava",
    icon: Notebook,
  },
];

// Concluídas por categoria
const entregas = [
  {
    categoria: "Publicações, interação e leads",
    itens: [
      "Publicar post diário, interagir nos perfis e enviar leads em volume alto",
      "Interagir nos perfis sem postagem, com foco em relacionamento e captação de leads",
      "Interagir em 5 perfis diferentes para aquecer audiências",
      "Ajustar site de envio de leads para corrigir queda de captação",
      "Fazer lista de leads antigos no Instagram para reativação",
    ],
  },
  {
    categoria: "Edição de vídeos (por pessoa ou projeto)",
    itens: [
      "Regina editar vídeos recorrentes para redes",
      "Lucas editar vídeo solicitado",
      "Gois editar vídeo urgente com entrega única",
      "Conti produzir e editar vídeos, incluindo o caso Atropelado",
      "Renan editar vídeos 1, 2 e 3",
      "Ruth editar vídeos para campanhas",
      "Ianca editar vídeo enviado",
      "Débora editar material para a Ianca",
      "Ribas editar vídeos 1, 2 e 3",
      "Flaviana produzir e editar vídeos 1, 2 e 3",
      "Kaue editar vídeos 1 e 2 para anúncio",
      "Stevam editar vídeo principal",
      "Café, Reuniões e Prêmios editar compilações de eventos internos",
      "Edição mínima e rápida de vários vídeos para cumprir prazos",
    ],
  },
  {
    categoria: "Filmagens, gravações e fotos",
    itens: [
      "Gravar 5 vídeos para TikTok e Instagram",
      "Café da Manhã, camisetas, patrocínio das construtoras e loja cheia, com edição",
      "Gravar 4 vídeos em decorado ou apê pronto durante visita",
      "Lais gravar 2 vídeos e entregar com correções",
      "Vila Prudente gravar vídeo da reunião",
      "Sapopemba gravar vídeo da reunião",
      "Realizar sessão de fotos profissional",
      "Andrew gravar vídeo colaborativo",
      "Produzir vídeos decorado 1 e 2 e Renan 1, 2 e 3",
      "Produzir Vídeo Meme 1 e 2",
    ],
  },
  {
    categoria: "Criação de artes e design",
    itens: [
      "Setembro Amarelo criar artes para equipes e campanha",
      "Instagram criar artes para postagens",
      "Richard criar arte sob demanda",
      "Karine criar arte de apoio para posts",
      "Ruth criar arte de feirão",
      "QR Code criar artes e checar produção em gráfica",
      "Criar artes para posts diversos, padronização visual",
    ],
  },
  {
    categoria: "Roteiros, páginas e relatórios",
    itens: [
      "Escrever roteiro para Ste",
      "Criar site do relatório e avançar no desenvolvimento",
      "Finalizar o esqueleto do relatório e evoluir para versão quase final",
      "Criar servidor para o site de envio de leads",
      "Testar e finalizar o site de envio de leads, funcional",
    ],
  },
  {
    categoria: "Gestão de contas, perfis e social",
    itens: [
      "Barra Funda recuperar acesso ao Instagram com o Matheus, retirada presencial",
      "Sapopemba criar página no Facebook e ajustar bio",
      "Organizar e melhorar perfis de corretores e corretores no Instagram",
      "Resolver senhas e acessos para Barra Funda e Sapopemba",
      "Roger publicar post dedicado e apoiar com edição",
    ],
  },
  {
    categoria: "Organização de acervo e processos",
    itens: [
      "Organizar pastas dos vídeos prontos para fluxo de entrega",
      "Organizar vídeos em galerias por tema ou projeto",
      "Criar plano de edição para alta demanda",
      "Criar calendário de gravações para produção contínua",
      "Organizar lotes de vídeos para publicação sequenciada",
    ],
  },
  {
    categoria: "Reuniões, eventos e documentação",
    itens: [
      "Itaquera participar de reunião local",
      "Vila Prudente participar de reunião e documentar",
      "Sapopemba participar de reunião e documentar",
      "Igor realizar meeting e visita a decorado",
      "Resumir meeting da Tenda a partir de 1h44m de vídeo",
      "Reunião às 15h com anotações formais",
      "Felipe realizar reunião estratégica",
    ],
  },
  {
    categoria: "Visitas a decorados e externas",
    itens: [
      "Graal visitar decorado para referência de conteúdo",
      "Vila Prudente visitar decorado e produzir materiais",
      "Viajar para Vila Prudente e Sapopemba para operações",
      "Visitar apartamento pronto e capturar mais de 4 vídeos",
    ],
  },
  {
    categoria: "Roteiros e campanhas específicas",
    itens: [
      "Gal escrever roteiro para vídeo temático",
      "Cesão produzir post dedicado",
      "Prova Social e Karine entregar vídeo de prova social com correções",
      "Regina produzir vídeo Eficaz específico da campanha",
      "QR Code e Karina alinhar QR code para distribuição em campo",
      "Independência criar arte temática da campanha",
    ],
  },
  {
    categoria: "Sites e tecnologia de captação",
    itens: [
      "Criar site para envio de leads a partir do zero",
      "Configurar servidor e infraestrutura para o site de leads",
      "Testar, finalizar e publicar a primeira versão do site de leads",
    ],
  },
  {
    categoria: "Administrativos e onboarding",
    itens: ["Assinar contrato e formalizar início", "Coletar todas as contas da imobiliária para gestão centralizada"],
  },
  {
    categoria: "Estudos e pessoal",
    itens: [
      "Concluir grandes blocos de atividades da faculdade, dia inteiro quando necessário",
      "Resolver logística pessoal, caçar bilhete único e realizar deslocamento longo",
    ],
  },
];

// Relatório diário — TEXTO EXATO
const diario = [
  {
    data: "21/09/2025",
    titulo: "Folga",
    texto:
      "Apesar de marcado como folga, o dia foi absorvido por responsabilidades. Logo cedo finalizei o post diário, interações e envio de leads, em quantidade bem acima do normal. Em seguida, reservei tempo para edições pontuais de vídeos, feitas de forma rápida, já que o foco principal estava em outras demandas. A maior parte das horas foi tomada pelas atividades da faculdade, acumuladas e exigentes, que ocuparam praticamente todo o dia. Foi um processo exaustivo, mas necessário para manter o cronograma acadêmico em dia. Ao final, sobrou pouco espaço para descanso, embora tenha havido sensação de alívio por concluir tarefas atrasadas.",
  },
  {
    data: "20/09/2025",
    titulo: "",
    texto:
      "O dia foi caracterizado por múltiplas entregas em sequência. Mantive a rotina de post diário, interações e leads, garantindo a continuidade da estratégia digital. Em paralelo, produzi conteúdos diversificados, entre eles vídeos de Café da Manhã, Camisetas, Patrocínio das Construtoras e Loja Cheia. A etapa seguinte foi a edição de todos esses materiais, tarefa extensa que exigiu foco e organização. Também avancei no relatório, já próximo da versão final, o que demandou atenção a detalhes técnicos. A carga de trabalho foi alta, mas os resultados mostraram avanço consistente em várias frentes.",
  },
  {
    data: "19/09/2025",
    titulo: "",
    texto:
      "Este foi um dia de execução intensiva. Comecei com criação de artes, seguida pela rotina de post diário, interação e envio de leads. A prioridade foi a edição urgente do vídeo do Gois, concluída em ritmo acelerado devido ao prazo apertado. Logo depois, direcionei esforços para os vídeos de reuniões, cafés e prêmios, que exigiram tratamento detalhado. Para encerrar, finalizei a produção e edição de material para a Regina. A sequência de atividades mostrou alto nível de demanda, porém concluiu-se de forma satisfatória, dentro do esperado para os prazos.",
  },
  {
    data: "18/09/2025",
    titulo: "",
    texto:
      "O dia teve início com imprevistos de transporte, prolongando o tempo de deslocamento. Mesmo assim, produzi a arte de Setembro Amarelo, com foco temático. Outra tarefa central foi a reorganização dos perfis de corretores e corretoras no Instagram, processo demorado pela quantidade envolvida. Produzi ainda dois vídeos direcionados ao Conti e ao Gois, além de artes complementares para manter a consistência das publicações. O envio de leads se destacou pelo volume, ultrapassando a marca de 100 no mesmo dia, superando a média habitual. Já há registro de horas extras acumuladas na imob, o que evidencia a intensidade das entregas.",
  },
  {
    data: "17/09/2025",
    titulo: "Folga",
    texto:
      "Embora definido como folga, o dia foi preenchido por tarefas acadêmicas e profissionais. Realizei interações e envio de leads, mantendo a regularidade. O período da manhã e parte da tarde foram consumidos pelas atividades da faculdade, de alta complexidade. No campo audiovisual, editei cinco vídeos e finalizei entregas da Lais e da Karine, incluindo correções solicitadas. Também produzi arte para o Richard e finalizei a criação do Facebook de Sapopemba, ajustando a bio e outros detalhes. A soma de atividades reforça o padrão de produtividade mesmo em dias destinados ao descanso.",
  },
  {
    data: "16/09/2025",
    titulo: "",
    texto:
      "As atividades do dia foram organizadas de forma sequencial. Iniciei com post diário, interação e envio de leads, consolidando a base de trabalho. Na sequência, produzi artes e reorganizei vídeos para evitar atrasos futuros. Avancei também no desenvolvimento do site de relatório, que exigiu foco em estruturação e clareza. Conduzi a elaboração de roteiro para a Ste e finalizei a edição de vídeo de café, de execução mais técnica. Encerrando a jornada, participei da reunião em Itaquera, alinhando pontos estratégicos. O saldo do dia foi positivo, com entregas equilibradas entre criatividade, técnica e planejamento.",
  },
  {
    data: "15/09/2025",
    titulo: "",
    texto:
      "O dia foi marcado por deslocamentos estratégicos, com visitas a Vila Prudente e Sapopemba. Em campo, realizei gravações para reuniões nas duas unidades, além de uma sessão de fotos complementar. Paralelamente, finalizei a edição de materiais específicos, como o vídeo da Regina, o vídeo do Stevam e conteúdos gastronômicos de Sapopemba. Para evitar acúmulos, organizei as pastas com vídeos já prontos, criando um fluxo mais limpo para futuras entregas. Mantive também a rotina de interação, postagem e envio de leads, consolidando presença digital. Foi um dia intenso, equilibrando atividades externas com finalizações técnicas.",
  },
  {
    data: "13/09/2025",
    titulo: "",
    texto:
      "A rotina começou com a publicação de conteúdo para Roger, seguida pelo post diário, interações e envio de leads. A parte técnica foi voltada à edição de vídeos de Renan e Felipe, além da criação de uma arte para postagem. Registrei e editei também o material de café, somando ao trabalho de correção do site de envio de leads, que apresentou instabilidade, mas garantiu mais de 40 contatos enviados. Para encerrar, produzi e finalizei o vídeo solicitado pelo Conti, relacionado ao caso do atropelado, que exigiu atenção até o final da noite. O saldo foi produtivo, mas com carga horária estendida.",
  },
  {
    data: "12/09/2025",
    titulo: "",
    texto:
      "As entregas do dia tiveram como destaque a produção de vídeos para clientes distintos. Visitei o decorado Graal, o que gerou material para diferentes edições. Foram gravados e finalizados três vídeos para Flaviana e três para Ribas, além da edição do terceiro vídeo de Renan. Mantive a disciplina no post diário, interações e envio de leads, fortalecendo a frente digital. Em paralelo, elaborei uma lista de leads antigos no Instagram, visando resgatar contatos já existentes. O dia combinou produção prática, edição técnica e ações de prospecção.",
  },
  {
    data: "11/09/2025",
    titulo: "Folga",
    texto:
      "Embora agendado como folga, o tempo foi utilizado de forma produtiva. Realizei edições dos dois primeiros vídeos de Renan, além de conteúdos de decorados. Também publiquei postagens para Roger, mantive interações e postagens rotineiras. A maior parte do dia, no entanto, foi destinada às atividades acadêmicas, com foco em trabalhos da faculdade. Foi um equilíbrio entre demandas profissionais essenciais e compromissos pessoais de formação.",
  },
  {
    data: "10/09/2025",
    titulo: "",
    texto:
      "O dia iniciou com visita ao decorado de Vila Prudente, seguido pela produção de dois vídeos no local. No campo de edição, finalizei três vídeos de Renan, dois memes e dois para Kaue. Também trabalhei nos materiais de Débora e Roger, ampliando o volume de entregas. Realizei o post diário e mantive interações, sem comprometer a rotina digital. Por fim, concluí os testes e ajustes finais do site de envio de leads, encerrando essa frente técnica. O dia foi longo, mas com a sensação de consolidar várias etapas em paralelo.",
  },
  {
    data: "09/09/2025",
    titulo: "",
    texto:
      "As entregas seguiram a cadência planejada, com post diário, interações e gravação de vídeo para Cesão. Em edição, finalizei materiais de Ruth, Tenda e Cesão, mantendo consistência na qualidade. Trabalhei na organização de vídeos em galerias, criando mais clareza para gestão do acervo. Também desenvolvi um plano de edição, considerando o aumento da demanda, além de estruturar um calendário de gravações para melhor controle de prazos. Faltou apenas a conclusão da arte para Karine, que permaneceu em aberto. Foi um dia de estruturação, essencial para alinhar o fluxo de trabalho.",
  },
  {
    data: "08/09/2025",
    titulo: "",
    texto:
      "O dia foi praticamente dividido entre criação e execução. Realizei o post diário e interações, além da edição de vídeos de enquetes. O ponto central foi a visita ao apartamento pronto, que gerou quatro novos vídeos e consumiu grande parte do dia. Após retorno, finalizei a edição de artes, dando andamento a conteúdos complementares. Foi uma rotina densa, com foco no campo e na pós-produção, sem comprometer a constância das entregas digitais.",
  },
  {
    data: "07/09/2025",
    titulo: "Folga",
    texto:
      "Ainda que classificado como folga, o dia foi inteiramente voltado ao desenvolvimento do site de envio de leads, prioridade absoluta. Mantive as interações rotineiras e avancei em edições, incluindo materiais para Ruth e o Meeting, este último ainda em processo. O vídeo da Barra Funda também entrou na pauta, mas ficou em andamento. A data representou mais um marco de construção técnica do que um descanso efetivo.",
  },
  {
    data: "06/09/2025",
    titulo: "",
    texto:
      "A rotina se dividiu entre entregas criativas e ajustes técnicos. Logo cedo realizei interações, postagens e três vídeos. O ponto central foi o resumo do Meeting da Tenda, que somou quase duas horas de conteúdo analisado. Também configurei o servidor para o site de envio de leads, etapa preparatória para finalização do projeto. Publiquei ainda conteúdo para Cesão e finalizei edições para Ianca, Regina e Ruth. Embora o site não tenha sido concluído, houve avanço consistente.",
  },
  {
    data: "05/09/2025",
    titulo: "",
    texto:
      "A agenda iniciou com um meeting e visita a decorado junto a Igor, consolidando pautas de campo. Em seguida, mantive interações e práticas de social selling, além da gravação de quatro vídeos. Trabalhei também na edição de conteúdos antigos de corretores, ao mesmo tempo em que me desloquei até Barra Funda para ajustes de conta com Matheus. O site de leads permaneceu em desenvolvimento. Além disso, produzi QR Code junto à Karina e gravei dois vídeos adicionais para Lais. O dia foi extenso, cobrindo atividades presenciais, técnicas e administrativas.",
  },
  {
    data: "04/09/2025",
    titulo: "",
    texto:
      "A execução foi diversificada. Realizei interações e postagens, gravei e editei três vídeos, além de redigir roteiro para Gal. Mantive contato com Matheus, mas ainda aguardando resposta. Paralelamente, avancei em edições de vídeos para Ianca e finalizei a arte do QR Code. Visitei a gráfica para orçamento, mas não havia opção de plastificação. Também produzi a arte de feirão para Ruth, atendendo demanda imediata. A criação do site de leads seguiu em progresso, mas sem finalização.",
  },
  {
    data: "03/09/2025",
    titulo: "Folga",
    texto:
      "Mesmo em folga, o dia foi consumido por ajustes diversos. Realizei posts diários e interações em cinco perfis. Também preparei postagens futuras e finalizei vídeo para anúncio de Kaue. Resolvi pendências de senhas relacionadas às unidades de Barra Funda e Sapopemba, além de desenvolver a arte de Independência, que exigiu dedicação ao longo de todo o dia. Aguardava apenas retorno de Matheus para concluir um ponto em aberto.",
  },
  {
    data: "02/09/2025",
    titulo: "",
    texto:
      "O foco do dia foi a produção e edição de vídeos para clientes distintos: Regina, Débora, Felipe e Andrew. Participei de reunião às 15h, registrando anotações importantes. Além disso, trabalhei na arte para Independência, ainda em progresso, e iniciei o QR Code de Felipe, também não concluído. Foi uma rotina de alta produção, alternando entre gravação, edição e desenvolvimento criativo.",
  },
  {
    data: "01/09/2025",
    titulo: "",
    texto:
      "A data marcou um volume expressivo de entregas. Foram produzidos cinco vídeos para TikTok e Instagram, consolidando presença digital. Também concentrei esforços em captar e organizar todas as contas da imob, etapa administrativa essencial. Houve assinatura de contrato e reunião estratégica com Felipe. Por fim, finalizei a gravação e edição do vídeo da festa, encerrando o dia com resultados completos em diferentes áreas.",
  },
];

const encerramento = {
  texto:
    "Encerramento do ciclo para priorizar a faculdade e o propósito original de crescer, estudar e buscar qualidade de vida.",
  citação:
    "Buscai primeiro o reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas",
  ref: "Mateus 6:33",
  disponibilidade:
    "Permaneço disponível como corretor e para auxiliar o próximo funcionário que for exercer a função.",
};

// -----------------------------
// Utils
// -----------------------------

function runDevTests() {
  try {
    const invalidDiario = diario.filter((d) => !d.data || !d.texto);
    console.assert(
      invalidDiario.length === 0,
      "[TEST] Diário precisa de 'data' e 'texto'",
      invalidDiario
    );
  } catch (err) {
    console.error("[TEST] Falha nos testes de sanidade:", err);
  }
}

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0.1, 0.3, 0.6] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const Section = ({ id, title, children, icon: Icon }) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-center gap-3 mb-4">
      {Icon ? <Icon className="h-5 w-5" /> : null}
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
    <div>{children}</div>
  </section>
);

const EvidenceCard = ({ title, href, Icon }) => (
  <a href={href} target="_blank" rel="noreferrer" className="group">
    <Card className="h-full transition-transform group-hover:-translate-y-0.5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="ghost" size="sm" className="gap-2 p-0">
          Abrir
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  </a>
);

const TeamCard = ({ role, stars, desc, Icon }) => {
  const IconComp = Icon || Users;
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <IconComp className="h-4 w-4" /> {role}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < stars ? "fill-current" : "opacity-30"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
};

const Nav = ({ sections }) => {
  const active = useScrollSpy(sections.map((s) => s.id));
  return (
    <nav className="sticky top-4 bg-background/80 backdrop-blur rounded-2xl border p-3">
      <ul className="space-y-1">
        {sections.map((s) => (
          <li key={s.id}>
            <Button
              variant={active === s.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                document
                  .getElementById(s.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {s.icon ? <s.icon className="h-4 w-4 mr-2" /> : null}
              {s.title}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const LeadsBarChart = () => {
  const data = [
    { name: "Média", valor: resultadosMensuraveis.leads.media },
    { name: "Pico", valor: resultadosMensuraveis.leads.pico },
    { name: "Total", valor: resultadosMensuraveis.leads.total },
  ];
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="valor" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const PrintButton = () => (
  <Button onClick={() => window.print()} className="gap-2" variant="outline">
    <Download className="h-4 w-4" /> Exportar para PDF
  </Button>
);

// -----------------------------
// Carrossel Diário
// -----------------------------
const DailyCarousel = ({ items }) => {
  const [idx, setIdx] = useState(0);
  const len = items.length;

  const prev = () => setIdx((i) => (i - 1 + len) % len);
  const next = () => setIdx((i) => (i + 1) % len);

  const prevIdx = (idx - 1 + len) % len;
  const nextIdx = (idx + 1) % len;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [len]);

  const SlideCard = ({ d, variant, onClick }) => {
    const base = "absolute top-0 h-full transition-all duration-300 ease-out";
    const commonCard = "h-full select-none bg-card"; // fundo sólido
    const clampText = "text-sm text-muted-foreground leading-relaxed max-h-40 overflow-hidden"; // sem plugin

    if (variant === "center") {
      return (
        <div className={`${base} left-1/2 -translate-x-1/2 w-[56%] md:w-[52%] scale-100 opacity-100 z-30`}>
          <Card className={commonCard} aria-current="true">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {d.data}
                {d.titulo ? <Badge variant="secondary" className="ml-2">{d.titulo}</Badge> : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {d.texto}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (variant === "left") {
      return (
        <div className={`${base} left-[3%] w-[26%] md:w-[22%] scale-95 opacity-90 z-10`}>
          <Card className={commonCard + " cursor-pointer"} onClick={onClick} aria-label="Anterior">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {d.data}
                {d.titulo ? <Badge variant="secondary" className="ml-2">{d.titulo}</Badge> : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pointer-events-none">
              <p className={clampText}>{d.texto}</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // right
    return (
      <div className={`${base} right-[3%] w-[26%] md:w-[22%] scale-95 opacity-90 z-10`}>
        <Card className={commonCard + " cursor-pointer"} onClick={onClick} aria-label="Próximo">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {d.data}
              {d.titulo ? <Badge variant="secondary" className="ml-2">{d.titulo}</Badge> : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pointer-events-none">
            <p className={clampText}>{d.texto}</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="relative w-full h-[360px] md:h-[340px]">
      <div className="absolute inset-0">
        <SlideCard d={items[prevIdx]} variant="left" onClick={prev} />
        <SlideCard d={items[idx]} variant="center" />
        <SlideCard d={items[nextIdx]} variant="right" onClick={next} />
      </div>

      {/* Controles */}
      <div className="absolute inset-y-0 left-2 sm:left-4 flex items-center">
        <Button size="icon" variant="secondary" className="rounded-full shadow" onClick={prev} aria-label="Anterior">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-2 sm:right-4 flex items-center">
        <Button size="icon" variant="secondary" className="rounded-full shadow" onClick={next} aria-label="Próximo">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground select-none">
        {idx + 1} / {len}
      </div>
    </div>
  );
};


// -----------------------------
// Componente principal
// -----------------------------

export default function RelatorioHenriqueSite() {
  const [busca, setBusca] = useState("");
  const categoriasFiltradas = useMemo(() => {
    if (!busca) return entregas;
    const term = busca.toLowerCase();
    return entregas
      .map((c) => ({
        ...c,
        itens: c.itens.filter((i) => i.toLowerCase().includes(term)),
      }))
      .filter((c) => c.itens.length > 0);
  }, [busca]);

  useEffect(() => {
    if (typeof window !== "undefined") runDevTests();
  }, []);

  const sections = [
    { id: "resumo", title: "Resumo Executivo", icon: BarChart3 },
    { id: "resultados", title: "Resultados", icon: CheckCircle2 },
    { id: "sugestoes", title: "Sugestões", icon: Rocket },
    { id: "equipe", title: "Equipe", icon: Users },
    { id: "entregas", title: "Entregas", icon: Notebook },
    { id: "diario", title: "Relatório Diário", icon: Calendar },
    { id: "encerramento", title: "Encerramento", icon: BookOpenText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/75 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                Relatório de Entregas, Henrique
              </h1>
              <p className="text-xs text-muted-foreground">
                Período com registro até {resultadosMensuraveis.ate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PrintButton />
            <Button
              variant="default"
              className="gap-2"
              onClick={() =>
                window.open(linksEvidencias[0].href, "_blank", "noreferrer")
              }
            >
              <FileSpreadsheet className="h-4 w-4" /> Abrir planilha
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Nav */}
        <div className="hidden lg:block col-span-1">
          <Nav sections={sections} />
        </div>

        {/* Content */}
        <div className="col-span-1 lg:col-span-3 space-y-12">
          {/* RESUMO (tópicos, texto exato) */}
          <Section id="resumo" title="Resumo Executivo" icon={BarChart3}>
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Resumo</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base">
                <li>Leads/dia: média 57, pico 119</li>
                <li>Produção: 183 takes, 47 edições, 70 posts</li>
                <li>Operação: 5 perfis ativos, social selling 9h–23h</li>
                <li>
                  Eficiência: recuperação de ~25 mil leads perdidos antes do
                  contrato (evidência em anexo)
                </li>
                <li>Próximos passos: automações e ajuste de equipe para escala</li>
              </ul>
            </div>
          </Section>

          {/* RESULTADOS (linhas claras + gráfico + evidências) */}
          <Section id="resultados" title="Resultados Mensuráveis" icon={CheckCircle2}>
            <div className="space-y-6">
              <div className="space-y-2">
                {[
                  `Leads enviados/dia: ${resultadosMensuraveis.leads.media} média | Pico: ${resultadosMensuraveis.leads.pico} (${resultadosMensuraveis.leads.picoData}) | Total: ${resultadosMensuraveis.leads.total}`,
                  `Interações/dia: ${resultadosMensuraveis.interacoes.media} média | Pico: ${resultadosMensuraveis.interacoes.pico}`,
                  `Conteúdos postados: ${resultadosMensuraveis.conteudos}`,
                  `Decorados visitados: ${resultadosMensuraveis.decorados} | Meetings: ${resultadosMensuraveis.meetings} | Reuniões: ${resultadosMensuraveis.reunioes}`,
                  `Takes gravados: ${resultadosMensuraveis.takes} | Edições: ${resultadosMensuraveis.edicoes} | Artes: ${resultadosMensuraveis.artes}`,
                ].map((linha) => (
                  <div
                    key={linha}
                    className="rounded-xl border bg-card p-3 text-sm sm:text-base font-medium"
                  >
                    {linha}
                  </div>
                ))}
              </div>

              <div>
                <LeadsBarChart />
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                {linksEvidencias.map((l) => (
                  <EvidenceCard
                    key={l.title}
                    title={l.title}
                    href={l.href}
                    Icon={l.icon}
                  />
                ))}
              </div>
            </div>
          </Section>

          <Section id="sugestoes" title="Sugestões de Implantação e Automação" icon={Rocket}>
            <Accordion type="single" collapsible className="w-full">
              {sugestoes.map((s, idx) => (
                <AccordionItem key={s.titulo} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-4 w-4" /> {s.titulo}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Objetivo</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          {s.objetivo}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Benefício</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          {s.beneficio}
                        </CardContent>
                      </Card>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Section>

          <Section id="equipe" title="Equipe Recomendada" icon={Users}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipe.map((p) => (
                <TeamCard
                  key={p.role}
                  role={p.role}
                  stars={p.stars}
                  desc={p.desc}
                  Icon={p.icon}
                />
              ))}
            </div>
          </Section>

          <Section id="entregas" title="Entregas Concluídas" icon={Notebook}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Filtrar por palavra"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setBusca("")}
                >
                  <Filter className="h-4 w-4" /> Limpar
                </Button>
              </div>
              <div className="space-y-6">
                {categoriasFiltradas.map((c) => (
                  <div key={c.categoria}>
                    <h3 className="text-lg font-semibold mb-2">
                      {c.categoria}
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                      {c.itens.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5" />
                          <span className="text-sm">{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="diario" title="Relatório Diário" icon={Calendar}>
            <DailyCarousel items={diario} />
          </Section>

          <Section id="encerramento" title="Encerramento" icon={BookOpenText}>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  {encerramento.texto}
                </p>
                <blockquote className="border-l-2 pl-4 italic text-sm">
                  “{encerramento.citação}” — {encerramento.ref}
                </blockquote>
                <p className="text-sm text-muted-foreground">
                  {encerramento.disponibilidade}
                </p>
              </CardContent>
            </Card>
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Este site reflete o Relatório Final. Links de evidência na seção de Resultados.
      </footer>
    </div>
  );
}
