import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx';

@Discord()
export class GameSlash {
  private readonly shifumiMoves = ['👊', '✋', '✌'];

  @SimpleCommand({ name: 'shifumi', aliases: [] })
  async shifumi(command: SimpleCommandMessage) {
    command.message.react(this.shifumiMoves.pickOne());
  }
}
