import React, { FC, useState, useRef, useEffect, MutableRefObject, Dispatch, memo } from 'react'
import { tween } from 'tweening-js'
import { shuffle, range, uniqueId } from 'lodash'
import browserBeep from 'browser-beep'
// const context = new window.AudioContext()
const beepI = browserBeep({ frequency: 130, volume: 0.1 })
const beepJ = browserBeep({ frequency: 630, volume: 0.1 })

const DURATION = 100
const SIZE = 100

type TRef = MutableRefObject<Dispatch<React.SetStateAction<number>>>

interface IPropsBar {
  idx: number
  value: number
  refSetX: TRef
}

interface IPropsHandler {
  idx: number
  type: 'i' | 'j'
  refSetIdx: TRef
}

interface IValueSetX {
  value: number
  setX: TRef
}

const useX = (init: number) => {
  const [x, setX] = useState(getX(init))
  useEffect(() => setX(getX(init)), [init])
  return { x, setX }
}

const Bar: FC<IPropsBar> = (props) => {
  const { value, idx, refSetX } = props
  const { x, setX } = useX(idx)
  refSetX.current = setX
  const style = { height: (value+1) * 2, transform: `translate3d(${x}px, 0px, 0px)`  }
  return (
    <>
      <div className='bar' style={style}></div>
      <style jsx>{`
        .bar {
          width: 10px;
          background-color: black;
          margin: 0px 1px 0px 1px;
          position: absolute;
        }
      `}</style>
    </>
  )
}

const Handler: FC<IPropsHandler> = (props) => {
  const { type, idx, refSetIdx } = props
  const { x, setX } = useX(idx)
  refSetIdx.current = setX
  const style = { transform: `translateX(${x}px)` }
  return (
    <>
      <div className='handler' style={style}>{type}</div>
      <style jsx>{`
        .handler {
          color: white;
          height: 20px;
          width: 10px;
          position: absolute;
          text-align: center;
          background-color: ${type === 'i' ? 'green' : 'blue'};
        }
      `}</style>
    </>
  )
}

const getX = (idx: number) => idx * 11

const swap = (barArr, a,b) => {
  const tmp = barArr[a]
  barArr[a] = barArr[b]
  barArr[b] = tmp
}


const insertionSort = async (arr: IValueSetX[], setI: TRef, setJ: TRef) => {
  let i = 0, j = 0
  while (i < arr.length) {
    beepJ(1)
    await tween({ from: getX(j), to: getX(i), duration: DURATION, step: setJ.current }).promise(),
    j = i
    while (j > 0 && arr[j-1].value > arr[j].value) {
      await Promise.all([
        tween({ from: getX(j), to: getX(j-1), duration: DURATION, step: arr[j].setX.current }).promise(),
        tween({ from: getX(j-1), to: getX(j), duration: DURATION, step: arr[j-1].setX.current }).promise(),
      ])
      swap(arr, j, j - 1)

      beepJ(1)
      await tween({ from: getX(j), to: getX(j-1), duration: DURATION, step: setJ.current }).promise(),
      j = j - 1
    }
    beepI(1)
    await tween({ from: getX(i), to: getX(i+1), duration: DURATION, step: setI.current }).promise(),
    i = i + 1
  }
}

const getArr = () => shuffle(range(0,SIZE))

interface IPropsBoard {
  arr: number[]
  refValueSetXArr: React.MutableRefObject<any[]>
}

const _Board: FC<IPropsBoard> = (props) => {
  const { arr, refValueSetXArr } = props
  const valueSetXArr = arr.map(value => ({ value, setX: useRef(null) }))
  const Bars = valueSetXArr.map( ({value,setX},i) => <Bar key={`${uniqueId()}:${i}`} idx={i} value={value} refSetX={setX}/>)
  console.log('render Board')
  useEffect( () => {
    refValueSetXArr.current = valueSetXArr
  }, [arr])
  return <>{Bars}</>
}

const boardPropsAreEqual = (prevProps: Readonly<IPropsBoard>, nextProps: Readonly<IPropsBoard>) => {
  // 현재 application 동작 중 label, value 값의 변화만 일어나기 때문에
  return prevProps.arr === nextProps.arr
}

const Board = memo(_Board, boardPropsAreEqual)

const initArr = getArr()

export default () => {
  const [arr, setArr] = useState(initArr)
  const [isRunning, setIsRunning] = useState(false)
  const valueSetXArr = useRef([])
  const setI = useRef(null)
  const setJ = useRef(null)

  const start = async () => {
    setIsRunning(true)
    await insertionSort(valueSetXArr.current, setI, setJ)
    setIsRunning(false)
  }

  const shuffle = async () => {
    setI.current(0)
    setJ.current(0)
    setArr(getArr())
  }

  console.log('render InsertionSort.tsx')
  return (
    <>
      <div className='box'>
        <Board refValueSetXArr={valueSetXArr} arr={arr}/>
      </div>

      <Handler type='i' idx={0} refSetIdx={setI}/>
      <Handler type='j' idx={0} refSetIdx={setJ}/>

      <div className='buttonBox'>
        { !isRunning && <button onClick={shuffle}>Shuffle</button>}
        { !isRunning && <button onClick={start}>Insertion sort</button>}
        { isRunning && <span>running...</span>}
      </div>

      <style jsx>{`
        .box {
          height: 120px;
          background-color: red;
          position: relative;
          transform: rotateX(180deg);
        }
        .buttonBox {
          margin-top: 30px;
        }
      `}</style>
    </>
  )
}

