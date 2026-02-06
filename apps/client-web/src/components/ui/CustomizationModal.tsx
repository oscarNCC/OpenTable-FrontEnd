import { useState, useMemo } from 'react';
import type { MenuItem, PizzaOptions, CheeseLevel } from '@monorepo/shared-types';
import {
  PIZZA_SIZES,
  PIZZA_CRUSTS,
  PIZZA_SAUCES,
  PIZZA_CHEESE_LEVELS,
  TOPPINGS_MEAT,
  TOPPINGS_NON_MEAT,
  PIZZA_SPECIALS,
  DIPPING_SAUCES,
  getMaxToppings,
  DEFAULT_PIZZA_OPTIONS,
} from '../../data/pizzaOptions';

export interface CustomizationModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (options: PizzaOptions) => void;
}

interface LocalOptions {
  size: string;
  crust: string;
  sauce: string;
  sauceLevel: CheeseLevel;
  cheese: CheeseLevel;
  toppings: { name: string; level?: CheeseLevel }[];
  specials: string[];
  dippingSauce: string;
}

const defaultOptions: LocalOptions = { ...DEFAULT_PIZZA_OPTIONS };

export function CustomizationModal({ item, onClose, onConfirm }: CustomizationModalProps) {
  const [opts, setOpts] = useState<LocalOptions>(defaultOptions);

  const maxToppings = useMemo(() => getMaxToppings(opts.crust), [opts.crust]);
  const toppingCount = opts.toppings.length;
  const atToppingLimit = toppingCount >= maxToppings;

  const setSize = (id: string) => setOpts((p) => ({ ...p, size: id }));
  const setCrust = (id: string) => setOpts((p) => ({ ...p, crust: id }));
  const setSauce = (id: string) => setOpts((p) => ({ ...p, sauce: id }));
  const setSauceLevel = (level: CheeseLevel) => setOpts((p) => ({ ...p, sauceLevel: level }));
  const setCheese = (level: CheeseLevel) => setOpts((p) => ({ ...p, cheese: level }));
  const setDippingSauce = (id: string) => setOpts((p) => ({ ...p, dippingSauce: id }));

  const toggleTopping = (name: string, defLevel?: CheeseLevel) => {
    setOpts((p) => {
      const idx = p.toppings.findIndex((t) => t.name === name);
      if (idx >= 0) {
        return { ...p, toppings: p.toppings.filter((_, i) => i !== idx) };
      }
      if (p.toppings.length >= getMaxToppings(p.crust)) return p;
      return { ...p, toppings: [...p.toppings, { name, level: defLevel ?? 'Normal' }] };
    });
  };

  const setToppingLevel = (name: string, level: CheeseLevel) => {
    setOpts((p) => ({
      ...p,
      toppings: p.toppings.map((t) => (t.name === name ? { ...t, level } : t)),
    }));
  };

  const toggleSpecial = (id: string) => {
    setOpts((p) => {
      const has = p.specials.includes(id);
      return { ...p, specials: has ? p.specials.filter((s) => s !== id) : [...p.specials, id] };
    });
  };

  const handleConfirm = () => {
    const payload: PizzaOptions = {
      size: opts.size,
      crust: opts.crust,
      sauce: opts.sauce,
      sauceLevel: opts.sauce === 'pizza' ? opts.sauceLevel : undefined,
      cheese: opts.cheese,
      toppings: opts.toppings,
      specials: opts.specials.length ? opts.specials : undefined,
      dippingSauce: opts.dippingSauce === 'none' ? undefined : opts.dippingSauce,
    };
    onConfirm(payload);
    onClose();
  };

  if (!item) return null;

  return (
    <div className="pizza-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="pizza-modal-title">
      <div className="pizza-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="pizza-modal-panel pizza-modal-panel-scroll">
        <div className="pizza-modal-header">
          <h2 id="pizza-modal-title" className="pizza-modal-title">{item.name}</h2>
          <button type="button" className="pizza-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="pizza-modal-body">
          {/* Size */}
          <section className="pizza-modal-section">
            <p className="label">Size</p>
            <div className="pizza-modal-toppings">
              {PIZZA_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`pizza-topping-chip ${opts.size === s.id ? 'active' : ''}`}
                  onClick={() => setSize(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          {/* Crust */}
          <section className="pizza-modal-section">
            <p className="label">Crust</p>
            <div className="pizza-modal-toppings">
              {PIZZA_CRUSTS.map((c) => {
                const crustWithSize = c as typeof c & { onlyForSize?: string };
                const disabled = crustWithSize.onlyForSize != null && opts.size !== crustWithSize.onlyForSize;
                const label = c.extraCharge ? `${c.label} (+$${c.extraCharge})` : c.label;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`pizza-topping-chip ${opts.crust === c.id ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                    onClick={() => !disabled && setCrust(c.id)}
                    disabled={disabled}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Sauce */}
          <section className="pizza-modal-section">
            <p className="label">Sauce</p>
            <div className="pizza-modal-toppings">
              {PIZZA_SAUCES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`pizza-topping-chip ${opts.sauce === s.id ? 'active' : ''}`}
                  onClick={() => setSauce(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {opts.sauce === 'pizza' && (
              <div className="pizza-modal-sub-options">
                <span className="pizza-modal-sub-label">Amount:</span>
                {PIZZA_CHEESE_LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`pizza-topping-chip small ${opts.sauceLevel === l ? 'active' : ''}`}
                    onClick={() => setSauceLevel(l as CheeseLevel)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Cheese */}
          <section className="pizza-modal-section">
            <p className="label">Cheese</p>
            <div className="pizza-modal-toppings">
              {PIZZA_CHEESE_LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`pizza-topping-chip ${opts.cheese === l ? 'active' : ''}`}
                  onClick={() => setCheese(l as CheeseLevel)}
                >
                  {l}
                </button>
              ))}
            </div>
          </section>

          {/* Toppings */}
          <section className="pizza-modal-section">
            <p className="label">Toppings ({toppingCount} / {maxToppings} selected)</p>
            <p className="pizza-modal-sub-label">Meats</p>
            <div className="pizza-modal-toppings">
              {TOPPINGS_MEAT.map((t) => {
                const selected = opts.toppings.find((x) => x.name === t.name);
                const canAdd = selected != null || !atToppingLimit;
                return (
                  <div key={t.name} className="pizza-topping-row">
                    <button
                      type="button"
                      className={`pizza-topping-chip ${selected ? 'active' : ''} ${!canAdd ? 'disabled' : ''}`}
                      onClick={() => canAdd && toggleTopping(t.name, t.levels ?? 'Normal')}
                      disabled={!canAdd}
                    >
                      {t.name}
                    </button>
                    {selected && t.levels != null && (
                      <span className="pizza-topping-levels">
                        {(['Light', 'Normal', 'Extra'] as const).map((l) => (
                          <button
                            key={l}
                            type="button"
                            className={`pizza-topping-chip small ${selected.level === l ? 'active' : ''}`}
                            onClick={() => setToppingLevel(t.name, l)}
                          >
                            {l}
                          </button>
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="pizza-modal-sub-label">Non-meats</p>
            <div className="pizza-modal-toppings">
              {TOPPINGS_NON_MEAT.map((t) => {
                const selected = opts.toppings.find((x) => x.name === t.name);
                const canAdd = selected != null || !atToppingLimit;
                return (
                  <div key={t.name} className="pizza-topping-row">
                    <button
                      type="button"
                      className={`pizza-topping-chip ${selected ? 'active' : ''} ${!canAdd ? 'disabled' : ''}`}
                      onClick={() => canAdd && toggleTopping(t.name, t.levels ?? 'Normal')}
                      disabled={!canAdd}
                    >
                      {t.name}
                    </button>
                    {selected && t.levels != null && (
                      <span className="pizza-topping-levels">
                        {(['Light', 'Normal', 'Extra'] as const).map((l) => (
                          <button
                            key={l}
                            type="button"
                            className={`pizza-topping-chip small ${selected.level === l ? 'active' : ''}`}
                            onClick={() => setToppingLevel(t.name, l)}
                          >
                            {l}
                          </button>
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Specials */}
          <section className="pizza-modal-section">
            <p className="label">Specials</p>
            <div className="pizza-modal-toppings">
              {PIZZA_SPECIALS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`pizza-topping-chip ${opts.specials.includes(s.id) ? 'active' : ''}`}
                  onClick={() => toggleSpecial(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          {/* Dipping sauce */}
          <section className="pizza-modal-section">
            <p className="label">Dipping sauce</p>
            <div className="pizza-modal-toppings">
              {DIPPING_SAUCES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`pizza-topping-chip ${opts.dippingSauce === d.id ? 'active' : ''}`}
                  onClick={() => setDippingSauce(d.id)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </section>
        </div>
        <div className="pizza-modal-footer">
          <button type="button" className="pizza-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="pizza-btn-primary" onClick={handleConfirm}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
