import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type TypographyProps = HTMLAttributes<HTMLElement> & {
  as?: keyof HTMLElementTagNameMap;
};

export function Display({ className, as: Tag = "h1", ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        "font-heading font-light leading-none tracking-tight",
        "text-[4.5rem] md:text-[5rem] lg:text-[5.5rem]",
        className
      )}
      {...props}
    />
  );
}

export function H1({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "font-heading font-normal leading-tight tracking-tight",
        "text-4xl md:text-5xl",
        className
      )}
      {...props}
    />
  );
}

export function H2({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-heading font-normal leading-tight tracking-tight",
        "text-3xl md:text-4xl",
        className
      )}
      {...props}
    />
  );
}

export function H3({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-heading font-semibold leading-snug",
        "text-2xl md:text-3xl",
        className
      )}
      {...props}
    />
  );
}

export function H4({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn("font-heading font-semibold leading-snug text-xl", className)}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("font-sans font-light text-xl leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export function Body({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("font-sans text-base leading-7", className)} {...props} />
  );
}

export function Small({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <small className={cn("font-sans text-sm leading-6", className)} {...props} />
  );
}

export function Caption({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <span
      className={cn(
        "font-sans text-xs uppercase tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
