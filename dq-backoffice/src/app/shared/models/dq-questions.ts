import { DqTheme } from "./dq-theme";

export interface DQQuestion {
	_id: string;
  text: string;
	theme: DqTheme;
	answer1: String;
	answer2: String;
	answer3: String;
	answer4: String;
	correct: Number;
	video: string;
	images: string[];
	soundclip: string;
}
