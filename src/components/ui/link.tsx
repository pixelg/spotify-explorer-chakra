"use client";

import { forwardRef, PropsWithChildren } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import { Button, type ButtonProps } from "@chakra-ui/react";

interface NavLinkProps extends Omit<ButtonProps, "as"> {
    to: string;
}

export const NavLink = forwardRef<HTMLButtonElement, NavLinkProps>(function NavLink(props, ref) {
    const { to, children, ...rest } = props;

    const RouterLinkComponent = ({
        children,
        ...props
    }: PropsWithChildren<Omit<RouterLinkProps, "to">>) => (
        <RouterLink to={to} {...props}>
            {children}
        </RouterLink>
    );

    return (
        <Button as={RouterLinkComponent} ref={ref} {...rest}>
            {children}
        </Button>
    );
});
