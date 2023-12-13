import plugin from "tailwindcss/plugin";

export const tailwindCssUtilities = plugin(
  ({ addVariant, matchVariant, addUtilities }) => {
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
    addUtilities({
      ".center": {
        "@apply left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]": {},
      },
      ".container-mini": {
        "@apply max-w-6xl mx-auto w-full": {},
      },
    });
  },
);
