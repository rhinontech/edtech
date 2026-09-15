import { Node } from "@tiptap/core";

// Ported from rhinon-cms (components/Admin/Content/BlogEditor/videoNode.ts).

export function extractYouTubeId(url: string): string | null {
  const m = (url || "").match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (attrs: { src: string; kind: "file" | "youtube"; width?: string }) => ReturnType;
    };
  }
}

/**
 * A block node for inline video: kind="file" renders <video controls>,
 * kind="youtube" a responsive privacy-mode iframe. Everything needed to
 * rebuild the node lives in data-* attributes on the wrapper, so saved HTML
 * parses back into the editor losslessly.
 */
export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-src"),
        renderHTML: (attrs: Record<string, string | null>) => ({ "data-src": attrs.src }),
      },
      kind: {
        default: "file",
        parseHTML: (el: HTMLElement) => el.getAttribute("data-kind") || "file",
        renderHTML: (attrs: Record<string, string | null>) => ({ "data-kind": attrs.kind }),
      },
      videoId: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-video-id"),
        renderHTML: (attrs: Record<string, string | null>) => (attrs.videoId ? { "data-video-id": attrs.videoId } : {}),
      },
      width: {
        default: "100%",
        parseHTML: (el: HTMLElement) => el.getAttribute("data-width") || "100%",
        renderHTML: (attrs: Record<string, string | null>) => ({ "data-width": attrs.width }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-video-embed]" }];
  },

  renderHTML({ node }) {
    const { src, kind, videoId, width } = node.attrs;
    const wrapperAttrs = {
      "data-video-embed": "",
      "data-src": src,
      "data-kind": kind,
      "data-width": width,
      ...(videoId ? { "data-video-id": videoId } : {}),
      style: `max-width: ${width}; margin-left: auto; margin-right: auto;`,
    };

    if (kind === "youtube" && videoId) {
      return [
        "div",
        wrapperAttrs,
        [
          "div",
          { style: "position: relative; padding-bottom: 56.25%; height: 0;" },
          [
            "iframe",
            {
              src: `https://www.youtube-nocookie.com/embed/${videoId}`,
              style: "position: absolute; inset: 0; width: 100%; height: 100%; border: 0;",
              allowfullscreen: "true",
            },
          ],
        ],
      ];
    }

    return ["div", wrapperAttrs, ["video", { src, controls: "true", style: "width: 100%; display: block;" }]];
  },

  addCommands() {
    return {
      setVideoEmbed:
        (attrs) =>
        ({ commands }) => {
          const videoId = attrs.kind === "youtube" ? extractYouTubeId(attrs.src) : null;
          if (attrs.kind === "youtube" && !videoId) return false;
          return commands.insertContent({ type: this.name, attrs: { ...attrs, videoId } });
        },
    };
  },
});
