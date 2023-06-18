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
import DescriptionSection from "./publish/DescriptionSection";
import ShareSection from "./publish/ShareSection";
import TitleSection from "./publish/TitleSection";

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
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mt-5">
      <h1 className="text-2xl font-bold text-white mb-4 text-center">
        Publish Data
      </h1>
      <TitleSection />
      <DescriptionSection />
      <ContentSection />
      <ShareSection sharedUsers={sharedUsers} setSharedUsers={setSharedUsers} />

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Publish
        </button>
      </div>
    </form>
  );
};

export default PublishForm;
