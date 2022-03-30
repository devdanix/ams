import React, { useContext } from 'react'
import { testContext } from './App.jsx'

export default function Test() {

  const test = useContext(testContext)

  console.log(test)

  return (
    <div>test</div>
  )
}


export const testContext = createContext()


const MyProvider = props => {
  const [value, setValue] = useState("foo");
  const [value2, setValue2] = useState("goo");
  const [value3, setValue3] = useState("Boo");

  return (
    <testContext.Provider value={{ value: [ value, setValue ], value2: [value2, setValue2], value3: [value3, setValue3], value4: {value3, setValue3} }}>
        {props.children}
    </testContext.Provider>
  );
};

const ComponentA = memo(() => {
  const { value, value2 } = useContext(testContext);
  const [stateValue, setStateValue] = value;
  const [stateValue2, setStateValue2] = value2;

  console.log('render A')


  return (
    <div>
      <h1>The value is: {stateValue}</h1>
      <h1>The value2 is: {stateValue2}</h1>
      <button onClick={() => setStateValue('test')} >set value 1</button>
    </div>
  );
});

const ComponentB = memo(() => {
  const { value3 } = useContext(testContext);
  console.log(useContext(testContext))
  const [stateValue3, setStateValue3] = value3;


  console.log('render B')


  return (
    <div>
      <h1>The value is B: {stateValue3}</h1>
      <button onClick={() => setStateValue3('test')} >set value 3</button>
    </div>
  );
});

const RenderComponent = memo(() => {
  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  )

})
