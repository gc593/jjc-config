
export interface EventConfig {
  eventNameEn: string;
  eventNameJp: string;
  eventDate: string;
  eventDateCard: string;
  eventTime: string;
  eventVenue: string;
  eventVenueNote: string;
  eventPrice: string;
  eventPriceNote: string;
  eventCapacity: string;
  eventURL: string;
  
  heroTagline: string;
  transitionJp: string;
  transitionSub: string;
  expHeadline: string;
  expDesc: string;
  quoteText: string;
  quoteAttr: string;
  
  inc1: string;
  inc1d: string;
  inc2: string;
  inc2d: string;
  inc3: string;
  inc3d: string;
  inc4: string;
  inc4d: string;
  
  accent: string;
  gold: string;
  paper: string;
  dark: string;
  ink: string;
  
  showPreloader: boolean;
  showTransition: boolean;
  showExperience: boolean;
  showInclusions: boolean;
  showQuote: boolean;
  showKanji: boolean;
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface ThemePreset {
  accent: string;
  gold: string;
  paper: string;
  dark: string;
  ink: string;
}
