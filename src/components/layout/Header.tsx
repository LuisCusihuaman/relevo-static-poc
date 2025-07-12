import { useTranslation } from "react-i18next";
import { StatusIndicator } from "../StatusIndicator";

export function Header() {
  const { t } = useTranslation();
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t("header.title")}</h1>
          <p className="text-sm text-gray-600">
            {t("header.department")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <StatusIndicator count={3} label={t("header.pending")} color="yellow" />
          <StatusIndicator count={3} label={t("header.active")} color="green" />
          <StatusIndicator count={3} label={t("header.newInfo")} color="red" />
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
            CM
          </div>
        </div>
      </div>
    </header>
  );
}
