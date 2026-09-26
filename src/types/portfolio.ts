export interface Project {
  id: string;
  title: string;
  category: 'Curriculum & MELCs' | 'PEAC-ESC Accreditation' | 'School Leadership' | 'DRRR & Community' | 'Research';
  description: string;
  longDescription?: string;
  image: string;
  role: string;
  institution: string;
  year: string;
  tags: string[];
  link?: string;
  keyOutcomes?: string[];
  featured?: boolean;
}

export interface WorkExperience {
  id: string;
  role: string;
  institution: string;
  period: string;
  year: number;
  description: string;
  responsibilities: string[];
  current?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  honors?: string;
  details?: string;
}

export interface LeadershipItem {
  id: string;
  position: string;
  organization: string;
  period: string;
  type: 'Institutional' | 'Community' | 'Civic' | 'Religious';
  details?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
  iconName?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  institution: string;
  phone: string;
  email?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  avatar?: string;
  verified: boolean;
}

export interface SocialLinks {
  email: string;
  phone: string;
  linkedin?: string;
  facebook?: string;
  researchGate?: string;
  location: string;
}

export interface PersonalDetails {
  birthday: string;
  citizenship: string;
  civilStatus: string;
  languages: string[];
}

export interface PortfolioData {
  name: string;
  professionalTitle: string;
  subtitle: string;
  bio: string;
  heroTagline: string;
  avatarUrl: string;
  personalDetails: PersonalDetails;
  socialLinks: SocialLinks;
  education: EducationItem[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: SkillCategory[];
  leadership: LeadershipItem[];
  researchTitle: string;
  researchAbstract: string;
  testimonials: TestimonialItem[];
  references: ReferenceItem[];
}

export interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  inquiryType: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
  forwardedTo: string;
  status: 'delivered' | 'pending';
}

export interface ActivityLogItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'info';
}
