"use client";

import { Button } from "@heroui/react";

interface CareerApplicationButtonProps {
  positionTitle: string;
  className?: string;
}

export default function CareerApplicationButton({
  positionTitle,
  className = "min-w-[160px]",
}: CareerApplicationButtonProps) {
  const subject = `Application for ${positionTitle}`;
  const body = `Hi,\n\nI'm interested in the ${positionTitle} position at Meyoo.\n\n[Please attach your resume and cover letter]`;

  const mailtoLink = `mailto:arjun@meyoo.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a href={mailtoLink}>
      <Button variant="primary"
        className={className}
       
        size="md"
       
      >
        Apply Now
      </Button>
    </a>
  );
}
