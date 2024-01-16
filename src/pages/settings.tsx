// src/pages/Settings.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { saveSettings } from '../utils/config';
import { Settings as SettingsType } from '../objects/settings';

// Define the schema for form data using Zod
const SettingsSchema = z.object({
  storageMode: z.enum(['database', 'blockchain']),
});

export const SettingsPage: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      storageMode: 'database',
    },
  });

  const onSubmit = (data: SettingsType) => {
    saveSettings(data);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4">
      <div className="bg-gray-700 p-6 rounded mt-10 text-white lg:w-[30rem] border-2 border-gray-600">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <span className="text-lg font-semibold">Storage Mode:</span>
            <div className="mt-2">
              <label className="flex items-center mt-2">
                <input
                  type="radio"
                  value="database"
                  {...form.register('storageMode')}
                  className="form-radio h-5 w-5 text-blue-500 border-gray-300"
                />
                <span className="ml-2 text-md">Database Only</span>
              </label>
              <label className="flex items-center mt-2">
                <input
                  type="radio"
                  value="blockchain"
                  {...form.register('storageMode')}
                  className="form-radio h-5 w-5 text-blue-500 border-gray-300"
                />
                <span className="ml-2 text-md">Blockchain/IPFS</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
