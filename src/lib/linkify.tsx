import { Fragment } from "react";

const URL_PATTERN = /(https?:\/\/[^\s<]+)/g;
const TRAILING = /[.,;:!?)\]]+$/;

/** Turns any http(s) URL in plain text into a clickable link. */
export function Linkify({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        // Keep punctuation at the end of a sentence out of the link.
        const trailing = part.match(TRAILING)?.[0] ?? "";
        const url = trailing ? part.slice(0, -trailing.length) : part;
        return (
          <Fragment key={i}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 underline underline-offset-2 break-all hover:text-teal-900"
            >
              {url}
            </a>
            {trailing}
          </Fragment>
        );
      })}
    </>
  );
}
