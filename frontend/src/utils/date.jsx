export const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value.replace?.(" ", "T") || value)
    .toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
};

export const daysSince = (value) => {
  if (!value) return 0;

  return Math.max(
    0,
    Math.floor(
      (Date.now() -
        new Date(value.replace?.(" ", "T"))) /
        86400000
    )
  );
};