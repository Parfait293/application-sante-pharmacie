import { Heart } from 'lucide-react';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'white' | 'color';
};

export function Logo({ size = 'md', variant = 'color' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-base' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-xl' }
  };

  const colors = {
    white: {
      bg: 'bg-white/20 backdrop-blur-sm',
      icon: 'text-white',
      text: 'text-white'
    },
    color: {
      bg: 'bg-gradient-to-br from-cyan-400 to-purple-600',
      icon: 'text-white',
      text: 'text-gray-800'
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size].container} ${colors[variant].bg} rounded-2xl flex items-center justify-center shadow-lg`}>
        <Heart className={`${sizes[size].icon} ${colors[variant].icon} fill-current`} />
      </div>
      <div>
        <h1 className={`${sizes[size].text} ${colors[variant].text} font-semibold leading-tight`}>
          Ma Santé
        </h1>
      </div>
    </div>
  );
}