import { useRef, useReducer, useEffect } from 'react';
import './AnimatedSection.css';

const initialState = {
  height: 0,
  shouldRender: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SHOW':
      return { ...state, shouldRender: true };
    case 'HIDE':
      return { ...state, shouldRender: false };
    case 'SET_HEIGHT':
      return { ...state, height: action.payload };
    case 'COLLAPSE':
      return { ...state, height: 0 };
    default:
      return state;
  }
}

function AnimatedSection({ show, children }) {
  const contentRef = useRef(null);
  const timerRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    shouldRender: show,
  });

  const paddingBottom = 20;

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (show) {
      dispatch({ type: 'SHOW' });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (contentRef.current) {
            dispatch({
              type: 'SET_HEIGHT',
              payload: contentRef.current.scrollHeight + paddingBottom,
            });
          }
        });
      });
    } else {
      dispatch({ type: 'COLLAPSE' });
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'HIDE' });
      }, 350);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [show]);

  useEffect(() => {
    if (show && state.shouldRender) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          dispatch({
            type: 'SET_HEIGHT',
            payload: contentRef.current.scrollHeight + paddingBottom,
          });
        }
      });
    }
  }, [children, show, state.shouldRender]);

  if (!state.shouldRender) {
    return null;
  }

  return (
    <div
      className={`animated-section ${show ? 'show' : 'hide'}`}
      style={{ height: show ? state.height : 0 }}
    >
      <div ref={contentRef} className="animated-section-content">
        {children}
      </div>
    </div>
  );
}

export default AnimatedSection;
