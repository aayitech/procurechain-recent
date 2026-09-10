export type SiteLocale = 'en' | 'fr' | 'pt' | 'ar' | 'sw';

export const LANGUAGE_STORAGE_KEY = 'procurechain-language';

export const SITE_LANGUAGES: Array<{ code: SiteLocale; label: string; name: string }> = [
  { code: 'en', label: 'English', name: 'English' },
  { code: 'fr', label: 'Français', name: 'French' },
  { code: 'pt', label: 'Português', name: 'Portuguese' },
  { code: 'ar', label: 'العربية', name: 'Arabic' },
  { code: 'sw', label: 'Kiswahili', name: 'Kiswahili' },
];

type TranslatedPhrase = Record<Exclude<SiteLocale, 'en'>, string>;

const PHRASES: Record<string, TranslatedPhrase> = {
  'Market Intelligence': { fr: 'Intelligence de marché', pt: 'Inteligência de mercado', ar: 'معلومات السوق', sw: 'Taarifa za soko' },
  'Overview': { fr: 'Aperçu', pt: 'Visão geral', ar: 'نظرة عامة', sw: 'Muhtasari' },
  'Commodities': { fr: 'Matières premières', pt: 'Commodities', ar: 'السلع', sw: 'Bidhaa' },
  'Exchange Rates': { fr: 'Taux de change', pt: 'Taxas de câmbio', ar: 'أسعار الصرف', sw: 'Viwango vya ubadilishaji' },
  'Categories': { fr: 'Catégories', pt: 'Categorias', ar: 'الفئات', sw: 'Kategoria' },
  'Available Categories': { fr: 'Catégories disponibles', pt: 'Categorias disponíveis', ar: 'الفئات المتاحة', sw: 'Kategoria zinazopatikana' },
  'Approved Sources': { fr: 'Sources approuvées', pt: 'Fontes aprovadas', ar: 'المصادر المعتمدة', sw: 'Vyanzo vilivyoidhinishwa' },
  'Approved Data Sources': { fr: 'Sources de données approuvées', pt: 'Fontes de dados aprovadas', ar: 'مصادر البيانات المعتمدة', sw: 'Vyanzo vya data vilivyoidhinishwa' },
  'Market Brief': { fr: 'Brief marché', pt: 'Resumo de mercado', ar: 'موجز السوق', sw: 'Muhtasari wa soko' },
  'Calculators': { fr: 'Calculateurs', pt: 'Calculadoras', ar: 'الحاسبات', sw: 'Vikokotoo' },
  'Benchmarking': { fr: 'Analyse comparative', pt: 'Benchmarking', ar: 'المقارنة المرجعية', sw: 'Ulinganishaji' },
  'Knowledge Centre': { fr: 'Centre de connaissances', pt: 'Centro de conhecimento', ar: 'مركز المعرفة', sw: 'Kituo cha maarifa' },
  'Book a Demo': { fr: 'Réserver une démo', pt: 'Agendar uma demonstração', ar: 'احجز عرضاً توضيحياً', sw: 'Weka nafasi ya onyesho' },
  'Book a demo': { fr: 'Réserver une démo', pt: 'Agendar uma demonstração', ar: 'احجز عرضاً توضيحياً', sw: 'Weka nafasi ya onyesho' },
  'Data Sources': { fr: 'Sources de données', pt: 'Fontes de dados', ar: 'مصادر البيانات', sw: 'Vyanzo vya data' },
  'AI Assistant': { fr: 'Assistant IA', pt: 'Assistente de IA', ar: 'مساعد الذكاء الاصطناعي', sw: 'Msaidizi wa AI' },
  'Search': { fr: 'Rechercher', pt: 'Pesquisar', ar: 'بحث', sw: 'Tafuta' },
  'Toggle Market Intelligence menu': { fr: 'Ouvrir le menu Intelligence de marché', pt: 'Abrir menu de inteligência de mercado', ar: 'فتح قائمة معلومات السوق', sw: 'Fungua menyu ya taarifa za soko' },
  'Toggle navigation menu': { fr: 'Ouvrir le menu de navigation', pt: 'Abrir menu de navegação', ar: 'فتح قائمة التنقل', sw: 'Fungua menyu ya urambazaji' },
  'Switch to light mode': { fr: 'Passer au mode clair', pt: 'Mudar para modo claro', ar: 'التبديل إلى الوضع الفاتح', sw: 'Badili kwenda hali angavu' },
  'Switch to dark mode': { fr: 'Passer au mode sombre', pt: 'Mudar para modo escuro', ar: 'التبديل إلى الوضع الداكن', sw: 'Badili kwenda hali nyeusi' },
  'Select language': { fr: 'Choisir la langue', pt: 'Selecionar idioma', ar: 'اختر اللغة', sw: 'Chagua lugha' },
  'Preferred currency': { fr: 'Devise préférée', pt: 'Moeda preferida', ar: 'العملة المفضلة', sw: 'Sarafu unayopendelea' },
  'Log in': { fr: 'Se connecter', pt: 'Entrar', ar: 'تسجيل الدخول', sw: 'Ingia' },
  'Procurement Health': { fr: 'Santé des achats', pt: 'Saúde de compras', ar: 'صحة المشتريات', sw: 'Afya ya ununuzi' },
  'Create Account': { fr: 'Créer un compte', pt: 'Criar conta', ar: 'إنشاء حساب', sw: 'Fungua akaunti' },
  'Log In': { fr: 'Se connecter', pt: 'Entrar', ar: 'تسجيل الدخول', sw: 'Ingia' },
  'FX & Currencies': { fr: 'Devises et taux de change', pt: 'Câmbio e moedas', ar: 'العملات وأسعار الصرف', sw: 'Fedha na ubadilishaji' },
  'Platform': { fr: 'Plateforme', pt: 'Plataforma', ar: 'المنصة', sw: 'Jukwaa' },
  'Decision Tools': { fr: 'Outils de décision', pt: 'Ferramentas de decisão', ar: 'أدوات القرار', sw: 'Zana za maamuzi' },
  'Intelligence': { fr: 'Intelligence', pt: 'Inteligência', ar: 'المعلومات', sw: 'Taarifa' },
  'Get Started': { fr: 'Commencer', pt: 'Começar', ar: 'ابدأ', sw: 'Anza' },
  'Personalised Overview': { fr: 'Aperçu personnalisé', pt: 'Visão personalizada', ar: 'نظرة عامة مخصصة', sw: 'Muhtasari binafsi' },
  'Live Market Coverage': { fr: 'Couverture de marché en direct', pt: 'Cobertura de mercado ao vivo', ar: 'تغطية السوق المباشرة', sw: 'Ufuatiliaji wa soko moja kwa moja' },
  'PROCURECHAIN INSIGHT HUB': { fr: 'CENTRE D’INFORMATION PROCURECHAIN', pt: 'CENTRO DE INTELIGÊNCIA PROCURECHAIN', ar: 'مركز معلومات بروسيرتشين', sw: 'KITUO CHA TAARIFA PROCURECHAIN' },
  'ProcureChain Insight Hub': { fr: 'Centre d’information ProcureChain', pt: 'Centro de inteligência ProcureChain', ar: 'مركز معلومات بروسيرتشين', sw: 'Kituo cha taarifa ProcureChain' },
  'Market intelligence, at a glance.': { fr: 'L’intelligence de marché en un coup d’œil.', pt: 'Inteligência de mercado em um relance.', ar: 'معلومات السوق في لمحة.', sw: 'Taarifa za soko kwa muhtasari.' },
  'Smarter procurement starts with trusted market signals, current prices and useful context.': { fr: 'Des achats plus intelligents commencent par des signaux fiables, des prix actuels et un contexte utile.', pt: 'Compras mais inteligentes começam com sinais confiáveis, preços atuais e contexto útil.', ar: 'تبدأ المشتريات الأذكى بإشارات سوق موثوقة وأسعار حالية وسياق مفيد.', sw: 'Ununuzi bora huanza na ishara za soko zinazoaminika, bei za sasa na muktadha muhimu.' },
  'Your market': { fr: 'Votre marché', pt: 'Seu mercado', ar: 'سوقك', sw: 'Soko lako' },
  'Global': { fr: 'Mondial', pt: 'Global', ar: 'عالمي', sw: 'Kimataifa' },
  'Market currency': { fr: 'Devise du marché', pt: 'Moeda do mercado', ar: 'عملة السوق', sw: 'Sarafu ya soko' },
  'Your industry': { fr: 'Votre secteur', pt: 'Seu setor', ar: 'قطاعك', sw: 'Sekta yako' },
  'General procurement': { fr: 'Achats généraux', pt: 'Compras gerais', ar: 'المشتريات العامة', sw: 'Ununuzi wa jumla' },
  'Market coverage': { fr: 'Couverture du marché', pt: 'Cobertura de mercado', ar: 'تغطية السوق', sw: 'Ufuatiliaji wa soko' },
  'Verified instruments': { fr: 'Instruments vérifiés', pt: 'Instrumentos verificados', ar: 'أدوات موثقة', sw: 'Vyombo vilivyothibitishwa' },
  'Data status': { fr: 'État des données', pt: 'Estado dos dados', ar: 'حالة البيانات', sw: 'Hali ya data' },
  'Verified sources': { fr: 'Sources vérifiées', pt: 'Fontes verificadas', ar: 'مصادر موثقة', sw: 'Vyanzo vilivyothibitishwa' },
  'No estimated market values': { fr: 'Aucune valeur de marché estimée', pt: 'Sem valores de mercado estimados', ar: 'لا توجد قيم سوقية تقديرية', sw: 'Hakuna thamani za soko zilizokadiriwa' },
  "TODAY'S KEY SIGNALS": { fr: 'SIGNAUX CLÉS DU JOUR', pt: 'PRINCIPAIS SINAIS DE HOJE', ar: 'إشارات اليوم الرئيسية', sw: 'ISHARA KUU ZA LEO' },
  'Markets moving now': { fr: 'Marchés en mouvement', pt: 'Mercados em movimento', ar: 'الأسواق المتحركة الآن', sw: 'Masoko yanayobadilika sasa' },
  'Open terminal': { fr: 'Ouvrir le terminal', pt: 'Abrir terminal', ar: 'فتح المحطة', sw: 'Fungua terminali' },
  "Today's top stories": { fr: 'Actualités principales du jour', pt: 'Principais notícias de hoje', ar: 'أهم أخبار اليوم', sw: 'Habari kuu za leo' },
  'View market brief': { fr: 'Voir le brief marché', pt: 'Ver resumo de mercado', ar: 'عرض موجز السوق', sw: 'Tazama muhtasari wa soko' },
  'Market watch': { fr: 'Surveillance du marché', pt: 'Monitor de mercado', ar: 'مراقبة السوق', sw: 'Ufuatiliaji wa soko' },
  'Ask the Market': { fr: 'Interroger le marché', pt: 'Pergunte ao mercado', ar: 'اسأل السوق', sw: 'Uliza soko' },
  'Explore procurement implications using the market data available in ProcureChain.': { fr: 'Explorez les implications pour les achats avec les données disponibles dans ProcureChain.', pt: 'Explore implicações de compras usando os dados disponíveis no ProcureChain.', ar: 'استكشف آثار المشتريات باستخدام بيانات السوق المتاحة في بروسيرتشين.', sw: 'Chunguza athari za ununuzi kwa kutumia data inayopatikana ProcureChain.' },
  'Try asking: Which tracked markets are moving most?': { fr: 'Essayez : quels marchés suivis évoluent le plus ?', pt: 'Pergunte: quais mercados monitorados estão variando mais?', ar: 'جرّب السؤال: ما الأسواق المتابعة الأكثر تحركاً؟', sw: 'Jaribu kuuliza: Ni masoko gani yanabadilika zaidi?' },
  'Open Ask the Market': { fr: 'Ouvrir Interroger le marché', pt: 'Abrir Pergunte ao mercado', ar: 'فتح اسأل السوق', sw: 'Fungua Uliza soko' },
  'EXPLORE BY CATEGORY': { fr: 'EXPLORER PAR CATÉGORIE', pt: 'EXPLORAR POR CATEGORIA', ar: 'استكشف حسب الفئة', sw: 'CHUNGUZA KWA KATEGORIA' },
  'Available market coverage': { fr: 'Couverture de marché disponible', pt: 'Cobertura de mercado disponível', ar: 'تغطية السوق المتاحة', sw: 'Ufuatiliaji wa soko unaopatikana' },
  'Loading verified market coverage…': { fr: 'Chargement de la couverture de marché vérifiée…', pt: 'Carregando cobertura de mercado verificada…', ar: 'جارٍ تحميل تغطية السوق الموثقة…', sw: 'Inapakia ufuatiliaji wa soko uliothibitishwa…' },
  'INTERACTIVE MARKET TERMINAL': { fr: 'TERMINAL DE MARCHÉ INTERACTIF', pt: 'TERMINAL DE MERCADO INTERATIVO', ar: 'محطة السوق التفاعلية', sw: 'TERMINALI SHIRIKISHI YA SOKO' },
  'Search and compare the full market currently covered by verified sources.': { fr: 'Recherchez et comparez l’ensemble du marché actuellement couvert par des sources vérifiées.', pt: 'Pesquise e compare todo o mercado atualmente coberto por fontes verificadas.', ar: 'ابحث وقارن السوق الكامل الذي تغطيه حالياً مصادر موثقة.', sw: 'Tafuta na ulinganishe soko lote linalofunikwa na vyanzo vilivyothibitishwa.' },
  'Verified data': { fr: 'Données vérifiées', pt: 'Dados verificados', ar: 'بيانات موثقة', sw: 'Data iliyothibitishwa' },
  'Ask about this market': { fr: 'Interroger ce marché', pt: 'Perguntar sobre este mercado', ar: 'اسأل عن هذا السوق', sw: 'Uliza kuhusu soko hili' },
  'Moving Average': { fr: 'Moyenne mobile', pt: 'Média móvel', ar: 'المتوسط المتحرك', sw: 'Wastani unaosogea' },
  'Moving avg': { fr: 'Moyenne mobile', pt: 'Média móvel', ar: 'متوسط متحرك', sw: 'Wastani unaosogea' },
  'Bollinger Bands': { fr: 'Bandes de Bollinger', pt: 'Bandas de Bollinger', ar: 'نطاقات بولينجر', sw: 'Mikanda ya Bollinger' },
  'Currency movement can change the local cost of imported goods and foreign-currency contracts.': { fr: 'Les variations de change peuvent modifier le coût local des importations et des contrats en devises.', pt: 'A variação cambial pode alterar o custo local de importações e contratos em moeda estrangeira.', ar: 'يمكن لحركة العملة تغيير التكلفة المحلية للواردات والعقود بالعملات الأجنبية.', sw: 'Mabadiliko ya sarafu yanaweza kubadili gharama ya bidhaa zinazoagizwa na mikataba ya fedha za kigeni.' },
  'High': { fr: 'Élevé', pt: 'Alto', ar: 'مرتفع', sw: 'Juu' },
  'Medium': { fr: 'Moyen', pt: 'Médio', ar: 'متوسط', sw: 'Wastani' },
  'Low': { fr: 'Faible', pt: 'Baixo', ar: 'منخفض', sw: 'Chini' },
  'Market instruments': { fr: 'Instruments de marché', pt: 'Instrumentos de mercado', ar: 'أدوات السوق', sw: 'Vyombo vya soko' },
  'Search available verified markets; select any row without leaving the terminal.': { fr: 'Recherchez les marchés vérifiés disponibles et sélectionnez une ligne sans quitter le terminal.', pt: 'Pesquise mercados verificados e selecione qualquer linha sem sair do terminal.', ar: 'ابحث في الأسواق الموثقة وحدد أي صف دون مغادرة المحطة.', sw: 'Tafuta masoko yaliyothibitishwa na uchague mstari bila kuondoka kwenye terminali.' },
  'Priority': { fr: 'Priorité', pt: 'Prioridade', ar: 'الأولوية', sw: 'Kipaumbele' },
  'Largest movement': { fr: 'Plus forte variation', pt: 'Maior movimento', ar: 'أكبر حركة', sw: 'Mabadiliko makubwa' },
  'Name': { fr: 'Nom', pt: 'Nome', ar: 'الاسم', sw: 'Jina' },
  'All': { fr: 'Tous', pt: 'Todos', ar: 'الكل', sw: 'Zote' },
  'Watch': { fr: 'Suivre', pt: 'Observar', ar: 'متابعة', sw: 'Fuatilia' },
  'Instrument': { fr: 'Instrument', pt: 'Instrumento', ar: 'الأداة', sw: 'Chombo' },
  'Category': { fr: 'Catégorie', pt: 'Categoria', ar: 'الفئة', sw: 'Kategoria' },
  'Current': { fr: 'Actuel', pt: 'Atual', ar: 'الحالي', sw: 'Sasa' },
  'live': { fr: 'en direct', pt: 'ao vivo', ar: 'مباشر', sw: 'hai' },
  'instrument': { fr: 'instrument', pt: 'instrumento', ar: 'أداة', sw: 'chombo' },
  'instruments': { fr: 'instruments', pt: 'instrumentos', ar: 'أدوات', sw: 'vyombo' },
  'tracked categories': { fr: 'catégories suivies', pt: 'categorias monitoradas', ar: 'فئات متابعة', sw: 'kategoria zinazofuatiliwa' },
  'Impact': { fr: 'Impact', pt: 'Impacto', ar: 'التأثير', sw: 'Athari' },
  'Data period': { fr: 'Période des données', pt: 'Período dos dados', ar: 'فترة البيانات', sw: 'Kipindi cha data' },
  'Source': { fr: 'Source', pt: 'Fonte', ar: 'المصدر', sw: 'Chanzo' },
  'PROCUREMENT IMPACT': { fr: 'IMPACT SUR LES ACHATS', pt: 'IMPACTO NAS COMPRAS', ar: 'تأثير المشتريات', sw: 'ATHARI KWA UNUNUZI' },
  'DATA CONFIDENCE': { fr: 'FIABILITÉ DES DONNÉES', pt: 'CONFIANÇA DOS DADOS', ar: 'موثوقية البيانات', sw: 'UAMINIFU WA DATA' },
  'Source-verified observation': { fr: 'Observation vérifiée par la source', pt: 'Observação verificada pela fonte', ar: 'ملاحظة موثقة من المصدر', sw: 'Uchunguzi uliothibitishwa na chanzo' },
  'ACTIVE DATA SOURCES': { fr: 'SOURCES DE DONNÉES ACTIVES', pt: 'FONTES DE DADOS ATIVAS', ar: 'مصادر البيانات النشطة', sw: 'VYANZO HAI VYA DATA' },
  'Verified coverage in this terminal': { fr: 'Couverture vérifiée dans ce terminal', pt: 'Cobertura verificada neste terminal', ar: 'تغطية موثقة في هذه المحطة', sw: 'Ufuatiliaji uliothibitishwa katika terminali hii' },
  'View source registry': { fr: 'Voir le registre des sources', pt: 'Ver registro de fontes', ar: 'عرض سجل المصادر', sw: 'Tazama sajili ya vyanzo' },
  'No instruments match these filters.': { fr: 'Aucun instrument ne correspond à ces filtres.', pt: 'Nenhum instrumento corresponde a estes filtros.', ar: 'لا توجد أدوات تطابق هذه المرشحات.', sw: 'Hakuna vyombo vinavyolingana na vichujio hivi.' },
  'Procurement Tools': { fr: 'Outils d’achats', pt: 'Ferramentas de compras', ar: 'أدوات المشتريات', sw: 'Zana za ununuzi' },
  'Make better procurement decisions': { fr: 'Prenez de meilleures décisions d’achat', pt: 'Tome melhores decisões de compras', ar: 'اتخذ قرارات مشتريات أفضل', sw: 'Fanya maamuzi bora ya ununuzi' },
  'Estimate costs, compare options, assess logistics and understand the commercial impact of procurement decisions — live, input-driven calculators with chart output and CSV export.': { fr: 'Estimez les coûts, comparez les options, évaluez la logistique et mesurez l’impact commercial grâce à des calculateurs interactifs avec graphiques et export CSV.', pt: 'Estime custos, compare opções, avalie a logística e entenda o impacto comercial com calculadoras interativas, gráficos e exportação CSV.', ar: 'قدّر التكاليف وقارن الخيارات وقيّم الخدمات اللوجستية وافهم الأثر التجاري باستخدام حاسبات تفاعلية ورسوم وتصدير CSV.', sw: 'Kadiria gharama, linganisha chaguo, tathmini usafirishaji na elewa athari za kibiashara kwa vikokotoo shirikishi, chati na usafirishaji wa CSV.' },
  'How does your procurement operation perform?': { fr: 'Quelle est la performance de vos achats ?', pt: 'Como está o desempenho das suas compras?', ar: 'كيف يعمل قسم المشتريات لديك؟', sw: 'Utendaji wa ununuzi wako ukoje?' },
  'Check Your Procurement Health': { fr: 'Évaluer la santé de vos achats', pt: 'Avaliar a saúde das compras', ar: 'افحص صحة مشترياتك', sw: 'Kagua afya ya ununuzi wako' },
  'Approved data sources': { fr: 'Sources de données approuvées', pt: 'Fontes de dados aprovadas', ar: 'مصادر البيانات المعتمدة', sw: 'Vyanzo vya data vilivyoidhinishwa' },
  'Source control': { fr: 'Contrôle des sources', pt: 'Controle de fontes', ar: 'التحكم بالمصادر', sw: 'Udhibiti wa vyanzo' },
  'ProcureChain uses official government and international sources first. A listed source is not treated as live until its authorised connector and licence requirements are satisfied; unavailable data is never estimated.': { fr: 'ProcureChain privilégie les sources officielles gouvernementales et internationales. Une source n’est active que lorsque son connecteur autorisé et sa licence sont validés ; les données indisponibles ne sont jamais estimées.', pt: 'O ProcureChain prioriza fontes oficiais governamentais e internacionais. Uma fonte só é considerada ativa após a validação do conector autorizado e da licença; dados indisponíveis nunca são estimados.', ar: 'تعطي بروسيرتشين الأولوية للمصادر الحكومية والدولية الرسمية. لا يُعتبر المصدر مباشراً حتى تكتمل متطلبات الموصل والترخيص، ولا يتم تقدير البيانات غير المتاحة.', sw: 'ProcureChain hutanguliza vyanzo rasmi vya serikali na kimataifa. Chanzo huwa hai tu baada ya kiunganishi na leseni kuthibitishwa; data isiyopatikana haikadiriwi.' },
  'Talk to ProcureChain': { fr: 'Parler à ProcureChain', pt: 'Fale com o ProcureChain', ar: 'تحدث إلى بروسيرتشين', sw: 'Zungumza na ProcureChain' },
  'Book a demo directly': { fr: 'Réserver une démo directement', pt: 'Agende uma demonstração diretamente', ar: 'احجز عرضاً مباشرة', sw: 'Weka nafasi ya onyesho moja kwa moja' },
  'Tell us what you buy and where you source. Choose a suitable time in the form below and the ProcureChain team will receive your details in GoHighLevel for follow-up.': { fr: 'Indiquez-nous ce que vous achetez et vos zones d’approvisionnement. Choisissez un créneau dans le formulaire ; l’équipe ProcureChain recevra vos coordonnées dans GoHighLevel.', pt: 'Informe o que você compra e onde abastece. Escolha um horário no formulário e a equipe ProcureChain receberá seus dados no GoHighLevel.', ar: 'أخبرنا بما تشتريه ومن أين تورّد. اختر وقتاً مناسباً في النموذج وسيتلقى فريق بروسيرتشين بياناتك في GoHighLevel للمتابعة.', sw: 'Tuambie unanunua nini na unapata bidhaa wapi. Chagua muda kwenye fomu na timu ya ProcureChain itapokea maelezo yako GoHighLevel.' },
  'Book from this page': { fr: 'Réserver depuis cette page', pt: 'Agendar nesta página', ar: 'احجز من هذه الصفحة', sw: 'Weka nafasi kutoka ukurasa huu' },
  'Ready for GHL follow-up automation': { fr: 'Prêt pour le suivi automatisé GHL', pt: 'Pronto para automação de acompanhamento GHL', ar: 'جاهز لمتابعة GHL الآلية', sw: 'Tayari kwa ufuatiliaji wa GHL' },
  'Procurement Knowledge Centre': { fr: 'Centre de connaissances achats', pt: 'Centro de conhecimento em compras', ar: 'مركز معرفة المشتريات', sw: 'Kituo cha maarifa ya ununuzi' },
  'Learn how to make better procurement decisions': { fr: 'Apprenez à prendre de meilleures décisions d’achat', pt: 'Aprenda a tomar melhores decisões de compras', ar: 'تعلّم اتخاذ قرارات مشتريات أفضل', sw: 'Jifunze kufanya maamuzi bora ya ununuzi' },
  'ProcureChain Intelligence Hub. All rights reserved.': { fr: 'ProcureChain Intelligence Hub. Tous droits réservés.', pt: 'ProcureChain Intelligence Hub. Todos os direitos reservados.', ar: 'مركز معلومات بروسيرتشين. جميع الحقوق محفوظة.', sw: 'ProcureChain Intelligence Hub. Haki zote zimehifadhiwa.' },
  'AI-Powered Procurement Intelligence, Market Insights & Decision Support': { fr: 'Intelligence achats par IA, informations marché et aide à la décision', pt: 'Inteligência de compras com IA, insights de mercado e apoio à decisão', ar: 'ذكاء المشتريات المدعوم بالذكاء الاصطناعي ورؤى السوق ودعم القرار', sw: 'Taarifa za ununuzi kwa AI, maarifa ya soko na msaada wa maamuzi' },
  'AI procurement intelligence assistant': { fr: 'Assistant IA d’intelligence achats', pt: 'Assistente de inteligência de compras com IA', ar: 'مساعد ذكاء المشتريات بالذكاء الاصطناعي', sw: 'Msaidizi wa AI wa taarifa za ununuzi' },
  'New conversation': { fr: 'Nouvelle conversation', pt: 'Nova conversa', ar: 'محادثة جديدة', sw: 'Mazungumzo mapya' },
  'EXPLORE TOPICS': { fr: 'EXPLORER LES SUJETS', pt: 'EXPLORAR TÓPICOS', ar: 'استكشف المواضيع', sw: 'CHUNGUZA MADA' },
  'Grounded responses': { fr: 'Réponses fondées', pt: 'Respostas fundamentadas', ar: 'إجابات موثقة', sw: 'Majibu yenye msingi' },
  'Answers use the market information available to ProcureChain and include the data timestamp when returned.': { fr: 'Les réponses utilisent les informations disponibles dans ProcureChain et incluent l’horodatage des données.', pt: 'As respostas usam as informações disponíveis no ProcureChain e incluem a data dos dados.', ar: 'تستخدم الإجابات معلومات السوق المتاحة وتتضمن توقيت البيانات.', sw: 'Majibu hutumia taarifa za soko zinazopatikana na hujumuisha muda wa data.' },
  'What would you like to understand?': { fr: 'Que souhaitez-vous comprendre ?', pt: 'O que gostaria de entender?', ar: 'ما الذي تود فهمه؟', sw: 'Ungependa kuelewa nini?' },
  'Ask about a tracked commodity, exchange rate, recent movement, freight availability, or procurement implication.': { fr: 'Posez une question sur une matière première, un taux de change, une évolution récente, le fret ou un impact achats.', pt: 'Pergunte sobre commodities, câmbio, movimentos recentes, frete ou impactos nas compras.', ar: 'اسأل عن سلعة أو سعر صرف أو حركة حديثة أو توفر الشحن أو أثر على المشتريات.', sw: 'Uliza kuhusu bidhaa, kiwango cha ubadilishaji, mabadiliko, mizigo au athari kwa ununuzi.' },
  'TRY ASKING': { fr: 'ESSAYEZ DE DEMANDER', pt: 'EXPERIMENTE PERGUNTAR', ar: 'جرّب السؤال', sw: 'JARIBU KUULIZA' },
  'Thinking…': { fr: 'Réflexion…', pt: 'Pensando…', ar: 'جارٍ التفكير…', sw: 'Inafikiria…' },
  'Clear': { fr: 'Effacer', pt: 'Limpar', ar: 'مسح', sw: 'Futa' },
  'Send question': { fr: 'Envoyer la question', pt: 'Enviar pergunta', ar: 'إرسال السؤال', sw: 'Tuma swali' },
  'Ask about commodities, exchange rates, market trends...': { fr: 'Posez une question sur les matières premières, les taux de change, les tendances...', pt: 'Pergunte sobre commodities, câmbio, tendências de mercado...', ar: 'اسأل عن السلع وأسعار الصرف واتجاهات السوق...', sw: 'Uliza kuhusu bidhaa, ubadilishaji na mwenendo wa soko...' },
  'Book a ProcureChain demo': { fr: 'Réserver une démo ProcureChain', pt: 'Agendar uma demonstração do ProcureChain', ar: 'احجز عرض بروسيرتشين', sw: 'Weka nafasi ya onyesho la ProcureChain' },
  'Your details are captured directly in GoHighLevel for follow-up.': { fr: 'Vos coordonnées sont enregistrées directement dans GoHighLevel pour le suivi.', pt: 'Seus dados são registrados diretamente no GoHighLevel para acompanhamento.', ar: 'تُحفظ بياناتك مباشرة في GoHighLevel للمتابعة.', sw: 'Maelezo yako huhifadhiwa moja kwa moja GoHighLevel kwa ufuatiliaji.' },
  'Close demo booking form': { fr: 'Fermer le formulaire de réservation', pt: 'Fechar formulário de agendamento', ar: 'إغلاق نموذج الحجز', sw: 'Funga fomu ya kuweka nafasi' },
  'I can help you book a ProcureChain demo. Please complete the secure booking form that is opening now. Once you submit it, GoHighLevel will capture your details and start the configured follow-up workflow. Your booking is not confirmed until the form is submitted.': { fr: 'Je peux vous aider à réserver une démo ProcureChain. Remplissez le formulaire sécurisé qui s’ouvre. Après l’envoi, GoHighLevel enregistrera vos coordonnées et lancera le suivi configuré. La réservation n’est confirmée qu’après l’envoi du formulaire.', pt: 'Posso ajudar a agendar uma demonstração do ProcureChain. Preencha o formulário seguro que está abrindo. Após o envio, o GoHighLevel registrará seus dados e iniciará o fluxo de acompanhamento configurado. O agendamento só será confirmado após o envio.', ar: 'يمكنني مساعدتك في حجز عرض بروسيرتشين. يرجى إكمال نموذج الحجز الآمن الذي يُفتح الآن. بعد الإرسال، سيحفظ GoHighLevel بياناتك ويبدأ سير المتابعة المُعد. لا يتأكد الحجز حتى ترسل النموذج.', sw: 'Ninaweza kukusaidia kuweka nafasi ya onyesho la ProcureChain. Jaza fomu salama inayofunguka sasa. Baada ya kutuma, GoHighLevel itahifadhi maelezo yako na kuanzisha mchakato wa ufuatiliaji. Nafasi haijathibitishwa hadi fomu itumwe.' },
};

export function isSiteLocale(value: string | null): value is SiteLocale {
  return SITE_LANGUAGES.some((language) => language.code === value);
}

export function languageName(locale: SiteLocale) {
  return SITE_LANGUAGES.find((language) => language.code === locale)?.name ?? 'English';
}

export function translatePhrase(value: string, locale: SiteLocale): string {
  if (locale === 'en') return value;
  const leading = value.match(/^\s*/)?.[0] ?? '';
  const trailing = value.match(/\s*$/)?.[0] ?? '';
  const text = value.trim();
  const direct = PHRASES[text]?.[locale];
  if (direct) return `${leading}${direct}${trailing}`;

  const live = text.match(/^(\d+) live instruments?$/i);
  if (live) {
    const templates = { fr: `${live[1]} instruments en direct`, pt: `${live[1]} instrumentos ao vivo`, ar: `${live[1]} أدوات مباشرة`, sw: `Vyombo ${live[1]} hai` };
    return `${leading}${templates[locale]}${trailing}`;
  }
  const tracked = text.match(/^(\d+) tracked categories$/i);
  if (tracked) {
    const templates = { fr: `${tracked[1]} catégories suivies`, pt: `${tracked[1]} categorias monitoradas`, ar: `${tracked[1]} فئات متابعة`, sw: `Kategoria ${tracked[1]} zinazofuatiliwa` };
    return `${leading}${templates[locale]}${trailing}`;
  }
  const liveOnly = text.match(/^(\d+) live$/i);
  if (liveOnly) {
    const templates = { fr: `${liveOnly[1]} actifs`, pt: `${liveOnly[1]} ativos`, ar: `${liveOnly[1]} مباشر`, sw: `${liveOnly[1]} hai` };
    return `${leading}${templates[locale]}${trailing}`;
  }

  const englishDate = text.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/);
  if (englishDate) {
    const days: Record<Exclude<SiteLocale, 'en'>, Record<string, string>> = {
      fr: { Monday: 'Lundi', Tuesday: 'Mardi', Wednesday: 'Mercredi', Thursday: 'Jeudi', Friday: 'Vendredi', Saturday: 'Samedi', Sunday: 'Dimanche' },
      pt: { Monday: 'Segunda-feira', Tuesday: 'Terça-feira', Wednesday: 'Quarta-feira', Thursday: 'Quinta-feira', Friday: 'Sexta-feira', Saturday: 'Sábado', Sunday: 'Domingo' },
      ar: { Monday: 'الاثنين', Tuesday: 'الثلاثاء', Wednesday: 'الأربعاء', Thursday: 'الخميس', Friday: 'الجمعة', Saturday: 'السبت', Sunday: 'الأحد' },
      sw: { Monday: 'Jumatatu', Tuesday: 'Jumanne', Wednesday: 'Jumatano', Thursday: 'Alhamisi', Friday: 'Ijumaa', Saturday: 'Jumamosi', Sunday: 'Jumapili' },
    };
    const months: Record<Exclude<SiteLocale, 'en'>, Record<string, string>> = {
      fr: { January: 'janvier', February: 'février', March: 'mars', April: 'avril', May: 'mai', June: 'juin', July: 'juillet', August: 'août', September: 'septembre', October: 'octobre', November: 'novembre', December: 'décembre' },
      pt: { January: 'janeiro', February: 'fevereiro', March: 'março', April: 'abril', May: 'maio', June: 'junho', July: 'julho', August: 'agosto', September: 'setembro', October: 'outubro', November: 'novembro', December: 'dezembro' },
      ar: { January: 'يناير', February: 'فبراير', March: 'مارس', April: 'أبريل', May: 'مايو', June: 'يونيو', July: 'يوليو', August: 'أغسطس', September: 'سبتمبر', October: 'أكتوبر', November: 'نوفمبر', December: 'ديسمبر' },
      sw: { January: 'Januari', February: 'Februari', March: 'Machi', April: 'Aprili', May: 'Mei', June: 'Juni', July: 'Julai', August: 'Agosti', September: 'Septemba', October: 'Oktoba', November: 'Novemba', December: 'Desemba' },
    };
    return `${leading}${days[locale][englishDate[1]]}, ${englishDate[2]} ${months[locale][englishDate[3]]} ${englishDate[4]}${trailing}`;
  }
  return value;
}
