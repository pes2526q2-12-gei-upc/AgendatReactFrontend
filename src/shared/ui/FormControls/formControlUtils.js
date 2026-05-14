export function optionValue(option) {
  return String(option.id ?? option.value ?? "");
}

export function optionLabel(option, fallbackPrefix = "Option") {
  return (
    option.name ??
    option.label ??
    option.denomination ??
    option.title ??
    option.nom ??
    `${fallbackPrefix} ${option.id ?? option.value ?? ""}`.trim()
  );
}
