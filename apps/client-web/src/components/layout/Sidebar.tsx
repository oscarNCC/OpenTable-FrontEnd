const CATEGORY_LABELS: Record<string, string> = {
  披薩: 'Pizzas',
  小食: 'Sides',
  飲品: 'Drinks',
  甜點: 'Desserts',
};

export interface SidebarProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function Sidebar({ categories, activeCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="pizza-sidebar">
      <nav className="pizza-sidebar-nav" aria-label="Menu categories">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`pizza-sidebar-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </nav>
    </aside>
  );
}
