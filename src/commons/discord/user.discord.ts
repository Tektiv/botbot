import { Guild, GuildMember, User } from 'discord.js';

export async function Username<U extends GuildMember | User>(user: U, guild: Guild) {
  let _user: GuildMember;
  if (user instanceof GuildMember) {
    _user = user;
  } else {
    _user = await guild.members.fetch(user.id);
  }
  return _user.displayName ?? _user.user.username;
}
