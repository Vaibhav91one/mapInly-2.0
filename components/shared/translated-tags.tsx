interface TranslatedTagsProps {
  tags: string[];
  className?: string;
}

// ponytail: tags are shown as written; the old Lingo-based tag translation needed a backend
export function TranslatedTags({ tags, className }: TranslatedTagsProps) {
  return (
    <>
      {tags.map((tag) => (
        <span key={tag} className={className}>
          #{tag}
        </span>
      ))}
    </>
  );
}
