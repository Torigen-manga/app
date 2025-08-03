import { useLanguage } from "../providers/localization";

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    "en-us": "English",
    "pt-br": "Português",
  } as const;

  return (
    <div className="language-switcher">
      <select
        className="language-select"
        onChange={(e) => setLanguage(e.target.value as typeof currentLanguage)}
        value={currentLanguage}
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageNames[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}
