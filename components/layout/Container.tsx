import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
};

export default function Container({ as: Tag = "div", className = "", ...props }: Props) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[var(--content-max)] px-[var(--gutter-x-sm)] md:px-[var(--gutter-x-md)] ${className}`}
      {...props}
    />
  );
}