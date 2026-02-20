const Asterisk = ({
  className,
  fill = "gradient",
}: {
  className?: string;
  fill?: "gradient" | "current";
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      className={className ?? "size-30"}
    >
      <defs>
        <linearGradient
          id="asterisk-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#B8CCA8" />
          <stop offset="50%" stopColor="#568145" />
          <stop offset="100%" stopColor="#B8CCA8" />
        </linearGradient>
      </defs>
      <path
        fill={fill === "current" ? "currentColor" : "url(#asterisk-gradient)"}
        fillRule="evenodd"
        d="M7 .09a1 1 0 0 1 1 1v4.088l3.463-2.204a1 1 0 0 1 1.074 1.688L8.863 7l3.674 2.338a1 1 0 0 1-1.074 1.688L8 8.822v4.087a1 1 0 1 1-2 0V8.822l-3.463 2.204a1 1 0 1 1-1.074-1.688L5.137 7 1.463 4.662a1 1 0 1 1 1.074-1.688L6 5.178V1.091a1 1 0 0 1 1-1"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Asterisk;