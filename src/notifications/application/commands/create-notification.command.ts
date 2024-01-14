export class CreateNotificationCommand {
  constructor(
    public readonly name: string,
    public readonly severity: string,
    public triggeredAt: Date,
    public items: Array<{ name: string; type: string }>,
  ) {}
}
