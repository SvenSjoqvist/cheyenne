"use client";

import { useState } from 'react';

interface EditableField {
  label: string;
  value: string;
  key: string;
}

interface EditableDetailsCardProps {
  title: string;
  data: EditableField[];
  onSave: (updatedData: EditableField[]) => Promise<void>;
}

export default function EditableDetailsCard({ 
  title, 
  data, 
  onSave, 
}: EditableDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditableField[]>(data);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData([...data]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData([...data]);
  };

  const handleFieldChange = (key: string, value: string) => {
    setEditedData(prev => 
      prev.map(field => 
        field.key === key ? { ...field, value } : field
      )
    );
  };


  return (
    <div className={`h-auto w-full rounded-2xl  overflow-hidden border-2 border-[#E0E0E0]`}>
      <div className="flex justify-between items-center p-4 border-b-2 border-[#E0E0E0]">
        <h3 className={`text-black font-semibold font-darker-grotesque text-lg sm:text-xl lg:text-2xl tracking-wider truncate`}>
          {title}
        </h3>
        <div className="flex gap-2 flex-shrink-0">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className={`px-3 py-1 border-2 border-black text-black hover:bg-black hover:text-white transition-colors font-darker-grotesque text-sm rounded`}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-darker-grotesque text-sm disabled:opacity-50 border-2 border-green-600"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors font-darker-grotesque text-sm border-2 border-gray-600"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className='w-full'>
          <tbody>
            {(isEditing ? editedData : data).map((field) => (
              <tr key={field.key} className="border-b border-[#E0E0E0] last:border-b-0">
                <td className={`text-black font-semibold font-darker-grotesque text-xs sm:text-sm lg:text-base py-2 sm:py-3 px-3 sm:px-4 md:px-6 border-r-2 border-[#E0E0E0] w-1/3 min-w-[120px] align-top`}>
                  <div className="break-words">{field.label}</div>
                </td>
                <td className={`text-black text-xs sm:text-sm lg:text-base font-regular font-darker-grotesque py-2 sm:py-3 px-3 sm:px-4 md:px-6 w-2/3 align-top`}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className={`w-full p-1 sm:p-2 rounded border bg-gray-50 text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-darker-grotesque text-xs sm:text-sm lg:text-base`}
                    />
                  ) : (
                    <div className="break-words">{field.value || 'N/A'}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 