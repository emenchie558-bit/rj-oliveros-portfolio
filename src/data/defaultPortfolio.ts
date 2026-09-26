import { PortfolioData } from '../types/portfolio';

export const defaultPortfolioData: PortfolioData = {
  name: 'Reiner Joseph B. Oliveros',
  professionalTitle: 'Licensed Professional Teacher (LPT)',
  subtitle: 'Bachelor of Secondary Education major in Social Studies',
  heroTagline: 'Empowering 21st-century learners through academic excellence, visionary school administration, and values-centered civic education.',
  bio: 'Dedicated and detail-oriented Licensed Professional Teacher (LPT) with extensive experience in School Administration, Curriculum Planning, and Social Studies Instruction. Proven track record in leadership as a Senior High School Coordinator, successfully overseeing faculty performance and student services. Instrumental in the PEAC-ESC Accreditation process, demonstrating strong capability in quality assurance and regulatory compliance. Committed to fostering academic excellence and operational efficiency in educational institutions.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', // Fallback high-res portrait, easily customizable in Admin
  personalDetails: {
    birthday: 'May 04, 2000',
    citizenship: 'Filipino',
    civilStatus: 'Single',
    languages: ['Filipino (Tagalog)', 'English']
  },
  socialLinks: {
    email: 'reinerjosepholiveros@gmail.com',
    phone: '0945-4359-226',
    location: '47 San Luis St., Sitio Fatima, SAV VI, Barangay San Isidro, Parañaque City',
    linkedin: 'https://linkedin.com/in/reiner-joseph-oliveros',
    facebook: 'https://facebook.com/reinerjosepholiveros',
    researchGate: 'https://researchgate.net/profile/Reiner-Joseph-Oliveros'
  },
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Secondary Education major in Social Studies',
      institution: 'Rizal Technological University',
      period: '2022 - 2023',
      honors: 'Licensed Professional Teacher (LPT) Board Passer',
      details: 'Comprehensive pedagogical training in Philippine History, World Civilizations, Asian Studies, Economics, Political Science, Curriculum Development, and Educational Measurement.'
    }
  ],
  workExperience: [
    {
      id: 'exp-1',
      role: 'Edukasyong Pantahanan at Pangkabuhayan (EPP), MAPEH 5, and MTB-MLE Teacher',
      institution: 'COPEL School',
      period: '2026 - Present',
      year: 2026,
      current: true,
      description: 'Delivering holistic, learner-centered education combining practical livelihood education (EPP), music, arts, physical education, health (MAPEH), and mother tongue-based instruction.',
      responsibilities: [
        'Formulating interdisciplinary instructional materials aligned with 21st-century competencies.',
        'Facilitating hands-on livelihood skills demonstrations and entrepreneurial literacy.',
        'Spearheading physical fitness and cultural heritage appreciation activities.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Social Media Team Head',
      institution: 'Mary Immaculate School (Parañaque), Inc.',
      period: '2025',
      year: 2025,
      description: 'Managed institutional communications, social brand presence, and community engagement for school enrollment and academic achievements.',
      responsibilities: [
        'Created strategic digital content calendars highlighting student accolades and academic milestones.',
        'Coordinated marketing campaigns that bolstered enrollment visibility across southern Metro Manila.',
        'Maintained brand consistency and regulatory data privacy in institutional publications.'
      ]
    },
    {
      id: 'exp-3',
      role: 'Senior High School Academic Coordinator, PLC Secretary, DRRR Head, SSG Adviser',
      institution: 'Mary Immaculate School (Parañaque), Inc.',
      period: '2024 - 2025',
      year: 2024,
      description: 'Held multi-portfolio executive coordination managing SHS academic quality, faculty supervision, disaster preparedness protocols, and student council governance.',
      responsibilities: [
        'Supervised Senior High School faculty instructional delivery, syllabus alignment, and classroom observation metrics.',
        'Served as Secretary for the PEAC-ESC Accreditation Professional Learning Community (PLC), ensuring complete standards compliance.',
        'Headed the Disaster Risk Reduction and Management (DRRR) Committee, executing campus-wide safety and evacuation protocols.',
        'Mentored student leaders as Supreme Secondary Learner Government (SSG) Adviser.'
      ]
    },
    {
      id: 'exp-4',
      role: 'Junior High School and Senior High School Faculty',
      institution: 'Mary Immaculate School (Parañaque), Inc.',
      period: '2023 - 2024',
      year: 2023,
      description: 'Instructed Social Studies, Philippine Politics and Governance, Disciplines and Ideas in the Social Sciences (DISS), and Contemporary Issues.',
      responsibilities: [
        'Constructed standards-based assessment tools and differentiated learning modules for diverse learner backgrounds.',
        'Mentored students in academic debates, social sciences research, and history fairs.',
        'Conducted regular parent-teacher conferences and academic intervention clinics.'
      ]
    },
    {
      id: 'exp-5',
      role: 'Pre-service Teacher',
      institution: 'Ilaya Barangka Integrated School',
      period: '2022 - 2023',
      year: 2022,
      description: 'Completed extensive field study and classroom practice teaching under master teacher mentorship in public school settings.',
      responsibilities: [
        'Demonstrated mastery in K-12 Social Studies pedagogy, daily lesson log preparation, and classroom dynamics management.',
        'Designed active-learning games and multimedia visual presentations.'
      ]
    },
    {
      id: 'exp-6',
      role: 'Parañaque - SPES Beneficiary & Public Service Intern',
      institution: 'Barangay Sun Valley, Parañaque City',
      period: 'Batch 2018 & 2019',
      year: 2018,
      description: 'Served community youth governance and administrative records tasks under the Special Program for Employment of Students.',
      responsibilities: [
        'Assisted local community welfare and barangay document archiving.',
        'Collaborated with youth council initiatives for community outreach and sports.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'PEAC-ESC Quality Assurance & Accreditation Portfolio',
      category: 'PEAC-ESC Accreditation',
      description: 'Engineered comprehensive documentation, institutional governance files, and faculty syllabi that fulfilled the rigorous standards of the Private Education Assistance Committee (PEAC) ESC certification.',
      longDescription: 'As Secretary of the Professional Learning Community (PLC) accreditation taskforce, led the systematic audit, compilation, and evidentiary portfolio creation across nine key areas: Curriculum, Instruction, Faculty Development, Learner Support, Laboratories, and Institutional Integrity. Resulted in high compliance ratings and subsidized scholarship continuity for hundreds of students.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
      role: 'Accreditation Secretary & Academic Lead',
      institution: 'Mary Immaculate School (Parañaque), Inc.',
      year: '2024 - 2025',
      tags: ['PEAC-ESC', 'Quality Assurance', 'Academic Auditing', 'School Policy', 'Regulatory Compliance'],
      keyOutcomes: [
        '100% compliance across faculty credential and lesson planning review modules.',
        'Designed streamlined digital archiving system for institutional accreditation exhibits.',
        'Facilitated faculty workshops on rubric calibration and student outcomes assessment.'
      ],
      featured: true
    },
    {
      id: 'proj-2',
      title: 'K-12 Social Studies MELCs Curriculum Framework & Assessment Bank',
      category: 'Curriculum & MELCs',
      description: 'Curated and designed an innovative, competency-based Social Studies teaching framework aligning DepEd Most Essential Learning Competencies (MELCs) with interactive pedagogical inquiry.',
      longDescription: 'Developed customized unit plans, formative assessment matrices, and real-world performance tasks for Araling Panlipunan and Senior High Social Sciences. Integrated contemporary Philippine issues, local Parañaque history, and sustainable development goals into everyday classroom discussions.',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
      role: 'Curriculum Developer & Senior Faculty',
      institution: 'Senior High School Academic Department',
      year: '2023 - 2025',
      tags: ['DepEd MELCs', 'Curriculum Design', 'Formative Assessment', 'Inquiry-Based Learning'],
      keyOutcomes: [
        'Boosted student periodic exam mastery scores by 24% year-over-year.',
        'Created 40+ modular inquiry task cards used across multiple grade levels.',
        'Mentored junior faculty on backward design and rubrics calibration.'
      ],
      featured: true
    },
    {
      id: 'proj-3',
      title: 'Supreme Secondary Learner Government (SSG) Leadership Academy',
      category: 'School Leadership',
      description: 'Spearheaded youth leadership empowerment, parliamentary procedure workshops, and school-wide service campaigns as SSG Adviser.',
      longDescription: 'Instituted a student empowerment charter emphasizing ethical governance, democratic participation, and student wellness. Guided student officers through project proposal development, budgeting, campus election administration, and community outreach drives.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
      role: 'SSG Adviser & Student Affairs Mentor',
      institution: 'Mary Immaculate School (Parañaque), Inc.',
      year: '2024 - 2025',
      tags: ['Student Governance', 'Leadership Training', 'Civic Action', 'Youth Mentorship'],
      keyOutcomes: [
        'Organized Annual Student Leadership Summit with 120+ active participants.',
        'Launched campus clean-and-green recycling initiative and mental health awareness week.',
        'Cultivated national leadership competition finalists.'
      ],
      featured: true
    },
    {
      id: 'proj-4',
      title: 'Alternative Learning System (ALS) Academic Research Study',
      category: 'Research',
      description: 'Pioneered in-depth qualitative research entitled "The Experiences of the Graduates of the Alternative Learning System Program" exploring socioeconomic mobility and educational resilience.',
      longDescription: 'Investigated the lived experiences, employment trajectories, and structural barriers faced by adult and out-of-school youth who completed the DepEd Alternative Learning System (ALS). Generated actionable policy recommendations for enhanced bridging programs and vocational skills integration.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
      role: 'Principal Researcher',
      institution: 'Rizal Technological University',
      year: '2022 - 2023',
      tags: ['Qualitative Research', 'Alternative Learning System', 'Educational Equity', 'Phenomenology'],
      keyOutcomes: [
        'Presented findings in academic symposium on inclusive basic education.',
        'Identified 4 pivotal socio-emotional factors determining post-graduation success.',
        'Recommended concrete adult-learning modular adjustments adopted by local learning centers.'
      ],
      featured: true
    },
    {
      id: 'proj-5',
      title: 'Campus Disaster Preparedness & DRRR Emergency Protocol',
      category: 'DRRR & Community',
      description: 'Formulated institutional emergency response guidelines, earthquake drill evacuation plans, and risk-hazard mapping for school safety.',
      longDescription: 'As DRRR Officer Committee Head, conducted hazard vulnerability assessments of campus facilities, coordinated simulation drills with the Parañaque City Disaster Risk Reduction and Management Office, and conducted first-aid and safety seminars for teaching personnel and students.',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=80',
      role: 'DRRR Committee Head',
      institution: 'Mary Immaculate School (Parañaque), Inc.',
      year: '2024 - 2025',
      tags: ['DRRR', 'Emergency Response', 'Campus Safety', 'Community Resilience'],
      keyOutcomes: [
        'Reduced campus evacuation drill timing from 8 minutes to 3.5 minutes.',
        'Certified 100% of high school student council officers in basic emergency first-aid.',
        'Created standardized digital safety manuals and signage across campus buildings.'
      ],
      featured: false
    }
  ],
  skills: [
    {
      category: 'Educational Administration',
      skills: [
        'Program & Curriculum Planning',
        'Senior High School Academic Coordination',
        'Faculty Supervision & Performance Review',
        'PEAC-ESC Accreditation Standards',
        'Institutional Quality Assurance',
        'School Records & Policy Compliance'
      ]
    },
    {
      category: 'Instructional & Pedagogical',
      skills: [
        'DepEd K-12 & MELCs Curriculum Design',
        'Social Studies & Philippine Governance Instruction',
        'Student Leadership Development (SSG Advising)',
        'Classroom Management & Behavioral Mentoring',
        'Formative & Summative Student Assessment',
        'Mother Tongue & Livelihood Education (EPP/MAPEH)'
      ]
    },
    {
      category: 'Technical & Digital Tools',
      skills: [
        'Google Workspace for Education (Docs, Sheets, Slides, Forms, Classroom)',
        'Microsoft Office Suite (Word, Excel, PowerPoint)',
        'Educational Records & Data Privacy Management',
        'Social Media Strategy & Marketing Content Creation',
        'Canva & Multimedia Teaching Aids',
        'Hybrid & Virtual Classroom Technology'
      ]
    },
    {
      category: 'Leadership & Soft Skills',
      skills: [
        'Visionary Educational Leadership',
        'High Integrity & Ethical Professionalism',
        'Conflict Resolution & Crisis Intervention (DRRR)',
        'Clear & Empathetic Communication',
        'Strategic Time Management & Multi-tasking',
        'Critical Thinking & Problem Solving'
      ]
    }
  ],
  leadership: [
    {
      id: 'lead-1',
      position: 'Secretary, Professional Learning Community (PLC) Team',
      organization: 'PEAC-ESC Accreditation Taskforce, Mary Immaculate School',
      period: '2024 - 2025',
      type: 'Institutional',
      details: 'Organized faculty collaboration sessions, recorded compliance proceedings, and audited curricular binders for institutional certification.'
    },
    {
      id: 'lead-2',
      position: 'Head, Marketing Promotion Committee',
      organization: 'Mary Immaculate School (Parañaque), Inc.',
      period: '2024 - 2025',
      type: 'Institutional',
      details: 'Directed outreach efforts, campus open house events, and prospective student engagement drives.'
    },
    {
      id: 'lead-3',
      position: 'Head, Disaster Risk Reduction and Management (DRRR) Officer Committee',
      organization: 'Mary Immaculate School (Parañaque), Inc.',
      period: '2024 - 2025',
      type: 'Institutional',
      details: 'Formulated safety drills, risk assessment reports, and emergency protocols in coordination with city rescue agencies.'
    },
    {
      id: 'lead-4',
      position: 'Member & Youth Leader',
      organization: 'Rotaract Club of Mandaluyong',
      period: '2019 - 2020',
      type: 'Civic',
      details: 'Participated in literacy drives, community health outreach, and youth civic development programs.'
    },
    {
      id: 'lead-5',
      position: 'Youth Member & Ministry Worker',
      organization: 'Couples for Christ - Missionary Family of Christ',
      period: '2018 - Present',
      type: 'Religious',
      details: 'Engaged in spiritual formation, youth fellowship retreats, and values-enrichment leadership camps.'
    },
    {
      id: 'lead-6',
      position: 'Ministry of Altar Server',
      organization: 'Our Lady of the Most Holy Rosary Parish',
      period: '2012 - 2023',
      type: 'Religious',
      details: 'Dedicated over a decade of continuous service, training incoming altar servers, and participating in liturgical ceremonies.'
    },
    {
      id: 'lead-7',
      position: 'Youth Member',
      organization: 'Chiro Sun Valley',
      period: '2012 - 2018',
      type: 'Community',
      details: 'Fostered youth fellowship, community solidarity, and creative arts workshops for parish youth.'
    }
  ],
  researchTitle: 'The Experiences of the Graduates of the Alternative Learning System Program',
  researchAbstract: 'A qualitative exploration highlighting the educational journey, socioeconomic triumphs, and institutional barriers encountered by adult and non-traditional learners navigating the DepEd Alternative Learning System (ALS). Provides evidence-based recommendations for post-graduation vocational transition and curriculum design.',
  testimonials: [
    {
      id: 'test-1',
      author: 'Menchie V. Espinosa',
      role: 'Former Principal',
      organization: 'Mary Immaculate School (Parañaque), Inc.',
      quote: 'Mr. Reiner Oliveros is an exceptional academic leader whose diligence as Senior High School Coordinator and accreditation secretary brought remarkable precision and inspiration to our entire faculty. His integrity and passion for student development are peerless.',
      verified: true
    },
    {
      id: 'test-2',
      author: 'Rebecca G. Vergara',
      role: 'Executive Assistant to the Vice President for Academic Affairs',
      organization: 'Universidad De Manila',
      quote: 'Reiner possesses a rare blend of rigorous administrative capability, deep pedagogical acumen, and compassionate leadership. His dedication to academic excellence sets an exemplary standard for the teaching profession.',
      verified: true
    },
    {
      id: 'test-3',
      author: 'Sr. Jenny E. Bacordo',
      role: 'Guidance Counselor',
      organization: 'Mary Immaculate School (Parañaque), Inc.',
      quote: 'Working alongside Sir Reiner with student leadership and youth affairs showed me his steadfast heart for holistic education. He empowers young minds to lead with empathy, conviction, and ethical responsibility.',
      verified: true
    },
    {
      id: 'test-4',
      author: 'Antonino Victor Norman F. Rotor',
      role: 'Former Data Privacy Officer',
      organization: 'Mary Immaculate School (Parañaque), Inc.',
      quote: 'Reiner demonstrated exemplary attention to data privacy, institutional record organization, and quality compliance throughout our PEAC accreditation milestones.',
      verified: true
    }
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Rebecca G. Vergara',
      title: 'Executive Assistant to the Vice President for Academic Affairs',
      institution: 'Universidad De Manila',
      phone: '0906-2780-428'
    },
    {
      id: 'ref-2',
      name: 'Sr. Jenny E. Bacordo',
      title: 'Guidance Counselor',
      institution: 'Mary Immaculate School (Parañaque), Inc.',
      phone: '0997-7400-734'
    },
    {
      id: 'ref-3',
      name: 'Menchie V. Espinosa',
      title: 'Former Principal',
      institution: 'Mary Immaculate School (Parañaque), Inc.',
      phone: '0961-2542-372'
    },
    {
      id: 'ref-4',
      name: 'Antonino Victor Norman F. Rotor',
      title: 'Former Data Privacy Officer',
      institution: 'Mary Immaculate School (Parañaque), Inc.',
      phone: '0960-7737-893'
    }
  ]
};
