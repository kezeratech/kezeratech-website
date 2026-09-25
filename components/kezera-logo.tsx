import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'light' | 'dark' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { svg: 28, text: 'text-base' },
  md: { svg: 36, text: 'text-lg' },
  lg: { svg: 48, text: 'text-2xl' },
  xl: { svg: 64, text: 'text-3xl' },
};

export function Logo({
  className,
  showText = true,
  variant = 'default',
  size = 'md',
}: LogoProps) {
  const dims = sizeMap[size];

  const colorClass =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
        ? 'text-foreground'
        : variant === 'monochrome'
          ? 'text-current'
          : 'text-foreground';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <KezeraMark size={dims.svg} variant={variant} />
      {showText && (
        <span
          className={cn(
            'font-heading font-bold tracking-tight',
            dims.text,
            colorClass
          )}
        >
          Kezera<span className="text-accent">Tech</span>
        </span>
      )}
    </div>
  );
}

export function KezeraMark({
  size = 36,
  variant = 'default',
  className,
}: {
  size?: number;
  variant?: 'default' | 'light' | 'dark' | 'monochrome';
  className?: string;
}) {
  const primaryColor =
    variant === 'light'
      ? '#FFFFFF'
      : variant === 'monochrome'
        ? 'currentColor'
        : 'hsl(var(--primary))';
  const accentColor =
    variant === 'light'
      ? '#00C8FF'
      : variant === 'monochrome'
        ? 'currentColor'
        : 'hsl(var(--accent))';
  const dotColor =
    variant === 'light'
      ? '#FFFFFF'
      : variant === 'monochrome'
        ? 'currentColor'
        : 'hsl(var(--accent))';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Kezera Tech logo"
    >
      {/* Infinity-inspired left loop */}
      <path
        d="M14 16C9.58 16 6 19.58 6 24C6 28.42 9.58 32 14 32C18 32 21 28 24 24C27 20 30 16 34 16C38.42 16 42 19.58 42 24C42 28.42 38.42 32 34 32C30 32 27 28 24 24"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Accent arc overlay for depth */}
      <path
        d="M14 16C9.58 16 6 19.58 6 24C6 28.42 9.58 32 14 32"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      {/* Dot 1 — Ideas */}
      <circle cx="6" cy="24" r="3" fill={dotColor} />
      {/* Dot 2 — Technology */}
      <circle cx="24" cy="24" r="3" fill={dotColor} />
      {/* Dot 3 — Impact */}
      <circle cx="42" cy="24" r="3" fill={dotColor} />
    </svg>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <KezeraMark size={80} />
      <div className="text-center">
        <div className="font-heading text-2xl font-bold tracking-tight">
          Kezera<span className="text-accent">Tech</span>
        </div>
        <div className="text-xs text-muted-foreground tracking-wider uppercase mt-1">
          Designing the Future Through Technology
        </div>
      </div>
    </div>
  );
}
