import { Atom, Brain, Globe, Landmark, Leaf, Orbit, type LucideIcon } from "lucide-react";

const symbols: Record<string, LucideIcon> = {
  orbit: Orbit,
  leaf: Leaf,
  landmark: Landmark,
  atom: Atom,
  brain: Brain,
  globe: Globe,
};

export function DomainSymbol({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = symbols[name] ?? Orbit;
  return <Icon aria-hidden="true" size={size} strokeWidth={1.8} />;
}
