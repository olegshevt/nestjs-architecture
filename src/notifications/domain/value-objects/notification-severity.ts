export class NotificationSeverity {
  constructor(readonly value: 'critical' | 'high' | 'medium' | 'low') {}

  equals(severity: NotificationSeverity) {
    return this.value === severity.value;
  }

  toJSON() {
    return this.value;
  }
}
