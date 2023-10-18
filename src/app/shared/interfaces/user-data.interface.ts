export interface UserData {
  id: string;
  name: string;
  email: string | null;
  password: string | null;
  favoriteQuestions: number[];
  photoUrl: number | string;
}
