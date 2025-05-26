import { Link, LinkProps } from "expo-router";

export function NavLink({ href, ...props }: LinkProps) {
  return (
    <Link href={href} replace {...props}>
      {props.children}
    </Link>
  );
}
