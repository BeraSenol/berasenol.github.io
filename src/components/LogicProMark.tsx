import logicProIcon from "../assets/logic-pro-icon.webp";

/**
 * Logic Pro's app icon.
 *
 * An <img>, not an inline svg like UnrealMark: the icon is raster art, with
 * its own shading and colour, so there is no path to hand a gradient to. The
 * same reason the app icons under DGT Studio Pro are images.
 *
 * alt="" by default, which marks the image as decorative: next to the words
 * "Logic Pro" a named image would make a screen reader say it twice. Pass
 * `label` where the icon stands on its own.
 *
 * The file is 232px square and the icon fills it edge to edge, with
 * transparent corners, so its box is its ink and it sizes like the svg does.
 */
export function LogicProMark({
  className = "",
  label = "",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <img
      src={logicProIcon}
      alt={label}
      width={232}
      height={232}
      className={className}
    />
  );
}
