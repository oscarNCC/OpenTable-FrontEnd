export type CheeseLevel = 'Light' | 'Normal' | 'Extra';

export interface Topping {
  name: string;
  type: 'meat' | 'non-meat';
  premium?: boolean;
  levels?: CheeseLevel;
}

export interface ToppingChoice {
  name: string;
  level?: CheeseLevel;
}

export interface PizzaOptions {
  size: string;
  crust: string;
  sauce: string;
  /** When sauce is Pizza Sauce, use Light/Normal/Extra */
  sauceLevel?: CheeseLevel;
  cheese: CheeseLevel;
  toppings: ToppingChoice[];
  specials?: string[];
  dippingSauce?: string;
}
