const B = {
  telegram: <path d="M22 3L2 11l6 2 2 7 3-4 5 4z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></>,
  github: <path d="M9 19c-4 1-4-2-6-2m12 4v-3a3 3 0 00-1-2c3 0 6-2 6-6a5 5 0 00-1-3 5 5 0 000-3s-1 0-3 1a10 10 0 00-6 0C7 4 6 4 6 4a5 5 0 000 3 5 5 0 00-1 3c0 4 3 6 6 6a3 3 0 00-1 2v3" />,
  linkedin: <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" />,
  youtube: <path d="M22 8a3 3 0 00-2-2c-2-.5-8-.5-8-.5s-6 0-8 .5A3 3 0 002 8c-.5 2-.5 4 0 6a3 3 0 002 2c2 .5 8 .5 8 .5s6 0 8-.5a3 3 0 002-2c.5-2 .5-4 0-6zM10 15V9l5 3z" />,
}
export const SOCIALS = Object.keys(B)
const Svg = ({ size = 18, sw = 2, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)
export const Brand = ({ name }) => <Svg>{B[name]}</Svg>
export const Arrow = () => <Svg size={16} sw={2.4}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
export const Chevron = () => <Svg sw={2.4}><path d="M6 9l6 6 6-6" /></Svg>
export const Burger = () => <Svg size={20}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>
export const FolderIcon = () => <svg width="64" height="64" viewBox="0 0 24 24" fill="#fff" fillOpacity=".85" aria-hidden="true"><path d="M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
