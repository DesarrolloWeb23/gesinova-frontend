export interface ReportTurns {
    id: number,
    turnCode: string,
    identificationType: string,
    identificationNumber: string,
    firstName: string,
    lastName: string,
    attentionService: string,
    classificationAttention: string,
    assignedDate: string,
    attendedDate: string,
    attentionTime: string,
    department: string,
    lastAttendedDate: string,
    municipality: string,
    totalAttentionTime: string,
    userProcess: string,
    waitingTime: string,
}

export type ReportTurnsList = ReportTurns[];