import { useState } from 'react'
import { Square } from './components/Square';
import { DIRECTIONS } from './constans';
import { resetGameStorage, saveGameToStorage } from './storage';



function App() {
  const [rows, setRows] = useState(8);
  //const [cells] = useState(rows * (2 * rows - 1))
  const calcCols = () => (2 * rows - 1)
  const [cols, setCols] = useState(calcCols)
  const calcCellMiddle = () => (cols - 1) / 2
  const [cellMiddle,setCellMiddle] = useState(calcCellMiddle)
  const [mines, setMines] = useState(7)

  const gridRows = 'repeat('+ rows +',50px)'
  const gridColumns = 'repeat('+cols+',50px)'

  /*
  const handleRows = (event) => {
    event.preventDefault();
    setRows(event.target.value)
  }
  const handleMines = (event) => {
    event.preventDefault();
    setMines(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault();

  }*/

  function getNextValue(value) {
    return (value.value >= 0 && value.value < 8) ? { value: value.value + 1, visible: value.visible } : value;
  }

  function wrapCell(grid, x, y) {
    for (const [dx, dy] of DIRECTIONS) {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
          if (newX >= cellMiddle - newY && newX <= cellMiddle + newY) {
            grid[newY][newX] = getNextValue(grid[newY][newX]);
        }
      }
    }
  }


  const createMatrix = (() => {
    let grid = Array(rows).fill(null).map(() => Array(cols).fill({ value: 0, visible: false }));
    let minesPlaced = 0;
  
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      if (x >= cellMiddle - y && x <= cellMiddle + y) {
        if (!grid[y][x].visible) {
          grid[y][x] = { value: 'X', visible: false };
          wrapCell(grid, x, y);
          minesPlaced++;
        }
      }
    }
    return grid;
  })();
  
 
  const [matrix, setMatrix] = useState(()=>{
    const matrixFromStorage = window.localStorage.getItem('matrix')
    return matrixFromStorage
      ? JSON.parse(matrixFromStorage)
      : createMatrix
  });

  const EnabledCells = (x, y) => x >= cellMiddle - y && x <= cellMiddle + y;


  const updateMatrix = (x,y) =>{
    const newMatrix = [...matrix]
    //newMatrix[x,y] 
    console.log('x:' + x + ' y: ' + y)
    newMatrix[y][x] = {value:matrix[y][x].value, visible:true}
    console.log(newMatrix[y][x].visible)//<--here
    setMatrix(newMatrix)

    saveGameToStorage({
      matrix:newMatrix
    })
  }

  const ResetGame = () => {
    if( !isNaN(mines) && !isNaN(rows)){
      resetGameStorage()

      setRows(rows)
      setCols(calcCols)
      setCellMiddle(calcCellMiddle)
      setMines(mines)
      const newMatrix = createMatrix
      setMatrix(newMatrix)

    }
  }

  return (
    <main className="board">
      <div className='title'>
        <h1>Buscaminas</h1>
      </div>
      <div className='form' >
        <div>
          <label htmlFor="rows">Altura:</label>
          <input type="number" min="3" max="10" id='rows' value={rows}/>
        </div>
        <div>
          <label htmlFor="mines">Minas</label>
          <input type="number" id='mines' value={mines}/>
        </div>
        <button>Nuevo Juego</button>
      </div>
      <section className="table">
        <div className='terrain' style={{gridTemplateRows: gridRows, gridTemplateColumns: gridColumns}}>
        {
          matrix.map((row,y)=>{
            return(
              row.map((cell,x)=>{
                return(
                  <Square 
                    key={`${x}${y}`} 
                    enabled={EnabledCells(x,y)} 
                    updateMatrix={updateMatrix} 
                    x={x} y={y}
                    color={cell.value}
                    visible={cell.visible}
                    cellMiddle={cellMiddle}
                  >
                    <small>[{x}][{y}]</small>
                    {cell.value}
                  </Square>
                )
              })
            )
          })
        }
        </div>
      </section>
    </main>
  )
}

export default App
