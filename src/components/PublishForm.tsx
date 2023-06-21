// src/components/PublishForm.tsx
import React, { FC, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setTitle, resetForm } from "../redux/slices/formSlice";
import { addAsset } from "../redux/slices/assetSlice";
import { addNotification } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import { uuid } from "uuidv4";
import ContentSection from "./publish/ContentSection";
import ShareSection from "./publish/ShareSection";
import TitleSection from "./publish/TitleSection";
import FileCardsSection from "./publish/FileCardsSection";

const PublishForm: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const form = useSelector((state: RootState) => state.form);
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);
  const { users, currentUserAddress } = useSelector(
    (state: RootState) => state.user
  );
  const currentUser = users.find((user) => user.address === currentUserAddress);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const createdDate = new Date().toISOString();
    dispatch(
      addAsset({
        ...form,
        owner: currentUser?.address,
        ownerTitle: currentUser?.address,
        createdDate,
        sharedWith: sharedUsers,
        history: [`Asset created on ${createdDate}`],
      })
    );

    sharedUsers.forEach((sharedUser) => {
      dispatch(
        addNotification({
          address: sharedUser,
          notification: {
            id: uuid(),
            read: false,
            message: `You have been added as a shared user to the asset titled "${form.title}".`,
          },
        })
      );
    });

    dispatch(resetForm());
    router.push("/");
  };

  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between bg-gray-900 p-4 md:p-8 text-white">
      <form onSubmit={handleSubmit} className="w-full md:w-4/5 mx-auto md:mx-0 mt-5 md:mt-0">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Publish Data
        </h1>
        <TitleSection />
        <ContentSection />
        <ShareSection sharedUsers={sharedUsers} setSharedUsers={setSharedUsers} />

        <div className="flex items-center justify-center mt-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Publish
          </button>
        </div>
      </form>

      <div className="w-full md:w-3/5 mt-8 md:mt-0">
        <FileCardsSection />
      </div>
    </div>
  );
};

export default PublishForm;
