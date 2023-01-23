import { useReducer } from "react";
import "./index.css";
import OperationButton from "./Operationbutton";
import DigitButton from "./Digitbutton";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE: "choose-operation",
  EVALUATE: "evaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite==true) {
        return{
          ...state,
           curroperand:payload.digit,
           overwrite:false,
        }
        
      }
      if (payload.digit === "0" && state.curroperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.curroperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        curroperand: `${state.curroperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE:
      if (state.curroperand == null && state.prevoperand == null) {
        return state
      }
      if (state.curroperand==null) {
        return {
          ...state,
          operation:payload.operation
        }
        
      }
      if (state.prevoperand == null){
        return {
          ...state,
          operation: payload.operation,
          prevoperand: state.curroperand,
          curroperand: null,
        }
      }
      return{
        ...state,
        prevoperand:evaluate(state),
        operation:payload.operation,
        curroperand:null,
      }
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite) {
          return{
          ...state,
          overwrite:false,
          curroperand:null,
        }
}
        if(state.curroperand== null) return state
        if(state.curroperand.length=== 1) return {
          ...state,
          curroperand:null,
        }
        return{
          ...state,
          curroperand:state.curroperand.slice(0,-1)
        }

      case ACTIONS.CLEAR:
        return {};

      case ACTIONS.EVALUATE:
        if (state.prevoperand== null || state.curroperand==null || state.prevoperand==null) {
          return state
        }
        return{
          ...state,
          overwrite:true,
          prevoperand:null,
          operation:null,
          curroperand:evaluate(state)

        }
  }
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-in", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function evaluate({curroperand,prevoperand,operation}){
  const prev=parseFloat(prevoperand)
  const curr=parseFloat(curroperand)
  if (isNaN(prev) || isNaN(curr)) return ''
  let computation=''
    switch (operation) {
      case '+':
        computation=prev+curr
        break;
      case '-':
        computation=prev-curr
        break;
      case '*':
        computation=prev*curr
        break;
      case '/':
        computation=prev/curr
        break;
    
      default:
        break;
    }
    return computation.toString()
  }  



function App() {
  const [{ curroperand, prevoperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-operand">
          {formatOperand(prevoperand)}
          {operation}
        </div>
        <div className="curr-operand">{formatOperand(curroperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button
       onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />

      <OperationButton operation="-" dispatch={dispatch} />

      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
