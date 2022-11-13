export enum Skills {
  FISHING = 'fish',
}

export const SkillsData: { [key in Skills]: { [key in 'label' | 'emoji']: string } } = {
  [Skills.FISHING]: {
    label: 'Fishing',
    emoji: '🎣',
  },
};

export type SkillModel = {
  user: string;
  skill: Skills;
  xp: number;
};
