import { Input } from "@/components/ui/input";
import { Clock, Mic, QrCode, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const recentSearches = [
  { query: "Respiratory failure", type: "diagnosis" },
  { query: "PICU-01", type: "room" },
  { query: "Dr. Sarah Chen", type: "doctor" },
  { query: "Cardiac surgery", type: "procedure" },
  { query: "Pneumonia", type: "diagnosis" },
];

const suggestions = [
  { query: "Diabetic Ketoacidosis", type: "diagnosis" },
  { query: "Post-op monitoring", type: "procedure" },
  { query: "Severe dehydration", type: "condition" },
  { query: "Status epilepticus", type: "diagnosis" },
  { query: "Acute kidney injury", type: "condition" },
];

export function SearchView() {
  const { t } = useTranslation("searchView");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = Object.keys(t("filters", { returnObjects: true }));

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="glass-card rounded-2xl p-5 mb-4">
          <h1 className="text-3xl font-semibold text-foreground mb-1">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="glass-card rounded-xl p-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("placeholder")}
              className="pl-12 pr-16 py-3 bg-transparent border-0 text-base placeholder:text-muted-foreground focus:ring-0"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <button className="p-1.5 bg-secondary rounded-lg">
                <Mic className="w-4 h-4 text-secondary-foreground" />
              </button>
              <button className="p-1.5 bg-secondary rounded-lg">
                <QrCode className="w-4 h-4 text-secondary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium whitespace-nowrap transition-colors hover:bg-secondary/80"
            >
              {t(`filters.${filter}`)}
            </button>
          ))}
        </div>
      </div>

      {searchQuery ? (
        <div className="px-4">
          <div className="glass-card rounded-2xl p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">
              {t("noResults.title")}
            </h3>
            <p className="text-muted-foreground mb-1">
              {t("noResults.forQuery", { query: searchQuery })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("noResults.suggestion")}
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-6">
          {/* Recent Searches */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">
                {t("recentSearches")}
              </h3>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search.query)}
                  className="w-full glass-card rounded-xl p-3 text-left transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <Search className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          {search.query}
                        </span>
                        <div className="text-sm text-muted-foreground capitalize">
                          {t(`searchTypes.${search.type}`)}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="font-medium text-foreground mb-3">
              {t("suggestedSearches")}
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion.query)}
                  className="w-full glass-card rounded-xl p-3 text-left transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        {suggestion.query}
                      </span>
                      <div className="text-sm text-muted-foreground capitalize">
                        {t(`searchTypes.${suggestion.type}`)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
