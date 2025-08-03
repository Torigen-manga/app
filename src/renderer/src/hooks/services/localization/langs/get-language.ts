import { en_lang } from "./en-us";
import { pt_lang } from "./pt-br";
import type { Languages, UITexts } from "./types";

export function getLanguage(language: Languages): UITexts {
	switch (language) {
		case "en-us":
			return en_lang;
		case "pt-br":
			return pt_lang;
		default:
			return en_lang;
	}
}
