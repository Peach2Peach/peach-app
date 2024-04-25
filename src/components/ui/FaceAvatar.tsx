/* eslint-disable no-magic-numbers */
import { display, svgsIndex, Face } from "facesjs";
import { CSSProperties, useEffect, useMemo, useRef } from "react";

const SVG_RATIO = 3 / 2;

// eslint-disable-next-line no-shadow
enum PropMap {
  gender,
  body,
  head,
  race,
  fatness,
  bodyColor,

  eye,
  eyeLine,
  eyeAngle,
  eyeBrow,
  eyebrowAngle,

  glasses,
  glassesExist,

  ear,
  earSize,

  hair,
  hairBg,
  hairColor,
  hairFlip,

  mouth,
  mouthFlip,

  nose,
  noseFlip,
  noseSize,

  smileLine,
  smileLineSize,

  facialHair,

  accessories,
  accessoriesExist,

  miscLine,
  jersey,

  shave,
  shaveIntensity,
}

// - taken from the library as it is not exported
const colors = {
  white: {
    skin: ["#f2d6cb", "#ddb7a0"],
    hair: [
      "#272421",
      "#3d2314",
      "#5a3825",
      "#c96",
      "#2c1608",
      "#b55239",
      "#e9c67b",
      "#d7bf91",
    ],
  },
  asian: {
    // https://imgur.com/a/GrBuWYw
    skin: ["#fedac7", "#f0c5a3", "#eab687"],
    hair: ["#272421", "#0f0902"],
  },
  brown: {
    skin: ["#bb876f", "#aa816f", "#a67358"],
    hair: ["#272421", "#1c1008"],
  },
  black: {
    skin: ["#ad6453", "#74453d", "#5c3937"],
    hair: ["#272421"],
  },
};

const races = keys(colors);

type SvgKey = keyof typeof svgsIndex;

// - just because it is not exported by the library. remove once library exports it
const svgsGenders: Record<
  SvgKey,
  Array<"male" | "female" | "both">
> = JSON.parse(`{
  "accessories": ["both", "both", "both", "both", "both", "both", "both"],
  "body": ["both", "both", "male", "both", "male"],
  "ear": ["both", "both", "male"],
  "eye": ["male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female"],
  "eyeLine": ["male", "male", "male", "male", "male", "male", "both"],
  "eyebrow": ["both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female"],
  "facialHair": ["male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "male", "both", "male", "male", "male", "male", "male", "male", "male", "male"],
  "glasses": ["both", "both", "both", "both", "both", "both", "both"],
  "hair": ["male", "both", "male", "male", "both", "male", "male", "male", "both", "both", "both", "male", "male", "male", "both", "male", "male", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female", "female", "male", "male", "male", "both", "male", "male", "male", "male", "both", "both", "male", "male", "male", "male", "both", "male", "male", "male", "male", "male", "male"],
  "hairBg": ["female", "female", "female", "female", "female", "both", "both", "both"],
  "head": ["female", "female", "female", "male", "male", "male", "male", "both", "both", "male", "both", "male", "male", "both", "male", "male", "male", "both", "male", "male", "male"],
  "jersey": ["both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both"],
  "miscLine": ["female", "both", "both", "male", "male", "male", "male", "male", "both", "both", "male"],
  "mouth": ["both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both"],
  "nose": ["both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both", "both"],
  "smileLine": ["both", "both", "both", "both", "both"]
}`);

const maleSvgs = filterGenderSvgs("male");
const femaleSvgs = filterGenderSvgs("female");

type FaceAvatarProps = {
  id: string;
  style?: CSSProperties;
  width?: string;
  height?: string;
};

/**
 *
 * @param id User ID
 * @param [style]
 * @param [height]
 * @param [width]
 * @constructor
 */
export function FaceAvatar({ id, style, height, width }: FaceAvatarProps) {
  const element = useRef(null);
  const face = useMemo(() => generateFace(id), [id]);

  useEffect(() => {
    display(element.current, face);
  }, [face]);

  const styles = {
    ...style,
    height: height ?? style?.height,

    // SVG is 3:2 ratio (400x600), so width has to be manually calculated when height is specified. Otherwise
    // image will be clipped or overlapping with other elements
    width:
      width ??
      (height ? `${parseInt(height, 10) / SVG_RATIO}px` : style?.width),
  };

  return <div style={styles} ref={element}></div>;
}

function generateFace(id: string): Face {
  // create alphabet from input, so that it doesn't matter what values are passed
  const alphabet = Array.from(new Set(id.split("")))
    .sort()
    .join("");

  // map Props to values in alphabet
  const propValues = Object.values(PropMap).map((_, index) =>
    alphabet.indexOf(id[index % id.length]),
  );

  const gender = bool(PropMap.gender) ? "female" : "male";
  const palette = colors[pick(races, PropMap.race)];
  const svgs = gender === "male" ? maleSvgs : femaleSvgs;

  return {
    fatness: percent(PropMap.fatness),
    teamColors: ["#89bfd3", "#7a1319", "#07364f"],
    hairBg: {
      id:
        percent(PropMap.hairBg) < (gender === "male" ? 0.1 : 0.9)
          ? pick(svgs.hairBg, PropMap.hairBg)
          : "none",
    },
    body: {
      id: pick(svgs.body, PropMap.body),
      color: pick(palette.skin, PropMap.bodyColor),
      size: gender === "male" ? 1 : 0.95,
    },
    jersey: {
      id: pick(svgs.jersey, PropMap.jersey),
    },
    ear: {
      id: pick(svgs.ear, PropMap.ear),
      size: 0.5 + (gender === "male" ? 1 : 0.5) * percent(PropMap.earSize),
    },
    head: {
      id: pick(svgs.head, PropMap.head),
      shave:
        gender === "male" && bool(PropMap.shave)
          ? `rgba(0,0,0,0.${propValues[PropMap.shaveIntensity]})`
          : "rgba(0,0,0,0)",
    },
    eyeLine: {
      id: pick(svgs.eyeLine, PropMap.eyeLine),
    },
    smileLine: {
      id: pick(svgs.smileLine, PropMap.smileLine),
      size: 0.25 + 2 * percent(PropMap.smileLineSize),
    },
    miscLine: {
      id: pick(svgs.miscLine, PropMap.miscLine),
    },
    facialHair: {
      id: pick(svgs.facialHair, PropMap.facialHair),
    },
    eye: {
      id: pick(svgs.eye, PropMap.eye),
      angle: Math.round(percent(PropMap.eyeAngle) * 25 - 10),
    },
    eyebrow: {
      id: pick(svgs.eyebrow, PropMap.eyeBrow),
      angle: Math.round(percent(PropMap.eyebrowAngle) * 35 - 15),
    },
    hair: {
      id: pick(svgs.hair, PropMap.hair),
      color: pick(palette.hair, PropMap.hairColor + 1),
      flip: bool(PropMap.hairFlip),
    },
    mouth: {
      id: pick(svgs.mouth, PropMap.mouth),
      flip: bool(PropMap.mouthFlip),
    },
    nose: {
      id: pick(svgs.nose, PropMap.nose),
      flip: bool(PropMap.noseFlip),
      size: roundTwoDecimals(
        0.5 + percent(PropMap.noseSize) * (gender === "female" ? 0.5 : 0.75),
      ),
    },
    glasses: {
      id:
        percent(PropMap.glassesExist) < 0.1
          ? pick(svgs.glasses, PropMap.glasses)
          : "none",
    },
    accessories: {
      id:
        percent(PropMap.accessoriesExist) < 0.2
          ? pick(svgs.accessories, PropMap.accessories)
          : "none",
    },
  };

  function pick<T>(arr: Array<T>, propMap: PropMap): T {
    return arr[propValues[propMap] % arr.length];
  }

  function percent(propMap: PropMap) {
    return propValues[propMap] / alphabet.length;
  }

  function bool(propMap: PropMap) {
    return percent(propMap) < 0.5;
  }

  function roundTwoDecimals(x: number) {
    return Math.round(x * 100) / 100;
  }
}

function filterGenderSvgs(gender: "male" | "female") {
  const values = entries<SvgKey, string[]>(svgsIndex).map(
    ([key, ids]): [SvgKey, string[]] => [
      key,
      ids.filter((_, index) =>
        ["both", gender].includes(svgsGenders[key][index]),
      ),
    ],
  );

  return Object.fromEntries(values) as Record<SvgKey, string[]>;
}

// - fix as Object.keys does not support generic types
function keys<T extends string>(o: Record<T, unknown>): T[] {
  return Object.keys(o) as T[];
}
function entries<T extends string, U>(o: Record<T, U>): [T, U][] {
  return Object.entries(o) as [T, U][];
}
