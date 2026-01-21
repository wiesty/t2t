export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-3 px-4 bg-card/80 backdrop-blur-sm border-t border-border z-40">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <a 
            href="https://wiesty.de/impressum" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Imprint
          </a>
          <span>•</span>
          <a 
            href="/datenschutz" 
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">•</span>
          <span className="text-muted-foreground/70">
            Powered by{' '}
            <a 
              href="https://instagram.com/wiestyy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              @wiesty
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
