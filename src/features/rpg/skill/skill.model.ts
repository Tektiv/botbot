export enum Skill {
  FISHING = 'fish',
}

export const SkillsData: { [key in Skill]: { [key in 'label' | 'emoji']: string } } = {
  [Skill.FISHING]: {
    label: 'Fishing',
    emoji: '🎣',
  },
};

export type SkillModel = {
  user: string;
  skill: Skill;
  xp: number;
};
