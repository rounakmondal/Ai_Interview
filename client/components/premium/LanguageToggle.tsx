import React from "react";
import { useLanguage } from "./LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

/**
 * LanguageToggle — Dropdown to switch between Bengali and English
 * Displays current language with globe icon
 */
export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">
            {language === "bn" ? "বাংলা" : "English"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <span className={language === "en" ? "font-semibold" : ""}>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("bn")}>
          <span className={language === "bn" ? "font-semibold" : ""}>বাংলা (Bengali)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
