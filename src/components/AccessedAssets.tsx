// src/components/AccessedAssets.tsx
import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
//import { fetchAccessedAssets } from '../redux/slices/assetSlice';

const AccessedAssets: FC = () => {
  const dispatch = useDispatch();
  const { username } = useSelector((state: RootState) => state.user);
  //const accessedAssets = useSelector((state: RootState) => state.assets.accessed);

  useEffect(() => {
    //dispatch(fetchAccessedAssets(username));
  }, [dispatch, username]);

  return (
    <div>
      <h2>Accessed Assets</h2>
      {/* Render your assets here */}
    </div>
  );
};

export default AccessedAssets;
