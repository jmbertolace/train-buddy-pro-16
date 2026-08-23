import { useEffect, useState } from "react";

const MIN_DURATION = 5;
const MAX_DURATION = 10;

export function ShortVideoField({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
}) {
  const [error, setError] = useState("");

  useEffect(() => setError(""), [value]);

  return (
    <div className="space-y-1">
      <input
        type="url"
        className={className}
        value={value}
        placeholder="https://.../video.mp4"
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <video
          src={value}
          preload="metadata"
          className="hidden"
          onLoadedMetadata={(event) => {
            const duration = event.currentTarget.duration;
            setError(
              duration >= MIN_DURATION && duration <= MAX_DURATION
                ? ""
                : "O vídeo precisa ter entre 5 e 10 segundos.",
            );
          }}
          onError={() => setError("Não foi possível validar este vídeo.")}
        />
      )}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Duração permitida: 5 a 10 segundos.</p>
      )}
    </div>
  );
}