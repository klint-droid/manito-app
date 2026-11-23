export interface Assignment {
  giverId: string;
  recipientId: string;
  revealed: boolean;
  revealedAt?: number;
}

export type DrawPhase =
  | 'ready'
  | 'giver_focus'
  | 'giver_entering'
  | 'selecting'
  | 'recipient_approaching'
  | 'revealed'
  | 'completed';

export type AppScreen = 'landing' | 'setup' | 'exchange' | 'results';
