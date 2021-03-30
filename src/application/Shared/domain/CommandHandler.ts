import Command from './Command';

export default interface CommandHandler<T extends Command> {
  subscribedTo(): Command;
  handle(command: T): Promise<void>;
}
