"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  showPhoneInput: boolean;
  onShowPhoneInputChange: (value: boolean) => void;
  requirePhoneInput: boolean;
  onRequirePhoneInputChange: (value: boolean) => void;
  askForName: boolean;
  onAskForNameChange: (value: boolean) => void;
  riggedMode: boolean;
  onRiggedModeChange: (value: boolean) => void;
}

export function SettingsPanel({
  isOpen,
  onToggle,
  showPhoneInput,
  onShowPhoneInputChange,
  requirePhoneInput,
  onRequirePhoneInputChange,
  askForName,
  onAskForNameChange,
  riggedMode,
  onRiggedModeChange,
}: SettingsPanelProps) {
  return (
    <div className="w-full max-w-sm">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="flex items-center gap-2 text-primary hover:text-primary/80 mx-auto"
        aria-expanded={isOpen}
        aria-controls="settings-panel"
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
        <ChevronUp
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            !isOpen && "rotate-180"
          )}
        />
      </Button>

      <div
        id="settings-panel"
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isOpen ? "max-h-125 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-card rounded-2xl p-5 space-y-5 border border-border">
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="rigged-mode" className="text-sm font-medium">
                Rigged Mode
              </Label>
              <Switch
                id="rigged-mode"
                checked={riggedMode}
                onCheckedChange={onRiggedModeChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              X can never win - only Pink (O) wins
            </p>
          </div>

          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="phone-input" className="text-sm font-medium">
                Phone number after win
              </Label>
              <Switch
                id="phone-input"
                checked={showPhoneInput}
                onCheckedChange={(checked) => {
                  onShowPhoneInputChange(checked);
                  if (!checked) {
                    onRequirePhoneInputChange(false);
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Ask winner for their phone number
            </p>
          </div>

          
          {showPhoneInput && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <Label htmlFor="require-phone" className="text-sm font-medium">
                  No skip button
                </Label>
                <Switch
                  id="require-phone"
                  checked={requirePhoneInput}
                  onCheckedChange={onRequirePhoneInputChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Winner must enter their number 🤪
              </p>
            </div>
          )}

          
          {showPhoneInput && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <Label htmlFor="ask-name" className="text-sm font-medium">
                  Ask for name
                </Label>
                <Switch
                  id="ask-name"
                  checked={askForName}
                  onCheckedChange={onAskForNameChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Also ask for the winner's name
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

