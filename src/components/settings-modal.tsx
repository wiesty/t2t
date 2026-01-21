"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showPhoneInput: boolean;
  onShowPhoneInputChange: (value: boolean) => void;
  requirePhoneInput: boolean;
  onRequirePhoneInputChange: (value: boolean) => void;
  askForName: boolean;
  onAskForNameChange: (value: boolean) => void;
  riggedMode: boolean;
  onRiggedModeChange: (value: boolean) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  showPhoneInput,
  onShowPhoneInputChange,
  requirePhoneInput,
  onRequirePhoneInputChange,
  askForName,
  onAskForNameChange,
  riggedMode,
  onRiggedModeChange,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-card rounded-3xl p-6 max-w-md w-full shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-5">
          {/* Rigged Mode */}
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

          {/* Phone Input */}
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

          {/* Require Phone */}
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

          {/* Ask for Name */}
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
