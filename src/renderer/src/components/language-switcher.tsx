import { useLanguage } from "../providers/localization";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    "en-us": "English",
    "pt-br": "Português",
  } as const;

  return (
    <div className="language-switcher">
      <Select
        onValueChange={(e) => setLanguage(e as typeof currentLanguage)}
        value={currentLanguage}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>

        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {languageNames[lang]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
