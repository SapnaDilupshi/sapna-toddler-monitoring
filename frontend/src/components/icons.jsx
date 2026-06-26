import React from 'react';

function Icon({ children, viewBox = '0 0 24 24', className = '', ...props }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export function BrandGlyph(props) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M11 31.5c7.4 0 10.8-4.6 13-9.5 1.7-3.8 4.8-6.5 8.8-6.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M13 34.5h22"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="17.2" cy="18.3" r="4.2" fill="currentColor" opacity="0.94" />
      <circle cx="31" cy="18.3" r="4.2" fill="currentColor" opacity="0.86" />
      <path
        d="M17.2 22.8c-3 0-5.6 2.2-6.1 5.1"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M31 22.8c3 0 5.6 2.2 6.1 5.1"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M10 29.5c3.6 0 6.7-1.8 8.2-4.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M28.9 29.5c2.8 0 5.3-1.1 7-3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon(props) {
  return (
    <Icon {...props}>
      <path d="M18.8 14.7A7.5 7.5 0 1 1 9.3 5.2 8.8 8.8 0 1 0 18.8 14.7Z" />
    </Icon>
  );
}

export function SunIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.8v2.2M12 19v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.8 12h2.2M19 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </Icon>
  );
}

export function BellIcon(props) {
  return (
    <Icon {...props}>
      <path d="M15.5 17.2H8.5c0-3-.9-4-1.8-5.4-.7-1.1-1.2-2.3-1.2-3.8A6.5 6.5 0 0 1 12 1.5a6.5 6.5 0 0 1 6.5 6.5c0 1.5-.5 2.7-1.2 3.8-.9 1.4-1.8 2.4-1.8 5.4Z" />
      <path d="M10.2 18.8c.4 1.4 1.2 2.2 1.8 2.2s1.4-.8 1.8-2.2" />
    </Icon>
  );
}

export function MailIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.6" />
      <path d="m5.5 7.8 6.5 5.1 6.5-5.1" />
    </Icon>
  );
}

export function LockIcon(props) {
  return (
    <Icon {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.2" />
      <path d="M8 10.5V8.2a4 4 0 0 1 8 0v2.3" />
      <path d="M12 14.4v2.3" />
    </Icon>
  );
}

export function EyeIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2.8 12s3.2-5.8 9.2-5.8 9.2 5.8 9.2 5.8-3.2 5.8-9.2 5.8S2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </Icon>
  );
}

export function EyeOffIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 4l16 16" />
      <path d="M10.6 10.7a2.8 2.8 0 0 0 3.2 3.2" />
      <path d="M6.2 8.4C4.2 9.9 3 12 3 12s3.2 5.8 9 5.8c1 0 1.8-.1 2.6-.4" />
      <path d="M9.1 5.8A11 11 0 0 1 12 5.2c5.8 0 9 6.8 9 6.8s-1 1.9-2.8 3.5" />
    </Icon>
  );
}

export function GridIcon(props) {
  return (
    <Icon {...props}>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </Icon>
  );
}

export function ChildIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 20a5.5 5.5 0 0 1 11 0" />
    </Icon>
  );
}

export function ActivityIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 14.5h3.3l2.2-6 3.1 10 2.1-5.6H20" />
    </Icon>
  );
}

export function ReportIcon(props) {
  return (
    <Icon {...props}>
      <path d="M7 4.8h7.4L19 9.4V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V6.3A1.5 1.5 0 0 1 7 4.8Z" />
      <path d="M12 4.9v4.7h4.6" />
      <path d="M9 14.8v2.6M12 12.8v4.6M15 10.8v6.6" />
    </Icon>
  );
}

export function InsightsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4.8 18.8h14.4" />
      <path d="M7 16V9.5M12 16V6.8M17 16v-4.1" />
      <path d="M6.2 6.2 12 11l5.8-4.8" />
    </Icon>
  );
}

export function AttendeeIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="9" r="2.3" />
      <circle cx="15.5" cy="10.5" r="1.9" />
      <path d="M4.8 18.2a4.2 4.2 0 0 1 8.4 0" />
      <path d="M12.2 18a3.5 3.5 0 0 1 7 0" />
    </Icon>
  );
}

export function ProfileIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8.5" r="3" />
      <path d="M6.5 19.2a5.5 5.5 0 0 1 11 0" />
    </Icon>
  );
}

export function SettingsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4.8 8.2h6M13.2 8.2h6" />
      <circle cx="11" cy="8.2" r="2" />
      <path d="M4.8 15.8h4.1M11.5 15.8h7.7" />
      <circle cx="8.9" cy="15.8" r="2" />
    </Icon>
  );
}

export function InfoIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.4v5.2M12 7.4h.01" />
    </Icon>
  );
}

export function LogoutIcon(props) {
  return (
    <Icon {...props}>
      <path d="M10 6.5V5.2A1.7 1.7 0 0 1 11.7 3.5h5.1A1.7 1.7 0 0 1 18.5 5.2v13.6a1.7 1.7 0 0 1-1.7 1.7h-5.1A1.7 1.7 0 0 1 10 18.8v-1.3" />
      <path d="M3.8 12h10.4" />
      <path d="m8.4 8.4 4 3.6-4 3.6" />
    </Icon>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function ShieldIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3.5 18 6v5.2c0 4.2-2.7 7.8-6 9.3-3.3-1.5-6-5.1-6-9.3V6l6-2.5Z" />
      <path d="m9.4 12.1 1.8 1.9 3.8-4.2" />
    </Icon>
  );
}

export function ClipboardIcon(props) {
  return (
    <Icon {...props}>
      <rect x="6.5" y="5.2" width="11" height="15" rx="2" />
      <rect x="9" y="3.5" width="6" height="3.2" rx="1.2" />
      <path d="M9.4 11.2h5.2M9.4 14.2h5.2" />
    </Icon>
  );
}

export function FolderIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3.8 7.4a2 2 0 0 1 2-2h4l1.4 2h8a2 2 0 0 1 2 2v7.8a2 2 0 0 1-2 2H5.8a2 2 0 0 1-2-2V7.4Z" />
    </Icon>
  );
}

export function ClockIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.2v4.4l3 1.6" />
    </Icon>
  );
}

export function CheckIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.7 12.2 2.3 2.4 4.7-5" />
    </Icon>
  );
}

export function DownloadIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 4.5v9.2" />
      <path d="m8.4 10.1 3.6 3.6 3.6-3.6" />
      <path d="M5 18.2h14" />
    </Icon>
  );
}

export function TrashIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5.5 7.2h13" />
      <path d="M9.3 7.2V5.8h5.4v1.4" />
      <path d="M7.7 7.2v10a1.8 1.8 0 0 0 1.8 1.8h5a1.8 1.8 0 0 0 1.8-1.8v-10" />
      <path d="M10 11v4.5M14 11v4.5" />
    </Icon>
  );
}

export function PlayIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 7.8v8.4a1 1 0 0 0 1.5.9l6.9-4.2a1 1 0 0 0 0-1.8l-6.9-4.2a1 1 0 0 0-1.5.9Z" />
    </Icon>
  );
}

export function ArrowRightIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Icon>
  );
}

export function PlusIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function UserIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8.5" r="3" />
      <path d="M6.5 19.2a5.5 5.5 0 0 1 11 0" />
    </Icon>
  );
}

export function SparkleIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3.5l1.8 4.7 4.7 1.8-4.7 1.8L12 16.5l-1.8-4.7-4.7-1.8 4.7-1.8L12 3.5Z" />
      <path d="M18.8 15.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3Z" />
    </Icon>
  );
}

export function GraphIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4.8 18.4V5.6" />
      <path d="M4.8 18.4h14.4" />
      <path d="M7.5 14.5 11 10.8l3 2.7 4.2-6" />
    </Icon>
  );
}

export function TargetIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="7.8" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

