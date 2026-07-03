export function AuthField({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="mt-1.5 w-full rounded-lg border border-edge bg-bg px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}
