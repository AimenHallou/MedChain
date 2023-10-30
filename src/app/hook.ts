// src/app/hooks.ts
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsShowing(true);
    }
  }, []);

  const toggle = () => {
    setIsShowing(!isShowing);
    if (!isShowing) { 
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }

  return {
    isShowing,
    toggle
  }
}