
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  links?: GroundingLink[];
}

export interface GroundingLink {
  uri: string;
  title: string;
}

export interface DesignStyle {
  id: string;
  name: string;
  prompt: string;
}
