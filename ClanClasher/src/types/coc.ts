
export interface UpgradeItem {
  id: string;
  dataId: number;
  name: string;
  currentLevel: number;
  image: string;
  isUpgrading: boolean;
  remainingSeconds: number;
  finishTime: string | null;
  type: string;
}

export interface Village {
  id: string;
  name: string;
  townHallLevel: number;
  activeBuilders: number;
  totalBuilders: number;
  extraBuilder: number;
  labStatus: string;
  nextFreeTime: string;
  buildings: any[]; // Keep for legacy
  upgrades: UpgradeItem[]; // ADD THIS LINE
  isMain: boolean;
  // New helper properties we added earlier
  petStatus?: string;
  bobStatus?: string;
  apprenticeStatus?: string;
  goblinStatus?: string;
}

export interface UserAccount {
  uid: string;
  displayName: string;
  villages: Village[];
}