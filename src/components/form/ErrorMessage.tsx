export default function ErrorMessage({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className="flex space-x-1">
      <p className={`text-sm !leading-tight text-red-500 ${className}`}>
        {children}
      </p>
    </div>
  );
}
