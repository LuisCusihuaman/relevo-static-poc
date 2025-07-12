import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SearchBar() {
  const { t } = useTranslation("searchBar");
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={t("placeholder")}
          className="pl-10 bg-white border-gray-200"
        />
      </div>
      <Button variant="outline" className="flex items-center gap-2">
        <Filter className="w-4 h-4" />
        {t("filter")}
      </Button>
    </div>
  );
}
