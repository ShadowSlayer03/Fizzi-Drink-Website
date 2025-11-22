// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import clsx from "clsx";
import React from "react";

type AsProp<T extends React.ElementType> = {
  as?: T;
};

type PropsToOmit<T extends React.ElementType, P> = keyof (AsProp<T> & P);

type PolymorphicComponentProps<
  T extends React.ElementType,
  Props = Record<string, unknown>
> = Props &
  AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>;

type BoundedOwnProps = {
  className?: string;
  children: React.ReactNode;
};

type BoundedProps<T extends React.ElementType> = PolymorphicComponentProps<
  T,
  BoundedOwnProps
>;

export const Bounded = <T extends React.ElementType = "section">(
  props: BoundedProps<T>
) => {
  const { as, className, children, ...rest } = props;

  const Component = as || "section";

  return (
    <Component
      {...rest}
      className={clsx("px-4 first:pt-10 md:px-6", className)}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {children}
      </div>
    </Component>
  );
};
