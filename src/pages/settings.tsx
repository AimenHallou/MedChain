// src/pages/Settings.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { saveSettings } from "../utils/config";
import { Settings as SettingsType } from "../objects/settings";
import Web3 from "web3";
import { LuRefreshCw } from "react-icons/lu";
import { initializeHelia, getHeliaInstance } from "../utils/initHelia";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

export const SettingsPage: React.FC = () => {
  const [serverAddress, setServerAddress] = useState<string | null>(null);
  const [databaseAddress, setDatabaseAddress] = useState<string | null>(null);
  const [blockchainAddress, setBlockchainAddress] = useState<string | null>(
    null
  );

  const [systemStatus, setSystemStatus] = useState({
    server: false,
    database: false,
    blockchain: false,
    ipfs: false,
  });

  const [expandedStatus, setExpandedStatus] = useState("");

  const toggleStatus = (statusName: string) => {
    setExpandedStatus(expandedStatus === statusName ? "" : statusName);
  };

  const getSystemStatus = async () => {
    const serverStatus = await checkServerStatus();
    const databaseStatus = await checkDatabaseStatus();
    const blockchainStatus = await checkBlockchainStatus();
    const ipfsStatus = await checkIPFSStatus();

    return {
      server: serverStatus,
      database: databaseStatus,
      blockchain: blockchainStatus,
      ipfs: ipfsStatus,
    };
  };

  const checkServerStatus = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/test");
      if (response.ok) {
        await response.json();
        console.log("Server is running.");
        setServerAddress("http://localhost:3001");
        return true;
      }
    } catch (error) {
      console.error("Error pinging server:", error);
      return false;
    }
  };

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/checkDatabase");
      if (response.ok) {
        await response.json();
        console.log("Database is running.");
        setDatabaseAddress("http://localhost:3001");
        return true;
      }
    } catch (error) {
      console.error("Error pinging database:", error);
      return false;
    }
  };

  const checkBlockchainStatus = async () => {
    try {
      const web3 = new Web3("http://127.0.0.1:8545");
      await web3.eth.getBlockNumber();
      console.log("Blockchain is running.");
      setBlockchainAddress("http://127.0.0.1:8545");
      return true;
    } catch (error) {
      console.error("Error accessing the blockchain:", error);
      return false;
    }
  };

  const checkIPFSStatus = async () => {
    try {
      await initializeHelia();
      const helia = getHeliaInstance();
      if (!helia) {
        throw new Error("Helia is not initialized.");
      }
      helia.stop();
      console.log("IPFS is running.");
      return true;
    } catch (error) {
      console.error("Error checking IPFS status:", error);
      return false;
    }
  };

  const refreshSystemStatus = async () => {
    const status = await getSystemStatus();
    setSystemStatus({
      server: status.server || false,
      database: status.database || false,
      blockchain: status.blockchain || false,
      ipfs: status.ipfs || false,
    });
  };

  useEffect(() => {
    const fetchSystemStatus = async () => {
      const status = await getSystemStatus();
      setSystemStatus({
        server: status.server || false,
        database: status.database || false,
        blockchain: status.blockchain || false,
        ipfs: status.ipfs || false,
      });
    };

    fetchSystemStatus();
  }, []);

  const form = useForm({
    defaultValues: {
      storageMode: "database",
    },
  });

  const onSubmit = (data: SettingsType) => {
    saveSettings(data);
  };

  const StatusLine = ({
    label,
    isRunning,
    children,
  }: {
    label: string;
    isRunning: boolean;
    children?: React.ReactNode;
  }) => {
    const isExpanded = expandedStatus === label;

    return (
      <div className="flex flex-col">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => toggleStatus(label)}
        >
          {isExpanded ? (
            <MdOutlineKeyboardArrowUp size={24} className="mr-2" />
          ) : (
            <MdOutlineKeyboardArrowDown size={24} className="mr-2" />
          )}
          <span className="font-medium">{label}:</span>{" "}
          {isRunning ? (
            <span className="text-green-500">Running</span>
          ) : (
            <span className="text-red-500">Stopped</span>
          )}
        </div>
        {isExpanded && (
          <div className="pl-8 pt-2 text-sm text-gray-300">{children}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="bg-gray-800 p-6 rounded-lg text-white w-full max-w-2xl border border-gray-600 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">System Status</h2>
          <LuRefreshCw
            className="text-lg cursor-pointer hover:text-gray-400"
            onClick={refreshSystemStatus}
            size={24}
          />
        </div>{" "}
        <div className="grid grid-cols-2 gap-4 text-lg mt-4">
          <StatusLine label="Server" isRunning={systemStatus.server}>
            {systemStatus.server ? (
              <>
                <p>Server Address: {serverAddress}</p>
              </>
            ) : (
              <p>Server is not running.</p>
            )}
          </StatusLine>
          <StatusLine label="Database" isRunning={systemStatus.database}>
            {systemStatus.database ? (
              <>
                <p>Database Address: {databaseAddress}</p>
              </>
            ) : (
              <p>Database is not running.</p>
            )}
          </StatusLine>
          <StatusLine label="Blockchain" isRunning={systemStatus.blockchain}>
            {systemStatus.blockchain ? (
              <>
                <p>Blockchain Address: {blockchainAddress}</p>
              </>
            ) : (
              <p>Blockchain is not running.</p>
            )}
          </StatusLine>
          <StatusLine label="IPFS" isRunning={systemStatus.ipfs} />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg text-white w-full max-w-2xl border border-gray-600 shadow-xl mt-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <span className="text-xl font-semibold">Storage Mode:</span>
            <div className="mt-3">
              <label className="flex items-center mt-3">
                <input
                  type="radio"
                  value="database"
                  {...form.register("storageMode")}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-md">Database Only</span>
              </label>
              <label className="flex items-center mt-3">
                <input
                  type="radio"
                  value="blockchain"
                  {...form.register("storageMode")}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-md">Blockchain/IPFS</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
