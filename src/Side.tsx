import { useEffect, useRef, useState } from "react";
import { v1 as uuidv1 } from "uuid";

import { Download, Upload } from "./Files";
import {
  Character,
  S,
  Sequence,
  clearCanvas,
  draw,
  lineDef,
} from "./Character";
import classNames from "classnames";

const initSequence = () => ({
  top: new Set<number>(),
  bottom: new Set<number>(),
});

interface SideProps {
  setCharacters: (character: Character[]) => void;
  characters: Character[];
  editingId: string | null;
  setEditing: React.Dispatch<React.SetStateAction<string | null>>;
}

const Side = ({
  setCharacters,
  characters,
  editingId,
  setEditing,
}: SideProps) => {
  const [sequence, setSequence] = useState<Sequence>(initSequence());
  const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bottomCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (editingId !== null) {
      const newSequence = characters.find(
        ({ id }) => editingId === id
      )?.sequence;
      if (newSequence) {
        setSequence(newSequence);
      }
    }
  }, [characters, editingId]);

  const drawTopLine = (line: number) => {
    setSequence((oldSequence) => {
      const top = new Set(oldSequence.top);

      if (top.has(line)) {
        top.delete(line);
      } else {
        top.add(line);
      }

      return {
        top,
        bottom: new Set(oldSequence.bottom),
      };
    });
  };

  const drawBottomLine = (line: number) => {
    setSequence((oldSequence) => {
      const bottom = new Set(oldSequence.bottom);

      if (bottom.has(line)) {
        bottom.delete(line);
      } else {
        bottom.add(line);
      }

      return {
        top: new Set(oldSequence.top),
        bottom,
      };
    });
  };

  useEffect(() => {
    const top = topCanvasRef.current;
    const bottom = bottomCanvasRef.current;
    if (top && bottom) {
      clearCanvas(top);
      clearCanvas(bottom);
      const topCtx = topCanvasRef.current?.getContext("2d");
      const bottomCtx = bottomCanvasRef.current?.getContext("2d");
      if (topCtx && bottomCtx) {
        draw({ topCtx, bottomCtx, sequence });
      }
    }
  }, [sequence]);

  const addCharacter = () => {
    if (topCanvasRef.current && bottomCanvasRef.current) {
      const character: Character = {
        id: uuidv1(),
        sequence: sequence,
      };
      if (editingId === null) {
        setCharacters([...characters, character]);
      } else {
        setCharacters(
          characters.map((char) => (char.id === editingId ? character : char))
        );
        setEditing(null);
      }
      setSequence(initSequence());
    }
  };

  const reset = () => {
    if (!confirm("Are you sure?")) {
      return;
    }

    setCharacters([]);
  };

  const addPunctuation = (char: string) => {
    const newCharacter = {
      id: uuidv1(),
      str: char,
    };
    setCharacters([...characters, newCharacter]);
  };

  return (
    <div id="canvasContainer" className="flex flex-row space-x-2">
      <div>
        <h3 className="text-lg font-semibold">Top</h3>
        <div className="flex flex-row space-x-2">
          <canvas
            ref={topCanvasRef}
            id="topCanvas"
            width={S}
            height={S}
            className="h-fit w-fit"
          ></canvas>
          <div className="flex flex-col">
            {Object.keys(lineDef.top).map((key) => (
              <button
                key={key}
                onClick={() => drawTopLine(+key)}
                className={classNames(
                  "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
                  {
                    "bg-blue-700": sequence.top.has(+key),
                  }
                )}
              >
                {lineDef.top[+key].title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Bottom</h3>
        <div className="flex flex-row space-x-2">
          <canvas
            ref={bottomCanvasRef}
            id="bottomCanvas"
            width={S}
            height={S}
            className="h-fit w-fit"
          ></canvas>
          <div className="flex flex-col">
            {Object.keys(lineDef.bottom).map((key) => (
              <button
                key={key}
                onClick={() => drawBottomLine(+key)}
                className={classNames(
                  "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
                  {
                    "bg-blue-700": sequence.bottom.has(+key),
                  }
                )}
              >
                {lineDef.bottom[+key].title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <button
          onClick={reset}
          className="px-4 py-2 mt-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
        <Upload onUpload={setCharacters} />
        <Download data={characters} />
        <div className="flex-grow" />
        <div>
          <button
            onClick={() => addPunctuation("•")}
            className="px-4 py-2 mt-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            "•"
          </button>
          <button
            onClick={() => addPunctuation(",")}
            className="px-4 py-2 mt-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ","
          </button>
          <button
            onClick={() => addPunctuation("!")}
            className="px-4 py-2 mt-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            "!"
          </button>
          <button
            onClick={() => addPunctuation("?")}
            className="px-4 py-2 mt-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            "?"
          </button>
        </div>
        <button
          onClick={addCharacter}
          className="px-4 py-2 mt-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {editingId === null ? "Add character" : "Update Character"}
        </button>
      </div>
    </div>
  );
};

export default Side;
