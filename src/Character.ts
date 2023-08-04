export interface Sequence {
  top: Set<number>;
  bottom: Set<number>;
}

export interface Character {
  id: string;
  sequence?: Sequence;
  str?: string;
}

export const W = 15;

export const S = 200;

const w = W / 2;

type POS = [number, number];

const CENTER = S / 2;

const Y_DIFF = 40;

const TOP = Y_DIFF;

const BOTTOM = S - Y_DIFF;

const top: POS = [CENTER, TOP];

const left: POS = [0, CENTER];

const right: POS = [S, CENTER];

const bottom: POS = [CENTER, BOTTOM];

const leftBottom: POS = [w, S];

const leftTop: POS = [w, TOP];

const bottomBottom: POS = [CENTER, S];

const R = Y_DIFF / 2;

const bottomCircle: [POS, number] = [[CENTER, BOTTOM + R], R];

interface LineDefValue {
  title: string;
  lines?: [POS, POS][];
  circles?: [POS, number][];
}

interface LineDefPart {
  [key: number]: LineDefValue;
}

interface LineDef {
  top: LineDefPart;
  bottom: LineDefPart;
}

const rhombus: LineDefPart = {
  1: {
    title: "Top - Left",
    lines: [[top, left]],
  },
  2: {
    title: "Top - Right",
    lines: [[top, right]],
  },
  3: {
    title: "Bottom - Right",
    lines: [[bottom, right]],
  },
  4: {
    title: "Bottom - Left",
    lines: [[bottom, left]],
  },
};

export const lineDef: LineDef = {
  top: {
    ...rhombus,
    5: {
      title: "Left line",
      lines: [[[w, CENTER + w], leftBottom]],
    },
    6: {
      title: "Center line",
      lines: [
        [top, bottom],
        [bottom, bottomBottom],
      ],
    },
    7: {
      title: "Small line",
      lines: [[bottom, bottomBottom]],
    },
  },
  bottom: {
    ...rhombus,
    5: {
      title: "Left line",
      lines: [[[w, CENTER - w], leftTop]],
    },
    6: {
      title: "Center line",
      lines: [[top, bottom]],
    },
    7: {
      title: "Bottom Circle",
      circles: [bottomCircle],
    },
  },
};

const setLine = (ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = W;
  ctx.lineCap = "round";
};

const drawLine = (ctx: CanvasRenderingContext2D, pos1: POS, pos2: POS) => {
  setLine(ctx);
  ctx.beginPath();
  ctx.moveTo(...pos1);
  ctx.lineTo(...pos2);
  ctx.stroke();
};

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  center: POS,
  radius: number
) => {
  setLine(ctx);
  ctx.beginPath();
  ctx.arc(...center, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

export const drawCtx = (
  ctx: CanvasRenderingContext2D,
  lineDef: LineDefValue
) => {
  lineDef?.lines?.forEach(([pos1, pos2]) => drawLine(ctx, pos1, pos2));
  lineDef?.circles?.forEach(([center, radius]) =>
    drawCircle(ctx, center, radius)
  );
};

interface DrawOptions {
  topCtx: CanvasRenderingContext2D;
  bottomCtx: CanvasRenderingContext2D;
  sequence: Sequence;
}

export const drawSequence = (
  ctx: CanvasRenderingContext2D,
  sequence: Sequence,
  position: "top" | "bottom"
) => {
  if (position === "top" && (sequence.bottom.size || sequence.top.size)) {
    drawLine(ctx, [0, S - w], [S, S - w]);
  }
  sequence[position].forEach((line) => drawCtx(ctx, lineDef[position][line]));
};

export const draw = ({ topCtx, bottomCtx, sequence }: DrawOptions) => {
  drawSequence(topCtx, sequence, "top");
  drawSequence(bottomCtx, sequence, "bottom");
};

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
};

type SerializedSequence = {
  top: number[];
  bottom: number[];
};

export type SerializedCharacter = {
  id: string;
  sequence?: SerializedSequence;
  str?: string;
};

export const serializeCharacters = (
  characters: Character[]
): SerializedCharacter[] =>
  characters.map((character) => {
    const serializedCharacter: SerializedCharacter = {
      id: character.id,
    };

    if (character.sequence) {
      serializedCharacter.sequence = {
        top: Array.from(character.sequence.top),
        bottom: Array.from(character.sequence.bottom),
      };
    }

    if (character.str) {
      serializedCharacter.str = character.str;
    }

    return serializedCharacter;
  });

export const deserializeCharacters = (
  characters: SerializedCharacter[]
): Character[] =>
  characters.map((character) => {
    const char: Character = {
      id: character.id,
    };

    if (character.sequence) {
      char.sequence = {
        top: new Set(character.sequence.top),
        bottom: new Set(character.sequence.bottom),
      };
    }

    if (character.str) {
      char.str = character.str;
    }

    return char;
  });
