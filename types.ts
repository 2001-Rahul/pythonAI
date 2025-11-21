export enum Role {
  User = 'user',
  Model = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
