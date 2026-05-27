export type UserRole = 'customer' | 'merchant' | 'designer' | 'agent';

export interface CustomProfile {
  displayName: string;
  avatarUrl: string;
  // Role-specific extensions
  storeName?: string;       // Used if role === 'merchant'
  designSpecialty?: string; // Used if role === 'designer'
  agentBadgeTier?: string;  // Used if role === 'agent' (e.g., 'Tier-2 Priority Support')
}

export type ConversationType = 

  | 'customer_to_agent' 
  | 'merchant_to_customer' 
  | 'agent_to_merchant';

export interface UnifiedChannel {
  _id: string;
  channelType: ConversationType;
  associatedOrderId?: string;
  currentStatusState: string;
  actionButtonLabel: string;
  
  // Participant Data Bundles
  initiator: {
    id: string;
    role: UserRole;
    profile: CustomProfile;
  };
  recipient: {
    id: string;
    role: UserRole;
    profile: CustomProfile;
  };
  
  lastMessageText: string;
  updatedAt: string;
  unreadCount: number;
}

export interface StreamedMessage {
  _id: string;
  channelId: string;
  senderId: string;
  messageBody: string;
  createdAt: string;
}
