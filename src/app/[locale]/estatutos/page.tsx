'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { useTranslations, useLocale } from 'next-intl';
import { Search, Printer, Scale, Building, Award, Bookmark, ArrowLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';

// Structured Statutes (Estatutos)
const ESTATUTOS_DATA = [
  {
    id: 'art-1',
    number: 'ARTIGO 1º',
    title: 'Denominação, Sede e Duração',
    paragraphs: [
      'A Associação, sem fins lucrativos, adota a denominação Check-In – Cooperação e Desenvolvimento, e tem sede na Casa das Associações, Rua Professor Janeiro Acabado s/n. 7800-506 Beja, União das Freguesias de Beja (Santiago Maior e São João Baptista), Concelho de Beja, e constitui-se por Associação Juvenil.',
      'A Associação tem o número de pessoa coletiva 509392733 e o número de identificação na segurança social 25093927331.'
    ]
  },
  {
    id: 'art-2',
    number: 'ARTIGO 2º',
    title: 'Fim',
    paragraphs: [
      'A Associação tem como fim:',
      'a) Promover a integração social e comunitária;',
      'b) Promover o desenvolvimento de competências pessoais, interpessoais e sociais;',
      'c) Promover uma cidadania ativa e global e o respeito pelos direitos humanos;',
      'd) Promover a tolerância, o diálogo intercultural e a solidariedade entre os povos;',
      'e) Promover a educação e a cooperação para o desenvolvimento sustentável;',
      'f) Promover a igualdade de oportunidades e de género;',
      'g) Promover o estudo, a investigação e a difusão de informação relativa aos jovens, cooperando com entidades públicas e privadas que visem a integração social e o desenvolvimento de políticas adequadas;',
      'h) Desenvolver sinergias e cooperação em rede com outras organizações, públicas e privadas, de modo a desenvolver atividades de defesa ambiental e de prevenção de comportamentos de risco; e',
      'i) Desenvolver a cooperação e solidariedade entre os seus associados, na base da realização de iniciativas relativas à problemática da juventude.',
      'j) Promover o estudo, a investigação, a divulgação e a formação na área da cibersegurança junto da comunidade juvenil;',
      'k) Desenvolver outras atividades complementares ou acessórias por deliberação da Assembleia Geral.'
    ]
  },
  {
    id: 'art-3',
    number: 'ARTIGO 3º',
    title: 'Receitas',
    paragraphs: [
      'Constituem receitas da Associação, designadamente:',
      'a) a jóia inicial paga pelos sócios;',
      'b) o produto das quotizações fixadas em Assembleia-geral e contribuições complementares pagas pelos associados;',
      'c) os rendimentos dos bens próprios da associação, dos serviços prestados e das receitas das atividades sociais;',
      'd) as liberdades aceites pela Associação; e',
      'e) os subsídios que lhe sejam atribuídos.'
    ]
  },
  {
    id: 'art-4',
    number: 'ARTIGO 4º',
    title: 'Órgãos',
    paragraphs: [
      '1. São órgãos da Associação a Assembleia-geral, a Direção e o Conselho Fiscal.',
      '2. O mandato dos órgãos sociais é de 5 anos.'
    ]
  },
  {
    id: 'art-5',
    number: 'ARTIGO 5º',
    title: 'Assembleia-geral',
    paragraphs: [
      'A Assembleia-geral é constituída por todos os associados no pleno gozo dos seus direitos.',
      'As competências da Assembleia-geral e a forma do seu funcionamento são os estabelecidos no Código Civil, designadamente no artigo 170º e nos artigos 172º a 179º.',
      'A mesa da Assembleia-geral é composta por três associados, um presidente e dois secretários, competindo-lhes dirigir as reuniões da assembleia e lavrar as respetivas atas.',
      'A assembleia geral é convocada por meio de aviso postal, expedido para cada um dos associados com a antecedência mínima de oito dias; no aviso indicar-se-á o dia, hora e local da reunião e a respetiva ordem do dia;',
      'É dispensada a expedição do aviso postal referido no número anterior caso a convocação da assembleia geral seja feita mediante publicação do respetivo aviso nos termos legalmente previstos para os atos das sociedades comerciais.'
    ]
  },
  {
    id: 'art-6',
    number: 'ARTIGO 6º',
    title: 'Direção',
    paragraphs: [
      'A Direção, eleita em Assembleia-geral, é composta por 7 associados.',
      'À Direção compete a gerência social, administrativa e financeira da Associação e a representação da Associação em juízo e fora dele.',
      'A forma do seu funcionamento é a estabelecida no artigo 171º do Código Civil.',
      'A Associação obriga-se com a intervenção da assinatura do Presidente;',
      'Na falta ou ausência do Presidente, a associação obriga-se com a assinatura de dois membros da direção.'
    ]
  },
  {
    id: 'art-7',
    number: 'ARTIGO 7º',
    title: 'Conselho Fiscal',
    paragraphs: [
      'O Conselho Fiscal, eleito em Assembleia-geral, é composto por 3 associados.',
      'Ao Conselho Fiscal compete fiscalizar os atos administrativos e financeiros da Direção, presentes nas suas contas e relatórios, e dar parecer sobre os atos que impliquem o aumento das despesas ou a diminuição das receitas.',
      'A forma do seu funcionamento é a estabelecida no artigo 171º do Código Civil.'
    ]
  },
  {
    id: 'art-8',
    number: 'ARTIGO 8º',
    title: 'Admissão e exclusão',
    paragraphs: [
      'As condições de admissão e exclusão dos membros associados, das suas categorias, direitos e obrigações, constarão do regulamento a aprovar na Assembleia-geral.'
    ]
  },
  {
    id: 'art-9',
    number: 'ARTIGO 9º',
    title: 'Extinção. Destino dos bens.',
    paragraphs: [
      'Extinta a Associação, o destino dos bens que integrarem o património social, que não estejam afetados a fim determinado e que não tenham sido doados ou deixados com algum encargo, será objeto de deliberação dos associados.'
    ]
  },
  {
    id: 'art-10',
    number: 'ARTIGO 10º',
    title: 'Direitos dos Associados',
    paragraphs: [
      '1) São direitos dos associados:',
      'A. Participar nas Assembleias Gerais;',
      'B. Fazer-se representar na Assembleia Geral por outro associado quando não puder comparecer através de procuração ou simples carta de representação;',
      'C. Requerer, nos termos estatutários, a convocação da Assembleia Geral Extraordinária;',
      'D. Examinar as atas e documentos relativos ao exercício colocados à disposição dos Associados com a antecedência mínima de dez dias a contar da data da realização da Assembleia Geral.',
      'E. Eleger ou ser eleito para Órgãos da associação;',
      'F. Reclamar junto de cada órgão associativo das deliberações, atos e omissões que sejam contrários à lei, aos estatutos e aos regulamentos;',
      'G. Usufruir dos serviços de apoio aos associados;',
      'H. Beneficiar dos protocolos que a associação venha a celebrar com entidades parceiras;',
      'I. Os direitos consignados no número anterior com exceção da mera presença nas Assembleias Gerais sem nelas poderem intervir, respeitam apenas aos associados com as quotas vencidas e regularizadas.'
    ]
  },
  {
    id: 'art-11',
    number: 'ARTIGO 11º',
    title: 'Deveres dos Associados',
    paragraphs: [
      '1) São duties dos associados:',
      'A. Pugnar pela boa imagem e pelo bom nome da Associação CHECK-IN;',
      'B. Cumprir os estatutos, os regulamentos e as deliberações dos órgãos da associação;',
      'C. Tomar todas as diligências que estejam ao seu alcance para o desenvolvimento da associação;',
      'D. Desempenhar os cargos para os que tenham sido eleitos, designado ou mandatados, salvo motivo especial de escusa reconhecidamente impeditivo;',
      'E. Prestar aos órgãos da associação as informações que lhes sejam pedidas no âmbito das atividades da Check-IN e na defesa dos seus legítimos interesses;',
      'F. Comunicar a mudança de morada e contactos;',
      'G. Pagar as quotas ou outras contribuições que lhe sejam exigíveis nos termos estatutários.'
    ]
  },
  {
    id: 'art-12',
    number: 'ARTIGO 12º',
    title: 'Contribuições',
    paragraphs: [
      'As contribuições dos associados serão determinadas em assembleia geral ou nas que constem do regulamento interno a aprovar.'
    ]
  },
  {
    id: 'art-13',
    number: 'ARTIGO 13º',
    title: 'Casos Omissos',
    paragraphs: [
      'Os casos omissos serão resolvidos pela assembleia geral, de acordo com a legislação em vigor.'
    ]
  }
];

// Structured Internal Regulations of Branches (Regulamento Interno dos Núcleos)
const REGULAMENTO_DATA = {
  preamble: 'A atenção da Associação Check-IN – Cooperação e Desenvolvimento recai naturalmente sobre aqueles jovens com acesso menos privilegiado à informação e, consequentemente, à candidatura a projetos de mobilidade, sendo as razões para tal associadas com a sua localização geográfica, a sua situação económica ou a sua condição pessoal. Através de uma estreita rede de trabalho entre a sede e os núcleos, a Check-IN consegue fazer chegar os seus propósitos a um maior número de jovens, de forma mais efetiva.',
  articles: [
    {
      id: 'reg-art-1',
      number: 'ARTIGO 1º',
      title: 'Objeto',
      paragraphs: [
        'O presente regulamento visa clarificar e agilizar os procedimentos dos núcleos da Associação, complementando o disposto nos Estatutos.'
      ]
    },
    {
      id: 'reg-art-2',
      number: 'ARTIGO 2º',
      title: 'Núcleos',
      paragraphs: [
        'Os associados podem agrupar-se em núcleos distritais e regionais, coordenados com vista a alcançarem de uma forma mais eficaz os fins da Associação e os objetivos aprovados pelos órgãos de Direção da Associação;',
        'Os núcleos poderão prosseguir objetivos próprios, desde que conformes aos objetivos e fins da Associação;',
        'A constituição de um núcleo está dependente da aprovação da Direção;',
        'A desativação de um núcleo está dependente da aprovação da Direção.'
      ]
    },
    {
      id: 'reg-art-3',
      number: 'ARTIGO 3º',
      title: 'Funcionamento',
      paragraphs: [
        'Os núcleos têm autonomia de funcionamento.',
        'Os núcleos adotarão a estrutura organizativa que mais se adapte às necessidades do seu funcionamento.',
        'A gestão financeira dos núcleos é da responsabilidade da Direção;',
        'Os núcleos regem-se pelos Estatutos e pelo presente Regulamento.',
        'Os núcleos não têm personalidade jurídica, mas têm capacidade judiciária, como decorre da lei geral.',
        'O exercício da capacidade judiciária ativa pelos núcleos depende de prévia autorização expressa da Direção.',
        'Os núcleos serão estruturas de natureza democrática, integrando sempre uma Assembleia de Núcleo e uma Coordenação de Núcleo.'
      ]
    },
    {
      id: 'reg-art-4',
      number: 'ARTIGO 4º',
      title: 'Assembleia de Núcleo',
      paragraphs: [
        'A Assembleia de Núcleo é constituída por todos os associados residentes na sua área geográfica de intervenção e no pleno gozo dos seus direitos.',
        'É a Coordenação que convoca a Assembleia de Núcleo, por iniciativa própria ou a pedido de um quinto dos associados residentes na respetiva área geográfica.',
        'As reuniões ordinárias das assembleias de todos os núcleos devem decorrer dentro de um período estabelecido de 90 dias.',
        'Da convocatória constará a indicação do nome do associado que presidirá à Mesa da Assembleia de Núcleo. O nome indicado será sugerido pela Coordenação de Núcleo ou ainda por outro associado que a Direção indique.'
      ]
    },
    {
      id: 'reg-art-5',
      number: 'ARTIGO 5º',
      title: 'Coordenação de Núcleo',
      paragraphs: [
        'A Coordenação de Núcleo é eleita por lista, em Assembleia de Núcleo, e é constituída por um mínimo de um e num máximo de três associados.',
        'A Coordenação de Núcleo é responsável por todos os atos praticados no desempenho da sua atividade, com exceção dos atos praticados por solicitação ou autorização expressas da Direção.'
      ]
    },
    {
      id: 'reg-art-6',
      number: 'ARTIGO 6º',
      title: 'Entrada em Vigor',
      paragraphs: [
        'O presente regulamento entra em vigor logo que aprovado, por maioria dos presentes, em reunião de Direção.'
      ]
    },
    {
      id: 'reg-art-7',
      number: 'ARTIGO 7º',
      title: 'Revisão',
      paragraphs: [
        'Qualquer alteração ou aditamento ao presente Regulamento deverá ser aprovado em reunião de Direção, por maioria.'
      ]
    }
  ]
};

// Structured Safeguarding and PSEAH Policy
const SAFEGUARDING_DATA = [
  {
    id: 'saf-1',
    number: 'SECÇÃO 1',
    title: {
      pt: 'Contexto e Compromisso',
      tr: 'Bağlam ve Taahhüt'
    },
    paragraphs: {
      pt: [
        'A Associação Check-IN reconhece a importância de garantir um ambiente seguro para todos os envolvidos nas suas atividades, com especial enfoque na proteção de menores e grupos vulneráveis.',
        'Esta política descreve os princípios e procedimentos para prevenir e responder a situações de exploração sexual, abuso, assédio, discriminação e outras violações de direitos.'
      ],
      tr: [
        'Check-IN Derneği, faaliyetlerinde yer alan herkes için, özellikle reşit olmayanların ve savunmasız grupların korunmasına odaklanarak güvenli bir ortam sağlamanın önemini kabul eder.',
        'Bu politika; cinsel sömürü, istismar, taciz, ayrımcılık ve diğer hak ihlallerini önlemek ve bunlara yanıt vermek için temel ilke ve prosedürleri tanımlamaktadır.'
      ]
    }
  },
  {
    id: 'saf-2',
    number: 'SECÇÃO 2',
    title: {
      pt: 'Enquadramento Legal e Regulamentar',
      tr: 'Yasal ve Mevzuat Çerçevesi'
    },
    paragraphs: {
      pt: [
        'Esta política baseia-se nos seguintes diplomas e referências internacionais:',
        'a) Convenção das Nações Unidas sobre os Direitos da Criança (CDC);',
        'b) Convenção sobre a Eliminação de Todas as Formas de Discriminação contra as Mulheres (CEDAW);',
        'c) Legislação portuguesa e europeia aplicável em matéria de proteção de menores;',
        'd) Código de Conduta interno da Associação Check-IN.'
      ],
      tr: [
        'Bu politika, aşağıdaki uluslararası sözleşmeler ve yasal referanslara dayanmaktadır:',
        'a) Birleşmiş Milletler Çocuk Haklarına Dair Sözleşme (ÇHS);',
        'b) Kadınlara Karşı Her Türlü Ayrımcılığın Önlenmesi Sözleşmesi (CEDAW);',
        'c) Reşit olmayanların korunmasına ilişkin ilgili Portekiz ve Avrupa mevzuatı;',
        'd) Check-IN Derneği iç Davranış Kuralları.'
      ]
    }
  },
  {
    id: 'saf-3',
    number: 'SECÇÃO 3',
    title: {
      pt: 'Definições Importantes',
      tr: 'Önemli Tanımlamalar'
    },
    paragraphs: {
      pt: [
        'Criança/Menor: Qualquer pessoa com idade inferior a 18 anos.',
        'Exploração Sexual: A utilização de uma posição de poder, autoridade ou vulnerabilidade para obter favores sexuais.',
        'Abuso Sexual: Qualquer ato sexual não consentido, incluindo o abuso contra menores.',
        'Assédio Sexual: Abordagens ou comentários sexuais indesejados que gerem desconforto ou intimidação.',
        'Discriminação: Tratamento injusto com base no género, etnia, deficiência, orientação sexual, entre outros fatores.',
        'PSEAH: Sigla para a Prevenção da Exploração, Abuso e Assédio Sexual.'
      ],
      tr: [
        'Çocuk: 18 yaşın altındaki her birey.',
        'Cinsel Sömürü: Cinsel çıkar sağlamak için güç, otorite veya savunmasızlık durumunun kullanılması.',
        'Cinsel İstismar: Reşit olmayanlara yönelik istismar da dahil olmak üzere, rıza dışı gerçekleşen her türlü cinsel eylem.',
        'Cinsel Taciz: İstenmeyen cinsel içerikli yaklaşımlar, teklifler veya yorumlar.',
        'Ayrımcılık: Cinsiyet, etnik köken, engellilik, cinsel yönelim vb. nedenlerle uygulanan haksız muamele.',
        'PSEAH: Cinsel Sömürü, İstismar ve Tacizin Önlenmesi (Prevention of Sexual Exploitation, Abuse, and Harassment) kısaltması.'
      ]
    }
  },
  {
    id: 'saf-4',
    number: 'SECÇÃO 4',
    title: {
      pt: 'Âmbito de Aplicação',
      tr: 'Uygulama Kapsamı'
    },
    paragraphs: {
      pt: [
        'Esta política aplica-se obrigatoriamente a:',
        'a) Colaboradores contratados, voluntários, consultores e estagiários da Check-IN;',
        'b) Parceiros internacionais, prestadores de serviços e fornecedores da associação;',
        'c) Participantes de projetos, beneficiários diretos e indiretos das atividades da Check-IN.'
      ],
      tr: [
        'Bu politika, aşağıdakiler için zorunlu olarak uygulanır:',
        'a) Check-IN çalışanları, gönüllüleri, danışmanları ve stajyerleri;',
        'b) Derneğin ortakları, hizmet sağlayıcıları ve tedarikçileri;',
        'c) Proje katılımcıları ve Check-IN faaliyetlerinin faydalanıcıları.'
      ]
    }
  },
  {
    id: 'saf-5',
    number: 'SECÇÃO 5',
    title: {
      pt: 'Princípios Fundamentais',
      tr: 'Temel İlkeler'
    },
    paragraphs: {
      pt: [
        '1. Tolerância zero para qualquer forma de abuso ou exploração sexual;',
        '2. Respeito absoluto pela dignidade humana em todas as interações da associação;',
        '3. Prevenção ativa mediante sessões de formação obrigatórias e sensibilização contínua;',
        '4. Responsabilidade partilhada entre todos os colaboradores na manutenção de ambientes seguros;',
        '5. Transparência nos processos de comunicação, receção de queixas e resposta institucional;',
        '6. Apoio imediato e confidencial às vítimas, assegurando o encaminhamento para serviços de especialidade.'
      ],
      tr: [
        '1. Her türlü istismar veya sömürüye karşı sıfır tolerans;',
        '2. Tüm kurumsal etkileşimlerde insan onuruna mutlak saygı;',
        '3. Zorunlu eğitim ve sürekli farkındalık çalışmalarıyla aktif önleme;',
        '4. Güvenli ortamların sürdürülmesinde tüm çalışanlar arasında ortak sorumluluk;',
        '5. İletişim, şikayetlerin alınması ve kurumsal yanıt süreçlerinde şeffaflık;',
        '6. Mağdurlara hemen ve gizli destek sağlanarak uzman servislere yönlendirme.'
      ]
    }
  },
  {
    id: 'saf-6',
    number: 'SECÇÃO 6',
    title: {
      pt: 'Medidas Preventivas Adotadas',
      tr: 'Alınan Önleyici Tedbirler'
    },
    paragraphs: {
      pt: [
        'A Check-IN implementa as seguintes medidas preventivas regulares:',
        'a) Verificação de antecedentes criminais e pedido de referências no recrutamento de pessoal;',
        'b) Formação obrigatória sobre a proteção de menores e a política PSEAH para a equipa;',
        'c) Assinatura obrigatória do Código de Conduta por todos os colaboradores e voluntários;',
        'd) Monitorização contínua de atividades que envolvam menores de idade;',
        'e) Obtenção de consentimento informado por escrito dos representantes legais dos menores.'
      ],
      tr: [
        'Check-IN, aşağıdaki düzenli önleyici tedbirleri uygulamaktadır:',
        'a) Personel işe alımlarında sabıka kaydı doğrulaması ve referans kontrolü;',
        'b) Ekip için çocuk koruma ve PSEAH politikası üzerine zorunlu eğitimler;',
        'c) Tüm çalışanlar ve gönüllüler tarafından Davranış Kurallarının imzalanması;',
        'd) Reşit olmayanların katıldığı faaliyetlerin sürekli izlenmesi;',
        'e) Reşit olmayanların yasal temsilcilerinden yazılı bilgilendirilmiş onam alınması.'
      ]
    }
  },
  {
    id: 'saf-7',
    number: 'SECÇÃO 7',
    title: {
      pt: 'Mecanismos de Denúncia e Reporte',
      tr: 'Şikayet ve Bildirim Mekizmaları'
    },
    paragraphs: {
      pt: [
        'Qualquer suspeita ou incidente deve ser reportado imediatamente através dos seguintes canais:',
        '1. Canal de E-mail Dedicado: protecao@checkin.org.pt;',
        '2. Formulário de denúncia anónimo ou identificado disponível no website da associação;',
        '3. Garantia absoluta de confidencialidade e proteção total contra retaliações ao denunciante;',
        '4. Investigação interna iniciada e resposta institucional no prazo máximo de 48 horas;',
        '5. Encaminhamento imediato para as autoridades policiais ou judiciais competentes sempre que aplicável.'
      ],
      tr: [
        'Herhangi bir şüphe veya olay derhal aşağıdaki kanallar aracılığıyla bildirilmelidir:',
        '1. Özel E-posta Kanalı: protecao@checkin.org.pt;',
        '2. Dernek web sitesinde bulunan anonim veya kimlikli bildirim formu;',
        '3. İhbarcı için mutlak gizlilik garantisi ve misillemelere karşı tam koruma;',
        '4. En geç 48 saat içinde başlatılan iç soruşturma ve kurumsal yanıt süreci;',
        '5. Gerektiğinde yetkili polis veya adli makamlara derhal resmi bildirim.'
      ]
    }
  },
  {
    id: 'saf-8',
    number: 'SECÇÃO 8',
    title: {
      pt: 'Apoio aos Sobreviventes / Vítimas',
      tr: 'Hayatta Kalanlara / Mağdurlara Destek'
    },
    paragraphs: {
      pt: [
        'A Check-IN compromete-se a fornecer:',
        'a) Acompanhamento empático, seguro, digno e sem julgamentos;',
        'b) Encaminhamento estruturado para apoio psicológico, médico e jurídico especializado;',
        'c) Monitorização contínua do bem-estar e reintegração dos envolvidos;',
        'd) Envolvimento ativo da pessoa em todas as decisões sobre o seu processo pessoal.'
      ],
      tr: [
        'Check-IN aşağıdakileri sağlamayı taahhüt eder:',
        'a) Empatik, güvenli, onurlu ve yargısız yaklaşım;',
        'b) Uzman psikolojik, tıbbi ve hukuki desteğe yapılandırılmış yönlendirme;',
        'c) Süreçteki kişilerin refahının ve uyumunun sürekli izlenmesi;',
        'd) Kişinin kendi süreciyle ilgili tüm kararlara aktif olarak dahil edilmesi.'
      ]
    }
  },
  {
    id: 'saf-9',
    number: 'SECÇÃO 9',
    title: {
      pt: 'Envolvimento Comunitário e Parcerias',
      tr: 'Toplumsal Katılım ve Ortaklıklar'
    },
    paragraphs: {
      pt: [
        'a) Sensibilização das comunidades locais e parceiros sociais sobre esta política de salvaguarda;',
        'b) Exigência de adesão aos princípios de proteção por parte de todos os parceiros de consórcios;',
        'c) Ações de formação conjuntas periódicas com entidades associadas e redes locais.'
      ],
      tr: [
        'a) Yerel toplulukların ve sosyal ortakların koruma politikası hakkında bilinçlendirilmesi;',
        'b) Konsorsiyum ortaklarının tamamından bu koruma ilkelerine uyum taahhüdü talep edilmesi;',
        'c) Üye kuruluşlar ve yerel ağlar ile periyodik ortak eğitim faaliyetlerinin yürütülmesi.'
      ]
    }
  },
  {
    id: 'saf-10',
    number: 'SECÇÃO 10',
    title: {
      pt: 'Revisão Periódica da Política',
      tr: 'Politikanın Periyodik Revizyonu'
    },
    paragraphs: {
      pt: [
        'Esta política será objeto de revisão integral a cada dois anos ou imediatamente após qualquer incidente grave que o justifique.',
        'A revisão contará com o contributo ativo da equipa técnica, parceiros estratégicos e representantes dos beneficiários directos.',
        'Data de Aprovação: 6 de Junho de 2025.'
      ],
      tr: [
        'Bu politika, her iki yılda bir veya gerekçelendiren herhangi bir ciddi olay sonrasında tamamen gözden geçirilecektir.',
        'Gözden geçirme sürecine teknik ekibin, stratejik ortakların ve doğrudan faydalanıcı temsilcilerinin aktif katkısı dahil edilecektir.',
        'Onay Tarihi: 6 Haziran 2025.'
      ]
    }
  }
];

export default function EstatutosPage() {
  const t = useTranslations('estatutosPage');
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<'estatutos' | 'regulamento' | 'safeguarding'>('estatutos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // References to article sections for scroll control
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Clean active section when active tab switches
  useEffect(() => {
    if (activeTab === 'estatutos') {
      setActiveSection('art-1');
    } else if (activeTab === 'regulamento') {
      setActiveSection('preamble');
    } else {
      setActiveSection('saf-1');
    }
    setSearchQuery('');
  }, [activeTab]);

  const activeArticles = useMemo(() => {
    if (activeTab === 'estatutos') return ESTATUTOS_DATA;
    if (activeTab === 'regulamento') return REGULAMENTO_DATA.articles;
    
    // Normalize Safeguarding to match the general rendering shape
    return SAFEGUARDING_DATA.map((item) => ({
      id: item.id,
      number: item.number,
      title: locale === 'tr' ? item.title.tr : item.title.pt,
      paragraphs: locale === 'tr' ? item.paragraphs.tr : item.paragraphs.pt
    }));
  }, [activeTab, locale]);

  // Clean printing helper
  const handlePrint = () => {
    window.print();
  };

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const yOffset = -90; // Offset for header spacing
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  // Set up intersection observer to dynamically track active item on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -75% 0px',
      threshold: 0
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe active articles
    activeArticles.forEach((article) => {
      const el = document.getElementById(article.id);
      if (el) observer.observe(el);
    });

    // Observe Preamble for Regulamento tab
    if (activeTab === 'regulamento') {
      const el = document.getElementById('preamble');
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [activeArticles, activeTab]);

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return activeArticles;

    const query = searchQuery.toLowerCase();
    return activeArticles.filter((article) => {
      const inTitle = article.title.toLowerCase().includes(query);
      const inNumber = article.number.toLowerCase().includes(query);
      const inParagraphs = article.paragraphs.some(p => p.toLowerCase().includes(query));
      return inTitle || inNumber || inParagraphs;
    });
  }, [activeArticles, searchQuery]);

  const preambleMatchesQuery = useMemo(() => {
    if (activeTab !== 'regulamento') return false;
    if (!searchQuery.trim()) return true;
    return REGULAMENTO_DATA.preamble.toLowerCase().includes(searchQuery.toLowerCase());
  }, [activeTab, searchQuery]);

  // Text highlighter utility
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;

    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-amber-100 text-slate-900 rounded font-semibold px-0.5 border-b border-amber-300">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getActiveArticleNumber = () => {
    if (activeSection === 'preamble') return t('preamble');
    const found = activeArticles.find((a) => a.id === activeSection);
    return found ? found.number : '';
  };

  return (
    <main className="min-h-screen bg-[#FAFAFC] text-slate-800">
      {/* Custom print styling */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, .no-print {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-break-inside {
            page-break-inside: avoid !important;
            margin-bottom: 2rem !important;
            border: none !important;
            background: transparent !important;
          }
          .print-title {
            text-align: center;
            margin-bottom: 2rem;
          }
        }
      `}</style>

      {/* Navbar wrapper */}
      <div className="no-print">
        <Navbar variant="light" />
      </div>

      <div className="theme-light bg-background text-foreground transition-colors duration-300">

        {/* Premium Light-Themed Header */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-6 no-print">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200/60 pb-8 gap-6">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-accent-blue transition-colors uppercase tracking-wider mb-4 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {locale === 'tr' ? 'Ana Sayfaya Dön' : 'Voltar ao Início'}
              </Link>
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-accent-blue shrink-0">
                  <Scale className="w-6 h-6" />
                </span>
                <div>
                  <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-slate-900">
                    {t('title')}
                  </h1>
                  <p className="text-slate-500 text-sm sm:text-base font-semibold mt-1">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-full transition-all border border-slate-200 shadow-sm hover:shadow active:scale-98 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {t('printButton')}
            </button>
          </div>
        </section>

        {/* Tab Switcher Panel */}
        <div className="max-w-7xl mx-auto px-6 mt-8 no-print">
          <div className="bg-slate-100/80 border border-slate-200/50 p-1.5 rounded-[24px] grid grid-cols-1 md:grid-cols-3 gap-2 max-w-3xl mx-auto">
            <button
              onClick={() => setActiveTab('estatutos')}
              className={`py-3.5 px-4 rounded-[18px] text-xs font-bold transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'estatutos'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-900/5 border border-slate-200/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Scale className="w-4 h-4 text-accent-blue" />
              {t('tabEstatutos')}
            </button>
            <button
              onClick={() => setActiveTab('regulamento')}
              className={`py-3.5 px-4 rounded-[18px] text-xs font-bold transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'regulamento'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-900/5 border border-slate-200/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building className="w-4 h-4 text-accent-blue" />
              {t('tabRegulamento')}
            </button>
            <button
              onClick={() => setActiveTab('safeguarding')}
              className={`py-3.5 px-4 rounded-[18px] text-xs font-bold transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'safeguarding'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-900/5 border border-slate-200/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-accent-blue" />
              {t('tabSafeguarding')}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="max-w-7xl mx-auto px-6 mt-6 no-print">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm flex items-start sm:items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-xl text-accent-blue shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                {activeTab === 'estatutos'
                  ? t('officialWarningEstatutos')
                  : activeTab === 'regulamento'
                  ? t('officialWarningRegulamento')
                  : t('officialWarningSafeguarding')}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Jump Menu */}
        <div className="sticky top-[64px] z-30 bg-white/95 backdrop-blur-xl border-b border-slate-100 py-3.5 px-6 shadow-sm flex items-center justify-between gap-3 lg:hidden no-print">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-accent-blue" />
            {t('tableOfContents')}
          </button>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {getActiveArticleNumber()}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black z-40 lg:hidden no-print"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 bottom-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden no-print"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="font-heading font-black text-slate-900 text-lg uppercase tracking-wider">
                      {t('tableOfContents')}
                    </span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-extrabold text-slate-400 hover:text-slate-800"
                    >
                      {locale === 'tr' ? 'Kapat' : 'Fechar'}
                    </button>
                  </div>

                  <nav className="space-y-1.5">
                    {activeTab === 'regulamento' && (
                      <button
                        onClick={() => scrollToSection('preamble')}
                        className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          activeSection === 'preamble'
                            ? 'bg-accent-blue/10 text-accent-blue'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold">{t('preamble')}</span>
                        </div>
                      </button>
                    )}

                    {activeArticles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => scrollToSection(article.id)}
                        className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          activeSection === article.id
                            ? 'bg-accent-blue/10 text-accent-blue'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        <div className="truncate">
                          <span className="block text-[9px] uppercase tracking-wider opacity-85">
                            {article.number}
                          </span>
                          <span className="font-semibold">{article.title}</span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  CHECK-IN ASSOCIATION
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Layout */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Sidebar Sticky Panel (Desktop) */}
            <aside className="lg:col-span-4 sticky top-[100px] space-y-6 hidden lg:block no-print">
              
              {/* Search */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                  {locale === 'tr' ? 'HIZLI ARAMA' : 'PESQUISAR'}
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-slate-800 outline-none transition-all focus:border-accent-blue focus:bg-white shadow-inner"
                  />
                </div>
              </div>

              {/* Table of Contents */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm flex flex-col max-h-[380px]">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">
                  {t('tableOfContents')}
                </span>
                <div className="overflow-y-auto pr-2 space-y-1">
                  {activeTab === 'regulamento' && (
                    <button
                      onClick={() => scrollToSection('preamble')}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                        activeSection === 'preamble'
                          ? 'bg-accent-blue/10 text-accent-blue border-l-4 border-accent-blue rounded-l-none'
                          : 'text-slate-600 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-semibold block truncate leading-normal">{t('preamble')}</span>
                      </div>
                    </button>
                  )}

                  {activeArticles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => scrollToSection(article.id)}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                        activeSection === article.id
                          ? 'bg-accent-blue/10 text-accent-blue border-l-4 border-accent-blue rounded-l-none'
                          : 'text-slate-600 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block text-[8px] uppercase tracking-widest opacity-80 mb-0.5">
                          {article.number}
                        </span>
                        <span className="font-semibold block truncate leading-normal">{article.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest block border-b border-slate-100 pb-2">
                  {locale === 'tr' ? 'RESMİ BİLGİLER' : 'DADOS LEGAIS'}
                </span>
                
                <div className="space-y-3.5">
                  <div className="flex gap-3">
                    <Building className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                        {t('nipc')}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {activeTab === 'estatutos' ? '509 392 733' : '509 392 733'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Award className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                        {t('iss')}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {activeTab === 'estatutos' ? '2 509 392 733 1' : '2 509 392 733 1'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Bookmark className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                        REGISTO IPDJ
                      </span>
                      <span className="text-xs font-semibold text-slate-800">Nº 156 (Associação Juvenil)</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Document Content */}
            <article className="lg:col-span-8 space-y-6 print-full-width">
              
              {/* Print Title */}
              <div className="hidden print-title print:block">
                <h1 className="text-2xl font-bold uppercase tracking-wide">
                  {activeTab === 'estatutos'
                    ? t('tabEstatutos')
                    : activeTab === 'regulamento'
                    ? t('tabRegulamento')
                    : t('tabSafeguarding')}
                </h1>
                <p className="text-base text-slate-600 font-semibold mt-1">{t('subtitle')}</p>
                <div className="mt-4 border-b border-slate-400 pb-4 text-sm text-slate-500">
                  <span>NIPC: 509392733 | NISS: 25093927331</span>
                </div>
              </div>

              {/* Mobile Search Input */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm lg:hidden no-print mb-4">
                <div className="relative">
                  <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-xs text-slate-800 outline-none focus:border-accent-blue focus:bg-white"
                  />
                </div>
              </div>

              {/* Preamble for Regulamento */}
              {activeTab === 'regulamento' && preambleMatchesQuery && (
                <section
                  id="preamble"
                  ref={(el) => {
                    sectionRefs.current['preamble'] = el;
                  }}
                  className="bg-[#F8FAFC] border border-slate-200/60 rounded-[32px] p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.015)] scroll-mt-24 print-break-inside"
                >
                  <h2 className="font-heading font-black text-slate-900 text-lg sm:text-xl tracking-tight mb-4 leading-snug">
                    {t('preamble')}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {highlightText(REGULAMENTO_DATA.preamble, searchQuery)}
                  </p>
                </section>
              )}

              {filteredArticles.length === 0 && !preambleMatchesQuery ? (
                <div className="bg-white border border-slate-200/80 rounded-[32px] py-16 px-6 text-center shadow-sm">
                  <Scale className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm font-semibold text-slate-500">
                    {t('noResults')}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredArticles.map((article) => (
                    <section
                      key={article.id}
                      id={article.id}
                      ref={(el) => {
                        sectionRefs.current[article.id] = el;
                      }}
                      className="bg-white border border-slate-200/60 rounded-[32px] p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.015)] transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)] border-l-4 border-l-transparent hover:border-l-accent-blue/80 scroll-mt-24 print-break-inside"
                    >
                      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                        <span className="px-3.5 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {highlightText(article.number, searchQuery)}
                        </span>
                      </div>

                      <h2 className="font-heading font-black text-slate-900 text-lg sm:text-xl tracking-tight mb-5 leading-snug">
                        {highlightText(article.title, searchQuery)}
                      </h2>

                      <div className="space-y-4">
                        {article.paragraphs.map((para, pIdx) => {
                          const isListItem = para.trim().match(/^[a-z1-2]\)/i) || para.trim().match(/^[A-I]\./) || para.trim().match(/^\d+\./);
                          return (
                            <p
                              key={pIdx}
                              className={`text-slate-600 text-sm leading-relaxed ${
                                isListItem ? 'pl-5 md:pl-8 font-medium text-slate-700' : 'text-slate-500'
                              }`}
                            >
                              {highlightText(para, searchQuery)}
                            </p>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {/* End of Document Stamp */}
              <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider print-break-inside">
                <span>
                  {activeTab === 'estatutos'
                    ? t('lastUpdatedEstatutos')
                    : activeTab === 'regulamento'
                    ? t('lastUpdatedRegulamento')
                    : t('lastUpdatedSafeguarding')}
                </span>
                <span className="no-print">Check-in Association Beja</span>
              </div>

            </article>

          </div>
        </section>

      </div>

      {/* Footer wrapper */}
      <div className="no-print">
        <Footer />
      </div>
    </main>
  );
}
