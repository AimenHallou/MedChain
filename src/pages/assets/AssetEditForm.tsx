// src/components/pages/AssetEditForm.tsx
import React, { FC } from "react";

interface AssetEditFormProps {
  editedTitle: string;
  setEditedTitle: (value: string) => void;
  editedContent: File[];
  setEditedContent: (value: File[]) => void;
  handleSave: () => void;
}

const AssetEditForm: FC<AssetEditFormProps> = ({
  editedTitle,
  setEditedTitle,
  editedContent,
  setEditedContent,
  handleSave,
}) => (
  <div className="px-4 py-2 bg-gray-900">
    <div className="mb-4">
      <label htmlFor="editedTitle" className="text-white font-bold">
        Title
      </label>
      <input
        id="editedTitle"
        name="editedTitle"
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="editedContent" className="text-white font-bold">
        Content
      </label>
      <input
        id="editedContent"
        name="editedContent"
        type="file"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            setEditedContent(Array.from(e.target.files));
          }
        }}
        className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
      />
    </div>

    <button
      onClick={handleSave}
      className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      Save
    </button>
  </div>
);

export default AssetEditForm;
