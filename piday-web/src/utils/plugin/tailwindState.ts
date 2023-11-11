import plugin from "tailwindcss/plugin";

export const utilities = plugin(({ addVariant }) => {
  const states = { selected: true, state: "open" };
  Object.keys(states).forEach((state) =>
    addVariant(
      state,
      `&[data-${state}="${states[state as keyof typeof states]}"]`,
    ),
  );
});
