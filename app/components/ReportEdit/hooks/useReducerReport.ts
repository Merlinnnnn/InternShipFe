type ActionType =
  | { type: 'UPDATE_FIELD'; field: string; value: string | number }
  | { type: 'SET_STATE'; payload: StateType }; // Thêm loại hành động 'SET_STATE' với payloa

interface StateType {
  [key: string]: string | number;
}

export const useReducerReport = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'SET_STATE':
      return {
        ...state,
        ...action.payload 
      };
    default:
      return state;
  }
};
