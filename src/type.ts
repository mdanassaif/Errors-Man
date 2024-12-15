export interface Answer {
  id: number;
  avatar_url: string;
  user_id: string;
  created_at: string;
  content: string;
  is_accepted: boolean;
}

export interface Question {
  id: number;
  avatar_url: string;
  user_id: string;
  title: string;
  created_at: string;
  content: string;
  code?: string;
  language?: string;
  links?: string[];
  tags?: string[];
  answers?: Answer[];
}

export interface NewAnswer {
  questionId: number;
  content: string;
}

export interface QuestionListProps {
  questions: Question[];
  selectedQuestion?: number;
  setSelectedQuestion: (id: number | null) => void;
  newAnswer: {
    questionId?: number;
    content: string;
  };
  setNewAnswer: (answer: { questionId: number; content: string }) => void;
  onAnswerSubmit: (questionId: number) => void;
  currentUser: string;
}
