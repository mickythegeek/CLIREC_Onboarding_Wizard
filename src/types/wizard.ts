export interface FileRule {
    id: string;
    fileNamePattern: string;
    extractionRules: string;
}

export interface Account {
    id: string;
    accountNumber: string; // GL Number / Account Nmber
    accountName: string;
    currency: string; // CCY
    unit: string;
    accountOwner: string; // User
    representativeAccount: string;
    isSelfReconciling: string; // Yes/No
    isActive: string; // Y/N
    lastReconDate: string;
    reconFrequency: string; // daily/monthly
    internalSource: string;
    externalAccountNumber: string;
    settlementFilesCount: number;
    fileFormat: string;
    hasMatchingCriteria: string; // Yes/No
    internalRefLogic: string; // Unique References... Internal
    sampleInternalRef: string;
    externalRefLogic: string; // Unique references... External
    sampleExternalRef: string;
    additionalInfo: string;

    // Filtering Conditions
    productCount: number;
    matchingLogic: string; // Detailed logic from text file
    fileRules: FileRule[];
}

export interface ClientInfo {
    clientName: string;
    clientId: string;
    region: string;
}

export interface WizardData {
    clientInfo: ClientInfo;
    accounts: Account[];
}
