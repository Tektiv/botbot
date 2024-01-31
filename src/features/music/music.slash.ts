import { QueueNode } from '@discordx/music';
import { Configuration } from '@helpers/config';
import { Embeds } from 'commons/discord/embeds.discord';
import type { CommandInteraction, Guild } from 'discord.js';
import { ApplicationCommandOptionType, EmbedBuilder, GuildMember } from 'discord.js';
import type { ArgsOf } from 'discordx';
import { Discord, On, Slash, SlashGroup, SlashOption } from 'discordx';
import { bot as Client } from 'main';
import YouTube from 'youtube-sr';
import { Queue, formatDurationFromMS } from './music.service';

@Discord()
@SlashGroup({ description: 'music', name: 'music' })
@SlashGroup('music')
export class music {
  queueNode: QueueNode;
  guildQueue = new Map<string, Queue>();

  constructor() {
    this.queueNode = new QueueNode(Client);
  }

  private getQueue(guildId: string): Queue {
    let queue = this.guildQueue.get(guildId);
    if (!queue) {
      queue = new Queue({
        client: Client,
        guildId,
        queueNode: this.queueNode,
      });
      queue.setVolume(50);

      this.guildQueue.set(guildId, queue);
    }

    return queue;
  }

  private async validateRequest(
    interaction: CommandInteraction,
  ): Promise<{ guild: Guild; member: GuildMember; queue: Queue } | null> {
    if (!Configuration.checkIfFeatureIsEnabled('music', interaction)) {
      return null;
    }

    if (!interaction.guild || !interaction.channel || !(interaction.member instanceof GuildMember)) {
      interaction.reply(Embeds.error('Unknown error, sorry for the inconvenience'));
      return null;
    }

    const { guild, member } = interaction;
    if (!member.voice.channel) {
      interaction.reply(Embeds.nope('You are not currently connected to a channel'));
      return null;
    }

    const queue = this.getQueue(guild.id);

    const bot = guild.members.cache.get(interaction.client.user.id);
    if (!bot?.voice.channelId) {
      queue.setChannel(interaction.channel);
      queue.join({
        channelId: member.voice.channel.id,
        guildId: guild.id,
      });
    } else if (bot.voice.channelId !== member.voice.channelId) {
      interaction.reply(Embeds.nope('You are not currently connected to the right channel'));
      return null;
    }

    return { guild, member, queue };
  }

  @On({ event: 'voiceStateUpdate' })
  handleVoiceState([, newState]: ArgsOf<'voiceStateUpdate'>): void {
    if (newState.member?.user.id === newState.client.user.id && newState.channelId === null) {
      const guildId = newState.guild.id;
      const queue = this.guildQueue.get(guildId);
      if (queue) {
        queue.exit();
        this.guildQueue.delete(guildId);
      }
    }
  }

  @Slash({ description: 'Play a song', name: 'play' })
  async play(
    @SlashOption({
      description: 'song url or title',
      name: 'song',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    songName: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const request = await this.validateRequest(interaction);
    if (!request) {
      return;
    }

    const { queue, member } = request;

    const video = await YouTube.searchOne(songName).catch(() => null);
    if (!video) {
      interaction.reply(Embeds.nope(`No song found with name **${songName}**`));
      return;
    }

    queue.addTrack({
      duration: video.duration,
      thumbnail: video.thumbnail?.url,
      seek: 0,
      title: video.title ?? 'NaN',
      url: video.url,
      user: member.user,
    });

    const embed = new EmbedBuilder();
    if (!queue.currentTrack) {
      queue.playNext();
      embed.setTitle('🎶  Started playing');
    } else {
      embed.setTitle(`🎶  Queued to position #${queue.tracks.length}`);
    }
    embed.setDescription(`**${video.title}** (${formatDurationFromMS(video.duration)})`);
    if (video.thumbnail?.url) {
      embed.setThumbnail(video.thumbnail?.url);
    }
    interaction.reply({ embeds: [embed] });
  }

  @Slash({ description: 'View queue', name: 'queue' })
  async queue(interaction: CommandInteraction): Promise<void> {
    const request = await this.validateRequest(interaction);
    if (!request) {
      return;
    }

    const { queue } = request;

    const currentTrack = queue.currentTrack;
    if (!currentTrack) {
      await interaction.reply(Embeds.nope('Queue is empty'));
      return;
    }

    const embed = new EmbedBuilder().setTitle('🎶  Now playing');

    let description = `**${currentTrack.title}** (${formatDurationFromMS(currentTrack.duration)})`;
    if (currentTrack.thumbnail) {
      embed.setThumbnail(currentTrack.thumbnail);
    }
    if (queue.queueSize) {
      const list = queue.tracks
        .map((track, index) => `#${index + 1} **${track.title}** (${formatDurationFromMS(track.duration)})`)
        .join('\n');
      description += `\n\nNext in the queue:\n${list}`;
    }
    embed.setDescription(description);
    interaction.reply({ embeds: [embed], ephemeral: true });
  }

  @Slash({ description: 'Pause current track', name: 'pause' })
  async pause(interaction: CommandInteraction): Promise<void> {
    const request = await this.validateRequest(interaction);
    if (!request) {
      return;
    }

    const { queue } = request;

    const currentTrack = queue.currentTrack;
    if (!currentTrack || !queue.isPlaying) {
      interaction.reply(Embeds.nope('There is nothing to pause'));
      return;
    }

    queue.pause();

    interaction.reply({
      embeds: [new EmbedBuilder().setTitle('⏸️  Paused music')],
    });
  }

  @Slash({ description: 'Resume current track', name: 'resume' })
  async resume(interaction: CommandInteraction): Promise<void> {
    const request = await this.validateRequest(interaction);
    if (!request) {
      return;
    }

    const { queue } = request;

    const currentTrack = queue.currentTrack;
    if (!currentTrack || queue.isPlaying) {
      interaction.reply(Embeds.nope('There is nothing to resume'));
      return;
    }

    queue.unpause();

    interaction.reply({
      embeds: [new EmbedBuilder().setTitle('▶️  Resumed music')],
    });
  }

  @Slash({ description: 'Skip current song', name: 'skip' })
  async skip(interaction: CommandInteraction): Promise<void> {
    const request = await this.validateRequest(interaction);
    if (!request) {
      return;
    }

    const { queue } = request;

    const currentTrack = queue.currentTrack;
    const nextTrack = queue.tracks.first;
    if (!currentTrack) {
      interaction.reply(Embeds.nope('There is nothing to skip'));
      return;
    }

    queue.skip();

    const embed = new EmbedBuilder().setTitle('⏭️  Skipped music');
    if (nextTrack) {
      embed.setDescription(`Now playing **${nextTrack.title}** (${formatDurationFromMS(nextTrack.duration)})`);
      if (nextTrack.thumbnail) {
        embed.setThumbnail(nextTrack.thumbnail);
      }
    } else {
      embed.setDescription('No music left in the queue');
    }

    interaction.reply({ embeds: [embed] });
  }

  @Slash({ description: 'Remove song from queue', name: 'remove' })
  async remove(
    @SlashOption({
      description: 'Position in the queue',
      name: 'position',
      required: true,
      type: ApplicationCommandOptionType.Number,
      minValue: 1,
    })
    position: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    const request = await this.validateRequest(interaction);
    if (!request) {
      return;
    }

    const { queue } = request;

    const track = queue.tracks[position - 1];
    if (!track) {
      interaction.reply(Embeds.nope('Position is not valid'));
      return;
    }

    queue.tracks.splice(position - 1, 1);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`⏭️  Removed music in position #${position}`)
          .setDescription(`Which was **${track.title}**`),
      ],
    });
  }

  @Slash({ description: 'Stop music player', name: 'stop' })
  async stop(interaction: CommandInteraction): Promise<void> {
    const request = await this.validateRequest(interaction);
    if (!request) {
      return;
    }

    const { queue, guild } = request;

    queue.exit();
    this.guildQueue.delete(guild.id);

    interaction.reply({
      embeds: [new EmbedBuilder().setTitle('⏹️  Stopped player')],
    });
  }

  @Slash({ description: 'Shuffle queue', name: 'shuffle' })
  async shuffle(interaction: CommandInteraction): Promise<void> {
    const request = await this.validateRequest(interaction);
    if (!request) {
      return;
    }

    const { queue } = request;

    queue.mix();

    interaction.reply({ embeds: [new EmbedBuilder().setTitle('🔀  Shuffled queue')] });
  }
}
