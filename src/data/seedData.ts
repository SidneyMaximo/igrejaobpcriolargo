import {
  ChurchInfo,
  WeeklySchedule,
  ChurchEvent,
  MediaFolder,
  MediaItem,
  PrayerRequest,
  ChurchMember,
  FinancialTransaction,
  SystemUser,
  AuditLog,
  ChurchDepartment
} from '../types';

export const INITIAL_CHURCH_INFO: ChurchInfo = {
  name: 'Igreja O Brasil Para Cristo',
  subtitle: 'Uma Família que Ama a Deus, Serve ao Próximo e Vive a Palavra',
  pastorName: 'Pr. Janildo Manoel',
  vicePastorName: '',
  address: 'Loteamento 3 amigos, 3 - Forene',
  cityState: 'Rio Largo - AL',
  zipCode: '57100-000',
  phone: '(82) 3214-8800',
  whatsapp: '(82) 999694402',
  email: 'obpcriolargo@gmail.com',
  pixKey: '82999694402',
  pixKeyType: 'Telefone',
  pixRecipient: 'Igreja O Brasil Para Cristo',
  bankName: 'Mercado Pago',
  bankAgency: '',
  bankAccount: '',
  youtubeChannelUrl: 'https://youtube.com/@obpcriolargo',
  instagramUrl: 'https://instagram.com/obpcriolargo',
  facebookUrl: 'https://facebook.com',
  liveStreamUrl: 'https://youtube.com/@obpcriolargo/live',
  historyText: 'Fundada pelo missionário Manoel de Mello em 1956, a Igreja O Brasil Para Cristo é um ministério de fé, avivamento pentecostal, evangelização vibrante e profundo compromisso social. Nosso propósito é levar a salvação em Cristo a cada lar e transformar vidas pelo poder do Evangelho.'
};

export const INITIAL_SCHEDULES: WeeklySchedule[] = [
  {
    id: 'sch-1',
    dayOfWeek: 'Segunda',
    time: '19:00',
    title: 'Círculo de Oração',
    ministry: 'UFEBRAC / Intercessão',
    description: 'Momento de clamor, oração e busca pelo poder de Deus na congregação Forene.',
    leader: 'Liderança Círculo de Oração',
    location: 'Forene',
    iconName: 'flame',
    colorTag: 'rose',
    order: 1
  },
  {
    id: 'sch-2',
    dayOfWeek: 'Terça',
    time: '19:30',
    title: 'Círculo de Oração',
    ministry: 'UFEBRAC / Intercessão Geral',
    description: 'Encontro de clamor e intercessão pelas famílias, enfermos e causas especiais no templo sede.',
    leader: 'Liderança Círculo de Oração',
    location: 'Sede',
    iconName: 'flame',
    colorTag: 'rose',
    order: 2
  },
  {
    id: 'sch-3',
    dayOfWeek: 'Quarta',
    time: '19:30',
    title: 'Culto da ADOBRAC',
    ministry: 'ADOBRAC (Adolescentes O Brasil Para Cristo)',
    description: 'Culto vibrante com louvor, dinâmica bíblica e ministração direcionada aos adolescentes no templo sede.',
    leader: 'Liderança ADOBRAC',
    location: 'Sede',
    iconName: 'zap',
    colorTag: 'amber',
    order: 3
  },
  {
    id: 'sch-4',
    dayOfWeek: 'Quinta',
    time: '19:30',
    title: 'Culto da ADOBRAC',
    ministry: 'ADOBRAC (Adolescentes O Brasil Para Cristo)',
    description: 'Louvor congregacional, adoração e comunhão para os adolescentes na congregação Forene.',
    leader: 'Liderança ADOBRAC',
    location: 'Forene',
    iconName: 'zap',
    colorTag: 'amber',
    order: 4
  },
  {
    id: 'sch-5',
    dayOfWeek: 'Sábado',
    time: '19:30',
    title: 'Culto de Ensino',
    ministry: 'Ministério de Ensino & Doutrina',
    description: 'Estudo aprofundado das Sagradas Escrituras, doutrina bíblica e fortalecimento espiritual no templo sede.',
    leader: 'Ministério Pastoral & Ensino',
    location: 'Sede',
    iconName: 'book-open',
    colorTag: 'blue',
    order: 5
  },
  {
    id: 'sch-6',
    dayOfWeek: 'Domingo',
    time: '05:00',
    title: 'Sala de Oração',
    ministry: 'Intercessão & Clamor Matinal',
    description: 'Oração e consagração ao romper da aurora, buscando a presença do Senhor no templo sede.',
    leader: 'Ministério de Oração',
    location: 'Sede',
    iconName: 'sparkles',
    colorTag: 'indigo',
    order: 6
  },
  {
    id: 'sch-7',
    dayOfWeek: 'Domingo',
    time: '18:00',
    title: 'Culto da Família',
    ministry: 'Ministério Pastoral & Famílias',
    description: 'Grande culto dominical com louvor congregacional, ministração da Palavra e bênção para os lares na Forene.',
    leader: 'Liderança Local Forene',
    location: 'Forene',
    iconName: 'heart-handshake',
    colorTag: 'emerald',
    order: 7
  },
  {
    id: 'sch-8',
    dayOfWeek: 'Domingo',
    time: '19:00',
    title: 'Culto da UMASBRAC',
    ministry: 'UMASBRAC (Homens de Honra) & Celebração',
    description: 'Celebração congregacional com louvor, ministração bíblica e consagração das famílias no templo sede.',
    leader: 'Liderança UMASBRAC & Pastoral',
    location: 'Sede',
    iconName: 'shield',
    colorTag: 'purple',
    order: 8
  }
];

export const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: 'evt-1',
    title: 'Grande Congresso Estadual da Família 2026',
    subtitle: 'Edificando Lares Inabaláveis sobre a Rocha',
    date: '2026-09-18',
    endDate: '2026-09-20',
    time: '19:00',
    location: 'Templo Sede OBPC Central',
    description: 'Três dias de avivamento com palestras especiais sobre casamento, criação de filhos na era digital, saúde emocional e finanças à luz da Bíblia.',
    bannerUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    category: 'Congresso',
    highlight: true,
    registrationOpen: true,
    registrationLimit: 450,
    registeredCount: 238,
    guestSpeaker: 'Pr. Josué Gonçalves e Pastores Convidados',
    musicalGuest: 'Ministério de Louvor Voz da Esperança'
  },
  {
    id: 'evt-2',
    title: 'Conferência Missionária & Ação Social "Mãos que Acolhem"',
    subtitle: 'Até os Confins da Terra e no Nosso Bairro',
    date: '2026-09-05',
    endDate: '2026-09-06',
    time: '09:00',
    location: 'Quadra Esportiva & Templo Sede',
    description: 'Mutirão com atendimento odontológico, médico gratuito, corte de cabelo, distribuição de 300 cestas básicas e noites de testemunhos impactantes de missionários no sertão e no exterior.',
    bannerUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
    category: 'Missões',
    highlight: true,
    registrationOpen: true,
    registrationLimit: 500,
    registeredCount: 312,
    guestSpeaker: 'Missionário Daniel Souza (África) & Equipe OBPC',
    musicalGuest: 'Coral Som do Céu'
  },
  {
    id: 'evt-3',
    title: 'Grande Vigília do Avivamento & Pentecostes',
    subtitle: 'Buscando a Presença e o Fogo do Espírito Santo',
    date: '2026-09-25',
    time: '22:30 - 05:00',
    location: 'Templo Sede',
    description: 'Madrugada inteira de adoração contínua, oração em línguas, intercessão pelo Brasil, quebra de maldições e ministração da Santa Ceia da Vitória na alvorada.',
    bannerUrl: 'https://images.unsplash.com/photo-1510525009512-ab7522cabb6b?auto=format&fit=crop&w=1200&q=80',
    category: 'Vigília',
    highlight: false,
    registrationOpen: false,
    registeredCount: 0,
    guestSpeaker: 'Pr. Janildo Manoel & Evangelistas'
  },
  {
    id: 'evt-4',
    title: 'Batismo nas Águas & Celebração dos Novos Convertidos',
    subtitle: 'Sepultando o velho homem e nascendo de novo',
    date: '2026-10-04',
    time: '10:00',
    location: 'Sítio Recanto de Canaã (Transporte sairá da Igreja)',
    description: 'Festa espiritual com batismo por imersão dos novos irmãos que desceram às águas, seguido de almoço comunitário de confraternização fraterna.',
    bannerUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    category: 'Batismo',
    highlight: false,
    registrationOpen: true,
    registrationLimit: 80,
    registeredCount: 42,
    guestSpeaker: 'Corpo Pastoral OBPC'
  }
];

export const INITIAL_MEDIA_FOLDERS: MediaFolder[] = [
  {
    id: 'fol-1',
    name: 'Congresso de Mulheres - UFEBRAC 2026',
    description: 'Fotos e momentos marcantes do 24º Congresso de Mulheres Vitoriosas.',
    category: 'Congressos e Conferências',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    eventDate: '2026-07-20',
    itemCount: 8,
    createdAt: '2026-07-22'
  },
  {
    id: 'fol-2',
    name: 'Culto de Celebração & Santa Ceia do Senhor',
    description: 'Registro do primeiro domingo do mês em comunhão e adoração ao Cordeiro.',
    category: 'Cultos e Celebrações',
    coverUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    eventDate: '2026-08-02',
    itemCount: 6,
    createdAt: '2026-08-03'
  },
  {
    id: 'fol-3',
    name: 'Ação Social Sopão da Paz & Doação de Roupas',
    description: 'Evangelismo em ação levando alimento e o amor de Cristo à comunidade carente.',
    category: 'Ação Social',
    coverUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    eventDate: '2026-08-15',
    itemCount: 5,
    createdAt: '2026-08-16'
  },
  {
    id: 'fol-4',
    name: 'Acampamento Jovem Geração Forte',
    description: 'Três dias de ministrações, dinâmicas esportivas e muita presença de Deus.',
    category: 'Juventude e Crianças',
    coverUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80',
    eventDate: '2026-06-12',
    itemCount: 7,
    createdAt: '2026-06-15'
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-1',
    folderId: 'fol-1',
    title: 'Abertura Triunfal do Congresso das Irmãs',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    description: 'Entrada com estandartes e louvor congregacional.',
    date: '2026-07-20',
    featured: true
  },
  {
    id: 'med-2',
    folderId: 'fol-1',
    title: 'Ministração da Palavra com Pra. Marlene',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80',
    description: 'Momento de forte unção e derramar de Deus.',
    date: '2026-07-20',
    featured: true
  },
  {
    id: 'med-3',
    folderId: 'fol-1',
    title: 'Vídeo: Melhores Momentos do Congresso Feminino',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Clean sample playable
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    description: 'Resumo oficial produzido pela equipe de mídia OBPC.',
    date: '2026-07-21',
    featured: true
  },
  {
    id: 'med-4',
    folderId: 'fol-2',
    title: 'Ministração da Santa Ceia pelo Pastor Presidente',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=400&q=80',
    description: 'O pão e o cálice repartidos em reverência e gratidão.',
    date: '2026-08-02',
    featured: true
  },
  {
    id: 'med-5',
    folderId: 'fol-2',
    title: 'Coral Louvor Celestial em Adoração',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1519744346861-a590c2941328?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519744346861-a590c2941328?auto=format&fit=crop&w=400&q=80',
    description: 'Cânticos que tocaram os corações da igreja reunida.',
    date: '2026-08-02',
    featured: false
  },
  {
    id: 'med-6',
    folderId: 'fol-3',
    title: 'Entrega de Alimentos e Oração com as Famílias',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
    description: 'Mais de 180 refeições servidas com amor e carinho.',
    date: '2026-08-15',
    featured: true
  },
  {
    id: 'med-7',
    folderId: 'fol-4',
    title: 'Vídeo: Clipes do Acampamento Jovem Geração Forte',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=600&q=80',
    description: 'Vigília ao redor da fogueira e batismo com o Espírito Santo.',
    date: '2026-06-14',
    featured: true
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 'pray-1',
    name: 'Irmã Maria de Lourdes',
    phone: '(11) 98451-2299',
    isConfidential: false,
    requestType: 'Saúde',
    message: 'Peço oração por meu esposo João que fará cirurgia no coração na próxima sexta-feira. Cremos no milagre e nas mãos do Senhor Jesus.',
    status: 'em_oracao',
    createdAt: '2026-08-22 14:20',
    pastorNotes: 'Colocado na lista do Círculo de Oração e cultos de libertação.'
  },
  {
    id: 'pray-2',
    name: 'Fiel Anônimo (Membro)',
    phone: '',
    isConfidential: true,
    requestType: 'Família',
    message: 'Gostaria de pedir oração pelo meu casamento e pela restauração do meu filho que se afastou dos caminhos do Senhor. Rogo sigilo pastoral.',
    status: 'em_oracao',
    createdAt: '2026-08-23 09:15',
    pastorNotes: 'Atendimento pastoral agendado com discrição total.'
  },
  {
    id: 'pray-3',
    name: 'Renato Guimarães',
    phone: '(11) 97722-1100',
    isConfidential: false,
    requestType: 'Financeiro',
    message: 'Estou em busca de recolocação profissional após 8 meses. Peço que a igreja ore para que Deus abra portas de emprego.',
    status: 'pendente',
    createdAt: '2026-08-24 08:30'
  }
];

export const INITIAL_MEMBERS: ChurchMember[] = [];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [];

export const DAILY_VERSES = [
  {
    verse: 'Porque sou Eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de lhes causar dano, planos de dar-lhes esperança e um futuro.',
    reference: 'Jeremias 29:11'
  },
  {
    verse: 'Trazei todos os dízimos à casa do tesouro, para que haja mantimento na minha casa, e depois fazei prova de mim, diz o Senhor dos Exércitos, se eu não vos abrir as janelas do céu.',
    reference: 'Malaquias 3:10'
  },
  {
    verse: 'Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria.',
    reference: '2 Coríntios 9:7'
  },
  {
    verse: 'Alegrei-me quando me disseram: Vamos à casa do Senhor!',
    reference: 'Salmos 122:1'
  },
  {
    verse: 'Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas.',
    reference: 'Mateus 6:33'
  }
];

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-1',
    name: 'Pr. Janildo Manoel',
    username: 'pastor',
    password: '1234', // default demo PIN / password
    role: 'pastor',
    email: 'pastor.janildo@obrasilparacristo.org.br',
    phone: '(11) 99876-5432',
    isActive: true,
    createdAt: '2026-01-10',
    lastLogin: '2026-08-24 15:30',
    createdBy: 'Sistema'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '24/08/2026 15:30:12',
    userName: 'Pr. Janildo Manoel',
    userRole: 'pastor',
    action: 'Login no Sistema',
    category: 'AUTH',
    details: 'Acesso autenticado ao Painel Pastoral e Administrativo.',
    ipAddress: '189.40.122.15',
    status: 'sucesso'
  },
  {
    id: 'log-2',
    timestamp: '24/08/2026 14:22:45',
    userName: 'Pr. Janildo Manoel',
    userRole: 'pastor',
    action: 'Lançamento de Dízimo',
    category: 'FINANCEIRO',
    details: 'Registrado dízimo de R$ 750,00 para o membro MBR-2026-102 (Recibo REC-2026-3021).',
    ipAddress: '177.38.90.44',
    status: 'sucesso'
  },
  {
    id: 'log-3',
    timestamp: '24/08/2026 11:15:30',
    userName: 'Pr. Janildo Manoel',
    userRole: 'pastor',
    action: 'Atualização de Horários de Cultos',
    category: 'CULTOS',
    details: 'Atualizada a programação do Círculo de Oração Forene de Segunda-feira.',
    ipAddress: '189.40.122.15',
    status: 'sucesso'
  },
  {
    id: 'log-4',
    timestamp: '23/08/2026 20:45:10',
    userName: 'Pr. Janildo Manoel',
    userRole: 'pastor',
    action: 'Atendimento de Pedido de Oração',
    category: 'ORACAO',
    details: 'Status do pedido de oração de Maria Aparecida alterado para "Em Oração".',
    ipAddress: '189.40.122.15',
    status: 'sucesso'
  },
  {
    id: 'log-5',
    timestamp: '23/08/2026 16:30:00',
    userName: 'Pr. Janildo Manoel',
    userRole: 'pastor',
    action: 'Novo Evento Publicado',
    category: 'EVENTOS',
    details: 'Publicado evento "Vigília das 12 Horas de Clamor" para 20/09/2026.',
    ipAddress: '177.38.90.44',
    status: 'sucesso'
  }
];

export const INITIAL_DEPARTMENTS: ChurchDepartment[] = [
  {
    id: 'dep-1',
    code: 'JUBRAC',
    name: 'JUBRAC (Juventude)',
    description: 'Juventude de O Brasil Para Cristo: Responsável pela união, capacitação, congressos e despertamento espiritual dos jovens.',
    leader: 'Liderança JUBRAC',
    meetingSchedule: 'Sábados às 19:30',
    colorTag: 'emerald',
    iconName: 'users',
    isActive: true,
    order: 1,
    createdAt: '2026-01-10'
  },
  {
    id: 'dep-2',
    code: 'UFEBRAC',
    name: 'UFEBRAC (Mulheres)',
    description: 'União Feminina: Círculo de Oração, intercessão contínua pelas famílias e suporte comunitário.',
    leader: 'Liderança UFEBRAC',
    meetingSchedule: 'Segundas e Terças às 19:30',
    colorTag: 'rose',
    iconName: 'heart',
    isActive: true,
    order: 2,
    createdAt: '2026-01-10'
  },
  {
    id: 'dep-3',
    code: 'MENBRAC',
    name: 'MENBRAC (Homens)',
    description: 'Ministério de Homens: Formação de sacerdotes do lar, fortalecimento de pais de família e evangelismo.',
    leader: 'Liderança MENBRAC',
    meetingSchedule: 'Quintas às 19:30',
    colorTag: 'blue',
    iconName: 'shield',
    isActive: true,
    order: 3,
    createdAt: '2026-01-10'
  },
  {
    id: 'dep-4',
    code: 'UCEBRAC',
    name: 'UCEBRAC (Crianças)',
    description: 'União de Crianças: Ensino bíblico infantil, escola bíblica e valores cristãos na infância.',
    leader: 'Liderança UCEBRAC',
    meetingSchedule: 'Domingos às 09:00 e 18:30',
    colorTag: 'amber',
    iconName: 'sparkles',
    isActive: true,
    order: 4,
    createdAt: '2026-01-10'
  },
  {
    id: 'dep-5',
    code: 'ADOBRAC',
    name: 'ADOBRAC (Adolescentes)',
    description: 'Adolescentes de O Brasil Para Cristo: Cultos temáticos, discipulado bíblico e comunhão entre os adolescentes.',
    leader: 'Liderança ADOBRAC',
    meetingSchedule: 'Quartas e Quintas às 19:30',
    colorTag: 'purple',
    iconName: 'zap',
    isActive: true,
    order: 5,
    createdAt: '2026-01-10'
  },
  {
    id: 'dep-6',
    code: 'LOUVOR',
    name: 'Ministério de Louvor & Adoração',
    description: 'Banda, coral e instrumentistas dedicados a conduzir a igreja em profunda adoração a Deus.',
    leader: 'Ministério de Louvor',
    meetingSchedule: 'Ensaios aos Sábados às 17:00',
    colorTag: 'sky',
    iconName: 'music',
    isActive: true,
    order: 6,
    createdAt: '2026-01-10'
  }
];


