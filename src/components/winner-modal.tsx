"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon, OIcon } from "@/components/game-icons";
import confetti from "canvas-confetti";

interface WinnerModalProps {
  winner: "X" | "O";
  showPhoneInput: boolean;
  requirePhoneInput: boolean;
  askForName: boolean;
  onClose: () => void;
  onSavePhone: (phone: string, name?: string) => void;
}

export function WinnerModal({
  winner,
  showPhoneInput,
  requirePhoneInput,
  askForName,
  onClose,
  onSavePhone,
}: WinnerModalProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  // Confetti effect when opening the modal
  useEffect(() => {
    const fireConfetti = () => {
      const count = 60;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999
      };

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
    };

    // Fire confetti on open
    fireConfetti();
  }, []);

  const handleSave = () => {
    if (phone.trim()) {
      onSavePhone(phone, name.trim() || undefined);
      setSaved(true);
    }
  };

  const handleAddToContacts = async () => {
    if (!phone.trim()) {
      console.error("No phone number available");
      return;
    }

    const contactName = name.trim() || "Tic2Talk";
    const phoneNumber = phone.trim();
    
    // Proper vCard 3.0 format with line breaks
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contactName}`,
      `TEL;TYPE=CELL:${phoneNumber}`,
      'END:VCARD'
    ].join('\r\n');

    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // For iOS: Create a hidden link and trigger download
      // This avoids the popup blocker and directly shows the contact card
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${contactName}.vcf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger click
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      // For Android/Desktop: Try Share API first
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([vcard], `${contactName}.vcf`, { 
            type: "text/vcard",
            lastModified: Date.now()
          });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Save Contact",
              text: `Save ${contactName} to your contacts`
            });
            return;
          }
        } catch (err) {
          console.log("Share API failed:", err);
        }
      }
      
      // Fallback: Download
      const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${contactName}.vcf`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-in fade-in duration-300">
      <div className="bg-card rounded-3xl p-8 max-w-sm w-full shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {!saved ? (
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {winner === "X" ? (
                  <XIcon className="w-20 h-20" />
                ) : (
                  <OIcon className="w-20 h-20" />
                )}
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                You won!
              </h2>
              {showPhoneInput && (
                <p className="text-muted-foreground">
                  Game is Game 🤪
                </p>
              )}
            </div>

            {showPhoneInput && (
              <div className="space-y-4">
                {askForName && (
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-center text-xl h-16 rounded-xl"
                    aria-label="Name"
                  />
                )}
                <Input
                  type="tel"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-center text-lg h-16 rounded-xl"
                  aria-label="Phone number"
                />
                <Button
                  onClick={handleSave}
                  className="w-full h-14 rounded-xl text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!phone.trim()}
                >
                  Text me 😉
                </Button>
              </div>
            )}

            {(!requirePhoneInput || !showPhoneInput) && (
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full mt-4 text-muted-foreground hover:text-foreground"
              >
                {showPhoneInput ? "Nah, just for fun" : "Play again"}
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {winner === "X" ? (
                  <XIcon className="w-16 h-16" />
                ) : (
                  <OIcon className="w-16 h-16" />
                )}
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Thank you for the game!
              </h2>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAddToContacts}
                variant="outline"
                className="w-full h-14 rounded-xl text-lg bg-transparent"
              >
                Show Contact
              </Button>
              <Button
                onClick={onClose}
                className="w-full h-14 rounded-xl text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Play again
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
