import plugin from "tailwindcss/plugin";

export const tailwindCssUtilities = plugin(({ addVariant, matchVariant }) => {
  const states = { selected: true, state: "open" };
  Object.keys(states).forEach((state) =>
    addVariant(
      state,
      `&[data-${state}="${states[state as keyof typeof states]}"]`,
    ),
  );
  matchVariant("nth", (value) => {
    return `&:nth-child(${value})`;
  });
});
