import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function ComposeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M48.7772 9.9766L50.4649 8.2422C51.2852 7.4219 51.2852 6.2734 50.488 5.5L49.9489 4.9375C49.2227 4.2109 48.074 4.3047 47.3008 5.0547L45.5897 6.7422ZM21.8007 34.3516L26.371 32.3594L47.0665 11.6875L43.8554 8.5234L23.1835 29.1953L21.0741 33.6016C20.8866 34 21.3554 34.5391 21.8007 34.3516ZM12.0741 51.7891L39.5897 51.7891C43.8085 51.7891 46.246 49.3516 46.246 44.5234L46.246 18.4375L42.4726 22.2109L42.4726 44.336C42.4726 46.7734 41.1601 48.0156 39.5429 48.0156L12.1444 48.0156C9.8007 48.0156 8.4882 46.7734 8.4882 44.336L8.4882 17.7344C8.4882 15.2969 9.8007 14.0312 12.1444 14.0312L32.4179 14.0312L36.1913 10.2578L12.0741 10.2578C7.1992 10.2578 4.7148 12.6953 4.7148 17.5234L4.7148 44.5234C4.7148 49.375 7.1992 51.7891 12.0741 51.7891Z"
        stroke="currentColor"
        fill="currentColor"
      />
    </svg>
  )
}

export function GridViewIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function ListViewIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
