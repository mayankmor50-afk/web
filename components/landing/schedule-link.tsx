'use client';

import { forwardRef, type ComponentProps } from 'react';
import { BookingHoverMenu } from '@/components/landing/booking-hover-menu';

type ScheduleLinkProps = ComponentProps<typeof BookingHoverMenu>;

/** Schedule CTA on /audit — same hover menu, opens Cal.com when configured */
export const ScheduleLink = forwardRef<HTMLButtonElement, ScheduleLinkProps>(
  function ScheduleLink({
    children,
    placement = 'bottom-start',
    variant = 'link',
    label = 'Book a call',
    showPlus = true,
    ...rest
  }, ref) {
    return (
      <BookingHoverMenu
        ref={ref}
        label={label}
        showPlus={showPlus}
        variant={variant}
        placement={placement}
        {...rest}
      >
        {children}
      </BookingHoverMenu>
    );
  },
);

ScheduleLink.displayName = 'ScheduleLink';
