import { ChangeEvent } from "react";
import {
  Character,
  deserializeCharacters,
  serializeCharacters,
} from "./Character";

interface DownloadProps {
  data: Character[];
}

export const Download = ({ data }: DownloadProps) => {
  const handleDownload = () => {
    const fileData = JSON.stringify(serializeCharacters(data));
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "characters.json";
    link.href = url;
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
    >
      Download Data
    </button>
  );
};

interface UploadProps {
  onUpload: (data: Character[]) => void;
}

export const Upload = ({ onUpload }: UploadProps) => {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = JSON.parse(event.target?.result as string);
        onUpload(deserializeCharacters(data));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center justify-center bg-grey-lighter">
      <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-300">
        <svg
          className="w-8 h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M14 13v4H6v-4H2l8-8 8 8h-4zm-8 8h10v-2H6v2zm10-12V3H4v6h2V7h8v2h2z" />
        </svg>
        <span className="mt-2 text-base leading-normal">Select a file</span>
        <input
          type="file"
          accept=".json"
          onChange={handleUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};
