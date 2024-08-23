export interface User {
    id: string;
    nom: string;
    email: string;
    trialStartDate: string;
    trialEndDate: string;
    isTrialActive: boolean;
    profil: {
      nom: string;
      roles: string[];
    };
  }
  
  export interface Profile {
    id?: string; 
    nom: string;
    roles: string[];
  }