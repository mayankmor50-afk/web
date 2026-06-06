'use client';

import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { bookingLinkProps } from '@/lib/booking';

type BookingLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  children: ReactNode;
};

/** Primary audit CTA — opens Calendly when NEXT_PUBLIC_BOOKING_URL is set */
export const BookingLink = forwardRef<HTMLAnchorElement, BookingLinkProps>(
  function BookingLink({ children, ...rest }, ref) {
    return (
      <a ref={ref} {...bookingLinkProps()} data-cursor="cta" {...rest}>
        {children}
      </a>
    );
  },
);

BookingLink.displayName = 'BookingLink';
