import { useEffect, useState } from "react";
import {
  Character,
  SerializedCharacter,
  deserializeCharacters,
  serializeCharacters,
} from "./Character";
import localforage from "localforage";
import Side from "./Side";
import Characters from "./Characters";

localforage.config({
  name: "TunicDecode",
});

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editingId, setEditing] = useState<string | null>(null);
  const [footerHeight, setFooterHeight] = useState(100); // Initial footer height

  const handleMouseDown = () => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: { clientY: number }) => {
    setFooterHeight(Math.max(100, window.innerHeight - e.clientY));
  };

  useEffect(() => {
    localforage.getItem<SerializedCharacter[]>("characters").then((data) => {
      if (data) {
        setCharacters(deserializeCharacters(data));
      }
    });
  }, []);

  const handleSetCharacters = (newCharacters: Character[]) => {
    setCharacters(newCharacters);
    // Store the new characters array in localStorage
    localforage.setItem("characters", serializeCharacters(newCharacters));
  };

  return (
    <div className="flex flex-col max-h-screen min-h-screen">
      <Side
        {...{
          setCharacters: handleSetCharacters,
          characters,
          editingId,
          setEditing,
        }}
      />
      <div className="overflow-y-scroll flex-grow">
        <Characters
          {...{
            setCharacters: handleSetCharacters,
            characters,
            setEditing,
            editingId,
          }}
        />
      </div>
      <div
        className="bg-gray-800 text-white"
        style={{ height: `${footerHeight}px` }}
      >
        <div
          className="cursor-n-resize h-2 bg-gray-900"
          onMouseDown={handleMouseDown}
        ></div>
        <div className="container mx-auto p-4">
          <p>Your Footer Content Here</p>
        </div>
      </div>
    </div>
  );
}

export default App;
