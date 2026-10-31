/**
 * With JavaScript off, a showpiece never goes live, so its unmask covers must
 * rest off to the side, and its entering layers stay visible, even where motion
 * is allowed (styles/media.css). Goes
 * once in each app's root layout.
 */
export function NoScriptMedia() {
  return (
    <noscript
      dangerouslySetInnerHTML={{ __html: "<style>[data-unmask]{transform:translateX(101%)!important}[data-enter]{opacity:1!important}</style>" }}
    />
  );
}
