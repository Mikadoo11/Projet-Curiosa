import type { Article, Domain } from "@/lib/content-types";

export const demoDomains: Domain[] = [
  { _id: "domain-space", title: "Espace", slug: "espace", description: "Des planètes aux galaxies, explore les mystères de l'Univers.", icon: "orbit", color: "violet", articleCount: 2 },
  { _id: "domain-nature", title: "Nature", slug: "nature", description: "Comprends le vivant, les animaux et les équilibres de notre planète.", icon: "leaf", color: "green", articleCount: 2 },
  { _id: "domain-history", title: "Histoire", slug: "histoire", description: "Les événements, les idées et les civilisations qui ont façonné le monde.", icon: "landmark", color: "amber", articleCount: 2 },
  { _id: "domain-science", title: "Sciences", slug: "sciences", description: "Les grandes découvertes expliquées simplement, sans perdre la nuance.", icon: "atom", color: "blue", articleCount: 2 },
  { _id: "domain-mind", title: "Psychologie", slug: "psychologie", description: "Découvre comment nous pensons, apprenons et prenons des décisions.", icon: "brain", color: "rose", articleCount: 2 },
  { _id: "domain-world", title: "Géographie", slug: "geographie", description: "Explore les paysages, les climats et les liens entre les sociétés et leur environnement.", icon: "globe", color: "teal", articleCount: 2 },
];

const nasaSources = [
  { title: "Black Holes", url: "https://science.nasa.gov/universe/black-holes/", publisher: "NASA" },
  { title: "Black holes", url: "https://www.esa.int/Science_Exploration/Space_Science/Black_holes", publisher: "Agence spatiale européenne" },
];

export const demoArticles: Article[] = [
  {
    _id: "article-black-holes", title: "Les trous noirs", slug: "trous-noirs",
    excerpt: "Des régions de l'espace où la gravité est si intense que rien, pas même la lumière, ne peut s'en échapper une fois la limite franchie.",
    domain: { title: "Espace", slug: "espace", icon: "orbit", color: "violet" }, readingMinutes: 5,
    publishedAt: "2026-10-12T09:00:00.000Z", tags: ["astronomie", "gravité", "univers"],
    sections: [
      { heading: "Qu'est-ce qu'un trou noir ?", body: "Un trou noir est une région de l'espace-temps dont la gravité est si forte qu'au-delà d'une frontière appelée horizon des événements, aucun signal ne peut revenir vers l'extérieur. Il ne s'agit pas d'un aspirateur cosmique : à distance égale, son attraction gravitationnelle se comporte comme celle de tout autre objet de même masse." },
      { heading: "Comment se forment-ils ?", body: "Certains trous noirs se forment lorsque le cœur d'une étoile très massive s'effondre à la fin de son évolution. D'autres, beaucoup plus massifs, se trouvent au centre de nombreuses galaxies. Leur formation et leur croissance font encore l'objet de recherches." },
      { heading: "Comment les observe-t-on ?", body: "Un trou noir n'émet pas directement de lumière depuis l'intérieur de son horizon. Les astronomes étudient donc ses effets sur son environnement : le mouvement des étoiles, le gaz chauffé autour de lui et, dans certains cas, l'ombre révélée par des observations radio coordonnées." },
    ],
    keyTakeaways: ["L'horizon des événements marque la limite au-delà de laquelle rien ne peut revenir.", "Les trous noirs peuvent être détectés grâce à leurs effets sur la matière et la lumière proches.", "Ils n'attirent pas automatiquement tous les objets de l'Univers."],
    funFact: "La première image de l'ombre d'un trou noir publiée en 2019 a été obtenue grâce au réseau mondial de télescopes Event Horizon Telescope.", sources: nasaSources,
  },
  {
    _id: "article-exoplanets", title: "Les exoplanètes", slug: "exoplanetes", excerpt: "Des mondes situés autour d'autres étoiles : certains sont rocheux, d'autres géants gazeux, et beaucoup sont très différents de la Terre.",
    domain: { title: "Espace", slug: "espace", icon: "orbit", color: "violet" }, readingMinutes: 4, publishedAt: "2026-10-08T09:00:00.000Z", tags: ["planètes", "astronomie"],
    sections: [{ heading: "Des planètes au-delà du Soleil", body: "Une exoplanète est une planète qui orbite autour d'une étoile autre que le Soleil. Elles existent dans une grande variété de tailles, de températures et d'orbites." }, { heading: "Comment les détecter ?", body: "La méthode du transit observe la légère baisse de luminosité d'une étoile lorsqu'une planète passe devant elle. D'autres méthodes mesurent le minuscule mouvement d'une étoile provoqué par l'attraction de sa planète." }],
    keyTakeaways: ["Une exoplanète orbite autour d'une autre étoile que le Soleil.", "Les transits et les vitesses radiales sont deux méthodes majeures de détection."],
    sources: [{ title: "Exoplanets", url: "https://science.nasa.gov/exoplanets/", publisher: "NASA" }],
  },
  {
    _id: "article-migration", title: "Les grandes migrations animales", slug: "migrations-animales", excerpt: "Pourquoi des espèces parcourent-elles parfois des milliers de kilomètres pour se nourrir, se reproduire ou éviter des conditions difficiles ?",
    domain: { title: "Nature", slug: "nature", icon: "leaf", color: "green" }, readingMinutes: 6, publishedAt: "2026-10-10T10:00:00.000Z", tags: ["animaux", "écologie", "comportement"],
    sections: [{ heading: "Un déplacement régulier", body: "La migration est un déplacement saisonnier ou cyclique entre différentes zones. Elle répond souvent à des changements de température, de disponibilité alimentaire ou de conditions favorables à la reproduction." }, { heading: "Des stratégies variées", body: "Les oiseaux peuvent s'orienter grâce à plusieurs indices, dont les étoiles, le champ magnétique terrestre et le paysage. Les poissons, les mammifères et les insectes ont développé leurs propres stratégies, adaptées à leur milieu." }],
    keyTakeaways: ["Les migrations sont généralement liées à des changements saisonniers et aux ressources.", "Les espèces utilisent des stratégies d'orientation différentes."],
    sources: [{ title: "Animal migration", url: "https://www.nationalgeographic.com/animals", publisher: "National Geographic" }],
  },
  {
    _id: "article-ecosystems", title: "Comment fonctionne un écosystème ?", slug: "ecosystemes", excerpt: "Les êtres vivants et leur environnement forment un réseau d'interactions où l'énergie circule et la matière se transforme.",
    domain: { title: "Nature", slug: "nature", icon: "leaf", color: "green" }, readingMinutes: 5, publishedAt: "2026-10-03T10:00:00.000Z", tags: ["écologie", "biodiversité"],
    sections: [{ heading: "Un système d'interactions", body: "Un écosystème comprend les organismes vivants d'un lieu et les éléments non vivants avec lesquels ils interagissent : eau, sol, air, température et lumière." }, { heading: "Énergie et matière", body: "L'énergie entre souvent dans l'écosystème grâce à la lumière captée par les producteurs, puis passe entre les organismes dans les réseaux alimentaires. La matière, elle, est recyclée par différents processus naturels." }],
    keyTakeaways: ["Un écosystème associe les êtres vivants et leur milieu physique.", "Les réseaux alimentaires transfèrent de l'énergie entre les organismes."],
    sources: [{ title: "Ecosystem", url: "https://education.nationalgeographic.org/resource/ecosystem/", publisher: "National Geographic Education" }],
  },
  {
    _id: "article-printing", title: "L'invention de l'imprimerie en Europe", slug: "invention-imprimerie", excerpt: "Au XVe siècle, l'impression à caractères mobiles transforme la reproduction et la circulation des textes en Europe.",
    domain: { title: "Histoire", slug: "histoire", icon: "landmark", color: "amber" }, readingMinutes: 5, publishedAt: "2026-10-07T10:00:00.000Z", tags: ["livres", "Europe", "techniques"],
    sections: [{ heading: "Avant l'imprimerie à caractères mobiles", body: "Les textes étaient notamment copiés à la main. Des techniques d'impression existaient déjà dans différentes régions du monde, dont l'Asie, bien avant le XVe siècle européen." }, { heading: "Une transformation progressive", body: "Au milieu du XVe siècle, Johannes Gutenberg contribue à diffuser en Europe un système d'impression à caractères métalliques mobiles, associé à une presse et à des méthodes de production adaptées. Les livres deviennent progressivement plus faciles à reproduire et à diffuser." }],
    keyTakeaways: ["L'impression existait sous différentes formes avant Gutenberg.", "Les caractères mobiles ont facilité la reproduction des textes à grande échelle."],
    sources: [{ title: "The Gutenberg Bible", url: "https://www.bl.uk/collection-items/gutenberg-bible", publisher: "British Library" }],
  },
  {
    _id: "article-silkroad", title: "La route de la soie", slug: "route-de-la-soie", excerpt: "Un ensemble de routes terrestres et maritimes reliait des régions d'Asie, d'Afrique et d'Europe par le commerce et les échanges culturels.",
    domain: { title: "Histoire", slug: "histoire", icon: "landmark", color: "amber" }, readingMinutes: 6, publishedAt: "2026-10-01T10:00:00.000Z", tags: ["commerce", "Asie", "civilisations"],
    sections: [{ heading: "Un réseau, pas une seule route", body: "L'expression « route de la soie » désigne un réseau changeant de voies commerciales terrestres et maritimes. Les itinéraires reliaient des oasis, des ports et des villes, avec des acteurs et des marchandises variés." }, { heading: "Des échanges de biens et d'idées", body: "La soie était une marchandise importante, mais les réseaux véhiculaient aussi d'autres produits, des technologies, des croyances, des langues et des savoirs. Les échanges pouvaient être pacifiques, mais aussi dépendre des conflits et des pouvoirs politiques." }],
    keyTakeaways: ["La route de la soie était un réseau complexe d'itinéraires.", "Les échanges concernaient les idées et les techniques autant que les marchandises."],
    sources: [{ title: "Silk Roads Programme", url: "https://en.unesco.org/silkroad/", publisher: "UNESCO" }],
  },
  {
    _id: "article-quantum", title: "La physique quantique", slug: "physique-quantique", excerpt: "Une branche de la physique qui décrit la matière et la lumière à l'échelle des atomes et des particules.",
    domain: { title: "Sciences", slug: "sciences", icon: "atom", color: "blue" }, readingMinutes: 7, publishedAt: "2026-10-11T08:30:00.000Z", tags: ["physique", "atomes", "particules"],
    sections: [{ heading: "Un monde à petite échelle", body: "La physique quantique décrit des phénomènes que les lois classiques ne suffisent pas à expliquer. À l'échelle atomique, certaines grandeurs ne prennent que des valeurs discrètes et les résultats d'une mesure sont décrits en termes de probabilités." }, { heading: "Des effets contre-intuitifs", body: "La superposition et l'intrication sont des notions centrales. Elles ne signifient pas que tout est possible ni que l'on peut transmettre instantanément un message ; elles décrivent des propriétés précises de systèmes quantiques." }],
    keyTakeaways: ["La physique quantique décrit la matière et la lumière à petite échelle.", "Ses prédictions sont probabilistes, mais extrêmement bien testées.", "L'intrication ne permet pas de communiquer plus vite que la lumière."],
    sources: [{ title: "Quantum physics", url: "https://www.nist.gov/physics", publisher: "NIST" }],
  },
  {
    _id: "article-plate-tectonics", title: "La tectonique des plaques", slug: "tectonique-plaques", excerpt: "La surface rigide de la Terre est divisée en plaques mobiles dont les interactions façonnent montagnes, volcans et séismes.",
    domain: { title: "Sciences", slug: "sciences", icon: "atom", color: "blue" }, readingMinutes: 5, publishedAt: "2026-09-29T08:30:00.000Z", tags: ["Terre", "géologie", "séismes"],
    sections: [{ heading: "Une surface en mouvement", body: "La lithosphère terrestre est découpée en plaques qui se déplacent lentement les unes par rapport aux autres. Leurs frontières peuvent être divergentes, convergentes ou coulissantes." }, { heading: "Des conséquences visibles", body: "L'interaction des plaques participe à la formation des chaînes de montagnes, à la distribution des volcans et à de nombreux séismes. Les mouvements sont généralement de l'ordre de quelques centimètres par an." }],
    keyTakeaways: ["Les plaques se déplacent lentement à la surface du globe.", "Leurs interactions expliquent une grande partie de l'activité sismique et volcanique."],
    sources: [{ title: "This Dynamic Earth", url: "https://pubs.usgs.gov/gip/dynamic/", publisher: "USGS" }],
  },
  {
    _id: "article-memory", title: "Comment fonctionne la mémoire ?", slug: "fonctionnement-memoire", excerpt: "La mémoire n'est pas un enregistrement parfait : elle repose sur des processus d'encodage, de consolidation et de récupération.",
    domain: { title: "Psychologie", slug: "psychologie", icon: "brain", color: "rose" }, readingMinutes: 6, publishedAt: "2026-10-09T12:00:00.000Z", tags: ["cerveau", "apprentissage", "cognition"],
    sections: [{ heading: "Plusieurs systèmes", body: "On distingue différentes formes de mémoire, notamment la mémoire de travail, qui maintient temporairement des informations, et la mémoire à long terme. Ces catégories correspondent à des fonctions qui interagissent plutôt qu'à des compartiments totalement isolés." }, { heading: "Se souvenir, c'est reconstruire", body: "Un souvenir peut changer avec le temps et être influencé par le contexte, les connaissances et les informations rencontrées ensuite. La récupération active et l'espacement des révisions peuvent aider certains apprentissages." }],
    keyTakeaways: ["La mémoire comprend plusieurs processus et systèmes.", "Les souvenirs ne sont pas des copies parfaites des événements.", "Se tester et espacer les révisions peut renforcer l'apprentissage."],
    sources: [{ title: "Learning and memory", url: "https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-understanding-sleep", publisher: "National Institute of Neurological Disorders and Stroke" }],
  },
  {
    _id: "article-cognitive-bias", title: "Les biais cognitifs", slug: "biais-cognitifs", excerpt: "Des raccourcis mentaux nous aident à décider rapidement, mais peuvent aussi systématiquement déformer certains jugements.",
    domain: { title: "Psychologie", slug: "psychologie", icon: "brain", color: "rose" }, readingMinutes: 5, publishedAt: "2026-09-27T12:00:00.000Z", tags: ["décision", "raisonnement"],
    sections: [{ heading: "Pourquoi ces raccourcis existent-ils ?", body: "Notre attention et notre temps sont limités. Le cerveau s'appuie souvent sur des règles rapides qui fonctionnent dans de nombreuses situations, mais peuvent produire des erreurs prévisibles dans d'autres." }, { heading: "Les repérer sans simplifier à l'excès", body: "Le biais de confirmation, par exemple, désigne la tendance à rechercher ou interpréter plus favorablement les informations qui confortent une idée. Le connaître aide à prendre du recul, sans pour autant supprimer automatiquement son influence." }],
    keyTakeaways: ["Les biais sont des tendances systématiques, pas simplement des erreurs aléatoires.", "Vérifier des hypothèses contradictoires peut améliorer le jugement."],
    sources: [{ title: "Behavioral science", url: "https://www.oecd.org/en/topics/sub-issues/behavioural-science.html", publisher: "OCDE" }],
  },
  {
    _id: "article-monsoon", title: "Les moussons", slug: "moussons", excerpt: "Un changement saisonnier des vents qui modifie fortement les précipitations dans plusieurs régions du monde.",
    domain: { title: "Géographie", slug: "geographie", icon: "globe", color: "teal" }, readingMinutes: 4, publishedAt: "2026-10-05T08:30:00.000Z", tags: ["climat", "Asie", "météorologie"],
    sections: [{ heading: "Un phénomène saisonnier", body: "Les moussons sont liées aux différences saisonnières de chauffage entre les terres et les océans, à la circulation atmosphérique et à d'autres facteurs régionaux. Elles sont souvent associées à une saison des pluies marquée." }, { heading: "Des effets majeurs", body: "Les pluies de mousson sont essentielles à l'agriculture et aux ressources en eau dans de nombreuses régions. Leur variabilité peut aussi entraîner des inondations, des glissements de terrain ou des périodes de sécheresse." }],
    keyTakeaways: ["La mousson est un régime saisonnier de vents, souvent associé à de fortes pluies.", "Sa variabilité influence l'agriculture, l'eau et les risques naturels."],
    sources: [{ title: "Monsoon", url: "https://www.britannica.com/science/monsoon", publisher: "Encyclopaedia Britannica" }],
  },
  {
    _id: "article-timezones", title: "Pourquoi existe-t-il des fuseaux horaires ?", slug: "fuseaux-horaires", excerpt: "Les fuseaux horaires organisent l'heure civile en tenant compte de la rotation terrestre et des besoins des sociétés.",
    domain: { title: "Géographie", slug: "geographie", icon: "globe", color: "teal" }, readingMinutes: 4, publishedAt: "2026-09-25T08:30:00.000Z", tags: ["Terre", "temps", "société"],
    sections: [{ heading: "La Terre tourne", body: "La Terre effectue une rotation en environ 24 heures. Le Soleil ne culmine donc pas au même moment selon la longitude, ce qui a historiquement conduit les villes à régler leurs horloges différemment." }, { heading: "Une convention internationale", body: "Les chemins de fer et les communications ont favorisé l'adoption d'heures standardisées au XIXe siècle. Aujourd'hui, les fuseaux suivent surtout des décisions politiques et ne forment pas des bandes parfaitement régulières." }],
    keyTakeaways: ["La rotation terrestre explique les différences locales d'heure solaire.", "Les fuseaux horaires sont aussi des conventions politiques et sociales."],
    sources: [{ title: "Time zones", url: "https://www.timeanddate.com/time/time-zones.html", publisher: "timeanddate.com" }],
  },
];
