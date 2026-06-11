'use client';

import { forwardRef, type ComponentProps } from 'react';
import { BookingHoverMenu } from '@/components/landing/booking-hover-menu';

type BookingLinkProps = ComponentProps<typeof BookingHoverMenu>;

/** Primary audit CTA — hover menu with email + Cal.com booking */
export const BookingLink = forwardRef<HTMLButtonElement, BookingLinkProps>(
  function BookingLink({ children, showPlus = true, variant = 'link', label = 'Book a call', ...rest }, ref) {
    return (
      <BookingHoverMenu ref={ref} showPlus={showPlus} variant={variant} label={label} {...rest}>
        {children}
      </BookingHoverMenu>
    );
  },
);

BookingLink.displayName = 'BookingLink';
