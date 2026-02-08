import { useState, useCallback } from 'react';

function useUndoRedo(initialState) {
  const [state, setState] = useState({
    history: [initialState],
    currentIndex: 0,
  });

  const setNewState = useCallback((newState) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);
      return {
        history: [...newHistory, newState],
        currentIndex: prev.currentIndex + 1,
      };
    });
  }, []);

  const undo = useCallback(() => {
    let result = null;
    setState(prev => {
      if (prev.currentIndex > 0) {
        result = prev.history[prev.currentIndex - 1];
        return { ...prev, currentIndex: prev.currentIndex - 1 };
      }
      return prev;
    });
    return result;
  }, []);

  const redo = useCallback(() => {
    let result = null;
    setState(prev => {
      if (prev.currentIndex < prev.history.length - 1) {
        result = prev.history[prev.currentIndex + 1];
        return { ...prev, currentIndex: prev.currentIndex + 1 };
      }
      return prev;
    });
    return result;
  }, []);

  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;

  return { 
    setState: setNewState, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  };
}

export default useUndoRedo;
