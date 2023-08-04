import classNames from "classnames";
import Char from "./Char";
import { Character } from "./Character";
import { useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface CharactersProps {
  setCharacters: (character: Character[]) => void;
  characters: Character[];
  setEditing: React.Dispatch<React.SetStateAction<string | null>>;
  editingId: string | null;
}

interface DraggableCharacterProps {
  character: Character;
  index: number;
  moveCharacter: (from: number, to: number) => void;
  setEditing: React.Dispatch<React.SetStateAction<string | null>>;
  editingId: string | null;
}

interface TrashBoxProps {
  removeCharacter: (index: number) => void;
}

const DraggableCharacter = ({
  character,
  index,
  moveCharacter,
  setEditing,
  editingId,
}: DraggableCharacterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "character",
    hover(item: { type: string; index: number; hoveredIndex: number }) {
      if (!ref.current) {
        return;
      }
      const hoverIndex = index;
      if (item.index === hoverIndex) {
        return;
      }
      item.hoveredIndex = hoverIndex; // Keep track of hovered index
    },
  });

  const [, drag, preview] = useDrag({
    type: "character",
    item: () => ({ type: "character", index, hoveredIndex: -1 }), // Include a hoveredIndex property
    end: (item, monitor) => {
      if (!monitor.didDrop() || item.hoveredIndex === -1) {
        return;
      }
      moveCharacter(item.index, item.hoveredIndex); // Perform the move on drag end
    },
  });

  preview(drop(ref));
  drag(ref);

  return (
    <div
      ref={ref}
      className={classNames(
        "flex flex-col items-center justify-center hover:bg-gray-300 hover:cursor-pointer",
        {
          "bg-gray-400": character.id === editingId,
        }
      )}
      onClick={() => setEditing(character.id)}
    >
      {character.sequence && (
        <>
          <Char sequence={character.sequence} position="top" />
          <Char sequence={character.sequence} position="bottom" />
        </>
      )}
      {character.str && (
        <div className="text-7xl px-3 flex items-center justify-center">
          <div>{character.str}</div>
        </div>
      )}
    </div>
  );
};

const TrashBox = ({ removeCharacter }: TrashBoxProps) => {
  const [, drop] = useDrop({
    accept: "character",
    drop: (item: { type: string; index: number }) => {
      removeCharacter(item.index);
    },
  });

  return (
    <div
      ref={drop}
      style={{
        width: 75,
        border: "1px dashed black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 25,
      }}
    >
      <span>Trash</span>
    </div>
  );
};

const Characters = ({
  setCharacters,
  characters,
  setEditing,
  editingId,
}: CharactersProps) => {
  const moveCharacter = (dragIndex: number, hoverIndex: number) => {
    const dragItem = characters[dragIndex];
    const newCharacters = [...characters];
    newCharacters.splice(dragIndex, 1); // Remove the dragged item
    newCharacters.splice(hoverIndex, 0, dragItem); // Insert it at the new position
    setCharacters(newCharacters);
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="characters" className="flex flex-wrap mt-10">
        <TrashBox removeCharacter={removeCharacter} />
        {characters.map((character, index) => (
          <DraggableCharacter
            key={character.id}
            {...{ editingId, setEditing, moveCharacter, character, index }}
          />
        ))}
        <div className="flex flex-col items-center bg-gray-300 w-2"></div>
      </div>
    </DndProvider>
  );
};

export default Characters;
