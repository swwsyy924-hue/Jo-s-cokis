export type TagType = {
  id: string;
  symbol: string;
  name: string;
  color: string;
};

export type BubbleType = {
  text: string;
  originalText: string;
  tagId: string | null;
};

export type Settings = {
  fontSize: number;
  tags: TagType[];
  smartCleaner: boolean;
};

export type SessionData = {
  bubbles: BubbleType[];
  currentIndex: number;
  inputText: string;
};
